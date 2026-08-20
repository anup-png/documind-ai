from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.db.models.user import User
from app.repositories.sqlalchemy.user_repository import UserRepository
from app.repositories.sqlalchemy.document_repository import DocumentRepository
from app.repositories.sqlalchemy.chat_repository import ChatRepository
from app.storage.cloudinary_backend import CloudinaryBackend
from app.ai.embeddings.google_embeddings import GoogleEmbeddings
from app.ai.chat_models.mistral_chat import MistralChat
from app.ai.vector_store.chroma_store import ChromaStore
from app.ai.retriever import Retriever
from app.services.document_service import DocumentService
from app.services.chat_service import ChatService

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    user_id = decode_access_token(credentials.credentials)
    if user_id is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")

    user = UserRepository(db).get_by_id(user_id)
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")

    return user


# Singletons — expensive to construct (API clients, persistent Chroma connection),
# safe to share across requests since they hold no per-request state.
_embedding_model = GoogleEmbeddings()
_chat_model = MistralChat()
_vector_store = ChromaStore(_embedding_model)
_retriever = Retriever(_vector_store, _chat_model)


def get_document_service(db: Session = Depends(get_db)) -> DocumentService:
    return DocumentService(
        document_repo=DocumentRepository(db),
        storage=CloudinaryBackend(),
        vector_store=_vector_store,
    )


def get_chat_service(db: Session = Depends(get_db)) -> ChatService:
    return ChatService(
        chat_repo=ChatRepository(db),
        document_repo=DocumentRepository(db),
        retriever=_retriever,
    )