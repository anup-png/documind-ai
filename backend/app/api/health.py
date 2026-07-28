from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/")
def home():
    return {
        "message": "Welcome to DocuMind AI"
    }


@router.get("/health")
def health():
    return {
        "status": "healthy"
    }