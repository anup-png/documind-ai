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
  const [starting, setStarting] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    startSession();
  }, [documentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function startSession() {
    setStarting(true);
    try {
      const res = await api.post(`/documents/${documentId}/chat/sessions`);
      setSessionId(res.data.id);
    } catch {
      setError("Could not start a chat session for this document.");
    } finally {
      setStarting(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const content = question.trim();
    if (!content || !sessionId || sending) return;

    setMessages((prev) => [...prev, { role: "USER", content }]);
    setQuestion("");
    setSending(true);
    setError("");

    try {
      const res = await api.post(`/chat/sessions/${sessionId}/messages`, { content });
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong answering that.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-paper">
      {/* Header */}
      <div className="border-b border-border bg-surface px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="text-muted hover:text-ink text-sm transition"
          aria-label="Back to documents"
        >
          ← Back
        </button>
        <div className="h-4 w-px bg-border" />
        <span className="font-display text-base">Chat</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {starting && (
            <p className="text-sm text-muted text-center">Starting session…</p>
          )}

          {!starting && messages.length === 0 && (
            <div className="text-center py-16">
              <p className="font-display text-lg text-ink mb-2">Ask this document anything</p>
              <p className="text-sm text-muted">
                Answers are grounded only in what's written in the document.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((m, i) =>
              m.role === "USER" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[75%] bg-accent text-white text-sm rounded-lg rounded-br-sm px-4 py-2.5">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[80%] border-l-2 border-gold pl-4 py-0.5">
                    <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              )
            )}

            {sending && (
              <div className="flex justify-start">
                <div className="border-l-2 border-gold pl-4 py-0.5">
                  <span className="text-sm text-muted italic">Thinking…</span>
                </div>
              </div>
            )}
          </div>
          <div ref={bottomRef} />
        </div>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto w-full px-6">
          <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-md px-3 py-2 mb-3">
            {error}
          </p>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-border bg-surface px-6 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about this document…"
            disabled={starting || sending}
            className="flex-1 px-4 py-2.5 border border-border rounded-md bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={starting || sending || !question.trim()}
            className="bg-accent hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 rounded-md transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}