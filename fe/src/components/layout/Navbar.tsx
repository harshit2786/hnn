import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-primary font-medium"
      : "text-muted-foreground hover:text-foreground transition-colors";

  // Close whenever location changes
  useState(() => { setOpen(false); });

  return (
    <header className="border-b border-border bg-background relative z-20">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-serif text-lg font-normal tracking-wide text-foreground"
          onClick={() => setOpen(false)}
        >
          Hearts & Notes
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-7 text-sm">
          <NavLink to="/" end className={navClass}>Archive</NavLink>
          <NavLink to="/about" className={navClass}>About</NavLink>
          <NavLink to="/portfolio" className={navClass}>Portfolio</NavLink>
          {user && <NavLink to="/admin" className={navClass}>Manuscripts</NavLink>}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-1 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4 text-sm">
          <NavLink to="/" end className={navClass} onClick={() => setOpen(false)}>Archive</NavLink>
          <NavLink to="/about" className={navClass} onClick={() => setOpen(false)}>About</NavLink>
          <NavLink to="/portfolio" className={navClass} onClick={() => setOpen(false)}>Portfolio</NavLink>
          {user && (
            <NavLink to="/admin" className={navClass} onClick={() => setOpen(false)}>
              Manuscripts
            </NavLink>
          )}
        </div>
      )}

      {/* Suppress unused warning */}
      <span className="hidden">{location.pathname}</span>
    </header>
  );
}
