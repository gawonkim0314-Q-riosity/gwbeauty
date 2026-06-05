import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ievobqd5agb7g3ug.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
