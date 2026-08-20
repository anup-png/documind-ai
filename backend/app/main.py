from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.routes import auth


from app.api import document, chat, health

app = FastAPI(
    title="DocuMind AI",
    version="1.0.0",
)
print(settings.FRONTEND_URL)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(health.router)
app.include_router(document.router)
app.include_router(chat.router)