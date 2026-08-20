from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.core.config import settings
from app.ai.embeddings.base import EmbeddingModel


class GoogleEmbeddings(EmbeddingModel):
    def __init__(self):
        self._client = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-2-preview",
            google_api_key=settings.GOOGLE_API_KEY,
        )

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return self._client.embed_documents(texts)

    def embed_query(self, text: str) -> list[float]:
        return self._client.embed_query(text)