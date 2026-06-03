"use client";

import { ReactNode, useEffect } from "react";
import { MdClose } from "react-icons/md";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: AdminModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClass = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-3xl",
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className={`relative w-full ${widthClass} rounded-2xl shadow-2xl bg-white overflow-hidden`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #EDE8F5" }}
        >
          <h2 className="text-base font-semibold text-[#2D1B4E]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#A895C0] hover:text-[#5A4070] hover:bg-[#F7F5FF] transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">{children}</div>

        {/* Footer */}
        {footer && (
          <div
            className="px-6 py-4 flex items-center justify-end gap-3"
            style={{ borderTop: "1px solid #EDE8F5", background: "#FAF8FF" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
