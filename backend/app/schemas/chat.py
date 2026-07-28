from pydantic import BaseModel
from uuid import UUID


class ChatRequest(BaseModel):
    document_id: UUID
    question: str


class ChatResponse(BaseModel):
    answer: str