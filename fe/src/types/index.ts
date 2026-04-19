export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  author: { name: string };
}

export interface PaginatedPosts {
  data: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
  _count: { posts: number };
}
