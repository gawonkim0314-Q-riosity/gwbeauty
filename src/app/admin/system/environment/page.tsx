export default function AdminEnvironmentPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2D1B4E]">환경 설정</h1>
        <p className="text-sm text-[#5A4070] mt-1">로컬·Vercel 환경 변수 설정 가이드</p>
      </div>

      <div
        className="rounded-2xl p-6 shadow-sm max-w-3xl"
        style={{ background: "white", border: "1px solid #EDE8F5" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "#F0EBFF" }}
          >
            ⚙️
          </div>
          <div>
            <h2 className="font-semibold text-[#2D1B4E]">환경 변수</h2>
            <p className="text-xs text-[#A895C0]">`.env.local` / Vercel Dashboard</p>
          </div>
        </div>
        <div
          className="rounded-xl p-4 font-mono text-xs leading-relaxed"
          style={{ background: "#1A1030", color: "#B89AE8" }}
        >
          <p className="text-[#E8748A] mb-1"># Database</p>
          <p>DATABASE_URL=&quot;postgresql://...&quot;</p>
          <p className="text-[#E8748A] mt-3 mb-1"># Firebase (NEXT_PUBLIC_FIREBASE_* ×6)</p>
          <p>→ firebase.env.example 참고</p>
          <p className="text-[#E8748A] mt-3 mb-1"># Admin bootstrap (선택)</p>
          <p>ADMIN_BOOTSTRAP_EMAILS=linking204@naver.com</p>
          <p className="text-[#A895C0] mt-3"># 스키마: npm run db:push</p>
          <p className="text-[#A895C0]"># admin 부여: node scripts/grant-admin.mjs email@example.com</p>
        </div>
      </div>
    </div>
  );
}
