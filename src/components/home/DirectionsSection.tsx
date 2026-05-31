import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function DirectionsSection() {
  return (
    <section id="directions" className="py-24 md:py-32">
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-pink-400 uppercase">
              Location
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-snug text-charcoal md:text-5xl">
              오시는 길
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted">
              편안한 상담을 위해 접근성 좋은 위치에 자리하고 있습니다. 방문
              전 상담 예약을 남겨주시면 더욱 원활하게 안내해 드립니다.
            </p>

            <dl className="mt-10 space-y-6">
              <div>
                <dt className="text-xs font-semibold tracking-[0.16em] text-pink-400 uppercase">
                  Address
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-charcoal">
                  {siteConfig.address}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-[0.16em] text-pink-400 uppercase">
                  Hours
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-charcoal">
                  {siteConfig.hours}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-[0.16em] text-pink-400 uppercase">
                  Phone
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-charcoal">
                  {siteConfig.phone}
                </dd>
              </div>
            </dl>

            <Link
              href="/inquire"
              className="mt-10 inline-flex rounded-full bg-charcoal px-8 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-charcoal/85"
            >
              방문 상담 예약하기
            </Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-pink-100 bg-pink-50 shadow-[var(--shadow-card)]">
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[var(--shadow-soft)]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className="text-pink-500"
                >
                  <path
                    d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <p className="font-serif text-xl text-charcoal">지도 연동 예정</p>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                도메인 및 주소 확정 후 네이버/카카오 지도 API를 연동하여
                정확한 위치를 안내할 예정입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
