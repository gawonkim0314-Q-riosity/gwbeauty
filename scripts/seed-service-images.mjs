/**
 * scripts/seed-service-images.mjs
 *
 * 1. OpenAI gpt-image-1 로 서비스별 이미지 생성
 * 2. Vercel Blob 에 업로드 (BLOB_READ_WRITE_TOKEN 있을 때)
 *    또는 public/images/services/ 에 로컬 저장 (fallback)
 * 3. DB services 테이블 imageUrl 업데이트
 *
 * 실행: node scripts/seed-service-images.mjs
 *
 * 필요 환경변수 (.env 또는 .env.local):
 *   DATABASE_URL          - Neon 연결 문자열
 *   OPEN_API_SECRET_KEY   - OpenAI API key
 *   BLOB_READ_WRITE_TOKEN - Vercel Blob 토큰 (없으면 로컬 저장)
 */

import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Env loader ───────────────────────────────────────────────────────────────
function loadEnv() {
  for (const file of [".env", ".env.local"]) {
    const p = path.join(__dirname, "..", file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const match = line.match(/^([^#=\s][^=]*)=(.*)$/);
      if (!match) continue;
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}
loadEnv();

// ── Key checks ───────────────────────────────────────────────────────────────
const DB_URL = process.env.DATABASE_URL;
const OAI_KEY = process.env.OPEN_API_SECRET_KEY;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!DB_URL) {
  console.error("❌  DATABASE_URL is not set. Add it to .env or .env.local");
  process.exit(1);
}
if (!OAI_KEY) {
  console.error("❌  OPEN_API_SECRET_KEY is not set.");
  console.error("    Add it to .env:  OPEN_API_SECRET_KEY=sk-...");
  process.exit(1);
}
if (!BLOB_TOKEN) {
  console.warn(
    "⚠️  BLOB_READ_WRITE_TOKEN not set — images will be saved to public/images/services/"
  );
  console.warn("   Get it from: Vercel Dashboard → Storage → gwbeauty-db → Settings");
}

// ── Setup ────────────────────────────────────────────────────────────────────
const openai = new OpenAI({ apiKey: OAI_KEY });
const sql = neon(DB_URL);

const LOCAL_DIR = path.join(__dirname, "..", "public", "images", "services");
if (!BLOB_TOKEN && !fs.existsSync(LOCAL_DIR)) {
  fs.mkdirSync(LOCAL_DIR, { recursive: true });
}

// ── Service image manifest ────────────────────────────────────────────────────
const services = [
  // 눈 성형
  {
    titleEn: "Double Eyelid Surgery",
    filename: "eye-double-eyelid.jpg",
    prompt:
      "Close-up portrait of a beautiful Korean woman with naturally defined double eyelids, " +
      "flawless luminous skin, soft natural makeup, serene expression, " +
      "pure white seamless studio background, bright clean even studio lighting, " +
      "high-end Korean beauty clinic editorial photography, fresh and luminous, magazine quality",
  },
  {
    titleEn: "Ptosis Correction",
    filename: "eye-ptosis-correction.jpg",
    prompt:
      "Portrait of a Korean woman with bright wide-open expressive eyes, alert and energetic gaze, " +
      "flawless skin, subtle natural makeup, " +
      "pure white seamless studio background, soft diffused studio lighting, " +
      "high-end Korean beauty clinic editorial photography, magazine quality",
  },
  {
    titleEn: "Epicanthoplasty",
    filename: "eye-epicanthoplasty.jpg",
    prompt:
      "Close-up beauty portrait of a Korean woman with refined elegant eye shape, " +
      "perfectly proportioned eyes, soft natural makeup, luminous skin, " +
      "pure white seamless studio background, clean studio lighting, " +
      "high-end Korean beauty clinic editorial photography, magazine quality",
  },
  // 코 성형
  {
    titleEn: "Rhinoplasty (Augmentation)",
    filename: "nose-augmentation.jpg",
    prompt:
      "Side profile portrait of a beautiful Korean woman with elegant refined nose bridge, " +
      "natural proportions, flawless luminous skin, minimal makeup, " +
      "pure white seamless studio background, soft directional lighting, " +
      "high-end Korean beauty clinic editorial photography, magazine quality",
  },
  {
    titleEn: "Tip Rhinoplasty",
    filename: "nose-tip.jpg",
    prompt:
      "Close-up three-quarter portrait of a Korean woman with delicate refined nose tip, " +
      "soft natural makeup, luminous glowing skin, " +
      "pure white seamless studio background, bright clean studio lighting, " +
      "high-end Korean beauty clinic editorial photography, magazine quality",
  },
  {
    titleEn: "Hump Nose Correction",
    filename: "nose-hump-correction.jpg",
    prompt:
      "Side profile beauty portrait of a Korean woman with smooth elegant nose profile, " +
      "perfectly straight nose bridge, natural refined look, luminous skin, " +
      "pure white seamless studio background, soft studio lighting, " +
      "high-end Korean beauty clinic editorial photography, magazine quality",
  },
  // 리프팅
  {
    titleEn: "Thread Lifting",
    filename: "lifting-thread.jpg",
    prompt:
      "Portrait of a graceful Korean woman in her 30s with lifted youthful facial contours, " +
      "smooth skin, defined jawline, serene confident expression, natural makeup, " +
      "pure white seamless studio background, bright clean studio lighting, " +
      "high-end Korean beauty clinic editorial photography, magazine quality",
  },
  {
    titleEn: "Facelift",
    filename: "lifting-facelift.jpg",
    prompt:
      "Elegant portrait of a Korean woman with beautifully lifted and contoured face, " +
      "refined jawline, smooth skin texture, sophisticated makeup, confident serene expression, " +
      "pure white seamless studio background, soft luminous studio lighting, " +
      "high-end Korean beauty clinic editorial photography, magazine quality",
  },
  {
    titleEn: "Brow Lifting",
    filename: "lifting-brow.jpg",
    prompt:
      "Portrait of a Korean woman with naturally lifted eyebrows and smooth forehead, " +
      "youthful open expression, luminous skin, refined natural makeup, " +
      "pure white seamless studio background, bright clean studio lighting, " +
      "high-end Korean beauty clinic editorial photography, magazine quality",
  },
  // 쁘띠
  {
    titleEn: "Botox",
    filename: "petit-botox.jpg",
    prompt:
      "Portrait of a Korean woman with smooth youthful skin, relaxed natural expression, " +
      "subtle sophisticated makeup, flawless luminous complexion, " +
      "pure white seamless studio background, soft diffused studio lighting, " +
      "high-end Korean beauty clinic editorial photography, fresh and radiant, magazine quality",
  },
  {
    titleEn: "Filler",
    filename: "petit-filler.jpg",
    prompt:
      "Portrait of a Korean woman with naturally volumized cheeks and lips, " +
      "soft natural enhancement, luminous glowing skin, fresh minimal makeup, " +
      "pure white seamless studio background, bright clean studio lighting, " +
      "high-end Korean beauty clinic editorial photography, magazine quality",
  },
  {
    titleEn: "Skin Booster",
    filename: "petit-skin-booster.jpg",
    prompt:
      "Portrait of a Korean woman with deeply hydrated glass-like radiant glowing skin, " +
      "dewy luminous complexion, fresh natural makeup, serene expression, " +
      "pure white seamless studio background, bright clean even studio lighting, " +
      "high-end Korean beauty clinic editorial photography, magazine quality",
  },
];

// ── Image generation + upload ─────────────────────────────────────────────────
async function generateAndUpload(service) {
  const { titleEn, filename, prompt } = service;
  console.log(`\n🎨  Generating: ${titleEn}`);

  let imageBuffer;
  try {
    const r = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1536",
      quality: "medium",
      n: 1,
      output_format: "jpeg",
    });
    imageBuffer = Buffer.from(r.data[0].b64_json, "base64");
    console.log(`   ✅ Image generated (${Math.round(imageBuffer.length / 1024)}KB)`);
  } catch (err) {
    console.error(`   ❌ Generation failed: ${err.message}`);
    return null;
  }

  if (BLOB_TOKEN) {
    // Vercel Blob upload using @vercel/blob put()
    try {
      const { url } = await put(`services/${filename}`, imageBuffer, {
        access: "public",
        contentType: "image/jpeg",
        token: BLOB_TOKEN,
      });
      console.log(`   ✅ Blob uploaded: ${url}`);
      return url;
    } catch (err) {
      console.error(`   ⚠️  Blob upload failed (${err.message}), saving locally...`);
    }
  }

  // Fallback: save locally
  const localPath = path.join(LOCAL_DIR, filename);
  fs.writeFileSync(localPath, imageBuffer);
  const publicUrl = `/images/services/${filename}`;
  console.log(`   💾 Saved locally: ${publicUrl}`);
  return publicUrl;
}

// ── DB update ─────────────────────────────────────────────────────────────────
async function updateServiceImageUrl(titleEn, imageUrl) {
  await sql`
    UPDATE services
    SET image_url = ${imageUrl}, updated_at = NOW()
    WHERE title_en = ${titleEn}
  `;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀  Starting service image seeding...");
  console.log(`   Mode: ${BLOB_TOKEN ? "Vercel Blob" : "Local (public/images/services/)"}`);

  let successCount = 0;

  for (const service of services) {
    const imageUrl = await generateAndUpload(service);
    if (!imageUrl) continue;

    try {
      await updateServiceImageUrl(service.titleEn, imageUrl);
      console.log(`   💾 DB updated for: ${service.titleEn}`);
      successCount++;
    } catch (err) {
      console.error(`   ❌ DB update failed: ${err.message}`);
    }

    // Rate limit respect (OpenAI gpt-image-1)
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\n✅  Done! ${successCount}/${services.length} services updated.`);
  process.exit(0);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
