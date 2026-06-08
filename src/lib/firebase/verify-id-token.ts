export type VerifiedFirebaseUser = {
  firebaseUid: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
};

type LookupResponse = {
  users?: Array<{
    localId: string;
    email?: string;
    displayName?: string;
    photoUrl?: string;
  }>;
};

/** Firebase Identity Toolkit REST API로 ID Token 검증 (Admin SDK 불필요) */
export async function verifyFirebaseIdToken(
  idToken: string
): Promise<VerifiedFirebaseUser | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    console.error("[verifyFirebaseIdToken] NEXT_PUBLIC_FIREBASE_API_KEY missing");
    return null;
  }

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("[verifyFirebaseIdToken] lookup failed", res.status);
    return null;
  }

  const data = (await res.json()) as LookupResponse;
  const user = data.users?.[0];
  if (!user?.localId || !user.email) return null;

  return {
    firebaseUid: user.localId,
    email: user.email,
    displayName: user.displayName ?? null,
    photoUrl: user.photoUrl ?? null,
  };
}
