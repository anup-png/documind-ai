from app.ai.chat import llm
from app.ai.retriever import retrieve_documents

query = "What is the candidate's experience?"

docs = retrieve_documents(query)

context = "\n\n".join(doc.page_content for doc in docs)

prompt = f"""
Answer ONLY using the context below.

Context:
{context}

Question:
{query}
"""

response = llm.invoke(prompt)

print(response.content)