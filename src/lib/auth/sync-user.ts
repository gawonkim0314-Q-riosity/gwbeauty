import type { User as FirebaseUser } from "firebase/auth";

export type SyncedUser = {
  id: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
  role: string;
};

/** Firebase 로그인 후 Neon users 테이블에 프로필 동기화 */
export async function syncUserToDatabase(
  firebaseUser: FirebaseUser
): Promise<SyncedUser | null> {
  const token = await firebaseUser.getIdToken();
  const res = await fetch("/api/auth/sync", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.warn("[syncUserToDatabase] failed", res.status);
    return null;
  }

  return res.json() as Promise<SyncedUser>;
}
