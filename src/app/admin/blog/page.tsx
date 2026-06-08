"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBlogPosts, useDeletePost } from "@/hooks/use-blog";
import type { BlogPost } from "@/db/schema";
import {
  MdAdd,
  MdSearch,
  MdEdit,
  MdDelete,
  MdArticle,
  MdPublic,
  MdDrafts,
} from "react-icons/md";
import { useAdminToast } from "@/components/admin/AdminToast";
import { formatBlogDate } from "@/lib/blog-blocks";

type Filter = "all" | "published" | "draft";

export default function AdminBlogPage() {
  const router = useRouter();
  const { data: posts = [], isLoading } = useBlogPosts(true);
  const deletePost = useDeletePost();
  const { showToast } = useAdminToast();

  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = posts;
    if (filter === "published") list = list.filter((p) => p.isPublished);
    if (filter === "draft") list = list.filter((p) => !p.isPublished);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt ?? "").toLowerCase().includes(q) ||
          (p.category ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [posts, filter, search]);

  const stats = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((p) => p.isPublished).length,
      draft: posts.filter((p) => !p.isPublished).length,
    }),
    [posts]
  );

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`"${post.title}"을 삭제하시겠습니까?`)) return;
    try {
      await deletePost.mutateAsync(post.id);
      showToast("게시글이 삭제되었습니다.");
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "삭제에 실패했습니다.",
        "error"
      );
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2D1B4E]">블로그 관리</h1>
          <p className="text-sm text-[#5A4070] mt-1">
            블록 에디터로 텍스트·이미지 콘텐츠를 작성하고 발행합니다.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/blog/new")}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 shrink-0"
          style={{ background: "linear-gradient(135deg, #E8748A 0%, #8B64C8 100%)" }}
        >
          <MdAdd size={18} />
          새 포스트 작성
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { key: "all" as Filter, label: "전체", value: stats.total, icon: MdArticle, color: "#8B64C8" },
          { key: "published" as Filter, label: "게시됨", value: stats.published, icon: MdPublic, color: "#22c55e" },
          { key: "draft" as Filter, label: "초안", value: stats.draft, icon: MdDrafts, color: "#eab308" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className="rounded-2xl px-4 py-4 text-left transition-all"
            style={{
              background: filter === s.key ? "#F0EBF8" : "white",
              border: filter === s.key ? "2px solid #8B64C8" : "1px solid #EDE8F5",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={16} style={{ color: s.color }} />
              <span className="text-xs font-semibold text-[#A895C0]">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-[#2D1B4E]">{s.value}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <MdSearch
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A895C0]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="제목, 요약, 카테고리 검색..."
          className="admin-input pl-10"
        />
      </div>

      {/* Post list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-2xl py-16 text-center"
          style={{ background: "white", border: "1px solid #EDE8F5" }}
        >
          <MdArticle size={40} className="mx-auto text-[#C0AED6] mb-3" />
          <p className="text-sm text-[#A895C0]">
            {search ? "검색 결과가 없습니다." : "아직 포스트가 없습니다."}
          </p>
          {!search && (
            <button
              onClick={() => router.push("/admin/blog/new")}
              className="mt-4 text-sm text-[#8B64C8] font-semibold hover:underline"
            >
              첫 포스트 작성하기 →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={() => router.push(`/admin/blog/${post.id}`)}
              onDelete={() => handleDelete(post)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({
  post,
  onEdit,
  onDelete,
}: {
  post: BlogPost;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article
      className="flex gap-4 p-4 rounded-2xl transition-shadow hover:shadow-md cursor-pointer group"
      style={{ background: "white", border: "1px solid #EDE8F5" }}
      onClick={onEdit}
    >
      {/* Thumbnail */}
      <div
        className="relative w-28 h-20 shrink-0 rounded-xl overflow-hidden"
        style={{ background: "#F0EBF8" }}
      >
        {post.thumbnailUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MdArticle size={24} className="text-[#C0AED6]" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
              post.isPublished
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {post.isPublished ? "게시됨" : "초안"}
          </span>
          {post.category && (
            <span className="text-[10px] text-[#8B64C8] font-medium">
              {post.category}
            </span>
          )}
          <span className="text-[10px] text-[#A895C0]">
            {formatBlogDate(post.publishedAt ?? post.createdAt)}
          </span>
        </div>
        <h3 className="font-semibold text-[#2D1B4E] truncate group-hover:text-[#8B64C8] transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-xs text-[#A895C0] mt-0.5 line-clamp-1">{post.excerpt}</p>
        )}
        <p className="text-[10px] text-[#C0AED6] mt-1">{post.author}</p>
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onEdit}
          className="p-2 rounded-lg hover:bg-[#F0EBF8] text-[#5A4070]"
          title="편집"
        >
          <MdEdit size={18} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg hover:bg-red-50 text-red-400"
          title="삭제"
        >
          <MdDelete size={18} />
        </button>
      </div>
    </article>
  );
}
