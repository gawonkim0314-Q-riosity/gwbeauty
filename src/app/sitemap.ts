import type { MetadataRoute } from "next";
import {
  buildSitemapEntries,
  buildStaticSitemapEntries,
} from "@/lib/seo/sitemap-entries";

/** Build-time static generation only — avoids ISR revalidation 500s for crawlers. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    return await buildSitemapEntries();
  } catch {
    return buildStaticSitemapEntries();
  }
}
