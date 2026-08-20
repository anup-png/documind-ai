import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

const STATUS_STYLES = {
  READY: "bg-success/10 text-success",
  PROCESSING: "bg-gold/10 text-gold",
  UPLOADING: "bg-accent/10 text-accent",
  FAILED: "bg-danger/10 text-danger",
};

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const res = await api.get("/documents");
      setDocuments(res.data);
    } catch {
      setError("Could not load documents.");
    }
  }

  async function uploadFile(file) {
    if (!file || file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    uploadFile(e.dataTransfer.files[0]);
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar email={JSON.parse(atob(localStorage.getItem("access_token")?.split(".")[1] || "e30=")).sub ? "" : ""} />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl mb-1">Your documents</h1>
          <p className="text-sm text-muted">Upload a PDF, then ask it anything.</p>
        </div>

        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition mb-8 ${
            dragActive ? "border-accent bg-accent/5" : "border-border bg-surface hover:border-accent/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => uploadFile(e.target.files[0])}
          />
          <p className="text-sm font-medium text-ink mb-1">
            {uploading ? "Uploading…" : "Drop a PDF here, or click to browse"}
          </p>
          <p className="text-xs text-muted">PDF only</p>
        </div>

        {error && (
          <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-md px-3 py-2 mb-6">
            {error}
          </p>
        )}

        {/* Document list */}
        {documents.length === 0 ? (
          <div className="text-center py-16 text-muted text-sm">
            No documents yet — upload one above to get started.
          </div>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between bg-surface border border-border rounded-lg px-5 py-4 hover:border-accent/40 transition"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{doc.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[doc.status] || "bg-muted/10 text-muted"}`}>
                      {doc.status.charAt(0) + doc.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
                <button
                  disabled={doc.status !== "READY"}
                  onClick={() => navigate(`/documents/${doc.id}/chat`)}
                  className="shrink-0 text-sm font-medium text-accent border border-accent/30 rounded-md px-4 py-2 hover:bg-accent/5 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Chat
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}