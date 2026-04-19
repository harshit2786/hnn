import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import type { Post } from "../types";
import { formatDate, readingTime } from "../lib/utils";
import { useAuth } from "../hooks/useAuth";

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/posts/${slug}`)
      .then(({ data }) => setPost(data))
      .catch(() => navigate("/", { replace: true }))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center font-serif italic text-muted-foreground text-sm">
        Opening the manuscript…
      </div>
    );
  }

  if (!post) return null;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back link — always visible on mobile above content */}
      <Link
        to="/"
        className="inline-block text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 sm:hidden"
      >
        ← Back to Collections
      </Link>

      <div className="sm:grid sm:grid-cols-[160px_1fr] sm:gap-12">
        {/* Sidebar — hidden on mobile, shown on sm+ */}
        <aside className="hidden sm:block pt-2">
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-10"
          >
            ← Back to Collections
          </Link>

          <div className="space-y-5 text-xs">
            <div>
              <p className="uppercase tracking-widest text-muted-foreground mb-1">Published</p>
              <p className="text-foreground font-serif">{formatDate(post.createdAt)}</p>
            </div>
            <div>
              <p className="uppercase tracking-widest text-muted-foreground mb-1">Reading Time</p>
              <p className="text-foreground font-serif italic">{readingTime(post.content)}</p>
            </div>
            {post.tags.length > 0 && (
              <div>
                <p className="uppercase tracking-widest text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-col gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground w-fit tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {user && (
              <div className="pt-4 border-t border-border">
                <Link to={`/admin/edit/${post.id}`} className="text-xs text-primary hover:underline">
                  Edit manuscript
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Article */}
        <article>
          {/* Mobile meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-5 sm:hidden text-xs text-muted-foreground">
            <span>{formatDate(post.createdAt)}</span>
            <span className="opacity-40">·</span>
            <span className="italic">{readingTime(post.content)}</span>
            {user && (
              <>
                <span className="opacity-40">·</span>
                <Link to={`/admin/edit/${post.id}`} className="text-primary hover:underline">Edit</Link>
              </>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground mb-5 sm:mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="font-serif italic text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 border-b border-border pb-8 sm:pb-10">
              {post.excerpt}
            </p>
          )}

          <div
            className="prose-journal"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags on mobile — shown at bottom */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border sm:hidden">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </main>
  );
}
