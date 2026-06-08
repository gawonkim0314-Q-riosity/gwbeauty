"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MdArrowBack,
  MdSave,
  MdPublish,
  MdCloudUpload,
  MdVisibility,
  MdClose,
} from "react-icons/md";
import { BlogBlockEditor } from "@/components/admin/blog/BlogBlockEditor";
import { BlogPostPreview } from "@/components/admin/blog/BlogPostPreview";
import { useCreatePost, useUpdatePost } from "@/hooks/use-blog";
import { useUpload } from "@/hooks/use-upload";
import { useAdminToast } from "@/components/admin/AdminToast";
import {
  type BlogBlock,
  BLOG_CATEGORIES,
  createBlock,
  parseBlocks,
  blocksToPlainText,
  excerptFromBlocks,
  slugifyTitle,
} from "@/lib/blog-blocks";
import type { BlogPost } from "@/db/schema";

export interface BlogEditorState {
  title: string;
  slug: string;
  excerpt: string;
  thumbnailUrl: string;
  category: string;
  author: string;
  isPublished: boolean;
  blocks: BlogBlock[];
}

export function postToEditorState(post: BlogPost): BlogEditorState {
  return {
    title: post.title,
    slug: post.slug ?? "",
    excerpt: post.excerpt ?? "",
    thumbnailUrl: post.thumbnailUrl ?? "",
    category: post.category ?? "클리닉 소식",
    author: post.author ?? "GW Beauty",
    isPublished: post.isPublished ?? false,
    blocks: parseBlocks(post.blocks ?? post.content),
  };
}

export const emptyEditorState = (): BlogEditorState => ({
  title: "",
  slug: "",
  excerpt: "",
  thumbnailUrl: "",
  category: "클리닉 소식",
  author: "GW Beauty",
  isPublished: false,
  blocks: [createBlock("paragraph")],
});

interface Props {
  postId?: number;
  initial?: BlogEditorState;
}

