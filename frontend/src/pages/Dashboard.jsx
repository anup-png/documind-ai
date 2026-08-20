import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { logout } from "../api/auth";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const res = await api.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      setError("Could not load documents");
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ maxWidth: 640, margin: "40px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Your documents</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <form onSubmit={handleUpload} style={{ margin: "20px 0", display: "flex", gap: 8 }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {documents.map((doc) => (
          <li
            key={doc.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div>
              <strong>{doc.title}</strong>
              <div style={{ fontSize: 12, color: "#888" }}>{doc.status}</div>
            </div>
            <button
              disabled={doc.status !== "READY"}
              onClick={() => navigate(`/documents/${doc.id}/chat`)}
            >
              Chat
            </button>
          </li>
        ))}
      </ul>

      {documents.length === 0 && <p>No documents yet — upload one to get started.</p>}
    </div>
  );
}