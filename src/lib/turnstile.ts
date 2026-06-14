const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Cloudflare test secret — development only, always passes. */
const DEV_TURNSTILE_SECRET = "1x0000000000000000000000000000000AA";

export function getTurnstileSiteKey(): string | null {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (key) return key;
  if (process.env.NODE_ENV === "development") {
    return "1x00000000000000000000AA";
  }
  return null;
}

function getTurnstileSecretKey(): string | null {
  const key = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (key) return key;
  if (process.env.NODE_ENV === "development") {
    return DEV_TURNSTILE_SECRET;
  }
  return null;
}

export function isTurnstileConfigured(): boolean {
  return Boolean(getTurnstileSiteKey() && getTurnstileSecretKey());
}

export async function verifyTurnstileToken(
  token: string
): Promise<{ ok: boolean; errorCodes?: string[] }> {
  const secret = getTurnstileSecretKey();
  if (!secret) return { ok: false, errorCodes: ["missing-secret"] };
  if (!token?.trim()) return { ok: false, errorCodes: ["missing-token"] };

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  // remoteip는 Vercel 등 프록시 환경에서 토큰 발급 IP와 불일치해
  // invalid-input-response를 유발할 수 있어 전달하지 않음.

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { ok: false, errorCodes: ["http-error"] };
    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    return {
      ok: data.success === true,
      errorCodes: data["error-codes"],
    };
  } catch {
    return { ok: false, errorCodes: ["network-error"] };
  }
}
