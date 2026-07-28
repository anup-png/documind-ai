import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Loader2, AlertCircle, FileWarning, MessageSquareText, FileText } from "lucide-react";

import { askQuestion } from "../api/chatApi";
import { getDocuments } from "../api/documentApi";

const MAX_QUESTION_LENGTH = 2000;

/**
 * Generates a reasonably unique id for local message state.
 * Not sent to the server — display/key purposes only.
 */
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

function Chat() {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docLoading, setDocLoading] = useState(true);
  const [docError, setDocError] = useState(null);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  const scrollAnchorRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadDocument = async () => {
      setDocLoading(true);
      setDocError(null);

      try {
        const docs = await getDocuments();
        const selected = docs.find((doc) => String(doc.id) === String(documentId));

        if (cancelled) return;

        if (!selected) {
          setDocError("not-found");
        } else {
          setDocInfo(selected);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setDocError("load-failed");
      } finally {
        if (!cancelled) setDocLoading(false);
      }
    };

    loadDocument();

    return () => {
      cancelled = true;
    };
  }, [documentId]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  // Auto-grow the textarea up to a max height, then let it scroll internally.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [question]);

  const trimmedQuestion = question.trim();
  const isTooLong = question.length > MAX_QUESTION_LENGTH;
  const canSend = trimmedQuestion.length > 0 && !isTooLong && !sending && !docError;

  const sendQuestion = async () => {
    if (!canSend) return;

    const questionText = trimmedQuestion;

    setMessages((prev) => [
      ...prev,
      { id: makeId(), role: "user", content: questionText },
    ]);
    setQuestion("");
    setSendError(null);
    setSending(true);

    try {
      const response = await askQuestion(documentId, questionText);

      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "assistant", content: response.answer },
      ]);
    } catch (err) {
      console.error(err);
      setSendError("Something went wrong sending your question. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: "I couldn't process that question. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F6F5F1] text-[#1C2127]">
      {/* Header — pinned to the top */}
      <header className="z-10 shrink-0 border-b border-[#E4E1DA] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Back to documents"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#4A5361] transition-colors hover:bg-[#EFEDE6] hover:text-[#1C2127] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B6E68]"
          >
            <ArrowLeft className="h-4.5 w-4.5" aria-hidden="true" />
          </button>

          <div className="min-w-0 flex-1">
            {docLoading ? (
              <div className="space-y-1.5" aria-hidden="true">
                <div className="h-2.5 w-20 animate-pulse rounded bg-[#EAE8E1]" />
                <div className="h-4 w-48 animate-pulse rounded bg-[#EAE8E1]" />
              </div>
            ) : docError ? (
              <div className="flex items-center gap-2">
                <FileWarning className="h-4 w-4 shrink-0 text-[#B3261E]" aria-hidden="true" />
                <p className="truncate text-sm font-medium text-[#1C2127]">
                  {docError === "not-found" ? "Document not found" : "Couldn't load this document"}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-[#2B6E68]" aria-hidden="true" />
                <div className="min-w-0">
                  <h1 className="truncate font-serif text-[15px] font-semibold leading-tight text-[#1C2127] sm:text-base">
                    {docInfo?.title}
                  </h1>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#8A93A0]">
                    Document Q&amp;A
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Messages — the only scrollable region */}
      <main className="flex-1 overflow-y-auto" role="log" aria-live="polite">
        <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-end px-4 py-6 sm:px-6">
          {docError ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
              <FileWarning className="h-8 w-8 text-[#E2A6A0]" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-[#4A5361]">
                {docError === "not-found"
                  ? "This document may have been removed, or the link is incorrect."
                  : "There was a problem reaching the server."}
              </p>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-4 rounded-lg border border-[#D9D6CD] bg-white px-4 py-2 text-sm font-medium text-[#1C2127] transition-colors hover:bg-[#EFEDE6]"
              >
                Return to documents
              </button>
            </div>
          ) : messages.length === 0 && !sending ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
              <MessageSquareText className="h-8 w-8 text-[#B7C4C2]" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-[#4A5361]">
                Ask your first question about this document
              </p>
              <p className="mt-1 max-w-xs text-xs text-[#8A93A0]">
                Answers are generated from the document's contents.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      message.role === "user"
                        ? "max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-[#1C2127] px-4 py-2.5 text-[14px] leading-relaxed text-white"
                        : message.isError
                        ? "max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-tl-sm border border-[#F3C7C3] bg-[#FBEEED] px-4 py-2.5 text-[14px] leading-relaxed text-[#8C2A22]"
                        : "max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-tl-sm border border-[#E4E1DA] bg-white px-4 py-2.5 text-[14px] leading-relaxed text-[#1C2127]"
                    }
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-[#E4E1DA] bg-white px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#2B6E68] [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#2B6E68] [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#2B6E68]" />
                  </div>
                </div>
              )}

              <div ref={scrollAnchorRef} />
            </div>
          )}
        </div>
      </main>

      {/* Composer — pinned to the bottom, always visible, never scrolls away */}
      <footer className="z-10 shrink-0 border-t border-[#E4E1DA] bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          {sendError && (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-[#FBEEED] px-3 py-2 text-xs text-[#8C2A22]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {sendError}
            </div>
          )}

          <div className="flex items-end gap-3 rounded-2xl border border-[#D9D6CD] bg-white p-2 pl-4 shadow-sm transition-colors focus-within:border-[#2B6E68] focus-within:ring-1 focus-within:ring-[#2B6E68]">
            <label htmlFor="chat-question" className="sr-only">
              Ask a question about this document
            </label>
            <textarea
              id="chat-question"
              ref={textareaRef}
              rows={1}
              placeholder={docError ? "This document is unavailable" : "Ask anything about this document..."}
              className="block max-h-40 flex-1 resize-none border-0 bg-transparent py-2 text-[14px] text-[#1C2127] placeholder:text-[#9AA0A6] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:text-[#9AA0A6]"
              value={question}
              disabled={!!docError || docLoading}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-invalid={isTooLong}
              aria-describedby="chat-question-help"
            />
            <button
              type="button"
              onClick={sendQuestion}
              disabled={!canSend}
              aria-label="Send question"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2B6E68] text-white transition-colors hover:bg-[#245C57] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B6E68] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#C7CFCD] disabled:text-[#8A93A0]"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          <div id="chat-question-help" className="mt-1.5 flex items-center justify-between px-1">
            <span className="text-xs text-[#9AA0A6]">Enter to send · Shift + Enter for a new line</span>
            <span className={isTooLong ? "text-xs font-medium text-[#B3261E]" : "text-xs text-[#9AA0A6]"}>
              {question.length}/{MAX_QUESTION_LENGTH}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Chat;