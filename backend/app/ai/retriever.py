from uuid import UUID

from app.ai.vector_store.base import VectorStore
from app.ai.chat_models.base import ChatModel

SYSTEM_PROMPT = (
    "You are a helpful assistant answering questions about a specific document. "
    "Only use the provided context to answer. If the answer isn't in the context, "
    "say you don't know based on the document."
)


class Retriever:
    def __init__(self, vector_store: VectorStore, chat_model: ChatModel):
        self.vector_store = vector_store
        self.chat_model = chat_model

    def answer(self, user_id: UUID, document_id: UUID, question: str) -> str:
        chunks = self.vector_store.search(user_id, document_id, question)
        context = "\n\n".join(chunks)
        return self.chat_model.generate(SYSTEM_PROMPT, question, context)