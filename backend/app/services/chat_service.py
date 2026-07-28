from app.ai.chat import llm
from app.ai.retriever import retrieve_documents


def ask_question(document_id: str, question: str):
    docs = retrieve_documents(document_id, question)

    context = "\n\n".join(doc.page_content for doc in docs)

    prompt = f"""
You are an AI documentation assistant.

Answer ONLY using the context below.

If the answer is not present, say:
"I couldn't find that information in the document."

Context:
{context}

Question:
{question}
"""

    response = llm.invoke(prompt)

    if hasattr(response, "text"):
        return response.text()

    if isinstance(response.content, list):
        return response.content[0]["text"]

    return str(response.content)