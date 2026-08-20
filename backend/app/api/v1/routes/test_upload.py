from fastapi import APIRouter, UploadFile, File, Depends
from uuid import uuid4

from app.api.v1.deps import get_current_user
from app.db.models.user import User
from app.storage.cloudinary_backend import CloudinaryBackend

router = APIRouter(prefix="/test", tags=["test"])


@router.post("/upload")
async def test_upload(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
):
    storage = CloudinaryBackend()
    document_id = uuid4()
    file_url, public_id = storage.save(user.id, document_id, file)
    return {"file_url": file_url, "public_id": public_id}