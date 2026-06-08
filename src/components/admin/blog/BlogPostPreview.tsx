"use client";

import { BlogBlockRenderer } from "@/components/blog/BlogBlockRenderer";
import type { BlogBlock } from "@/lib/blog-blocks";
import { formatBlogDate } from "@/lib/blog-blocks";

interface Props {
  title: string;
  excerpt: string;
  thumbnailUrl: string;
  category: string;
  author: string;
  blocks: BlogBlock[];
  publishedAt?: Date | string | null;
}

/** 관리자 편집 화면 우측 실시간 미리보기 */
export function BlogPostPreview({
  title,
  excerpt,
  thumbnailUrl,
  category,
  author,
  blocks,
  publishedAt,
}: Props) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid #EDE8F5", background: "var(--bg)" }}
    >
      <div
        className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#A895C0]"
        style={{ background: "#F9F7FD", borderBottom: "1px solid #EDE8F5" }}
      >
        미리보기
      </div>

      <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {thumbnailUrl && (
          <div className="aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-[#F0EBF8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          {category && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[0.58rem] font-semibold tracking-[0.12em] text-white uppercase"
              style={{ background: "var(--purple)" }}
            >
              {category}
            </span>
          )}
          <span className="text-[0.58rem] text-[var(--text-3)]">
            {formatBlogDate(publishedAt ?? new Date())}
          </span>
        </div>

        <h1 className="section-title text-2xl mb-3">
          {title || "제목을 입력하세요"}
        </h1>

        {excerpt && (
          <p className="text-sm text-[var(--text-3)] mb-6 leading-relaxed">
            {excerpt}
          </p>
        )}

        <p className="text-xs text-[var(--text-3)] mb-8">by {author}</p>

        <BlogBlockRenderer blocks={blocks.filter((b) => hasContent(b))} />
      </div>
    </div>
  );
}

function hasContent(block: BlogBlock): boolean {
  switch (block.type) {
    case "divider":
      return true;
    case "image":
      return !!block.url;
    case "list":
      return (block.items ?? []).some(Boolean);
    default:
      return !!block.text?.trim();
  }
}
