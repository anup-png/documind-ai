from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class DocumentResponse(BaseModel):
    id: UUID
    title: str
    file_name: str
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }