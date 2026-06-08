import type { NewBlogPost } from "@/db/schema";

const ALLOWED_KEYS = [
  "title",
  "slug",
  "content",
  "excerpt",
  "thumbnailUrl",
  "category",
  "blocks",
  "author",
  "isPublished",
  "publishedAt",
] as const;

/** 클라이언트 JSON → Drizzle insert/update용 필드 정규화 */
export function sanitizeBlogPayload(
  body: Record<string, unknown>
): Partial<NewBlogPost> {
  const data: Record<string, unknown> = {};

  for (const key of ALLOWED_KEYS) {
    if (key in body) data[key] = body[key];
  }

  if (data.publishedAt != null && typeof data.publishedAt === "string") {
    data.publishedAt = new Date(data.publishedAt);
  }

  return data as Partial<NewBlogPost>;
}

export function dbErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("unique") && error.message.includes("slug")) {
      return "이미 사용 중인 URL 슬러그입니다. 다른 슬러그를 입력해 주세요.";
    }
    if (error.message.includes('column "blocks"')) {
      return "DB 마이그레이션이 필요합니다. npm run db:add-blog-blocks 를 실행해 주세요.";
    }
    return error.message;
  }
  return "Unknown error";
}
