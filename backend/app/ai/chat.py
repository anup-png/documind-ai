from langchain_mistralai import ChatMistralAI

from app.core.config import settings

llm = ChatMistralAI(
    model="mistral-small-2506",
    google_api_key=settings.MISTRAL_API_KEY,
    temperature=0,
)