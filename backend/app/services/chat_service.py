from uuid import UUID
from fastapi import HTTPException, status

from app.repositories.sqlalchemy.chat_repository import ChatRepository
from app.repositories.sqlalchemy.document_repository import DocumentRepository
from app.ai.retriever import Retriever
from app.db.enums import MessageRole
from app.db.models.chat_session import ChatSession
from app.db.models.chat_message import ChatMessage


class ChatService:
    def __init__(
        self,
        chat_repo: ChatRepository,
        document_repo: DocumentRepository,
        retriever: Retriever,
    ):
        self.chat_repo = chat_repo
        self.document_repo = document_repo
        self.retriever = retriever

    def start_session(self, user_id: UUID, document_id: UUID) -> ChatSession:
        # ownership check happens here — 404s if the document isn't the user's
        document = self.document_repo.get_by_id_for_user(document_id, user_id)
        if document is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")

        return self.chat_repo.create_session(user_id, document_id)

    def ask(self, user_id: UUID, session_id: UUID, question: str) -> ChatMessage:
        session = self.chat_repo.get_session_for_user(session_id, user_id)
        if session is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Chat session not found")

        # persist the user's message first
        self.chat_repo.add_message(session_id, MessageRole.USER, question)

        # generate answer, scoped to this user + this document
        answer = self.retriever.answer(user_id, session.document_id, question)

        # persist and return the assistant's message
        return self.chat_repo.add_message(session_id, MessageRole.ASSISTANT, answer)

    def get_history(self, user_id: UUID, session_id: UUID) -> list[ChatMessage]:
        session = self.chat_repo.get_session_for_user(session_id, user_id)
        if session is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Chat session not found")
        return self.chat_repo.list_messages(session_id)