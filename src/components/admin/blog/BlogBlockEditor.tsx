"use client";

import { useRef, useState, useEffect } from "react";
import {
  MdTitle,
  MdTextFields,
  MdImage,
  MdFormatQuote,
  MdHorizontalRule,
  MdFormatListBulleted,
  MdArrowUpward,
  MdArrowDownward,
  MdDelete,
  MdCloudUpload,
  MdAdd,
} from "react-icons/md";
import {
  type BlogBlock,
  type BlogBlockType,
  createBlock,
} from "@/lib/blog-blocks";
import { useUpload } from "@/hooks/use-upload";

const BLOCK_TOOLS: { type: BlogBlockType; label: string; icon: React.ReactNode }[] = [
  { type: "heading", label: "제목", icon: <MdTitle size={16} /> },
  { type: "paragraph", label: "본문", icon: <MdTextFields size={16} /> },
  { type: "image", label: "이미지", icon: <MdImage size={16} /> },
  { type: "quote", label: "인용", icon: <MdFormatQuote size={16} /> },
  { type: "list", label: "목록", icon: <MdFormatListBulleted size={16} /> },
  { type: "divider", label: "구분선", icon: <MdHorizontalRule size={16} /> },
];

interface Props {
  blocks: BlogBlock[];
  onChange: (updater: (prev: BlogBlock[]) => BlogBlock[]) => void;
}

