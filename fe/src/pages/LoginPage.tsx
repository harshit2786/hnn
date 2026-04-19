import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-sm px-10 py-12">
          <div className="text-center mb-10">
            <h1 className="font-serif text-2xl text-foreground mb-2">
              Access the Archive
            </h1>
            <p className="text-xs text-muted-foreground italic">
              A space for deliberate thought
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-muted-foreground mb-2">
                Identification
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="author@archive.org"
                required
                className="w-full bg-transparent border-b border-border focus:border-primary outline-none text-sm text-foreground placeholder:text-muted-foreground pb-2 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-muted-foreground mb-2">
                Cipher
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-transparent border-b border-border focus:border-primary outline-none text-sm text-foreground placeholder:text-muted-foreground pb-2 transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground text-sm py-2.5 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              {loading ? "Entering…" : "Enter"}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-8">
          © {new Date().getFullYear()} Hearts & Notes
        </p>
      </div>
    </div>
  );
}
