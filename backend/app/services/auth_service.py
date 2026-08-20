from fastapi import HTTPException, status

from app.core.security import hash_password, verify_password, create_access_token
from app.repositories.sqlalchemy.user_repository import UserRepository
from app.schemas.user import UserCreate, UserLogin, Token


class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def signup(self, data: UserCreate) -> Token:
        if self.user_repo.get_by_email(data.email):
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Email already registered")
        user = self.user_repo.create(data.email, hash_password(data.password))
        return Token(access_token=create_access_token(user.id))

    def login(self, data: UserLogin) -> Token:
        user = self.user_repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.hashed_password):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
        return Token(access_token=create_access_token(user.id))