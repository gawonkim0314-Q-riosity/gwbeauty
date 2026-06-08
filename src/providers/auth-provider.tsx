"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { resolveGoogleRedirectResult } from "@/lib/firebase/auth";
import { syncUserToDatabase } from "@/lib/auth/sync-user";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  refreshAuth: (user?: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback((nextUser?: User | null) => {
    try {
      if (nextUser !== undefined) {
        setUser(nextUser);
      } else {
        const auth = getFirebaseAuth();
        setUser(auth.currentUser);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    try {
      const auth = getFirebaseAuth();

      // redirect await 전에 리스너를 먼저 등록해야 Google 복귀 후 UI가 갱신된다
      unsubscribe = onAuthStateChanged(auth, (nextUser) => {
        if (!mounted) return;
        setUser(nextUser);
        setLoading(false);
        if (nextUser) {
          void syncUserToDatabase(nextUser).catch((err) => {
            if (process.env.NODE_ENV === "development") {
              console.warn("[Auth] Neon sync failed:", err);
            }
          });
        }
      });

      void resolveGoogleRedirectResult()
        .then((credential) => {
          if (!mounted || !credential?.user) return;
          setUser(credential.user);
          setLoading(false);
          void syncUserToDatabase(credential.user).catch((err) => {
            if (process.env.NODE_ENV === "development") {
              console.warn("[Auth] Neon sync failed:", err);
            }
          });
        })
        .catch((err) => {
          if (process.env.NODE_ENV === "development") {
            console.warn("[Auth] Google redirect result failed:", err);
          }
        });
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[Auth] init failed:", err);
      }
      if (mounted) setLoading(false);
    }

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  const value = useMemo(
    () => ({ user, loading, refreshAuth }),
    [user, loading, refreshAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
