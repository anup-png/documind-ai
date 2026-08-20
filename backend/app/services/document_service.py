from uuid import UUID
from fastapi import UploadFile, HTTPException, status

from app.repositories.sqlalchemy.document_repository import DocumentRepository
from app.storage.base import StorageBackend
from app.ai.loaders.pdf_loader import load_pdf_from_url
from app.ai.splitters.text_splitter import split_text
from app.ai.vector_store.base import VectorStore
from app.db.enums import DocumentStatus
from app.db.models.document import Document

import logging

logger = logging.getLogger(__name__)


class DocumentService:
    def __init__(
        self,
        document_repo: DocumentRepository,
        storage: StorageBackend,
        vector_store: VectorStore,
    ):
        self.document_repo = document_repo
        self.storage = storage
        self.vector_store = vector_store

    def upload(self, user_id: UUID, file: UploadFile) -> Document:
        # 1. Create the DB row first so we have a document_id to key everything else on
        document = self.document_repo.create(
            user_id=user_id,
            title=file.filename,
            file_name=file.filename,
            file_url="",
            cloudinary_public_id="",
        )

        try:
            # 2. Upload raw file to Cloudinary
            file_url, public_id = self.storage.save(user_id, document.id, file)
            self.document_repo.update_file_info(document.id, file_url, public_id)

            # 3. Process: download -> extract text -> chunk -> embed
            self.document_repo.update_status(document.id, DocumentStatus.PROCESSING)
            text = load_pdf_from_url(file_url)
            chunks = split_text(text)
            self.vector_store.add_chunks(user_id, document.id, chunks)

            # 4. Mark ready
            self.document_repo.update_status(document.id, DocumentStatus.READY)

        except Exception:
            logger.exception("Document processing failed for document_id=%s", document.id)
            self.document_repo.update_status(document.id, DocumentStatus.FAILED)
            raise HTTPException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                "Document processing failed",
            )

        return self.document_repo.get_by_id_for_user(document.id, user_id)

    def list_documents(self, user_id: UUID) -> list[Document]:
        return self.document_repo.list_for_user(user_id)

    def get_document(self, document_id: UUID, user_id: UUID) -> Document:
        document = self.document_repo.get_by_id_for_user(document_id, user_id)
        if document is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")
        return document

    def delete_document(self, document_id: UUID, user_id: UUID) -> None:
        document = self.get_document(document_id, user_id)  # 404s if not owned
        self.storage.delete(document.cloudinary_public_id)
        self.vector_store.delete_document(user_id, document_id)
        self.document_repo.delete(document)