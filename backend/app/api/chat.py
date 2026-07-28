from uuid import UUID

from fastapi import APIRouter, Query

from app.schemas.chat import ChatResponse
from app.services.chat_service import ask_question

router = APIRouter(
    tags=["Chat"],
)


@router.post("/documents/{document_id}/chat", response_model=ChatResponse)
async def chat(
    document_id: UUID,
    question: str = Query(..., description="Question to ask about the document"),
):
    answer = ask_question(
        document_id=str(document_id),
        question=question,
    )

    return ChatResponse(answer=answer)