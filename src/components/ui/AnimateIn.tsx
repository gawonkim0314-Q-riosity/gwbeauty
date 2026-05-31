"use client";
import { useEffect, useRef, ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left" | "right";
}

export function AnimateIn({ children, delay = 0, className = "", from = "bottom" }: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fromMap = {
      bottom: "translateY(22px)",
      left: "translateX(-22px)",
      right: "translateX(22px)",
    };

    el.style.opacity = "0";
    el.style.transform = fromMap[from];
    el.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translate(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, from]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
