# 🧠 DocuMind AI

An AI-powered document assistant that allows users to upload PDF documents and chat with them using Retrieval-Augmented Generation (RAG).

Built with **FastAPI**, **React**, **PostgreSQL**, **ChromaDB**, **LangChain**, and **Google Gemini**.

---

## 🌐 Live Demo

**Frontend:** https://documind-ai-frontend-zw9n.onrender.com

> **Note:** The chat feature depends on the Google Gemini API. If the free API quota is exceeded, chat requests may temporarily be unavailable until the quota resets.

---

## ✨ Features

- 📄 Upload PDF documents
- 🤖 Chat with uploaded PDFs using AI
- 🔍 Semantic search using vector embeddings
- 🧠 Retrieval-Augmented Generation (RAG)
- 📚 Document-specific conversations
- 💾 PostgreSQL for document metadata
- ⚡ ChromaDB for vector storage
- 🎨 Responsive React + Tailwind CSS frontend
- 🚀 Fully deployed backend and frontend

---

## 🏗️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- ChromaDB
- LangChain
- Google Gemini API

### Deployment

- Render (Backend)
- Render (Frontend)
- Neon PostgreSQL

---

# 📂 Project Structure

```text
DocuMind-AI
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── ai/
│   │   ├── core/
│   │   ├── db/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ How It Works

```text
Upload PDF
      │
      ▼
PyPDFLoader
      │
      ▼
Text Splitter
      │
      ▼
Google Embeddings
      │
      ▼
ChromaDB
      │
      ▼
Similarity Search
      │
      ▼
Gemini LLM
      │
      ▼
AI Response
```

---

# 📡 API Endpoints

## Upload Document

```http
POST /documents/upload
```

Uploads a PDF and creates vector embeddings.

---

## Get Documents

```http
GET /documents
```

Returns all uploaded documents.

---

## Chat with Document

```http
POST /documents/{document_id}/chat
```

Ask questions related to a specific document.

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/documind-ai.git

cd documind-ai
```

---

## Backend Setup

```bash
cd backend

python -m venv .venv

source .venv/bin/activate
```

Windows

```bash
.venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create `.env`

```env
GOOGLE_API_KEY=YOUR_API_KEY

DATABASE_URL=YOUR_DATABASE_URL

CHROMA_DB=./chroma_db

FRONTEND_URL=http://localhost:5173
```

Run migrations

```bash
alembic upgrade head
```

Start server

```bash
uvicorn app.main:app --reload
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_API_URL=http://127.0.0.1:8000
```

Run

```bash
npm run dev
```

---

# 📸 Screenshots

> Add screenshots here

- Dashboard
- Upload PDF
- Chat Interface

---

# 🧠 AI Pipeline

- PDF Parsing
- Text Chunking
- Embedding Generation
- Vector Storage
- Similarity Search
- Prompt Construction
- Google Gemini Response Generation

---

# 📌 Current Limitations

- Chat history is not persisted.
- Uploaded files are stored locally (demo setup).
- ChromaDB uses local persistence.
- Google Gemini free-tier quotas may temporarily limit chat requests.

---

# 🛣️ Roadmap

## Planned Features

- [ ] User Authentication
- [ ] Chat History
- [ ] Multiple PDF Selection
- [ ] Source Citation with Page Numbers
- [ ] Streaming AI Responses
- [ ] Drag & Drop Upload
- [ ] Delete Documents
- [ ] Rename Documents
- [ ] Document Preview
- [ ] Markdown Rendering
- [ ] Dark Mode
- [ ] Vector Database (Pinecone/Qdrant)
- [ ] Cloud File Storage (AWS S3 / Cloudinary)
- [ ] Conversation Memory
- [ ] Rate Limiting
- [ ] Docker Support
- [ ] CI/CD Pipeline
- [ ] Unit & Integration Tests
- [ ] API Documentation Improvements

---

# 🎯 Learning Objectives

This project demonstrates practical experience with:

- FastAPI
- REST API Design
- SQLAlchemy ORM
- Alembic Migrations
- PostgreSQL
- Vector Databases
- Retrieval-Augmented Generation (RAG)
- LangChain
- Google Gemini API
- React
- Tailwind CSS
- Environment Configuration
- Full Stack Deployment

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit a pull request.

---

# 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.