export function BlogBlockEditor({ blocks, onChange }: Props) {
  const upload = useUpload();

  const updateBlock = (id: string, patch: Partial<BlogBlock>) => {
    onChange((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b))
    );
  };

  const removeBlock = (id: string) => {
    onChange((prev) => {
      if (prev.length <= 1) return [createBlock("paragraph")];
      return prev.filter((b) => b.id !== id);
    });
  };

  const moveBlock = (index: number, dir: -1 | 1) => {
    onChange((prev) => {
      const next = index + dir;
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  };

  const addBlock = (type: BlogBlockType, afterIndex?: number) => {
    const block = createBlock(type);
    onChange((prev) => {
      if (afterIndex === undefined) return [...prev, block];
      const copy = [...prev];
      copy.splice(afterIndex + 1, 0, block);
      return copy;
    });
  };

  const handleImageUpload = async (id: string, file: File) => {
    const url = await upload.uploadFile(file, "blog");
    if (url) {
      updateBlock(id, { url });
    }
  };

  return (
    <div className="space-y-3">
      {/* 블록 추가 툴바 */}
      <div
        className="sticky top-0 z-10 flex flex-wrap gap-1.5 p-2 rounded-xl mb-4"
        style={{ background: "#F9F7FD", border: "1px solid #EDE8F5" }}
      >
        <span className="text-[10px] font-semibold text-[#A895C0] self-center px-2">
          블록 추가
        </span>
        {BLOCK_TOOLS.map((tool) => (
          <button
            key={tool.type}
            type="button"
            onClick={() => addBlock(tool.type)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#5A4070] hover:bg-white transition-colors"
          >
            {tool.icon}
            {tool.label}
          </button>
        ))}
      </div>

      {blocks.map((block, index) => (
        <BlockRow
          key={block.id}
          block={block}
          index={index}
          total={blocks.length}
          isUploading={upload.state === "uploading"}
          onUpdate={(patch) => updateBlock(block.id, patch)}
          onRemove={() => removeBlock(block.id)}
          onMoveUp={() => moveBlock(index, -1)}
          onMoveDown={() => moveBlock(index, 1)}
          onImageUpload={(file) => handleImageUpload(block.id, file)}
          uploadError={upload.error}
          onAddAfter={(type) => addBlock(type, index)}
        />
      ))}
    </div>
  );
}

function BlockRow({
  block,
  index,
  total,
  isUploading,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onImageUpload,
  uploadError,
  onAddAfter,
}: {
  block: BlogBlock;
  index: number;
  total: number;
  isUploading: boolean;
  onUpdate: (patch: Partial<BlogBlock>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onImageUpload: (file: File) => void;
  uploadError: string | null;
  onAddAfter: (type: BlogBlockType) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    if (block.url && localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
  }, [block.url, localPreview]);
  const typeLabel =
    BLOCK_TOOLS.find((t) => t.type === block.type)?.label ?? block.type;

  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
      style={{ border: "1px solid #EDE8F5", background: "white" }}
    >
      {/* 블록 컨트롤 바 */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ background: "#F9F7FD", borderBottom: "1px solid #EDE8F5" }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A895C0]">
          {typeLabel}
        </span>
        <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100">
          <IconBtn onClick={onMoveUp} disabled={index === 0} title="위로">
            <MdArrowUpward size={14} />
          </IconBtn>
          <IconBtn onClick={onMoveDown} disabled={index === total - 1} title="아래로">
            <MdArrowDownward size={14} />
          </IconBtn>
          <IconBtn onClick={onRemove} title="삭제">
            <MdDelete size={14} />
          </IconBtn>
        </div>
      </div>

      {/* 비주얼 편집 영역 */}
      <div className="p-5">
        {block.type === "heading" && (
          <div>
            <div className="flex gap-2 mb-3">
              {([2, 3] as const).map((lv) => (
                <button
                  key={lv}
                  type="button"
                  onClick={() => onUpdate({ level: lv })}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold"
                  style={{
                    background: block.level === lv ? "#8B64C8" : "#F0EBF8",
                    color: block.level === lv ? "white" : "#5A4070",
                  }}
                >
                  H{lv}
                </button>
              ))}
            </div>
            {block.level === 3 ? (
              <input
                type="text"
                value={block.text ?? ""}
                onChange={(e) => onUpdate({ text: e.target.value })}
                placeholder="소제목을 입력하세요"
                className="w-full text-lg font-semibold text-[#2D1B4E] bg-transparent outline-none placeholder:text-[#C0AED6]"
              />
            ) : (
              <input
                type="text"
                value={block.text ?? ""}
                onChange={(e) => onUpdate({ text: e.target.value })}
                placeholder="제목을 입력하세요"
                className="w-full text-2xl font-bold text-[#2D1B4E] bg-transparent outline-none placeholder:text-[#C0AED6] font-display"
              />
            )}
          </div>
        )}

        {block.type === "paragraph" && (
          <textarea
            value={block.text ?? ""}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="본문을 입력하세요. 줄바꿈이 그대로 반영됩니다."
            rows={4}
            className="w-full text-sm leading-relaxed text-[#5A4070] bg-transparent outline-none resize-y placeholder:text-[#C0AED6]"
          />
        )}

        {block.type === "quote" && (
          <div
            className="border-l-4 pl-4"
            style={{ borderColor: "#8B64C8" }}
          >
            <textarea
              value={block.text ?? ""}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="인용문을 입력하세요"
              rows={2}
              className="w-full text-sm italic text-[#5A4070] bg-transparent outline-none resize-none placeholder:text-[#C0AED6]"
            />
          </div>
        )}

        {block.type === "image" && (
          <div>
            {(block.url || localPreview) ? (
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-[#F0EBF8]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.url || localPreview || ""}
                  alt={block.alt ?? ""}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={isUploading}
                className="w-full aspect-[16/10] rounded-xl flex flex-col items-center justify-center gap-2 text-[#A895C0] hover:bg-[#F9F7FD] transition-colors"
                style={{ border: "2px dashed #EDE8F5" }}
              >
                <MdCloudUpload size={32} />
                <span className="text-xs">
                  {isUploading ? "업로드 중..." : "클릭하여 이미지 업로드"}
                </span>
              </button>
            )}
            {uploadError && !block.url && (
              <p className="text-xs text-red-500 mb-2">{uploadError}</p>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setLocalPreview(URL.createObjectURL(file));
                  onImageUpload(file);
                }
                e.target.value = "";
              }}
            />
            {block.url && (
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-xs text-[#8B64C8] hover:underline"
                >
                  이미지 교체
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLocalPreview(null);
                    onUpdate({ url: "" });
                  }}
                  className="text-xs text-red-400 hover:underline"
                >
                  제거
                </button>
              </div>
            )}
            <input
              type="text"
              value={block.alt ?? ""}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              placeholder="대체 텍스트 (접근성)"
              className="admin-input text-xs mb-2"
            />
            <input
              type="text"
              value={block.caption ?? ""}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="캡션 (선택)"
              className="admin-input text-xs"
            />
          </div>
        )}

        {block.type === "list" && (
          <div className="space-y-2">
            {(block.items ?? [""]).map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-[#8B64C8] text-sm">•</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const items = [...(block.items ?? [])];
                    items[i] = e.target.value;
                    onUpdate({ items });
                  }}
                  placeholder={`항목 ${i + 1}`}
                  className="flex-1 text-sm text-[#5A4070] bg-transparent outline-none border-b border-[#EDE8F5] pb-1"
                />
                {(block.items ?? []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const items = (block.items ?? []).filter((_, j) => j !== i);
                      onUpdate({ items });
                    }}
                    className="text-[#A895C0] hover:text-red-400"
                  >
                    <MdDelete size={14} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => onUpdate({ items: [...(block.items ?? []), ""] })}
              className="flex items-center gap-1 text-xs text-[#8B64C8] hover:underline mt-1"
            >
              <MdAdd size={14} /> 항목 추가
            </button>
          </div>
        )}

        {block.type === "divider" && (
          <hr className="border-0 h-px my-2" style={{ background: "#EDE8F5" }} />
        )}
      </div>

      {/* 빠른 추가 */}
      <div
        className="px-3 py-1.5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ borderTop: "1px solid #F0EBF8" }}
      >
        <button
          type="button"
          onClick={() => onAddAfter("paragraph")}
          className="text-[10px] text-[#A895C0] hover:text-[#8B64C8]"
        >
          + 본문
        </button>
        <button
          type="button"
          onClick={() => onAddAfter("image")}
          className="text-[10px] text-[#A895C0] hover:text-[#8B64C8]"
        >
          + 이미지
        </button>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="p-1 rounded hover:bg-white disabled:opacity-30 text-[#5A4070]"
    >
      {children}
    </button>
  );
}
