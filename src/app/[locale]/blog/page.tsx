import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <section className="section-container py-32">
      <p className="eyebrow">Blog</p>
      <h1 className="section-title mt-4">Blog</h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-[var(--text-2)]">
        블로그 및 콘텐츠 페이지는 다음 단계에서 구성합니다.
      </p>
      <Link href="/" className="mt-8 inline-flex text-sm text-[var(--pink)] hover:underline">
        메인으로 돌아가기
      </Link>
    </section>
  );
}