export function BlogEditorWorkspace({ postId, initial }: Props) {
  const router = useRouter();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const upload = useUpload();
  const { showToast } = useAdminToast();
  const thumbRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<BlogEditorState>(initial ?? emptyEditorState());
  const [showPreview, setShowPreview] = useState(true);
  const [slugEdited, setSlugEdited] = useState(!!initial?.slug);
  const [thumbLocalPreview, setThumbLocalPreview] = useState<string | null>(null);

  const isSaving = createPost.isPending || updatePost.isPending;

  const patch = (p: Partial<BlogEditorState>) => setForm((prev) => ({ ...prev, ...p }));

  const handleTitleChange = (title: string) => {
    patch({
      title,
      slug: slugEdited ? form.slug : slugifyTitle(title),
    });
  };

  const handleThumbnailUpload = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setThumbLocalPreview(preview);
    const url = await upload.uploadFile(file, "blog/thumbnails");
    if (url) {
      patch({ thumbnailUrl: url });
      URL.revokeObjectURL(preview);
      setThumbLocalPreview(null);
    } else {
      showToast("이미지 업로드에 실패했습니다.", "error");
    }
  };

  useEffect(() => {
    return () => {
      if (thumbLocalPreview) URL.revokeObjectURL(thumbLocalPreview);
    };
  }, [thumbLocalPreview]);

  const buildPayload = (publish: boolean) => {
    const blocks = form.blocks.filter((b) => {
      if (b.type === "image") return !!b.url;
      if (b.type === "divider") return true;
      if (b.type === "list") return (b.items ?? []).some(Boolean);
      return !!b.text?.trim();
    });

    return {
      title: form.title.trim(),
      slug: form.slug.trim() || slugifyTitle(form.title),
      excerpt: form.excerpt.trim() || excerptFromBlocks(blocks),
      thumbnailUrl: form.thumbnailUrl || null,
      category: form.category,
      author: form.author,
      blocks,
      content: blocksToPlainText(blocks),
      isPublished: publish,
      publishedAt: publish ? new Date() : null,
    };
  };

  const handleSave = async (publish: boolean) => {
    if (!form.title.trim()) {
      showToast("제목을 입력해 주세요.", "error");
      return;
    }

    const data = buildPayload(publish);

    try {
      if (postId) {
        await updatePost.mutateAsync({ id: postId, data });
        showToast(publish ? "게시글이 발행되었습니다." : "임시저장되었습니다.");
      } else {
        const created = await createPost.mutateAsync(data);
        showToast(publish ? "게시글이 발행되었습니다." : "임시저장되었습니다.");
        router.replace(`/admin/blog/${created.id}`);
      }
      if (publish) patch({ isPublished: true });
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "저장에 실패했습니다.",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between gap-4 px-6 py-3"
        style={{ background: "white", borderBottom: "1px solid #EDE8F5" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="p-2 rounded-lg hover:bg-[#F0EBF8] text-[#5A4070] shrink-0"
          >
            <MdArrowBack size={20} />
          </button>
          <div className="min-w-0">
            <p className="text-xs text-[#A895C0]">
              {postId ? "포스트 수정" : "새 포스트"}
            </p>
            <p className="text-sm font-semibold text-[#2D1B4E] truncate">
              {form.title || "제목 없음"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#5A4070] border hover:bg-gray-50"
            style={{ borderColor: "#EDE8F5" }}
          >
            <MdVisibility size={14} />
            {showPreview ? "미리보기 숨기기" : "미리보기"}
          </button>
          {postId && form.slug && form.isPublished && (
            <a
              href={`/ko/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#8B64C8] border hover:bg-[#F0EBF8]"
              style={{ borderColor: "#EDE8F5" }}
            >
              사이트에서 보기 →
            </a>
          )}
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[#5A4070] border hover:bg-gray-50 disabled:opacity-50"
            style={{ borderColor: "#EDE8F5" }}
          >
            <MdSave size={16} />
            {isSaving ? "저장 중..." : "임시저장"}
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #E8748A 0%, #8B64C8 100%)" }}
          >
            <MdPublish size={16} />
            {isSaving ? "저장 중..." : "발행"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor column */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Thumbnail */}
            <div>
              {(form.thumbnailUrl || thumbLocalPreview) ? (
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden group bg-[#F0EBF8]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.thumbnailUrl || thumbLocalPreview || ""}
                    alt="썸네일"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => thumbRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg text-xs text-white bg-white/20 backdrop-blur"
                    >
                      교체
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        patch({ thumbnailUrl: "" });
                        setThumbLocalPreview(null);
                      }}
                      className="p-1.5 rounded-lg text-white bg-white/20 backdrop-blur"
                    >
                      <MdClose size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => thumbRef.current?.click()}
                  disabled={upload.state === "uploading"}
                  className="w-full aspect-[16/9] rounded-2xl flex flex-col items-center justify-center gap-2 text-[#A895C0] hover:bg-[#F9F7FD] transition-colors"
                  style={{ border: "2px dashed #EDE8F5", background: "white" }}
                >
                  <MdCloudUpload size={36} />
                  <span className="text-sm font-medium">
                    {upload.state === "uploading" ? "업로드 중..." : "대표 이미지 업로드"}
                  </span>
                  <span className="text-xs">목록·상단에 표시됩니다</span>
                </button>
              )}
              <input
                ref={thumbRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleThumbnailUpload(file);
                  e.target.value = "";
                }}
              />
            </div>

            {/* Title */}
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="포스트 제목"
              className="w-full text-3xl font-bold text-[#2D1B4E] bg-transparent outline-none placeholder:text-[#C0AED6] font-display"
            />

            {/* Excerpt */}
            <input
              type="text"
              value={form.excerpt}
              onChange={(e) => patch({ excerpt: e.target.value })}
              placeholder="목록에 표시될 한 줄 요약 (비워두면 본문에서 자동 생성)"
              className="w-full text-sm text-[#5A4070] bg-transparent outline-none placeholder:text-[#C0AED6] border-b border-[#EDE8F5] pb-2"
            />

            {/* Meta row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-[#A895C0] mb-1 uppercase">
                  카테고리
                </label>
                <select
                  value={form.category}
                  onChange={(e) => patch({ category: e.target.value })}
                  className="admin-input text-sm"
                >
                  {BLOG_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[#A895C0] mb-1 uppercase">
                  작성자
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => patch({ author: e.target.value })}
                  className="admin-input text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[#A895C0] mb-1 uppercase">
                  URL 슬러그
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    patch({ slug: e.target.value });
                  }}
                  className="admin-input text-sm"
                  placeholder="자동 생성"
                />
              </div>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  form.isPublished
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {form.isPublished ? "게시됨" : "초안"}
              </span>
            </div>

            {/* Block editor */}
            <BlogBlockEditor
              blocks={form.blocks}
              onChange={(updater) =>
                setForm((prev) => ({
                  ...prev,
                  blocks: updater(prev.blocks),
                }))
              }
            />
          </div>
        </div>

        {/* Preview column */}
        {showPreview && (
          <aside
            className="hidden lg:block w-[380px] xl:w-[420px] shrink-0 p-6 overflow-y-auto"
            style={{ background: "#F7F8FA", borderLeft: "1px solid #EDE8F5" }}
          >
            <BlogPostPreview
              title={form.title}
              excerpt={form.excerpt || excerptFromBlocks(form.blocks)}
              thumbnailUrl={form.thumbnailUrl}
              category={form.category}
              author={form.author}
              blocks={form.blocks}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
