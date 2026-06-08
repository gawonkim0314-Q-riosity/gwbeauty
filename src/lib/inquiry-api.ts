import type { NewInquiry } from "@/db/schema";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitizeCreateInquiry(body: unknown): {
  data: Omit<NewInquiry, "id">;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { data: {} as Omit<NewInquiry, "id">, error: "Invalid payload" };
  }

  const b = body as Record<string, unknown>;
  const name = String(b.name ?? "").trim();
  const phone = String(b.phone ?? "").trim();
  const email = String(b.email ?? "").trim();
  const message = String(b.message ?? "").trim();

  if (!name) return { data: {} as Omit<NewInquiry, "id">, error: "이름을 입력해 주세요." };
  if (!phone) return { data: {} as Omit<NewInquiry, "id">, error: "연락처를 입력해 주세요." };
  if (!email) return { data: {} as Omit<NewInquiry, "id">, error: "이메일을 입력해 주세요." };
  if (!EMAIL_RE.test(email)) {
    return { data: {} as Omit<NewInquiry, "id">, error: "올바른 이메일 주소를 입력해 주세요." };
  }
  if (!message) return { data: {} as Omit<NewInquiry, "id">, error: "문의 내용을 입력해 주세요." };

  return {
    data: {
      name,
      phone,
      email,
      message,
      service: String(b.service ?? "").trim() || null,
      preferredDate: String(b.preferredDate ?? "").trim() || null,
      preferredTime: String(b.preferredTime ?? "").trim() || null,
      locale: String(b.locale ?? "ko").trim() || "ko",
      status: "pending",
    },
  };
}

export function sanitizeReplyPayload(body: unknown): {
  reply: string;
  adminNotes?: string;
  markCompleted: boolean;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { reply: "", markCompleted: true, error: "Invalid payload" };
  }
  const b = body as Record<string, unknown>;
  const reply = String(b.reply ?? "").trim();
  if (!reply) {
    return { reply: "", markCompleted: true, error: "답변 내용을 입력해 주세요." };
  }
  const adminNotes = String(b.adminNotes ?? "").trim() || undefined;
  const markCompleted = b.markCompleted !== false;
  return { reply, adminNotes, markCompleted };
}
