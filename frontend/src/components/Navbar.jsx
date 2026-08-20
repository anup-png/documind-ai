import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

export default function Navbar({ email }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="border-b border-border bg-surface px-6 py-4 flex items-center justify-between">
      <span className="font-display text-lg tracking-tight">DocuMind AI</span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted">{email}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-muted hover:text-ink border border-border rounded-md px-3 py-1.5 transition"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}