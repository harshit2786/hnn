import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../lib/api";
import type { Post } from "../../types";
import { formatDate } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";

function SortableRow({ post, onDelete }: { post: Post; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 px-4 py-4 border-b border-border bg-card hover:bg-accent/30 transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical size={15} />
      </button>

      <div className="flex-1 min-w-0">
        <p className="font-serif text-sm text-foreground leading-snug truncate">
          {post.title}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {formatDate(post.createdAt)}
          {post.tags.length > 0 && (
            <span className="ml-2 text-muted-foreground/70">
              {post.tags.join(", ")}
            </span>
          )}
        </p>
      </div>

      <span
        className={`text-[10px] px-2 py-0.5 rounded-full border tracking-wide ${
          post.published
            ? "border-primary/40 text-primary bg-primary/5"
            : "border-border text-muted-foreground"
        }`}
      >
        {post.published ? "Published" : "Draft"}
      </span>

      <div className="flex items-center gap-2">
        <Link
          to={`/admin/edit/${post.id}`}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Pencil size={13} />
        </Link>
        <button
          onClick={() => onDelete(post.id)}
          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default function ManuscriptsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    api.get("/posts", { params: { limit: 100 } })
      .then(({ data }) => setPosts(data.data))
      .finally(() => setLoading(false));
  }, []);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = posts.findIndex((p) => p.id === active.id);
    const newIndex = posts.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(posts, oldIndex, newIndex);
    setPosts(reordered);
    await api.put("/posts/reorder", { orderedIds: reordered.map((p) => p.id) });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this manuscript?")) return;
    await api.delete(`/posts/${id}`);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = posts.filter((p) => {
    if (filter === "published") return p.published;
    if (filter === "draft") return !p.published;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="border-b border-border bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="font-serif text-base text-foreground">Hearts & Notes</span>
            <span className="hidden sm:inline text-xs text-muted-foreground ml-2">— Managing the Archive</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View site
            </Link>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-start sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl italic text-foreground mb-1">
              Manuscripts & Drafts
            </h1>
            <p className="text-xs text-muted-foreground">
              Curate the entries for the archive — drag to reorder
            </p>
          </div>
          <Link
            to="/admin/new"
            className="flex items-center gap-2 bg-primary text-primary-foreground text-xs px-3 sm:px-4 py-2 rounded-sm hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">New Entry</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-4 sm:gap-6 mb-6 border-b border-border pb-3">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs pb-3 -mb-3 border-b-2 transition-colors capitalize ${
                filter === f
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All Records" : f === "published" ? "Published" : "Drafts"}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center font-serif italic text-muted-foreground text-sm">
            Opening manuscripts…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center font-serif italic text-muted-foreground text-sm">
            Nothing here yet.
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filtered.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <div className="border border-border rounded-sm overflow-hidden">
                {filtered.map((post) => (
                  <SortableRow key={post.id} post={post} onDelete={handleDelete} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
