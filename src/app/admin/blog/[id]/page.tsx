"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminFetch } from "@/lib/auth/admin-fetch";
import {
  BlogEditorWorkspace,
  postToEditorState,
} from "@/components/admin/blog/BlogEditorWorkspace";
import type { BlogPost } from "@/db/schema";

export default function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const postId = Number(id);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog", "post", postId],
    queryFn: async () => {
      const res = await adminFetch(`/api/blog/${postId}`);
      if (!res.ok) throw new Error("포스트를 불러올 수 없습니다.");
      return res.json() as Promise<BlogPost>;
    },
    enabled: !isNaN(postId),
  });

  if (isNaN(postId)) {
    return (
      <div className="p-8 text-center text-[#A895C0]">잘못된 포스트 ID입니다.</div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 w-48 rounded-lg animate-pulse bg-gray-100" />
        <div className="h-64 rounded-2xl animate-pulse bg-gray-100" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="p-8 text-center text-red-400">
        {error instanceof Error ? error.message : "포스트를 찾을 수 없습니다."}
      </div>
    );
  }

  return (
    <BlogEditorWorkspace
      postId={postId}
      initial={postToEditorState(post)}
    />
  );
}
