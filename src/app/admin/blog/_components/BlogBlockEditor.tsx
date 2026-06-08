"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  MdTitle,
  MdImage,
  MdFormatQuote,
  MdHorizontalRule,
  MdFormatListBulleted,
  MdDelete,
  MdCloudUpload,
  MdAdd,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";
import {
  type BlogBlock,
  type BlogBlockType,
  createBlock,
} from "@/lib/blog-blocks";
import { useUpload } from "@/admin/_shared/hooks/use-upload";

interface Props {
  blocks: BlogBlock[];
  onChange: (updater: (prev: BlogBlock[]) => BlogBlock[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
  onImageUploaded?: (url: string) => void;
  onUploadError?: (message: string) => void;
}

export function BlogBlockEditor({
  blocks,
  onChange,
  onUploadingChange,
  onImageUploaded,
  onUploadError,
}: Props) {
  const upload = useUpload();
  const fileRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  const [insertAfterIndex, setInsertAfterIndex] = useState<number | null>(null);

  useEffect(() => {
    onUploadingChange?.(upload.state === "uploading" || pendingIds.size > 0);
  }, [upload.state, pendingIds, onUploadingChange]);

  const updateBlock = useCallback(
    (id: string, patch: Partial<BlogBlock>) => {
      onChange((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    },
    [onChange]
  );

  const removeBlock = useCallback(
    (id: string) => {
      onChange((prev) => {
        if (prev.length <= 1) return [createBlock("paragraph")];
        return prev.filter((b) => b.id !== id);
      });
    },
    [onChange]
  );

  const moveBlock = useCallback(
    (index: number, dir: -1 | 1) => {
      onChange((prev) => {
        const next = index + dir;
        if (next < 0 || next >= prev.length) return prev;
        const copy = [...prev];
        [copy[index], copy[next]] = [copy[next], copy[index]];
        return copy;
      });
      setActiveIndex((i) => {
        const next = index + dir;
        if (i === index) return next;
        return i;
      });
    },
    [onChange]
  );

  const insertAfter = useCallback(
    (index: number, type: BlogBlockType) => {
      const block = createBlock(type);
      onChange((prev) => {
        const copy = [...prev];
        copy.splice(index + 1, 0, block);
        if (type === "image") {
          copy.splice(index + 2, 0, createBlock("paragraph"));
        }
        return copy;
      });
      setActiveIndex(index + 1);
      return block;
    },
    [onChange]
  );

  const handleInsertImage = (afterIndex?: number) => {
    const idx = afterIndex ?? (activeIndex >= 0 ? activeIndex : blocks.length - 1);
    setInsertAfterIndex(idx);
    fileRef.current?.click();
  };

  const handleReplaceImage = async (blockId: string, file: File) => {
    setPendingIds((prev) => new Set(prev).add(blockId));
    const url = await upload.uploadFile(file, "blog");
    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(blockId);
      return next;
    });
    if (url) {
      updateBlock(blockId, { url });
      onImageUploaded?.(url);
    } else {
      onUploadError?.("본문 이미지 업로드에 실패했습니다.");
    }
  };

  const handleImageFile = async (file: File, afterIndex: number) => {
    const imageBlock = insertAfter(afterIndex, "image");
    setPendingIds((prev) => new Set(prev).add(imageBlock.id));

    const url = await upload.uploadFile(file, "blog");
    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(imageBlock.id);
      return next;
    });

    if (url) {
      updateBlock(imageBlock.id, { url });
      onImageUploaded?.(url);
      setActiveIndex(afterIndex + 2);
    } else {
      removeBlock(imageBlock.id);
      onUploadError?.("본문 이미지 업로드에 실패했습니다.");
    }
    setInsertAfterIndex(null);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && insertAfterIndex !== null) {
      void handleImageFile(file, insertAfterIndex);
    }
    e.target.value = "";
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const idx = activeIndex >= 0 ? activeIndex : blocks.length - 1;
          void handleImageFile(file, idx);
        }
        return;
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) {
      const idx = activeIndex >= 0 ? activeIndex : blocks.length - 1;
      void handleImageFile(file, idx);
    }
  };

  const addBlockAtEnd = (type: BlogBlockType) => {
    if (type === "image") {
      handleInsertImage(blocks.length - 1);
      return;
    }
    onChange((prev) => [...prev, createBlock(type)]);
    setActiveIndex(blocks.length);
  };

  return (
    <div
      ref={docRef}
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid #EDE8F5", background: "white" }}
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* 통합 툴바 */}
      <div
        className="flex flex-wrap items-center gap-1.5 px-4 py-2.5"
        style={{ background: "#F9F7FD", borderBottom: "1px solid #EDE8F5" }}
      >
        <button
          type="button"
          onClick={() => handleInsertImage()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #E8748A 0%, #8B64C8 100%)" }}
        >
          <MdImage size={15} />
          사진 추가
        </button>
        <ToolbarBtn
          icon={<MdTitle size={15} />}
          label="소제목"
          onClick={() => addBlockAtEnd("heading")}
        />
        <ToolbarBtn
          icon={<MdFormatQuote size={15} />}
          label="인용"
          onClick={() => addBlockAtEnd("quote")}
        />
        <ToolbarBtn
          icon={<MdFormatListBulleted size={15} />}
          label="목록"
          onClick={() => addBlockAtEnd("list")}
        />
        <ToolbarBtn
          icon={<MdHorizontalRule size={15} />}
          label="구분선"
          onClick={() => addBlockAtEnd("divider")}
        />
        <span className="ml-auto text-[10px] text-[#A895C0] hidden sm:inline">
          본문과 사진을 한 화면에서 편집 · 붙여넣기·드래그로 사진 추가 가능
        </span>
      </div>

      {/* 통합 본문 영역 */}
      <div className="px-6 py-6 min-h-[400px] space-y-5">
        {blocks.map((block, index) => (
          <DocumentSegment
            key={block.id}
            block={block}
            index={index}
            total={blocks.length}
            isActive={activeIndex === index}
            isUploading={upload.state === "uploading" || pendingIds.has(block.id)}
            uploadError={upload.error}
            onFocus={() => setActiveIndex(index)}
            onUpdate={(patch) => updateBlock(block.id, patch)}
            onRemove={() => removeBlock(block.id)}
            onMoveUp={() => moveBlock(index, -1)}
            onMoveDown={() => moveBlock(index, 1)}
            onReplaceImage={(file) => void handleReplaceImage(block.id, file)}
            onInsertImageHere={() => handleInsertImage(index)}
          />
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
}

function ToolbarBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#5A4070] hover:bg-white transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}

function DocumentSegment({
  block,
  index,
  total,
  isActive,
  isUploading,
  uploadError,
  onFocus,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onReplaceImage,
  onInsertImageHere,
}: {
  block: BlogBlock;
  index: number;
  total: number;
  isActive: boolean;
  isUploading: boolean;
  uploadError: string | null;
  onFocus: () => void;
  onUpdate: (patch: Partial<BlogBlock>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onReplaceImage: (file: File) => void;
  onInsertImageHere: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (block.url && localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
  }, [block.url, localPreview]);

  const showControls = hovered || isActive;

  return (
    <div
      className="group relative rounded-xl transition-colors"
      style={{
        outline: isActive ? "2px solid rgba(139, 100, 200, 0.35)" : "2px solid transparent",
        outlineOffset: 4,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={onFocus}
    >
      {showControls && (
        <div className="absolute -right-1 -top-2 z-10 flex items-center gap-0.5 rounded-lg px-1 py-0.5 shadow-sm opacity-90"
          style={{ background: "white", border: "1px solid #EDE8F5" }}
        >
          <IconBtn onClick={onMoveUp} disabled={index === 0} title="위로">
            <MdArrowUpward size={13} />
          </IconBtn>
          <IconBtn onClick={onMoveDown} disabled={index === total - 1} title="아래로">
            <MdArrowDownward size={13} />
          </IconBtn>
          <IconBtn onClick={onInsertImageHere} title="여기에 사진">
            <MdImage size={13} />
          </IconBtn>
          <IconBtn onClick={onRemove} title="삭제">
            <MdDelete size={13} />
          </IconBtn>
        </div>
      )}

      {block.type === "heading" && (
        <div onClick={onFocus}>
          <div className="flex gap-2 mb-2">
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
              onFocus={onFocus}
              placeholder="소제목"
              className="w-full text-lg font-semibold text-[#2D1B4E] bg-transparent outline-none placeholder:text-[#C0AED6]"
            />
          ) : (
            <input
              type="text"
              value={block.text ?? ""}
              onChange={(e) => onUpdate({ text: e.target.value })}
              onFocus={onFocus}
              placeholder="섹션 제목"
              className="w-full text-2xl font-bold text-[#2D1B4E] bg-transparent outline-none placeholder:text-[#C0AED6] font-display"
            />
          )}
        </div>
      )}

      {block.type === "paragraph" && (
        <AutoTextarea
          value={block.text ?? ""}
          onChange={(text) => onUpdate({ text })}
          onFocus={onFocus}
          placeholder="본문을 입력하세요. 사진은 툴바의 「사진 추가」 또는 붙여넣기·드래그로 넣을 수 있습니다."
          className="w-full text-sm leading-[1.85] text-[#5A4070] bg-transparent outline-none placeholder:text-[#C0AED6]"
        />
      )}

      {block.type === "quote" && (
        <div className="border-l-4 pl-4" style={{ borderColor: "#8B64C8" }} onClick={onFocus}>
          <AutoTextarea
            value={block.text ?? ""}
            onChange={(text) => onUpdate({ text })}
            onFocus={onFocus}
            placeholder="인용문"
            className="w-full text-sm italic text-[#5A4070] bg-transparent outline-none placeholder:text-[#C0AED6]"
            minRows={2}
          />
        </div>
      )}

      {block.type === "image" && (
        <div onClick={onFocus}>
          {(block.url || localPreview) ? (
            <figure>
              <div
                className="rounded-xl overflow-hidden flex items-center justify-center"
                style={{ background: "#F0EBF8", border: "1px solid #EDE8F5" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.url || localPreview || ""}
                  alt={block.alt ?? ""}
                  className="w-full h-auto max-h-[480px] object-contain"
                />
              </div>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-xs text-[#8B64C8] hover:underline"
                >
                  교체
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
              <input
                type="text"
                value={block.caption ?? ""}
                onChange={(e) => onUpdate({ caption: e.target.value })}
                onFocus={onFocus}
                placeholder="캡션 (선택)"
                className="mt-2 w-full text-xs text-[#A895C0] bg-transparent outline-none border-b border-[#EDE8F5] pb-1"
              />
            </figure>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="w-full aspect-[16/10] rounded-xl flex flex-col items-center justify-center gap-2 text-[#A895C0] hover:bg-[#F9F7FD] transition-colors"
              style={{ border: "2px dashed #EDE8F5" }}
            >
              <MdCloudUpload size={28} />
              <span className="text-xs">
                {isUploading ? "업로드 중..." : "클릭하여 사진 업로드"}
              </span>
            </button>
          )}
          {uploadError && !block.url && (
            <p className="text-xs text-red-500 mt-1">{uploadError}</p>
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
                onReplaceImage(file);
              }
              e.target.value = "";
            }}
          />
        </div>
      )}

      {block.type === "list" && (
        <div className="space-y-2" onClick={onFocus}>
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
                onFocus={onFocus}
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
        <hr className="border-0 h-px my-4" style={{ background: "#EDE8F5" }} />
      )}
    </div>
  );
}

function AutoTextarea({
  value,
  onChange,
  onFocus,
  placeholder,
  className,
  minRows = 3,
}: {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  placeholder?: string;
  className?: string;
  minRows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, minRows * 24)}px`;
  }, [value, minRows]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      placeholder={placeholder}
      rows={minRows}
      className={`resize-none overflow-hidden ${className ?? ""}`}
    />
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
      className="p-1 rounded hover:bg-[#F0EBF8] disabled:opacity-30 text-[#5A4070]"
    >
      {children}
    </button>
  );
}
