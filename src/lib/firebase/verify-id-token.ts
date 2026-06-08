import { createRemoteJWKSet, jwtVerify } from "jose";

export type VerifiedFirebaseUser = {
  firebaseUid: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
};

const FIREBASE_JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

/**
 * Firebase ID Token JWT 검증 (서버/Vercel에서 동작, API key 제한과 무관)
 */
export async function verifyFirebaseIdToken(
  idToken: string
): Promise<VerifiedFirebaseUser | null> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error("[verifyFirebaseIdToken] NEXT_PUBLIC_FIREBASE_PROJECT_ID missing");
    return null;
  }

  try {
    const { payload } = await jwtVerify(idToken, FIREBASE_JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    const firebaseUid = payload.sub;
    const email =
      typeof payload.email === "string"
        ? payload.email
        : typeof payload.firebase?.identities?.email?.[0] === "string"
          ? payload.firebase.identities.email[0]
          : null;

    if (!firebaseUid || !email) {
      console.error("[verifyFirebaseIdToken] token missing sub or email");
      return null;
    }

    return {
      firebaseUid,
      email,
      displayName: typeof payload.name === "string" ? payload.name : null,
      photoUrl: typeof payload.picture === "string" ? payload.picture : null,
    };
  } catch (error) {
    console.error("[verifyFirebaseIdToken] jwt verify failed:", error);
    return null;
  }
}
