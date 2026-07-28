from app.ai.embeddings import embeddings

vector = embeddings.embed_query("Hello World")

print(len(vector))
print(vector[:5])