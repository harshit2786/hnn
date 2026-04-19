import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import type { PaginatedPosts, Post } from "../types";
import { formatDate } from "../lib/utils";

function groupByYear(posts: Post[]): [number, Post[]][] {
  const map = new Map<number, Post[]>();
  for (const p of posts) {
    const y = new Date(p.createdAt).getFullYear();
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(p);
  }
  return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
}

export default function ArchivePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<PaginatedPosts["meta"] | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/posts", { params: { page, limit: 20 } })
      .then(({ data }: { data: PaginatedPosts }) => {
        setPosts((prev) => page === 1 ? data.data : [...prev, ...data.data]);
        setMeta(data.meta);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const groups = groupByYear(posts);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-10 sm:mb-12">
        <p className="text-xs tracking-widest uppercase text-primary mb-3">
          The Collection
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight text-foreground mb-4">
          Writings &<br />Reflections.
        </h1>
        <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
          A collection of essays, observations, and fragments — bound by year and
          thematic resonance.
        </p>
      </div>

      {loading && posts.length === 0 ? (
        <div className="text-muted-foreground text-sm py-20 text-center font-serif italic">
          Opening the collection…
        </div>
      ) : groups.length === 0 ? (
        <div className="text-muted-foreground text-sm py-20 text-center font-serif italic">
          Nothing written yet.
        </div>
      ) : (
        groups.map(([year, yearPosts]) => (
          <section key={year} className="mb-14">
            <div className="divide-y divide-border">
              {yearPosts.map((post) => (
                  <article key={post.id} className="py-6 sm:py-8">
                    {/* Mobile: meta row above title */}
                    <div className="flex items-center gap-3 mb-2 sm:hidden">
                      <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
                    </div>

                    {/* Desktop: 3-col layout */}
                    <div className="hidden sm:grid sm:grid-cols-[100px_1fr_auto] sm:gap-6 sm:items-start">
                      <div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{formatDate(post.createdAt)}</p>
                      </div>
                      <div>
                        <Link
                          to={`/post/${post.slug}`}
                          className="font-serif text-xl font-normal text-foreground hover:text-primary transition-colors leading-snug block mb-2"
                        >
                          {post.title}
                        </Link>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.excerpt}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground tracking-wide">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Mobile: stacked layout */}
                    <div className="sm:hidden">
                      <Link
                        to={`/post/${post.slug}`}
                        className="font-serif text-lg font-normal text-foreground hover:text-primary transition-colors leading-snug block mb-2"
                      >
                        {post.title}
                      </Link>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground tracking-wide">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
              ))}
            </div>
          </section>
        ))
      )}

      {meta?.hasNextPage && (
        <div className="text-center mt-8">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
          >
            {loading ? "Loading…" : "Discover Further ↓"}
          </button>
        </div>
      )}
    </main>
  );
}
