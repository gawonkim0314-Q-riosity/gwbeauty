export default function AdminDatabasePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2D1B4E]">데이터베이스</h1>
        <p className="text-sm text-[#5A4070] mt-1">Neon PostgreSQL 연결 및 스키마 정보</p>
      </div>

      <div
        className="rounded-2xl p-6 shadow-sm max-w-2xl"
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
            <h2 className="font-semibold text-[#2D1B4E]">Neon PostgreSQL</h2>
            <p className="text-xs text-[#A895C0]">Drizzle ORM · Vercel 연동</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          {[
            { label: "주요 테이블", value: "users, services, service_detail_pages, blog_posts, inquiries" },
            { label: "ORM", value: "Drizzle ORM" },
            { label: "스토리지", value: "Vercel Blob" },
            { label: "인증", value: "Firebase Auth + Neon RBAC (users.role)" },
            { label: "호스팅", value: "Vercel" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between py-2 border-b gap-4"
              style={{ borderColor: "#EDE8F5" }}
            >
              <span className="text-[#A895C0] text-xs shrink-0">{label}</span>
              <span className="text-[#5A4070] text-xs font-medium text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
