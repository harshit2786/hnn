import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TipTapEditor from "../../components/TipTapEditor";
import api from "../../lib/api";
import type { Post } from "../../types";
import Logo from "../../components/Logo";

export default function EditorPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/posts/${id}`)
      .then(({ data }: { data: Post }) => {
        setTitle(data.title);
        setContent(data.content);
        setExcerpt(data.excerpt ?? "");
        setTags(data.tags.join(", "));
      })
      .catch(() => navigate("/admin"))
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  async function save(publish?: boolean) {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const body = {
        title,
        content,
        excerpt: excerpt.trim() || null,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        ...(publish !== undefined ? { published: publish } : {}),
      };
      if (isEdit) {
        await api.put(`/posts/${id}`, body);
      } else {
        const { data } = await api.post("/posts", { ...body, published: publish ?? false });
        navigate(`/admin/edit/${data.id}`, { replace: true });
      }
      setLastSaved(new Date().toLocaleTimeString());
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-serif italic text-muted-foreground text-sm">
        Loading manuscript…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Logo size={22} />
            <Link
              to="/admin"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Manuscripts
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {lastSaved && (
              <span className="hidden sm:inline text-[11px] text-muted-foreground">
                Saved at {lastSaved}
              </span>
            )}
            <button
              onClick={() => save(false)}
              disabled={saving || !title.trim()}
              className="text-xs px-3 sm:px-4 py-1.5 border border-border rounded-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors disabled:opacity-40"
            >
              Save Draft
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving || !title.trim()}
              className="text-xs px-3 sm:px-4 py-1.5 bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Publish
            </button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="lg:hidden flex border-t border-border">
          <button
            onClick={() => setTab("edit")}
            className={`flex-1 py-2 text-xs transition-colors ${
              tab === "edit"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setTab("preview")}
            className={`flex-1 py-2 text-xs transition-colors ${
              tab === "preview"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            Preview
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-10">
        {/* Editor pane */}
        <div className={`flex flex-col gap-5 ${tab === "preview" ? "hidden lg:flex" : ""}`}>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
              Manuscript Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your archive…"
              className="w-full bg-transparent text-xl sm:text-2xl font-serif text-foreground placeholder:text-muted-foreground/50 focus:outline-none border-b border-transparent focus:border-border pb-2 transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief note on what this entry holds…"
              rows={2}
              className="w-full bg-transparent text-sm font-serif italic text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none border-b border-transparent focus:border-border pb-1 transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
              Tags <span className="normal-case tracking-normal">(comma separated)</span>
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Poetry, Victorian, Elegy"
              className="w-full bg-transparent text-xs text-muted-foreground placeholder:text-muted-foreground/50 focus:outline-none border-b border-transparent focus:border-border pb-1 transition-colors"
            />
          </div>

          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
              Manuscript
            </label>
            <TipTapEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Preview pane */}
        <div className={`lg:border-l lg:border-border lg:pl-10 ${tab === "edit" ? "hidden lg:block" : ""}`}>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-6">
            Public Presentation Preview
          </p>

          {title ? (
            <>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-foreground mb-4">
                {title}
              </h1>
              {excerpt && (
                <p className="font-serif italic text-muted-foreground text-base leading-relaxed mb-8 border-b border-border pb-8">
                  {excerpt}
                </p>
              )}
              <div
                className="prose-journal"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </>
          ) : (
            <p className="font-serif italic text-muted-foreground/50 text-sm">
              Your manuscript will appear here…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
