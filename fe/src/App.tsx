import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Navbar from "./components/layout/Navbar";
import ArchivePage from "./pages/ArchivePage";
import PostPage from "./pages/PostPage";
import AboutPage from "./pages/AboutPage";
// import PortfolioPage from "./pages/PortfolioPage";
import LoginPage from "./pages/LoginPage";
import ManuscriptsPage from "./pages/admin/ManuscriptsPage";
import EditorPage from "./pages/admin/EditorPage";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Outlet />
      <footer className="border-t border-border mt-16 sm:mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} Hearts & Notes
          </p>
          <p className="text-[11px] text-muted-foreground font-serif italic">
            Adarshi Dubey
          </p>
        </div>
      </footer>
    </div>
  );
}

function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/admin" replace /> : <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<ArchivePage />} />
            <Route path="/post/:slug" element={<PostPage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* <Route path="/portfolio" element={<PortfolioPage />} /> */}
          </Route>

          {/* Login */}
          <Route
            path="/login"
            element={
              <RedirectIfAuthed>
                <LoginPage />
              </RedirectIfAuthed>
            }
          />

          {/* Admin — protected, no public navbar */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<ManuscriptsPage />} />
            <Route path="/admin/new" element={<EditorPage />} />
            <Route path="/admin/edit/:id" element={<EditorPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
