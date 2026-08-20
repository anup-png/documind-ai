import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Chat() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    startSession();
  }, [documentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startSession() {
    try {
      const res = await api.post(`/documents/${documentId}/chat/sessions`);
      setSessionId(res.data.id);
      setMessages(res.data.messages || []);
    } catch (err) {
      setError("Could not start chat session");
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!question.trim() || !sessionId) return;

    const userMessage = { role: "USER", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setSending(true);
    setError("");

    try {
      const res = await api.post(`/chat/sessions/${sessionId}/messages`, {
        content: userMessage.content,
      });
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to get a response");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", display: "flex", flexDirection: "column", height: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Chat</h2>
        <button onClick={() => navigate("/")}>Back</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === "USER" ? "right" : "left",
              margin: "8px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 8,
                background: m.role === "USER" ? "#dbeafe" : "#f3f4f6",
                maxWidth: "80%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSend} style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about this document..."
          style={{ flex: 1 }}
          disabled={sending}
        />
        <button type="submit" disabled={sending || !question.trim()}>
          {sending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}