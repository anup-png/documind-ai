from uuid import UUID
from sqlalchemy.orm import Session

from app.db.models.chat_session import ChatSession
from app.db.models.chat_message import ChatMessage
from app.db.enums import MessageRole


class ChatRepository:
    def __init__(self, db: Session):
        self.db = db

    # ---- sessions ----

    def create_session(self, user_id: UUID, document_id: UUID) -> ChatSession:
        session = ChatSession(user_id=user_id, document_id=document_id)
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def get_session_for_user(self, session_id: UUID, user_id: UUID) -> ChatSession | None:
        return (
            self.db.query(ChatSession)
            .filter(ChatSession.id == session_id, ChatSession.user_id == user_id)
            .first()
        )

    def list_sessions_for_user(self, user_id: UUID) -> list[ChatSession]:
        return (
            self.db.query(ChatSession)
            .filter(ChatSession.user_id == user_id)
            .order_by(ChatSession.created_at.desc())
            .all()
        )

    # ---- messages ----

    def add_message(self, session_id: UUID, role: MessageRole, content: str) -> ChatMessage:
        message = ChatMessage(session_id=session_id, role=role, content=content)
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message

    def list_messages(self, session_id: UUID) -> list[ChatMessage]:
        return (
            self.db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc())
            .all()
        )