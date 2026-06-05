/**
 * Before/After 대비용 이미지 (텍스트 없음) — 전체 시술
 * node scripts/generate-before-after-images.mjs
 * node scripts/generate-before-after-images.mjs --id=1
 * node scripts/generate-before-after-images.mjs --skip=4
 */

import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const NO_TEXT = `
ABSOLUTELY NO TEXT: no letters, numbers, logos, watermarks, captions, or typography in the image.
`;

/** slug: 파일명 prefix, category: eye|nose|lifting|petit */
const SETS = [
  {
    titleKo: "쌍꺼풀 수술",
    slug: "double-eyelid",
    category: "eye",
    label: "쌍꺼풀 라인 변화 참고",
    before: `Clinical BEFORE double eyelid reference. Korean woman front-facing portrait, focus on eyes: monolid or very faint crease, slightly puffy upper lids, tired dull gaze. Subtle white dotted planning lines along upper eyelid ONLY. Flat cool clinical lighting, grey-white background, slightly desaturated. ${NO_TEXT}`,
    after: `Clinical AFTER double eyelid reference. SAME woman SAME front angle, natural defined double eyelid crease, brighter awake eyes, smooth upper lid. Warm soft beauty lighting, subtle lavender-pink glow, clearly improved vs typical before. ${NO_TEXT}`,
  },
  {
    titleKo: "눈매교정",
    slug: "ptosis",
    category: "eye",
    label: "눈매교정 시술 전·후 참고",
    before: `Clinical BEFORE ptosis correction. Korean woman front portrait, droopy upper eyelids covering pupil, sleepy heavy gaze, mild under-eye shadows. White dotted lines on eyelid margin. Cool flat clinical light, desaturated. ${NO_TEXT}`,
    after: `Clinical AFTER ptosis correction. SAME woman SAME angle, eyes wide open with strong pupil exposure, lifted eyelids, energetic gaze. Warm beauty lighting, lavender hint, dramatic natural improvement. ${NO_TEXT}`,
  },
  {
    titleKo: "앞트임·뒤트임",
    slug: "epicanthoplasty",
    category: "eye",
    label: "트임 수술 전·후 참고",
    before: `Clinical BEFORE epicanthoplasty. Korean woman 3/4 face, eyes appear narrow, inner epicanthal fold prominent, horizontal eye ratio short. Dotted lines at inner and outer canthus. Clinical cool lighting. ${NO_TEXT}`,
    after: `Clinical AFTER epicanthoplasty. SAME woman SAME 3/4 angle, balanced wider eye shape, harmonious inner corner, bright eyes. Warm premium clinic lighting, pink-lavender glow. ${NO_TEXT}`,
  },
  {
    titleKo: "융비술",
    slug: "rhino",
    category: "nose",
    label: "융비술 라인 개선 참고",
    before: `Clinical BEFORE rhinoplasty. Korean woman side profile 90°, low flat bridge, rounded tip, dotted surgical lines on nose bridge and tip. Cool clinical lighting, grey background. ${NO_TEXT}`,
    after: `Clinical AFTER rhinoplasty. SAME woman SAME profile, refined straight nose line, smooth under-eye, warm beauty lighting, lavender-pink glow, dramatic natural result. ${NO_TEXT}`,
  },
  {
    titleKo: "코끝 성형",
    slug: "nose-tip",
    category: "nose",
    label: "코끝 성형 전·후 참고",
    before: `Clinical BEFORE nose tip plasty. Korean woman 3/4 face, bulbous rounded nose tip, wide nostril flare, dotted lines on tip and nostrils. Cool flat clinical light. ${NO_TEXT}`,
    after: `Clinical AFTER nose tip plasty. SAME woman SAME angle, refined lifted tip, slimmer nostrils, elegant proportion. Warm soft lighting, premium Korean clinic result. ${NO_TEXT}`,
  },
  {
    titleKo: "매부리코 교정",
    slug: "hump-nose",
    category: "nose",
    label: "매부리코 교정 전·후 참고",
    before: `Clinical BEFORE hump nose correction. Korean woman side profile, visible dorsal hump on nasal bridge, slight bump, dotted lines along bridge profile. Cool desaturated clinical photo. ${NO_TEXT}`,
    after: `Clinical AFTER hump nose correction. SAME woman SAME profile, smooth straight bridge line from radix to tip, harmonious silhouette. Warm beauty lighting, clear improvement. ${NO_TEXT}`,
  },
  {
    titleKo: "실 리프팅",
    slug: "thread-lift",
    category: "lifting",
    label: "실 리프팅 전·후 참고",
    before: `Clinical BEFORE thread lift. Korean woman 3/4 face, mild jowls, sagging jawline, less defined V-line, subtle dotted lift vectors on jaw and cheek. Cool clinical lighting, slightly aged look. ${NO_TEXT}`,
    after: `Clinical AFTER thread lift. SAME woman SAME angle, lifted jaw contour, sharper V-line, firmer mid-face, youthful skin. Warm glowing beauty light, lavender-pink tone. ${NO_TEXT}`,
  },
  {
    titleKo: "안면거상술",
    slug: "facelift",
    category: "lifting",
    label: "안면거상 전·후 참고",
    before: `Clinical BEFORE facelift. Korean woman front portrait, visible nasolabial folds, sagging lower face and jaw, tired mature appearance. Dotted lines on mid and lower face zones. Cool clinical light. ${NO_TEXT}`,
    after: `Clinical AFTER facelift. SAME woman SAME front view, smoother cheeks, reduced folds, lifted lower face, refreshed youthful appearance. Warm premium clinic lighting. ${NO_TEXT}`,
  },
  {
    titleKo: "이마 리프팅",
    slug: "brow-lift",
    category: "lifting",
    label: "이마 리프팅 전·후 참고",
    before: `Clinical BEFORE brow lift. Korean woman front portrait, low heavy brows, horizontal forehead wrinkles, dull upper face. Dotted lines on brow and forehead. Cool flat lighting. ${NO_TEXT}`,
    after: `Clinical AFTER brow lift. SAME woman SAME view, elevated brows, smoother forehead, open refreshed upper face. Warm soft beauty lighting. ${NO_TEXT}`,
  },
  {
    titleKo: "보톡스",
    slug: "botox",
    category: "petit",
    label: "보톡스 시술 전·후 참고",
    before: `Clinical BEFORE botox reference. Korean woman front portrait, visible forehead lines, glabella frown lines, crow's feet, slightly tired expression. Subtle dotted marks on wrinkle zones only. Cool clinical lighting. ${NO_TEXT}`,
    after: `Clinical AFTER botox reference. SAME woman SAME angle, smooth forehead, relaxed glabella, softened crow's feet, fresh rested look. Warm luminous skin, premium clinic glow. ${NO_TEXT}`,
  },
];

