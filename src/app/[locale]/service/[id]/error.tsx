"use client";

import { useEffect } from "react";

export default function ServiceDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[service detail]", error);
  }, [error]);

  return (
    <div className="section-container py-24 text-center">
      <h1 className="text-xl font-bold text-[#2D1B4E] mb-3">페이지를 불러오지 못했습니다</h1>
      <p className="text-sm text-[#5A4070] mb-6 max-w-md mx-auto">
        개발 서버가 실행 중인지, `.env` / `.env.local`에 `DATABASE_URL`이 있는지 확인해 주세요.
      </p>
      <p className="text-xs text-[#A895C0] mb-8 font-mono break-all">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="px-6 py-2.5 rounded-full text-sm font-semibold text-white"
        style={{ background: "var(--gradient-btn)" }}
      >
        다시 시도
      </button>
    </div>
  );
}
