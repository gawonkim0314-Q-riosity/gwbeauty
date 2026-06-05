/**
 * scripts/generate-service-details.mjs
 *
 * 1. 12개 시술 × 3장 = 36장 세로(1024×1536) 상세 이미지를 gpt-image-1 로 생성
 * 2. Vercel Blob 에 업로드
 * 3. service_detail_pages 에 ko locale draft 로 저장
 *
 * 실행: node scripts/generate-service-details.mjs
 */

import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  for (const file of [".env", ".env.local"]) {
    const p = path.join(__dirname, "..", file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const match = line.match(/^([^#=\s][^=]*)=(.*)/);
      if (!match) continue;
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}
loadEnv();

const OAI_KEY = process.env.OPEN_API_SECRET_KEY;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const DB_URL = process.env.DATABASE_URL;

if (!OAI_KEY || !DB_URL) {
  console.error("❌  OPEN_API_SECRET_KEY or DATABASE_URL not set");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OAI_KEY });
const sql = neon(DB_URL);

// ── Service manifest ──────────────────────────────────────────────────────────
const SERVICES = [
  {
    titleEn: "Double Eyelid Surgery",
    category: "eye",
    details: [
      { filename: "eye-01-consultation.jpg", prompt: "Korean beauty clinic consultation scene, elegant Korean woman doctor in white coat discussing eye surgery with patient, modern minimalist clinic interior, warm lighting, professional medical photography, high-end clinic aesthetic" },
      { filename: "eye-02-procedure.jpg",    prompt: "Close-up of a Korean woman with beautifully shaped double eyelids, flawless luminous skin, natural makeup, pure white seamless studio background, Korean beauty clinic editorial photography, magazine quality, serene expression" },
      { filename: "eye-03-recovery.jpg",     prompt: "Portrait of Korean woman with refreshed natural eyes, calm healing atmosphere, soft white background, minimal makeup, high-end Korean beauty clinic editorial photography, gentle warm lighting" },
    ],
  },
  {
    titleEn: "Ptosis Correction",
    category: "eye",
    details: [
      { filename: "ptosis-01-consultation.jpg", prompt: "Korean doctor examining patient eyes with medical instrument, professional clinic setting, bright clean white interior, close-up medical consultation, high quality editorial photography" },
      { filename: "ptosis-02-procedure.jpg",    prompt: "Korean woman with wide open bright expressive eyes, energetic clear gaze, natural makeup, pure white seamless studio background, Korean beauty editorial photography, magazine quality" },
      { filename: "ptosis-03-result.jpg",       prompt: "Beautiful Korean woman with alert youthful wide eyes, luminous skin, minimal makeup, pure white background, high-end beauty clinic photography" },
    ],
  },
  {
    titleEn: "Epicanthoplasty",
    category: "eye",
    details: [
      { filename: "epic-01-consultation.jpg", prompt: "Korean beauty clinic front desk, elegant interior with soft purple and white tones, consultation in progress, professional editorial photography" },
      { filename: "epic-02-detail.jpg",        prompt: "Extreme close-up of Korean woman's refined elegant eye corner area, perfectly proportioned eye shape, luminous skin, white background, high-end macro beauty photography" },
      { filename: "epic-03-result.jpg",        prompt: "Portrait of Korean woman with refined eye shape and wider eye appearance, natural makeup, pure white studio background, Korean beauty clinic editorial, magazine quality" },
    ],
  },
  {
    titleEn: "Rhinoplasty (Augmentation)",
    category: "nose",
    details: [
      { filename: "rhino-01-consultation.jpg", prompt: "Korean surgeon explaining nose procedure with 3D model to patient, modern bright clinic interior, professional white coat, editorial photography style" },
      { filename: "rhino-02-profile.jpg",      prompt: "Side profile portrait of Korean woman with elegant refined nose bridge, perfect nasal proportions, luminous skin, pure white background, high-end beauty clinic editorial photography" },
      { filename: "rhino-03-result.jpg",       prompt: "Three-quarter view portrait of Korean woman with naturally beautiful nose, refined nasal profile, flawless skin, soft white background, Korean beauty clinic photography" },
    ],
  },
  {
    titleEn: "Tip Rhinoplasty",
    category: "nose",
    details: [
      { filename: "nasetip-01-consultation.jpg", prompt: "Close-up of doctor using medical measurement tool near nose area, professional clinic setting, editorial medical photography, clean white background" },
      { filename: "nasetip-02-detail.jpg",       prompt: "Macro close-up of Korean woman's refined delicate nose tip, perfect contour, flawless skin texture, white background, high-end beauty photography" },
      { filename: "nasetip-03-result.jpg",       prompt: "Portrait of Korean woman with beautifully contoured nose tip, natural elegant profile, luminous skin, white seamless studio background, Korean beauty clinic editorial" },
    ],
  },
  {
    titleEn: "Hump Nose Correction",
    category: "nose",
    details: [
      { filename: "hump-01-consultation.jpg", prompt: "Korean surgeon showing nose profile analysis on tablet to patient, modern clinic interior, professional editorial photography, bright clean setting" },
      { filename: "hump-02-profile.jpg",      prompt: "Side profile of Korean woman with smooth elegant straight nose bridge, refined profile, luminous skin, white background, high-end Korean beauty editorial photography" },
      { filename: "hump-03-result.jpg",       prompt: "Portrait of Korean woman with perfectly smooth nose profile, sophisticated natural appearance, flawless skin, pure white studio, Korean beauty clinic photography" },
    ],
  },
  {
    titleEn: "Thread Lifting",
    category: "lifting",
    details: [
      { filename: "thread-01-consultation.jpg", prompt: "Korean doctor marking face for thread lift procedure on elegant Korean woman patient, professional clinic setting, editorial medical photography" },
      { filename: "thread-02-procedure.jpg",    prompt: "Portrait of graceful Korean woman in her late 30s with lifted youthful facial contours, defined jawline, smooth skin, white background, high-end editorial beauty photography" },
      { filename: "thread-03-result.jpg",       prompt: "Before and after style portrait of Korean woman with visibly lifted face contours, youthful V-line jawline, luminous skin, pure white background, Korean beauty clinic photography" },
    ],
  },
  {
    titleEn: "Facelift",
    category: "lifting",
    details: [
      { filename: "facelift-01-consultation.jpg", prompt: "Korean plastic surgeon in consultation with elegant middle-aged Korean woman, professional clinic interior, warm editorial photography, discussing facelift procedure" },
      { filename: "facelift-02-procedure.jpg",    prompt: "Elegant portrait of Korean woman with beautifully lifted smooth face, refined jawline, sophisticated minimal makeup, white background, high-end editorial beauty photography" },
      { filename: "facelift-03-result.jpg",       prompt: "Portrait of Korean woman showing dramatic facial rejuvenation, smooth lifted contours, youthful appearance, luminous skin, pure white studio background, Korean beauty editorial" },
    ],
  },
  {
    titleEn: "Brow Lifting",
    category: "lifting",
    details: [
      { filename: "brow-01-consultation.jpg", prompt: "Doctor examining Korean woman's forehead and brow area in clinic, professional editorial photography, clean bright clinic setting" },
      { filename: "brow-02-detail.jpg",        prompt: "Close-up of Korean woman with naturally lifted elegant eyebrows, smooth forehead, open youthful expression, luminous skin, white background, beauty editorial photography" },
      { filename: "brow-03-result.jpg",        prompt: "Portrait of Korean woman with refreshed lifted eyebrows and smooth forehead, youthful alert expression, natural makeup, white seamless background, Korean beauty clinic editorial" },
    ],
  },
  {
    titleEn: "Botox",
    category: "petit",
    details: [
      { filename: "botox-01-consultation.jpg", prompt: "Korean doctor marking injection points on Korean woman face, professional clinic setting, editorial medical photography, bright clean aesthetic" },
      { filename: "botox-02-procedure.jpg",    prompt: "Portrait of Korean woman with smooth youthful skin, relaxed natural expression, subtle sophisticated makeup, white background, high-end Korean beauty clinic editorial photography" },
      { filename: "botox-03-result.jpg",       prompt: "Portrait of Korean woman with flawless smooth skin after treatment, refreshed natural appearance, minimal makeup, pure white background, Korean beauty clinic photography" },
    ],
  },
  {
    titleEn: "Filler",
    category: "petit",
    details: [
      { filename: "filler-01-consultation.jpg", prompt: "Korean aesthetic doctor in consultation with beautiful Korean woman, clinic setting, editorial photography, professional and elegant atmosphere" },
      { filename: "filler-02-procedure.jpg",    prompt: "Portrait of Korean woman with naturally enhanced cheek volume and lips, soft natural glow, luminous skin, white background, high-end Korean beauty editorial photography" },
      { filename: "filler-03-result.jpg",       prompt: "Portrait of Korean woman with naturally volumized youthful face, dewy glow skin, soft minimal makeup, pure white seamless studio, Korean beauty clinic photography" },
    ],
  },
  {
    titleEn: "Skin Booster",
    category: "petit",
    details: [
      { filename: "skinbooster-01-consultation.jpg", prompt: "Korean dermatologist performing skin analysis with device on Korean woman, modern clinic, editorial photography style, professional and clean" },
      { filename: "skinbooster-02-procedure.jpg",    prompt: "Portrait of Korean woman with glass-skin dewy radiant glowing complexion, deeply hydrated luminous skin, fresh natural makeup, white background, high-end Korean beauty editorial" },
      { filename: "skinbooster-03-result.jpg",       prompt: "Portrait of Korean woman with exceptionally radiant glowing skin, healthy luminous complexion, minimal makeup, pure white seamless background, Korean beauty clinic editorial photography" },
    ],
  },
];

// ── Generate and upload ───────────────────────────────────────────────────────
async function generateImage(prompt, filename) {
  console.log(`   🎨 Generating: ${filename}`);
  const r = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1536",
    quality: "medium",
    n: 1,
    output_format: "jpeg",
  });
  const buffer = Buffer.from(r.data[0].b64_json, "base64");

  if (BLOB_TOKEN) {
    const { url } = await put(`services/detail/${filename}`, buffer, {
      access: "public",
      contentType: "image/jpeg",
      token: BLOB_TOKEN,
    });
    console.log(`   ✅ Blob: ${url}`);
    return url;
  }

  // Fallback: local
  const dir = path.join(__dirname, "..", "public", "images", "services", "detail");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), buffer);
  const localUrl = `/images/services/detail/${filename}`;
  console.log(`   💾 Local: ${localUrl}`);
  return localUrl;
}

