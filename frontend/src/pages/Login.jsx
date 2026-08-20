import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, saveToken } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      saveToken(data.access_token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-ink text-paper flex-col justify-between p-12">
        <div className="font-display text-xl tracking-tight">DocuMind AI</div>
        <div>
          <p className="font-display text-3xl leading-snug mb-4">
            Every document,
            <br />
            answered on its own terms.
          </p>
          <p className="text-sm text-paper/60 max-w-sm">
            Upload a document once. Ask it anything, as many times as you need —
            answers grounded only in what it actually says.
          </p>
        </div>
        <p className="text-xs text-paper/40">© {new Date().getFullYear()} DocuMind AI</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl mb-1">Welcome back</h1>
          <p className="text-sm text-muted mb-8">Log in to continue to your documents.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-border rounded-md bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-border rounded-md bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-md transition"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="text-sm text-muted mt-6 text-center">
            No account?{" "}
            <Link to="/signup" className="text-accent font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}