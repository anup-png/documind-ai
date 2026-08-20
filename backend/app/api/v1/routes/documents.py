from fastapi import APIRouter, UploadFile, File, Depends

from app.api.v1.deps import get_current_user, get_document_service
from app.db.models.user import User
from app.services.document_service import DocumentService
from app.schemas.document import DocumentResponse

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    return service.upload(user.id, file)


@router.get("", response_model=list[DocumentResponse])
def list_documents(
    user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    return service.list_documents(user.id)


@router.delete("/{document_id}")
def delete_document(
    document_id: str,
    user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    service.delete_document(document_id, user.id)
    return {"detail": "Document deleted"}