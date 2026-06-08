import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "./client";

const googleProvider = new GoogleAuthProvider();

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

export async function signInWithGoogle() {
  const auth = getFirebaseAuth();
  return signInWithPopup(auth, googleProvider);
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
  | "auth/too-many-requests"
  | "auth/network-request-failed"
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
      "auth/too-many-requests",
      "auth/network-request-failed",
    ];
    if (known.includes(code as AuthErrorCode)) {
      return code as AuthErrorCode;
    }
  }
  return "unknown";
}
