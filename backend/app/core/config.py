from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ==========================
    # Application
    # ==========================
    APP_NAME: str = "DocuMind AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # ==========================
    # Auth
    # ==========================
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # ==========================
    # AI Providers
    # ==========================
    GOOGLE_API_KEY: str
    MISTRAL_API_KEY: str

    # ==========================
    # Database
    # ==========================
    DATABASE_URL: str

    # ==========================
    # ChromaDB
    # ==========================
    CHROMA_DB: str = "./chroma_db"

    # ==========================
    # Cloudinary
    # ==========================
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    FRONTEND_URL: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()