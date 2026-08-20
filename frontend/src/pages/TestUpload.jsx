import { useState } from "react";
import api from "../api/api";

export default function TestUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/test/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Test Cloudinary upload</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full bg-blue-600 text-white py-2 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm break-all">
          <p className="font-medium text-green-800 mb-1">Uploaded successfully</p>
          
          <a
            href={result.file_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            {result.file_url}
          </a>
        </div>
      )}
    </div>
  );
}