export default function AdminMaintenancePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2D1B4E]">유지관리</h1>
        <p className="text-sm text-[#5A4070] mt-1">시스템 설정 및 권한 관리</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* RBAC Card */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{ background: "white", border: "1px solid #EDE8F5" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "#F0EBFF" }}
            >
              🔐
            </div>
            <div>
              <h2 className="font-semibold text-[#2D1B4E]">RBAC 권한 관리</h2>
              <p className="text-xs text-[#A895C0]">역할 기반 접근 제어</p>
            </div>
          </div>
          <div
            className="rounded-xl p-4 text-sm"
            style={{ background: "#FFF8F0", border: "1px solid #FFD9A0" }}
          >
            <p className="text-[#8B6030] font-medium mb-1">⏳ 개발 예정</p>
            <p className="text-[#A87840] text-xs leading-relaxed">
              관리자(Admin), 편집자(Editor), 뷰어(Viewer) 등의 역할 기반 접근 제어가
              추후 구현될 예정입니다. 로그인 및 세션 관리도 함께 적용됩니다.
            </p>
          </div>
        </div>

        {/* DB Status */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{ background: "white", border: "1px solid #EDE8F5" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "#F0EBFF" }}
            >
              🗄️
            </div>
            <div>
              <h2 className="font-semibold text-[#2D1B4E]">데이터베이스</h2>
              <p className="text-xs text-[#A895C0]">Neon PostgreSQL</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: "테이블", value: "services, blog_posts, inquiries" },
              { label: "ORM", value: "Drizzle ORM" },
              { label: "스토리지", value: "Vercel Blob" },
              { label: "호스팅", value: "Vercel (Neon)" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5 border-b" style={{ borderColor: "#EDE8F5" }}>
                <span className="text-[#A895C0] text-xs">{label}</span>
                <span className="text-[#5A4070] text-xs font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Env Info */}
        <div
          className="rounded-2xl p-6 shadow-sm md:col-span-2"
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
              <h2 className="font-semibold text-[#2D1B4E]">환경 변수 설정 가이드</h2>
              <p className="text-xs text-[#A895C0]">Neon DB 연결 후 환경 변수를 설정하세요</p>
            </div>
          </div>
          <div
            className="rounded-xl p-4 font-mono text-xs leading-relaxed"
            style={{ background: "#1A1030", color: "#B89AE8" }}
          >
            <p className="text-[#E8748A] mb-1"># .env.local</p>
            <p>DATABASE_URL=&quot;postgresql://user:pass@host/db?sslmode=require&quot;</p>
            <p className="text-[#A895C0] mt-2"># Vercel 대시보드 → Storage → Neon DB → Connect to Project</p>
            <p className="text-[#A895C0]"># 연결 후: npx vercel env pull .env.local</p>
            <p className="text-[#A895C0]"># 스키마 적용: npm run db:push</p>
            <p className="text-[#A895C0]"># 초기 데이터: npm run db:seed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
