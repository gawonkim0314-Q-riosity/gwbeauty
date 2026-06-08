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
import { createPortal } from "react-dom";
import { MdCheckCircle, MdError, MdClose } from "react-icons/md";

export type AdminToastType = "success" | "error";

type ToastItem = {
  id: number;
  message: string;
  type: AdminToastType;
};

type AdminToastContextValue = {
  showToast: (message: string, type?: AdminToastType) => void;
};

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

const AUTO_DISMISS_MS = 3500;

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  const showToast = useCallback((message: string, type: AdminToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, AUTO_DISMISS_MS);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <AdminToastContext.Provider value={value}>
      {children}
      {portalTarget &&
        createPortal(
          <div
            className="fixed top-4 right-4 z-[10000] flex flex-col gap-2 pointer-events-none"
            aria-live="polite"
          >
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className="pointer-events-auto flex items-start gap-3 min-w-[280px] max-w-sm px-4 py-3 rounded-xl shadow-lg animate-fade-up"
                style={{
                  background: toast.type === "success" ? "#2D1B4E" : "#FFF0F4",
                  border:
                    toast.type === "success"
                      ? "1px solid rgba(255,255,255,0.12)"
                      : "1px solid #FFD0DC",
                  color: toast.type === "success" ? "white" : "#D4547A",
                }}
                role="status"
              >
                {toast.type === "success" ? (
                  <MdCheckCircle size={20} className="shrink-0 mt-0.5 text-[#E8748A]" />
                ) : (
                  <MdError size={20} className="shrink-0 mt-0.5" />
                )}
                <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="shrink-0 opacity-70 hover:opacity-100"
                  aria-label="닫기"
                >
                  <MdClose size={16} />
                </button>
              </div>
            ))}
          </div>,
          portalTarget
        )}
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const ctx = useContext(AdminToastContext);
  if (!ctx) {
    throw new Error("useAdminToast must be used within AdminToastProvider");
  }
  return ctx;
}
