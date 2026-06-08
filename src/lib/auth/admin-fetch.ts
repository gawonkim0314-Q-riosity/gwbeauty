"use client";

import { getFirebaseAuth } from "@/lib/firebase/client";

export async function getAdminAuthHeaders(): Promise<Record<string, string>> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("NOT_AUTHENTICATED");
  }
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

/** 관리자 API 호출 — Firebase ID Token 자동 첨부 */
export async function adminFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const authHeaders = await getAdminAuthHeaders();
  const headers = new Headers(init?.headers);
  for (const [key, value] of Object.entries(authHeaders)) {
    headers.set(key, value);
  }
  return fetch(input, { ...init, headers });
}
