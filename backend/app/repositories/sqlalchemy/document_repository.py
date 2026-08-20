from uuid import UUID
from sqlalchemy.orm import Session

from app.db.models.document import Document
from app.db.enums import DocumentStatus


class DocumentRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: UUID, title: str, file_name: str, file_url: str, cloudinary_public_id: str) -> Document:
        doc = Document(
            user_id=user_id,
            title=title,
            file_name=file_name,
            file_url=file_url,
            cloudinary_public_id=cloudinary_public_id,
        )
        self.db.add(doc)
        self.db.commit()
        self.db.refresh(doc)
        return doc

    def get_by_id_for_user(self, document_id: UUID, user_id: UUID) -> Document | None:
        return (
            self.db.query(Document)
            .filter(Document.id == document_id, Document.user_id == user_id)
            .first()
        )

    def list_for_user(self, user_id: UUID) -> list[Document]:
        return (
            self.db.query(Document)
            .filter(Document.user_id == user_id)
            .order_by(Document.created_at.desc())
            .all()
        )

    def update_status(self, document_id: UUID, status: DocumentStatus) -> None:
        self.db.query(Document).filter(Document.id == document_id).update({"status": status})
        self.db.commit()

    def delete(self, document: Document) -> None:
        self.db.delete(document)
        self.db.commit()

    def update_file_info(self, document_id: UUID, file_url: str, cloudinary_public_id: str) -> None:
        self.db.query(Document).filter(Document.id == document_id).update(
            {"file_url": file_url, "cloudinary_public_id": cloudinary_public_id}
        )
        self.db.commit()