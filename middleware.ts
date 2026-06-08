import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function stripLocaleAdminPrefix(pathname: string): string | null {
  for (const locale of routing.locales) {
    const prefix = `/${locale}/admin`;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return pathname.replace(`/${locale}`, "") || "/admin";
    }
  }
  return null;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /ko/admin → /admin (locale prefix 붙은 잘못된 admin URL 정리)
  const adminWithoutLocale = stripLocaleAdminPrefix(pathname);
  if (adminWithoutLocale) {
    const url = request.nextUrl.clone();
    url.pathname = adminWithoutLocale;
    return NextResponse.redirect(url);
  }

  // /admin 은 i18n middleware 제외 (locale prefix 자동 부여 방지)
  if (isAdminPath(pathname)) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // i18n + locale/admin 리다이렉트 처리
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
