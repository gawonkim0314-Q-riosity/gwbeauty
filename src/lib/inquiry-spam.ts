import type { NextRequest } from "next/server";
import { isTurnstileConfigured, verifyTurnstileToken } from "@/lib/turnstile";
import {
  countRecentInquiriesByEmail,
  countRecentInquiriesByIp,
} from "@/db/queries/inquiries";

export const INQUIRY_MIN_SUBMIT_MS = 3000;
export const INQUIRY_EMAIL_COOLDOWN_MS = 30 * 60 * 1000;
export const INQUIRY_IP_LIMIT_PER_HOUR = 5;

export type InquirySpamPayload = {
  website?: unknown;
  formLoadedAt?: unknown;
  turnstileToken?: unknown;
};

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() ?? "unknown";
}

export async function validateInquirySpam(
  request: NextRequest,
  payload: InquirySpamPayload,
  email: string
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const honeypot = String(payload.website ?? "").trim();
  if (honeypot) {
    return {
      ok: false,
      error: "요청을 처리할 수 없습니다.",
      status: 400,
    };
  }

  const loadedAt = Number(payload.formLoadedAt);
  if (!Number.isFinite(loadedAt) || Date.now() - loadedAt < INQUIRY_MIN_SUBMIT_MS) {
    return {
      ok: false,
      error: "요청을 처리할 수 없습니다.",
      status: 400,
    };
  }

  const clientIp = getClientIp(request);

  if (isTurnstileConfigured()) {
    const token = String(payload.turnstileToken ?? "").trim();
    const verification = await verifyTurnstileToken(token);
    if (!verification.ok) {
      console.warn(
        "[inquiry-spam] Turnstile verification failed:",
        verification.errorCodes?.join(", ") ?? "unknown"
      );
      const isExpired = verification.errorCodes?.includes("timeout-or-duplicate");
      return {
        ok: false,
        error: isExpired
          ? "보안 확인이 만료되었습니다. 캡차를 다시 완료한 후 제출해 주세요."
          : "보안 확인에 실패했습니다. 새로고침 후 다시 시도해 주세요.",
        status: 400,
      };
    }
  }

  const [emailCount, ipCount] = await Promise.all([
    countRecentInquiriesByEmail(email, INQUIRY_EMAIL_COOLDOWN_MS),
    clientIp !== "unknown"
      ? countRecentInquiriesByIp(clientIp, 60 * 60 * 1000)
      : Promise.resolve(0),
  ]);

  if (emailCount > 0) {
    return {
      ok: false,
      error:
        "동일 이메일로는 30분에 한 번만 문의할 수 있습니다. 잠시 후 다시 시도해 주세요.",
      status: 429,
    };
  }

  if (ipCount >= INQUIRY_IP_LIMIT_PER_HOUR) {
    return {
      ok: false,
      error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
      status: 429,
    };
  }

  return { ok: true };
}
