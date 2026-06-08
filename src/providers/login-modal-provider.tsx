"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LoginModal } from "@/components/auth/LoginModal";

type LoginModalContextValue = {
  openLoginModal: () => void;
  closeLoginModal: () => void;
};

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openLoginModal = useCallback(() => setOpen(true), []);
  const closeLoginModal = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openLoginModal, closeLoginModal }),
    [openLoginModal, closeLoginModal]
  );

  return (
    <LoginModalContext.Provider value={value}>
      {children}
      <LoginModal open={open} onClose={closeLoginModal} />
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const ctx = useContext(LoginModalContext);
  if (!ctx) {
    throw new Error("useLoginModal must be used within LoginModalProvider");
  }
  return ctx;
}
