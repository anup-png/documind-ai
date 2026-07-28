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
    # Google AI
    # ==========================
    GOOGLE_API_KEY: str

    # ==========================
    # Database
    # ==========================
    DATABASE_URL: str

    # ==========================
    # ChromaDB
    # ==========================
    CHROMA_DB: str = "./chroma_db"

    FRONTEND_URL:str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()