function loadEnv() {
  for (const file of [".env", ".env.local"]) {
    const p = path.join(__dirname, "..", file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^([^#=\s][^=]*)=(.*)/);
      if (!m) continue;
      const k = m[1].trim();
      const v = m[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[k]) process.env[k] = v;
    }
  }
}
loadEnv();

const openai = new OpenAI({ apiKey: process.env.OPEN_API_SECRET_KEY });
const sql = neon(process.env.DATABASE_URL);
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

async function generate(prompt) {
  const r = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
    quality: "high",
    n: 1,
    output_format: "jpeg",
  });
  return Buffer.from(r.data[0].b64_json, "base64");
}

async function upload(filename, buffer) {
  if (BLOB_TOKEN) {
    const { url } = await put(`services/detail/${filename}`, buffer, {
      access: "public",
      contentType: "image/jpeg",
      token: BLOB_TOKEN,
    });
    return url;
  }
  const dir = path.join(__dirname, "../public/images/services/detail");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), buffer);
  return `/images/services/detail/${filename}`;
}

async function upsertBa(serviceId, beforeUrl, afterUrl, label) {
  const items = JSON.stringify([{ beforeUrl, afterUrl, label }]);
  const [row] = await sql`
    SELECT id FROM service_detail_pages
    WHERE service_id = ${serviceId} AND locale = 'ko' LIMIT 1
  `;
  if (row) {
    await sql`
      UPDATE service_detail_pages
      SET before_after_items = ${items}::jsonb, updated_at = NOW()
      WHERE id = ${row.id}
    `;
  } else {
    await sql`
      INSERT INTO service_detail_pages (service_id, locale, before_after_items, status)
      VALUES (${serviceId}, 'ko', ${items}::jsonb, 'published')
    `;
  }
}

const onlyId = process.argv.find((a) => a.startsWith("--id="))?.split("=")[1];
const skipIds = new Set(
  process.argv
    .filter((a) => a.startsWith("--skip="))
    .map((a) => a.split("=")[1])
);

async function processService(serviceId, cfg) {
  const beforeFile = `${cfg.slug}-ba-before.jpg`;
  const afterFile = `${cfg.slug}-ba-after.jpg`;

  console.log(`\n📋 ${cfg.titleKo} (ID ${serviceId})`);
  const beforeUrl = await upload(beforeFile, await generate(cfg.before));
  console.log(`   ✅ before ${beforeUrl}`);
  await new Promise((r) => setTimeout(r, 2500));

  const afterUrl = await upload(afterFile, await generate(cfg.after));
  console.log(`   ✅ after  ${afterUrl}`);

  await upsertBa(serviceId, beforeUrl, afterUrl, cfg.label);
  console.log("   💾 saved");
}

async function main() {
  const rows = await sql`SELECT id, title FROM services ORDER BY id`;
  const map = Object.fromEntries(rows.map((r) => [r.title, r.id]));

  let ok = 0;
  let fail = 0;

  for (const cfg of SETS) {
    const serviceId = map[cfg.titleKo];
    if (!serviceId) {
      console.warn(`⚠️  skip (not in DB): ${cfg.titleKo}`);
      continue;
    }
    if (onlyId && String(serviceId) !== onlyId) continue;
    if (skipIds.has(String(serviceId))) {
      console.log(`\n⏭️  ${cfg.titleKo} (ID ${serviceId}) — skipped`);
      continue;
    }

    try {
      await processService(serviceId, cfg);
      ok++;
      await new Promise((r) => setTimeout(r, 3000));
    } catch (e) {
      fail++;
      console.error(`   ❌ ${cfg.titleKo}: ${e.message}`);
    }
  }

  console.log(`\n✅ Done — success: ${ok}, failed: ${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
