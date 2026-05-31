"use client";
import { useRef, ReactNode, MouseEvent } from "react";

interface MagneticCardProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticCard({ children, className = "", strength = 0.15 }: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    const maxTranslate = 12;
    const maxRotate = 6;

    const tx = Math.max(-maxTranslate, Math.min(maxTranslate, dx * strength));
    const ty = Math.max(-maxTranslate, Math.min(maxTranslate, dy * strength));
    const rx = Math.max(-maxRotate, Math.min(maxRotate, -(dy / rect.height) * maxRotate * 2));
    const ry = Math.max(-maxRotate, Math.min(maxRotate, (dx / rect.width) * maxRotate * 2));

    el.style.transition = "transform 0.1s ease";
    el.style.transform = `perspective(800px) translate(${tx}px, ${ty}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    el.style.transform = "perspective(800px) translate(0, 0) rotateX(0deg) rotateY(0deg)";
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}
