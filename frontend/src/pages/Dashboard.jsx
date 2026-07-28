import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  UploadCloud,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FileWarning,
} from "lucide-react";

import { getDocuments, uploadDocument } from "../api/documentApi";

const ALLOWED_EXTENSION = ".pdf";
const ALLOWED_MIME_TYPE = "application/pdf";
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docsError, setDocsError] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fetchDocuments = async () => {
    setDocsLoading(true);
    setDocsError(false);

    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error(error);
      setDocsError(true);
    } finally {
      setDocsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const validateFile = (file) => {
    const hasValidExtension = file.name.toLowerCase().endsWith(ALLOWED_EXTENSION);
    const hasValidType = !file.type || file.type === ALLOWED_MIME_TYPE;

    if (!hasValidExtension || !hasValidType) {
      return "Only PDF files are supported.";
    }
    if (file.size === 0) {
      return "This file appears to be empty.";
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE_BYTES)}.`;
    }
    return null;
  };

  const processFile = async (file) => {
    if (!file) return;

    setUploadSuccess(null);

    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      await uploadDocument(file);
      await fetchDocuments();
      setUploadSuccess(`"${file.name}" uploaded successfully.`);
    } catch (error) {
      console.error(error);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (event) => {
    processFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (uploading) return;
    processFile(event.dataTransfer.files?.[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!uploading) setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#1C2127]">
      {/* Top bar */}
      <header className="border-b border-[#E4E1DA] bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-2.5 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2B6E68]">
            <FileText className="h-4.5 w-4.5 text-white" aria-hidden="true" />
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight text-[#1C2127]">
            DocuMind AI
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-semibold text-[#1C2127] sm:text-3xl">
            Your documents
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Upload a PDF and ask questions about what's inside it.
          </p>
        </div>

        {/* Upload */}
        <section className="mb-8 rounded-2xl border border-[#E4E1DA] bg-white p-6 shadow-[0_1px_2px_rgba(28,33,39,0.04)]">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#4A5361]">
            Upload a PDF
          </h2>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={
              isDragging
                ? "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#2B6E68] bg-[#EEF3F2] px-6 py-10 text-center transition-colors"
                : "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D9D6CD] bg-[#FBFAF8] px-6 py-10 text-center transition-colors"
            }
          >
            {uploading ? (
              <>
                <Loader2 className="h-7 w-7 animate-spin text-[#2B6E68]" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-[#1C2127]">Uploading your document…</p>
                <p className="mt-1 text-xs text-[#8A93A0]">This may take a moment for larger files.</p>
              </>
            ) : (
              <>
                <UploadCloud className="h-7 w-7 text-[#8A93A0]" aria-hidden="true" />
                <p className="mt-3 text-sm text-[#4A5361]">
                  <span className="font-medium text-[#1C2127]">Drag and drop</span> a PDF here, or
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 rounded-lg bg-[#2B6E68] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#245C57] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B6E68] focus-visible:ring-offset-2"
                >
                  Browse files
                </button>
                <p className="mt-3 text-xs text-[#9AA0A6]">
                  PDF only · up to {formatFileSize(MAX_FILE_SIZE_BYTES)}
                </p>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={`${ALLOWED_EXTENSION},${ALLOWED_MIME_TYPE}`}
              onChange={handleFileSelect}
              disabled={uploading}
              className="sr-only"
              aria-label="Upload PDF document"
            />
          </div>

          {uploadError && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#FBEEED] px-3 py-2.5 text-sm text-[#8C2A22]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {uploadError}
            </div>
          )}

          {uploadSuccess && !uploadError && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#EAF4EC] px-3 py-2.5 text-sm text-[#276B3F]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {uploadSuccess}
            </div>
          )}
        </section>

        {/* Documents */}
        <section className="rounded-2xl border border-[#E4E1DA] bg-white p-6 shadow-[0_1px_2px_rgba(28,33,39,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#4A5361]">
              My documents
            </h2>
            {!docsLoading && !docsError && documents.length > 0 && (
              <span className="text-xs text-[#9AA0A6]">
                {documents.length} document{documents.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {docsLoading ? (
            <div className="space-y-3" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-[#E4E1DA] p-4"
                >
                  <div className="space-y-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-[#EAE8E1]" />
                    <div className="h-3 w-28 animate-pulse rounded bg-[#EAE8E1]" />
                  </div>
                  <div className="h-9 w-28 animate-pulse rounded-lg bg-[#EAE8E1]" />
                </div>
              ))}
            </div>
          ) : docsError ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileWarning className="h-7 w-7 text-[#E2A6A0]" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-[#4A5361]">
                Couldn't load your documents
              </p>
              <button
                type="button"
                onClick={fetchDocuments}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#D9D6CD] bg-white px-4 py-2 text-sm font-medium text-[#1C2127] transition-colors hover:bg-[#EFEDE6]"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-7 w-7 text-[#B7C4C2]" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-[#4A5361]">No documents yet</p>
              <p className="mt-1 text-xs text-[#8A93A0]">
                Upload a PDF above to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-[#E4E1DA] p-4 transition-colors hover:border-[#B7C4C2] hover:bg-[#FBFAF8]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF3F2]">
                      <FileText className="h-4.5 w-4.5 text-[#2B6E68]" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-[#1C2127]">
                        {doc.title}
                      </h3>
                      <p className="truncate text-xs text-[#8A93A0]">{doc.file_name}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/documents/${doc.id}/chat`)}
                    className="shrink-0 rounded-lg bg-[#2B6E68] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#245C57] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B6E68] focus-visible:ring-offset-2"
                  >
                    Open chat
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;