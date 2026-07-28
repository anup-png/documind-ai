from app.ai.vector_store import vector_store


def retrieve_documents(document_id: str, query: str, k: int = 4):
    return vector_store.similarity_search(
        query=query,
        k=k,
        filter={
            "document_id": document_id
        },
    )