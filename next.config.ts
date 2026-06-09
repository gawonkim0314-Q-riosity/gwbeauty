import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/icon",
        permanent: true,
      },
      {
        source: "/:locale(ko|en|zh|ja)/admin",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/:locale(ko|en|zh|ja)/admin/:path*",
        destination: "/admin/:path*",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
