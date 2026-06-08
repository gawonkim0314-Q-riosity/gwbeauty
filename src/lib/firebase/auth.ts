import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
  type UserCredential,
} from "firebase/auth";
import { getFirebaseAuth } from "./client";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export async function signInWithEmail(email: string, password: string) {
  const auth = getFirebaseAuth();
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
) {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
  if (displayName?.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() });
  }
  return credential;
}

function prefersGooglePopup(): boolean {
  if (typeof window === "undefined") return false;
  const touchPrimary = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  return !touchPrimary && !narrow;
}

/**
 * PC(Chrome 등): popup — 로그인 직후 UI 갱신이 확실함
 * 모바일·팝업 차단: redirect fallback
 */
export async function signInWithGoogle(): Promise<UserCredential | null> {
  const auth = getFirebaseAuth();

  if (prefersGooglePopup()) {
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const code = getAuthErrorCode(err);
      if (code === "auth/popup-blocked") {
        await signInWithRedirect(auth, googleProvider);
        return null;
      }
      throw err;
    }
  }

  await signInWithRedirect(auth, googleProvider);
  return null;
}

let redirectResultPromise: ReturnType<typeof getRedirectResult> | null = null;

/** getRedirectResult는 페이지당 1회만 호출해야 한다 (React Strict Mode·재마운트 대비) */
export async function resolveGoogleRedirectResult() {
  if (typeof window === "undefined") return null;
  if (!redirectResultPromise) {
    const auth = getFirebaseAuth();
    redirectResultPromise = getRedirectResult(auth).finally(() => {
      // redirect 소비 후에도 auth 상태는 onAuthStateChanged로 유지된다
    });
  }
  return redirectResultPromise;
}

export async function signOut() {
  const auth = getFirebaseAuth();
  return firebaseSignOut(auth);
}

export function getUserInitials(user: User): string {
  const name = user.displayName?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  const email = user.email ?? "";
  return email.slice(0, 2).toUpperCase() || "?";
}

export type AuthErrorCode =
  | "auth/invalid-email"
  | "auth/user-not-found"
  | "auth/wrong-password"
  | "auth/invalid-credential"
  | "auth/email-already-in-use"
  | "auth/weak-password"
  | "auth/popup-closed-by-user"
  | "auth/popup-blocked"
  | "auth/unauthorized-domain"
  | "auth/operation-not-supported-in-this-environment"
  | "auth/cancelled-popup-request"
  | "auth/too-many-requests"
  | "auth/network-request-failed"
  | "auth/operation-not-allowed"
  | "unknown";

export function getAuthErrorCode(error: unknown): AuthErrorCode {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof (error as { code: string }).code === "string"
  ) {
    const code = (error as { code: string }).code;
    const known: AuthErrorCode[] = [
      "auth/invalid-email",
      "auth/user-not-found",
      "auth/wrong-password",
      "auth/invalid-credential",
      "auth/email-already-in-use",
      "auth/weak-password",
      "auth/popup-closed-by-user",
      "auth/popup-blocked",
      "auth/unauthorized-domain",
      "auth/operation-not-supported-in-this-environment",
      "auth/cancelled-popup-request",
      "auth/too-many-requests",
      "auth/network-request-failed",
      "auth/operation-not-allowed",
    ];
    if (known.includes(code as AuthErrorCode)) {
      return code as AuthErrorCode;
    }
  }
  return "unknown";
}
