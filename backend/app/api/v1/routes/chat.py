from fastapi import APIRouter, Depends

from app.api.v1.deps import get_current_user, get_chat_service
from app.db.models.user import User
from app.services.chat_service import ChatService
from app.schemas.chat import ChatSessionResponse, ChatMessageRequest, ChatMessageResponse

router = APIRouter(tags=["chat"])


@router.post("/documents/{document_id}/chat/sessions", response_model=ChatSessionResponse)
def start_session(
    document_id: str,
    user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    return service.start_session(user.id, document_id)


@router.post("/chat/sessions/{session_id}/messages", response_model=ChatMessageResponse)
def send_message(
    session_id: str,
    data: ChatMessageRequest,
    user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    return service.ask(user.id, session_id, data.content)


@router.get("/chat/sessions/{session_id}/messages", response_model=list[ChatMessageResponse])
def get_history(
    session_id: str,
    user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    return service.get_history(user.id, session_id)