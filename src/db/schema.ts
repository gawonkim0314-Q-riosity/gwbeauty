import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  uniqueIndex,
  customType,
} from "drizzle-orm/pg-core";

// pgvector custom type (drizzle-orm native vector support requires >=0.36)
const vector = customType<{ data: number[]; driverData: string }>({
  dataType(config) {
    const dims = (config as { dimensions?: number })?.dimensions ?? 1536;
    return `vector(${dims})`;
  },
  fromDriver(val: string): number[] {
    return val
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map(Number);
  },
  toDriver(val: number[]): string {
    return `[${val.join(",")}]`;
  },
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  category: text("category").notNull(), // eye | nose | lifting | petit
  description: text("description"),
  descriptionEn: text("description_en"),
  detail: text("detail"),
  price: text("price").default("상담 후 안내"),
  imageUrl: text("image_url"),
  tags: text("tags").array().default([]),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  // pgvector embedding (text-embedding-3-small = 1536 dims)
  embedding: vector("embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceDetailPages = pgTable(
  "service_detail_pages",
  {
    id: serial("id").primaryKey(),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    locale: text("locale").notNull().default("ko"), // ko | en | zh | ja

    // Hero
    heroImageUrl: text("hero_image_url"),
    heroTitle: text("hero_title"),
    heroSubtitle: text("hero_subtitle"),

    // Surgery info bar
    surgeryTime: text("surgery_time"),
    anesthesiaMethod: text("anesthesia_method"),
    visitCount: text("visit_count"),
    aftercareStart: text("aftercare_start"),
    recoveryPeriod: text("recovery_period"),

    // Recommended for
    recommendedFor: text("recommended_for").array().default([]),

    // Detail images (legacy URL list — card thumbnails sync)
    detailImageUrls: text("detail_image_urls").array().default([]),

    // Coupang-style vertical long detail images (full-width stack)
    detailLongImageUrls: text("detail_long_image_urls").array().default([]),

    // Detail section header (3-column cards)
    detailSectionEyebrow: text("detail_section_eyebrow"),
    detailSectionTitle: text("detail_section_title"),
    detailSectionSubtitle: text("detail_section_subtitle"),

    // 3-column detail cards [{ step, title, description, imageUrl, bullets, footer }]
    detailCards: jsonb("detail_cards")
      .$type<
        Array<{
          step: string;
          title: string;
          description: string;
          imageUrl: string;
          bullets: string[];
          footer?: string;
        }>
      >()
      .default([]),

    // Before & after [{beforeUrl, afterUrl, label}]
    beforeAfterItems: jsonb("before_after_items")
      .$type<Array<{ beforeUrl: string; afterUrl: string; label: string }>>()
      .default([]),

    // YouTube video IDs
    youtubeVideoIds: text("youtube_video_ids").array().default([]),

    // CTA
    ctaTitle: text("cta_title"),
    ctaSubtitle: text("cta_subtitle"),

    // Status
    status: text("status").default("draft"), // draft | published

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [uniqueIndex("uq_service_locale").on(t.serviceId, t.locale)]
);

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique(),
  content: text("content"),
  excerpt: text("excerpt"),
  thumbnailUrl: text("thumbnail_url"),
  author: text("author").default("GW Beauty"),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  service: text("service"),
  preferredDate: text("preferred_date"),
  preferredTime: text("preferred_time"),
  message: text("message"),
  locale: text("locale").default("ko"),
  status: text("status").default("pending"), // pending | contacted | completed | cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type ServiceDetailPage = typeof serviceDetailPages.$inferSelect;
export type NewServiceDetailPage = typeof serviceDetailPages.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
