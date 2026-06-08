import type { ReactNode } from "react";

export function FormCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #EDE8F5" }}>
      <h3
        className="text-sm font-bold text-[#2D1B4E] mb-4 pb-3 border-b"
        style={{ borderColor: "#EDE8F5" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#5A4070] mb-1.5">{label}</label>
      {children}
    </div>
  );
}
