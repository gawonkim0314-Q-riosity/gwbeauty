import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BlogPost, NewBlogPost } from "@/db/schema";
import { adminFetch } from "@/lib/auth/admin-fetch";

const BLOG_KEY = ["blog"] as const;

async function parseError(res: Response, fallback: string): Promise<never> {
  try {
    const data = await res.json();
    throw new Error(data.error ?? fallback);
  } catch (e) {
    if (e instanceof Error && e.message !== fallback) throw e;
    throw new Error(fallback);
  }
}

async function fetchPosts(all = false): Promise<BlogPost[]> {
  const res = all
    ? await adminFetch("/api/blog?all=true")
    : await fetch("/api/blog");
  if (!res.ok) await parseError(res, "포스트 목록을 불러올 수 없습니다.");
  return res.json();
}

async function createPost(data: Omit<NewBlogPost, "id">): Promise<BlogPost> {
  const res = await adminFetch("/api/blog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) await parseError(res, "포스트 생성에 실패했습니다.");
  return res.json();
}

async function updatePost(id: number, data: Partial<BlogPost>): Promise<BlogPost> {
  const res = await adminFetch(`/api/blog/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) await parseError(res, "포스트 수정에 실패했습니다.");
  return res.json();
}

async function deletePost(id: number): Promise<void> {
  const res = await adminFetch(`/api/blog/${id}`, { method: "DELETE" });
  if (!res.ok) await parseError(res, "포스트 삭제에 실패했습니다.");
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
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: BLOG_KEY });
      queryClient.invalidateQueries({ queryKey: ["blog", "post", id] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BLOG_KEY }),
  });
}
