from uuid import UUID
from langchain_chroma import Chroma
from langchain_core.documents import Document as LCDocument

from app.core.config import settings
from app.ai.vector_store.base import VectorStore
from app.ai.embeddings.base import EmbeddingModel


class ChromaStore(VectorStore):
    def __init__(self, embedding_model: EmbeddingModel):
        # LangChain's Chroma wrapper expects a LangChain Embeddings-compatible
        # object, so we wrap our interface to match that shape.
        self._client = Chroma(
            collection_name="documents",
            embedding_function=_LangchainEmbeddingAdapter(embedding_model),
            persist_directory=settings.CHROMA_DB,
        )

    def add_chunks(self, user_id: UUID, document_id: UUID, chunks: list[str]) -> None:
        docs = [
            LCDocument(
                page_content=chunk,
                metadata={"user_id": str(user_id), "document_id": str(document_id)},
            )
            for chunk in chunks
        ]
        self._client.add_documents(docs)

    def search(self, user_id: UUID, document_id: UUID, query: str, k: int = 4) -> list[str]:
        results = self._client.similarity_search(
            query,
            k=k,
            filter={
                "$and": [
                    {"user_id": str(user_id)},
                    {"document_id": str(document_id)},
                ]
            },
        )
        return [doc.page_content for doc in results]

    def delete_document(self, user_id: UUID, document_id: UUID) -> None:
        self._client.delete(where={
            "$and": [
                {"user_id": str(user_id)},
                {"document_id": str(document_id)},
            ]
        })


class _LangchainEmbeddingAdapter:
    """Adapts our EmbeddingModel interface to LangChain's expected Embeddings shape."""
    def __init__(self, model: EmbeddingModel):
        self._model = model

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return self._model.embed_documents(texts)

    def embed_query(self, text: str) -> list[float]:
        return self._model.embed_query(text)