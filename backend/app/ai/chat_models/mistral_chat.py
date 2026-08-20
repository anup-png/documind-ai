from langchain_mistralai import ChatMistralAI
from langchain_core.messages import SystemMessage, HumanMessage

from app.core.config import settings
from app.ai.chat_models.base import ChatModel


class MistralChat(ChatModel):
    def __init__(self):
        self._client = ChatMistralAI(
            model="mistral-small-latest",
            mistral_api_key=settings.MISTRAL_API_KEY,
            temperature=0.2,
        )

    def generate(self, system_prompt: str, question: str, context: str) -> str:
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Context:\n{context}\n\nQuestion: {question}"),
        ]
        response = self._client.invoke(messages)
        return response.content