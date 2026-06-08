import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BlogPost, NewBlogPost } from "@/db/schema";
import { adminFetch } from "@/lib/auth/admin-fetch";

const BLOG_KEY = ["blog"] as const;

async function fetchPosts(all = false): Promise<BlogPost[]> {
  const res = all
    ? await adminFetch("/api/blog?all=true")
    : await fetch("/api/blog");
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

async function createPost(data: Omit<NewBlogPost, "id">): Promise<BlogPost> {
  const res = await adminFetch("/api/blog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

async function updatePost(id: number, data: Partial<BlogPost>): Promise<BlogPost> {
  const res = await adminFetch(`/api/blog/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update post");
  return res.json();
}

async function deletePost(id: number): Promise<void> {
  const res = await adminFetch(`/api/blog/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post");
}

export function useBlogPosts(all = false) {
  return useQuery({
    queryKey: [...BLOG_KEY, { all }],
    queryFn: () => fetchPosts(all),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BLOG_KEY }),
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BlogPost> }) =>
      updatePost(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BLOG_KEY }),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BLOG_KEY }),
  });
}
