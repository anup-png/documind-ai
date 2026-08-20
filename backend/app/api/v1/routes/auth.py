from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.sqlalchemy.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate, UserLogin, Token

router = APIRouter(prefix="/auth", tags=["auth"])


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(UserRepository(db))


@router.post("/signup", response_model=Token)
def signup(data: UserCreate, service: AuthService = Depends(get_auth_service)):
    return service.signup(data)


@router.post("/login", response_model=Token)
def login(data: UserLogin, service: AuthService = Depends(get_auth_service)):
    return service.login(data)