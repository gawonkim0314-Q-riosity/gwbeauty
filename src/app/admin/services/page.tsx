"use client";

import { useState } from "react";
import { useAllServices, useCreateService, useUpdateService, useDeleteService } from "@/hooks/use-services";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminModal } from "@/components/admin/AdminModal";
import type { Service } from "@/db/schema";
import { MdAdd } from "react-icons/md";

const CATEGORIES = [
  { value: "eye", label: "눈 성형" },
  { value: "nose", label: "코 성형" },
  { value: "lifting", label: "리프팅" },
  { value: "petit", label: "쁘띠" },
];

const CATEGORY_LABELS: Record<string, string> = {
  eye: "눈 성형",
  nose: "코 성형",
  lifting: "리프팅",
  petit: "쁘띠",
};

interface ServiceForm {
  title: string;
  titleEn: string;
  category: string;
  description: string;
  descriptionEn: string;
  price: string;
  tags: string;
  order: string;
  isActive: boolean;
}

const defaultForm: ServiceForm = {
  title: "",
  titleEn: "",
  category: "eye",
  description: "",
  descriptionEn: "",
  price: "상담 후 안내",
  tags: "",
  order: "0",
  isActive: true,
};

export default function AdminServicesPage() {
  const { data: services = [], isLoading } = useAllServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(defaultForm);

  const openCreate = () => {
    setEditingService(null);
    setForm(defaultForm);
    setIsModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setForm({
      title: service.title,
      titleEn: service.titleEn ?? "",
      category: service.category,
      description: service.description ?? "",
      descriptionEn: service.descriptionEn ?? "",
      price: service.price ?? "상담 후 안내",
      tags: (service.tags ?? []).join(", "),
      order: String(service.order ?? 0),
      isActive: service.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (service: Service) => {
    if (!confirm(`"${service.title}"을 삭제하시겠습니까?`)) return;
    await deleteService.mutateAsync(service.id);
  };

  const handleSubmit = async () => {
    const data = {
      title: form.title,
      titleEn: form.titleEn || null,
      category: form.category,
      description: form.description || null,
      descriptionEn: form.descriptionEn || null,
      price: form.price,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      order: Number(form.order),
      isActive: form.isActive,
    };

    if (editingService) {
      await updateService.mutateAsync({ id: editingService.id, data });
    } else {
      await createService.mutateAsync(data);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: "order",
      header: "#",
      width: "60px",
      render: (s: Service) => (
        <span className="text-[#A895C0] text-xs">{s.order}</span>
      ),
    },
    {
      key: "title",
      header: "시술명",
      render: (s: Service) => (
        <div>
          <p className="font-medium text-[#2D1B4E]">{s.title}</p>
          {s.titleEn && <p className="text-xs text-[#A895C0]">{s.titleEn}</p>}
        </div>
      ),
    },
    {
      key: "category",
      header: "카테고리",
      render: (s: Service) => (
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
          style={{
            background:
              s.category === "eye"
                ? "#8B64C8"
                : s.category === "nose"
                ? "#E8748A"
                : s.category === "lifting"
                ? "#A87AD4"
                : "#D4547A",
          }}
        >
          {CATEGORY_LABELS[s.category]}
        </span>
      ),
    },
    {
      key: "price",
      header: "비용",
      render: (s: Service) => (
        <span className="text-[#5A4070] text-xs">{s.price}</span>
      ),
    },
    {
      key: "isActive",
      header: "상태",
      render: (s: Service) => (
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            s.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {s.isActive ? "활성" : "비활성"}
        </span>
      ),
    },
  ];

  const isSaving = createService.isPending || updateService.isPending;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2D1B4E]">시술 관리</h1>
          <p className="text-sm text-[#5A4070] mt-1">
            등록된 시술 {services.length}건
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #E8748A 0%, #8B64C8 100%)" }}
        >
          <MdAdd size={18} />
          시술 추가
        </button>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl shadow-sm p-6"
        style={{ background: "white", border: "1px solid #EDE8F5" }}
      >
        <AdminTable
          columns={columns}
          data={services}
          keyField="id"
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "시술 수정" : "시술 추가"}
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
          <div className="grid grid-cols-2 gap-4">
            <FormField label="시술명 (한국어) *">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="admin-input"
                placeholder="예: 쌍꺼풀 수술"
              />
            </FormField>
            <FormField label="시술명 (영어)">
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="admin-input"
                placeholder="Double Eyelid Surgery"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="카테고리 *">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="admin-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="비용 안내">
              <input
                type="text"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="admin-input"
              />
            </FormField>
          </div>

          <FormField label="시술 설명 (한국어)">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="admin-input resize-none"
              rows={3}
              placeholder="시술에 대한 간략한 설명을 입력하세요."
            />
          </FormField>

          <FormField label="시술 설명 (영어)">
            <textarea
              value={form.descriptionEn}
              onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
              className="admin-input resize-none"
              rows={3}
              placeholder="Enter a brief description of the procedure."
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="태그 (쉼표 구분)">
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="admin-input"
                placeholder="눈 성형, 쌍꺼풀"
              />
            </FormField>
            <FormField label="정렬 순서">
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                className="admin-input"
                min={0}
              />
            </FormField>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-[#5A4070]">활성화</span>
            </label>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#5A4070] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
