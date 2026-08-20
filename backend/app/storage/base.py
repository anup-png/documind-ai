from abc import ABC, abstractmethod
from uuid import UUID
from fastapi import UploadFile


class StorageBackend(ABC):
    @abstractmethod
    def save(self, user_id: UUID, document_id: UUID, file: UploadFile) -> tuple[str, str]:
        """Returns (file_url, public_id)."""
        raise NotImplementedError

    @abstractmethod
    def delete(self, public_id: str) -> None:
        raise NotImplementedError