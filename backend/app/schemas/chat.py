from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class ChatSessionResponse(BaseModel):
    id: UUID
    document_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatMessageRequest(BaseModel):
    content: str


class ChatMessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}