"use client";

import { useState } from "react";
import { useBlogPosts, useCreatePost, useUpdatePost, useDeletePost } from "@/hooks/use-blog";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminModal } from "@/components/admin/AdminModal";
import type { BlogPost } from "@/db/schema";
import { MdAdd } from "react-icons/md";
import { useAdminToast } from "@/components/admin/AdminToast";

interface PostForm {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  isPublished: boolean;
}

const defaultForm: PostForm = {
  title: "",
  excerpt: "",
  content: "",
  author: "GW Beauty",
  isPublished: false,
};

export default function AdminBlogPage() {
  const { data: posts = [], isLoading } = useBlogPosts(true);
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const { showToast } = useAdminToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<PostForm>(defaultForm);

  const openCreate = () => {
    setEditingPost(null);
    setForm(defaultForm);
    setIsModalOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      excerpt: post.excerpt ?? "",
      content: post.content ?? "",
      author: post.author ?? "GW Beauty",
      isPublished: post.isPublished ?? false,
    });
    setIsModalOpen(true);
  };

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

  const handleSubmit = async () => {
    const data = {
      ...form,
      publishedAt: form.isPublished ? new Date() : null,
    };
    try {
      if (editingPost) {
        await updatePost.mutateAsync({ id: editingPost.id, data });
        showToast("게시글이 저장되었습니다.");
      } else {
        await createPost.mutateAsync(data);
        showToast("새 게시글이 등록되었습니다.");
      }
      setIsModalOpen(false);
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "저장에 실패했습니다.",
        "error"
      );
    }
  };

  const isSaving = createPost.isPending || updatePost.isPending;

  const columns = [
    {
      key: "title",
      header: "제목",
      render: (p: BlogPost) => (
        <div>
          <p className="font-medium text-[#2D1B4E]">{p.title}</p>
          {p.excerpt && (
            <p className="text-xs text-[#A895C0] mt-0.5 line-clamp-1">{p.excerpt}</p>
          )}
        </div>
      ),
    },
    {
      key: "author",
      header: "작성자",
      width: "120px",
      render: (p: BlogPost) => (
        <span className="text-sm text-[#5A4070]">{p.author}</span>
      ),
    },
    {
      key: "isPublished",
      header: "게시 상태",
      width: "100px",
      render: (p: BlogPost) => (
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            p.isPublished
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {p.isPublished ? "게시됨" : "초안"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "작성일",
      width: "120px",
      render: (p: BlogPost) => (
        <span className="text-xs text-[#A895C0]">
          {p.createdAt ? new Date(p.createdAt).toLocaleDateString("ko-KR") : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2D1B4E]">블로그 관리</h1>
          <p className="text-sm text-[#5A4070] mt-1">전체 {posts.length}건</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #E8748A 0%, #8B64C8 100%)" }}
        >
          <MdAdd size={18} />
          포스트 작성
        </button>
      </div>

      <div
        className="rounded-2xl shadow-sm p-6"
        style={{ background: "white", border: "1px solid #EDE8F5" }}
      >
        <AdminTable
          columns={columns}
          data={posts}
          keyField="id"
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPost ? "포스트 수정" : "포스트 작성"}
        size="lg"
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-[#5A4070] border hover:bg-gray-50"
              style={{ borderColor: "#EDE8F5" }}
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving || !form.title}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #E8748A 0%, #8B64C8 100%)" }}
            >
              {isSaving ? "저장 중..." : "저장"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5A4070] mb-1.5">
              제목 *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
              placeholder="포스트 제목"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A4070] mb-1.5">
              발췌문
            </label>
            <input
              type="text"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="admin-input"
              placeholder="목록에 표시될 짧은 설명"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A4070] mb-1.5">
              본문
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="admin-input resize-none"
              rows={8}
              placeholder="포스트 내용을 입력하세요..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5A4070] mb-1.5">
                작성자
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="admin-input"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-[#5A4070]">바로 게시</span>
              </label>
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
