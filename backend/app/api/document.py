from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.ai.loader import load_pdf
from app.ai.splitter import split_documents
from app.ai.vector_store import vector_store
from app.db.session import get_db
from app.db.models.document import Document
from app.schemas.document import DocumentResponse

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed.",
        )

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Save document metadata
    document = Document(
        title=file.filename.replace(".pdf", ""),
        file_name=file.filename,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    # Load and process PDF
    documents = load_pdf(str(file_path))
    chunks = split_documents(documents)

    # Add metadata to each chunk
    for chunk in chunks:
        chunk.metadata["document_id"] = str(document.id)

    # Store in ChromaDB
    vector_store.add_documents(chunks)

    return DocumentResponse(
        id=document.id,
        title=document.title,
        file_name=document.file_name,
        status=document.status.value,
        created_at=document.created_at,
    )


@router.get("", response_model=list[DocumentResponse])
def get_documents(
    db: Session = Depends(get_db),
):
    documents = (
        db.query(Document)
        .order_by(Document.created_at.desc())
        .all()
    )

    return [
        DocumentResponse(
            id=document.id,
            title=document.title,
            file_name=document.file_name,
            status=document.status.value,
            created_at=document.created_at,
        )
        for document in documents
    ]