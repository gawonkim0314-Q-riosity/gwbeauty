/** GW Beauty 전용 블로그 블록 CMS 타입 */

export type BlogBlockType =
  | "heading"
  | "paragraph"
  | "image"
  | "quote"
  | "divider"
  | "list";

export type BlogBlock = {
  id: string;
  type: BlogBlockType;
  text?: string;
  level?: 2 | 3;
  url?: string;
  alt?: string;
  caption?: string;
  items?: string[];
};

export const BLOG_CATEGORIES = [
  "피부 관리",
  "레이저 치료",
  "성형 상담",
  "시술 후기",
  "클리닉 소식",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export function newBlockId(): string {
  return `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createBlock(type: BlogBlockType): BlogBlock {
  const id = newBlockId();
  switch (type) {
    case "heading":
      return { id, type, level: 2, text: "" };
    case "paragraph":
      return { id, type, text: "" };
    case "image":
      return { id, type, url: "", alt: "", caption: "" };
    case "quote":
      return { id, type, text: "" };
    case "divider":
      return { id, type };
    case "list":
      return { id, type, items: [""] };
  }
}

export function parseBlocks(raw: unknown, fallbackContent?: string | null): BlogBlock[] {
  if (Array.isArray(raw)) {
    if (raw.length > 0) return raw as BlogBlock[];
    if (fallbackContent?.trim()) {
      return [{ id: newBlockId(), type: "paragraph", text: fallbackContent }];
    }
    return [createBlock("paragraph")];
  }
  if (!raw) {
    if (fallbackContent?.trim()) {
      return [{ id: newBlockId(), type: "paragraph", text: fallbackContent }];
    }
    return [createBlock("paragraph")];
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as BlogBlock[];
    } catch {
      /* legacy plain text */
    }
    return raw.trim()
      ? [{ id: newBlockId(), type: "paragraph", text: raw }]
      : [createBlock("paragraph")];
  }
  return [createBlock("paragraph")];
}

export function blocksToPlainText(blocks: BlogBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading":
        case "paragraph":
        case "quote":
          return b.text ?? "";
        case "list":
          return (b.items ?? []).join("\n");
        case "image":
          return b.caption ?? b.alt ?? "";
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

export function excerptFromBlocks(blocks: BlogBlock[], maxLen = 120): string {
  const text = blocksToPlainText(blocks).replace(/\s+/g, " ").trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trim()}…`;
}

export function slugifyTitle(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(
      /[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\uac00-\ud7af-]/g,
      ""
    )
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `post-${Date.now()}`;
}

export function formatBlogDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function getFirstImageUrl(blocks: BlogBlock[]): string | null {
  for (const b of blocks) {
    if (b.type === "image" && b.url) return b.url;
  }
  return null;
}

/** 저장 전 — URL 없는 이미지 블록이 있는지 */
export function hasEmptyImageBlocks(blocks: BlogBlock[]): boolean {
  return blocks.some((b) => b.type === "image" && !b.url);
}
