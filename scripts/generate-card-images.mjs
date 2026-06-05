/**
 * 3열 카드용 이미지 생성 (텍스트 없음, 정사각형)
 * node scripts/generate-card-images.mjs --id=4
 */

import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GW_REF = path.join(__dirname, "../public/images/gw.png");

const NO_TEXT = `
ABSOLUTELY NO TEXT: no letters, no numbers, no Korean or English typography, no logos with readable text, no caption bars with writing, no headlines, no watermarks.
All copy will be added in HTML/CSS outside the image — image must be text-free.
`;

const CARD_PROMPTS = {
  융비술: [
    {
      file: "rhino-card-01.jpg",
      prompt: `Clean clinical beauty photo for card thumbnail. Korean woman, 3/4 face angle, focus on nose and eyes, soft natural makeup, pure white seamless studio background, bright even lighting, professional Korean aesthetic clinic photography. ${NO_TEXT}`,
    },
    {
      file: "rhino-card-02.jpg",
      prompt: `Medical beauty reference photo: Korean woman face, front view, subtle white dotted guide lines on nose bridge only (thin cosmetic diagram lines, NOT text), white background, professional clinic style. ${NO_TEXT}`,
    },
    {
      file: "rhino-card-03.jpg",
      prompt: `Elegant side profile portrait, Korean woman, refined nose silhouette, soft lavender-white gradient background (#F5F0FF), luminous skin, high-end beauty clinic editorial. ${NO_TEXT}`,
    },
  ],
};

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

function loadReferenceFile() {
  if (!fs.existsSync(GW_REF)) return null;
  const buf = fs.readFileSync(GW_REF);
  return new File([buf], "gw.png", { type: "image/png" });
}

async function generate(prompt) {
  const refFile = loadReferenceFile();
  if (refFile) {
    try {
      const ref = await openai.images.edit({
        model: "gpt-image-1",
        image: refFile,
        prompt,
        size: "1024x1024",
        n: 1,
      });
      const b64 = ref.data[0]?.b64_json;
      if (b64) return Buffer.from(b64, "base64");
    } catch (e) {
      console.warn(`   edit fallback: ${e.message}`);
    }
  }

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

async function updateCardImages(serviceId, urls) {
  const [row] = await sql`
    SELECT id, detail_cards FROM service_detail_pages
    WHERE service_id = ${serviceId} AND locale = 'ko' LIMIT 1
  `;
  if (!row) return;

  let cards = row.detail_cards ?? [];
  if (!Array.isArray(cards)) cards = [];
  cards = cards.map((c, i) => ({
    ...c,
    imageUrl: urls[i] ?? c.imageUrl ?? "",
  }));

  const cardsJson = JSON.stringify(cards);
  await sql`
    UPDATE service_detail_pages
    SET detail_cards = ${cardsJson}::jsonb,
        detail_image_urls = ${urls},
        updated_at = NOW()
    WHERE id = ${row.id}
  `;
}

const onlyId = process.argv.find((a) => a.startsWith("--id="))?.split("=")[1];
const updateOnly = process.argv.includes("--update-only");

async function main() {
  const rows = await sql`SELECT id, title FROM services ORDER BY id`;
  const map = Object.fromEntries(rows.map((r) => [r.title, r.id]));

  for (const [titleKo, slides] of Object.entries(CARD_PROMPTS)) {
    const serviceId = map[titleKo];
    if (!serviceId) continue;
    if (onlyId && String(serviceId) !== onlyId) continue;

    console.log(`\n📋 ${titleKo} (ID ${serviceId}) — text-free card images`);
    const urls = [];
    if (updateOnly) {
      const base = "https://ievobqd5agb7g3ug.public.blob.vercel-storage.com/services/detail";
      for (const slide of slides) urls.push(`${base}/${slide.file}`);
    } else {
      for (const slide of slides) {
        try {
          console.log(`   🎨 ${slide.file}`);
          const buf = await generate(slide.prompt);
          const url = await upload(slide.file, buf);
          urls.push(url);
          console.log(`   ✅ ${url}`);
          await new Promise((r) => setTimeout(r, 2000));
        } catch (e) {
          console.error(`   ❌ ${e.message}`);
        }
      }
    }
    if (urls.length) {
      await updateCardImages(serviceId, urls);
      console.log("   💾 detail_cards updated");
    }
  }
  console.log("\n✅ Done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
