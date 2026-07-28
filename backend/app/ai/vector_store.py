from langchain_chroma import Chroma

from app.ai.embeddings import embeddings
from app.core.config import settings


vector_store = Chroma(
    persist_directory=settings.CHROMA_DB,
    embedding_function=embeddings,
)