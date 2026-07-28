from enum import Enum


class DocumentStatus(str, Enum):
    UPLOADING = "UPLOADING"
    PROCESSING = "PROCESSING"
    READY = "READY"
    FAILED = "FAILED"


class MessageRole(str, Enum):
    USER = "USER"
    ASSISTANT = "ASSISTANT"