async function upsertDetailPage(serviceId, locale, detailImageUrls) {
  // Check if exists
  const existing = await sql`
    SELECT id FROM service_detail_pages
    WHERE service_id = ${serviceId} AND locale = ${locale}
    LIMIT 1
  `;

  if (existing.length > 0) {
    await sql`
      UPDATE service_detail_pages
      SET detail_image_urls = ${detailImageUrls}, updated_at = NOW()
      WHERE id = ${existing[0].id}
    `;
  } else {
    await sql`
      INSERT INTO service_detail_pages (service_id, locale, detail_image_urls, status)
      VALUES (${serviceId}, ${locale}, ${detailImageUrls}, 'published')
    `;
  }
}

async function main() {
  console.log("🚀  Generating service detail images...");
  console.log(`   Mode: ${BLOB_TOKEN ? "Vercel Blob" : "Local"}\n`);

  // Get service IDs
  const rows = await sql`SELECT id, title_en FROM services ORDER BY "order"`;

  for (const service of SERVICES) {
    const row = rows.find((r) => r.title_en === service.titleEn);
    if (!row) {
      console.warn(`⚠️  Service not found: ${service.titleEn}`);
      continue;
    }

    console.log(`\n📋  ${service.titleEn} (ID: ${row.id})`);
    const imageUrls = [];

    for (const detail of service.details) {
      try {
        const url = await generateImage(detail.prompt, detail.filename);
        imageUrls.push(url);
        await new Promise((r) => setTimeout(r, 1500));
      } catch (err) {
        console.error(`   ❌ ${err.message}`);
        imageUrls.push("");
      }
    }

    await upsertDetailPage(row.id, "ko", imageUrls);
    console.log(`   💾 DB updated`);
  }

  console.log("\n✅  Done!");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
