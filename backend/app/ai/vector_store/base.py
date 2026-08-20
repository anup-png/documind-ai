from abc import ABC, abstractmethod
from uuid import UUID


class VectorStore(ABC):
    @abstractmethod
    def add_chunks(self, user_id: UUID, document_id: UUID, chunks: list[str]) -> None:
        raise NotImplementedError

    @abstractmethod
    def search(self, user_id: UUID, document_id: UUID, query: str, k: int = 4) -> list[str]:
        raise NotImplementedError

    @abstractmethod
    def delete_document(self, user_id: UUID, document_id: UUID) -> None:
        raise NotImplementedError