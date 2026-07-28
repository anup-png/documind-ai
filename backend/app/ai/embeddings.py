
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.core.config import settings

embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-2-preview",
    google_api_key=settings.GOOGLE_API_KEY,
)