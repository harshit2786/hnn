import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  published: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
});

export const updatePostSchema = createPostSchema.partial();

export const reorderSchema = z.object({
  orderedIds: z.array(z.string()).min(1),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(10),
  tag: z.string().optional(),
});
