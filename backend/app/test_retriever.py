from app.ai.retriever import retrieve_documents

results = retrieve_documents("What is the candidate's experience?")

print(f"Found {len(results)} documents\n")

for i, doc in enumerate(results, start=1):
    print(f"Result {i}")
    print(doc.page_content)
    print("-" * 80)