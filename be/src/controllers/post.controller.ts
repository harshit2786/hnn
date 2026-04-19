import type { Response } from "express";
import { prisma } from "../lib/prisma.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  createPostSchema,
  updatePostSchema,
  reorderSchema,
  paginationSchema,
} from "../validators/post.validator.js";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${i++}`;
  }
}

async function upsertTags(names: string[]) {
  return Promise.all(
    names.map((name) =>
      prisma.tag.upsert({
        where: { name: name.toLowerCase().trim() },
        update: {},
        create: { name: name.toLowerCase().trim() },
      })
    )
  );
}

export async function getAllPosts(req: AuthRequest, res: Response) {
  const parsed = paginationSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { page, limit, tag } = parsed.data;
  const skip = (page - 1) * limit;

  const where = {
    published: true,
    ...(tag ? { tags: { some: { tag: { name: tag.toLowerCase().trim() } } } } : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { order: "asc" },
      skip,
      take: limit,
      include: {
        tags: { include: { tag: true } },
        author: { select: { name: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  res.json({
    data: posts.map((p) => ({ ...p, tags: p.tags.map((pt) => pt.tag.name) })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  });
}

export async function getPost(req: AuthRequest, res: Response) {
  const slug = req.params.slug as string;
  const isAuthor = !!req.userId;

  const post = await prisma.post.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    include: {
      tags: { include: { tag: true } },
      author: { select: { name: true } },
    },
  });

  if (!post || (!post.published && !isAuthor)) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.json({ ...post, tags: post.tags.map((pt) => pt.tag.name) });
}

export async function createPost(req: AuthRequest, res: Response) {
  const parsed = createPostSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { title, content, excerpt, published, tags } = parsed.data;

  const maxOrder = await prisma.post.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const slug = await uniqueSlug(slugify(title));
  const upserted = await upsertTags(tags);

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt ?? null,
      published,
      order,
      authorId: req.userId!,
      tags: {
        create: upserted.map((tag) => ({ tagId: tag.id })),
      },
    },
    include: { tags: { include: { tag: true } } },
  });

  res.status(201).json({ ...post, tags: post.tags.map((pt) => pt.tag.name) });
}

export async function updatePost(req: AuthRequest, res: Response) {
  const id = req.params.id as string;

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const parsed = updatePostSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { title, content, excerpt, published, tags } = parsed.data;

  let slug = existing.slug;
  if (title && title !== existing.title) {
    slug = await uniqueSlug(slugify(title), id);
  }

  if (tags !== undefined) {
    const upserted = await upsertTags(tags);
    await prisma.postTag.deleteMany({ where: { postId: id } });
    await prisma.postTag.createMany({
      data: upserted.map((tag) => ({ postId: id, tagId: tag.id })),
    });
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(slug !== existing.slug && { slug }),
      ...(content !== undefined && { content }),
      ...(excerpt !== undefined && { excerpt: excerpt ?? null }),
      ...(published !== undefined && { published }),
    },
    include: { tags: { include: { tag: true } } },
  });

  res.json({ ...post, tags: post.tags.map((pt) => pt.tag.name) });
}

export async function deletePost(req: AuthRequest, res: Response) {
  const id = req.params.id as string;

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  await prisma.post.delete({ where: { id } });
  res.json({ message: "Post deleted" });
}

export async function reorderPosts(req: AuthRequest, res: Response) {
  const parsed = reorderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { orderedIds } = parsed.data;

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.post.update({ where: { id }, data: { order: index } })
    )
  );

  res.json({ message: "Posts reordered" });
}

export async function getAllPostsAdmin(_req: AuthRequest, res: Response) {
  const posts = await prisma.post.findMany({
    orderBy: { order: "asc" },
    include: {
      tags: { include: { tag: true } },
      author: { select: { name: true } },
    },
  });

  res.json(
    posts.map((p) => ({ ...p, tags: p.tags.map((pt) => pt.tag.name) }))
  );
}

export async function getAllTags(_req: AuthRequest, res: Response) {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
  res.json(tags);
}
