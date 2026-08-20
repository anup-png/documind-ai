from uuid import UUID
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile

from app.core.config import settings
from app.storage.base import StorageBackend

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)


class CloudinaryBackend(StorageBackend):
    def save(self, user_id: UUID, document_id: UUID, file: UploadFile) -> tuple[str, str]:
        result = cloudinary.uploader.upload(
            file.file,
            resource_type="raw",
            folder=f"documind/{user_id}",
            public_id=str(document_id),
            overwrite=True,
        )
        return result["secure_url"], result["public_id"]

    def delete(self, public_id: str) -> None:
        cloudinary.uploader.destroy(public_id, resource_type="raw")