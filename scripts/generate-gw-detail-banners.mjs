/**
 * GW Beauty 클리닉 상세 배너 (쿠팡/DA 스타일 레이아웃)
 * - 시술당 3장 세로 1024×1536
 * - 01 훅 / 02 GW'S POINT 3단 / 03 결과·CTA
 * - public/images/gw.png 모델 참고
 *
 * node scripts/generate-gw-detail-banners.mjs --id=4
 */

import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GW_REF = path.join(__dirname, "../public/images/gw.png");

/** 레퍼런스: DA 클리닉 상세 — 화이트 배경, 섹션 번호, 헤드라인+컬러 바, 3단 포인트 그리드 */
const LAYOUT_RULES = `
CRITICAL LAYOUT (Korean premium clinic product detail page, like DA Hair Design Center reference):
- Clean WHITE background, generous padding, NO dark full-bleed photos as entire background
- Top: small brand "GW BEAUTY" + large section number (01, 02, or 03)
- Bold Korean headline typography (readable placeholder Korean characters or blocks)
- Accent highlight bar under headline: soft pink #E8748A or lavender #B89AE8 (GW Beauty brand, NOT mint green)
- Professional print/brochure quality, NOT AI surreal, NOT distorted faces, NOT extra limbs
- Same Korean woman model throughout all 3 slides — natural makeup, clinic model look
- Photorealistic studio portraits only where faces appear; rest is clean graphic design
`;

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

const BANNERS = [
  {
    titleKo: "쌍꺼풀 수술",
    gender: "female",
    slides: [
      {
        file: "gw-eye-01-detail.jpg",
        num: "01",
        prompt: `Slide 01 intro. Headline theme: natural double eyelid, clear eyes. Sub copy about customized eye line design. Bottom: front-facing portrait, focus on eyes, white studio.`,
      },
      {
        file: "gw-eye-02-detail.jpg",
        num: "02",
        prompt: `Slide 02 "GW'S POINT" purple label banner. THREE columns: (1) eye line balance front view with white dotted lines on eyelids (2) crease height side angle (3) natural width 3/4 view. Each column: portrait crop + dark gray caption box with Korean text lines at bottom.`,
      },
      {
        file: "gw-eye-03-detail.jpg",
        num: "03",
        prompt: `Slide 03 results. Headline about confident bright eyes after surgery. Soft purple footer band with consultation CTA placeholder. Elegant close-up portrait, eyes sharp and natural.`,
      },
    ],
  },
  {
    titleKo: "눈매교정",
    gender: "female",
    slides: [
      {
        file: "gw-ptosis-01-detail.jpg",
        num: "01",
        prompt: `Slide 01. Headline: ptosis correction, awake gaze. Intro about strengthening eye opening muscle. Portrait emphasizing tired vs refreshed eye concept subtly.`,
      },
      {
        file: "gw-ptosis-02-detail.jpg",
        num: "02",
        prompt: `Slide 02 GW'S POINT three-column grid: dotted lines on upper eyelid margin, brow-eyelid distance, pupil exposure. Dark caption boxes, white background.`,
      },
      {
        file: "gw-ptosis-03-detail.jpg",
        num: "03",
        prompt: `Slide 03 result message, purple CTA footer, bright natural eyes portrait.`,
      },
    ],
  },
  {
    titleKo: "앞트임·뒤트임",
    gender: "female",
    slides: [
      {
        file: "gw-epic-01-detail.jpg",
        num: "01",
        prompt: `Slide 01 epicanthoplasty intro, wider eye shape headline, intro copy area.`,
      },
      {
        file: "gw-epic-02-detail.jpg",
        num: "02",
        prompt: `Slide 02 three columns: inner corner, outer corner, combined balance — dotted annotation on eye corners, gray caption boxes.`,
      },
      {
        file: "gw-epic-03-detail.jpg",
        num: "03",
        prompt: `Slide 03 harmonious eye ratio result, soft CTA footer.`,
      },
    ],
  },
  {
    titleKo: "융비술",
    gender: "female",
    slides: [
      {
        file: "gw-rhino-01-detail.jpg",
        num: "01",
        prompt: `Slide 01 rhinoplasty (nose augmentation). Large Korean headline: low flat bridge to elegant refined line, face looks more balanced. 2-3 lines intro copy placeholder. Pink/lavender highlight bar under headline. Lower area: Korean woman 3/4 face, nose visible, soft white studio lighting.`,
      },
      {
        file: "gw-rhino-02-detail.jpg",
        num: "02",
        prompt: `Slide 02 EXACTLY like DA clinic 3-point layout but for NOSE: hand-drawn style "GW'S POINT" on soft purple ribbon. THREE equal vertical panels side by side:
Panel A front face — white dotted lines on nose bridge width
Panel B 3/4 angle — dotted lines on bridge height and tip projection  
Panel C profile — dotted lines on nasal line from forehead to tip
Each panel: clean studio photo + dark charcoal caption box at bottom with 2 lines Korean placeholder text. White background, professional medical brochure.`,
      },
      {
        file: "gw-rhino-03-detail.jpg",
        num: "03",
        prompt: `Slide 03 rhinoplasty results. Headline: natural silhouette, harmonious with face. Side profile portrait showing elegant nose line. Purple-pink gradient bottom CTA strip "무료 상담" placeholder. Premium trustworthy clinic finish.`,
      },
    ],
  },
  {
    titleKo: "코끝 성형",
    gender: "female",
    slides: [
      { file: "gw-tip-01-detail.jpg", num: "01", prompt: `Slide 01 nose tip plasty intro headline, bulbous tip refinement.` },
      { file: "gw-tip-02-detail.jpg", num: "02", prompt: `Slide 02 GW'S POINT 3 columns: tip rotation, nostril balance, tip projection — dotted lines, caption boxes.` },
      { file: "gw-tip-03-detail.jpg", num: "03", prompt: `Slide 03 refined tip result profile, CTA footer.` },
    ],
  },
  {
    titleKo: "매부리코 교정",
    gender: "female",
    slides: [
      { file: "gw-hump-01-detail.jpg", num: "01", prompt: `Slide 01 hump nose correction intro, smooth bridge headline.` },
      { file: "gw-hump-02-detail.jpg", num: "02", prompt: `Slide 02 three columns: hump profile, straight bridge line, front symmetry — medical dotted lines.` },
      { file: "gw-hump-03-detail.jpg", num: "03", prompt: `Slide 03 smooth profile result, CTA footer.` },
    ],
  },
  {
    titleKo: "실 리프팅",
    gender: "female",
    slides: [
      { file: "gw-thread-01-detail.jpg", num: "01", prompt: `Slide 01 thread lift intro, sagging skin elasticity headline.` },
      { file: "gw-thread-02-detail.jpg", num: "02", prompt: `Slide 02 GW'S POINT: jawline lift vectors, cheek lift, V-line — three face angles with dotted lift lines.` },
      { file: "gw-thread-03-detail.jpg", num: "03", prompt: `Slide 03 lifted contour result portrait.` },
    ],
  },
  {
    titleKo: "안면거상술",
    gender: "female",
    slides: [
      { file: "gw-face-01-detail.jpg", num: "01", prompt: `Slide 01 facelift intro, youthful contour headline.` },
      { file: "gw-face-02-detail.jpg", num: "02", prompt: `Slide 02 three zones: mid-face, lower face, neck line with dotted vectors.` },
      { file: "gw-face-03-detail.jpg", num: "03", prompt: `Slide 03 rejuvenated face result.` },
    ],
  },
  {
    titleKo: "이마 리프팅",
    gender: "female",
    slides: [
      { file: "gw-brow-01-detail.jpg", num: "01", prompt: `Slide 01 brow lift intro, forehead lines headline.` },
      { file: "gw-brow-02-detail.jpg", num: "02", prompt: `Slide 02 GW'S POINT: brow position, forehead tension, upper face refresh — 3 columns.` },
      { file: "gw-brow-03-detail.jpg", num: "03", prompt: `Slide 03 open refreshed upper face.` },
    ],
  },
  {
    titleKo: "보톡스",
    gender: "female",
    slides: [
      { file: "gw-botox-01-detail.jpg", num: "01", prompt: `Slide 01 botox intro, wrinkle smooth headline.` },
      { file: "gw-botox-02-detail.jpg", num: "02", prompt: `Slide 02 three zones: forehead, glabella, crow's feet with subtle dotted marks.` },
      { file: "gw-botox-03-detail.jpg", num: "03", prompt: `Slide 03 smooth skin glow result.` },
    ],
  },
];

function loadReferenceFile() {
  if (!fs.existsSync(GW_REF)) return null;
  const buf = fs.readFileSync(GW_REF);
  return new File([buf], "gw.png", { type: "image/png" });
}

async function generateBanner(slide, serviceTitle, gender) {
  const prompt = `${LAYOUT_RULES}
Service: ${serviceTitle} (${gender} Korean clinic model, use reference face likeness when provided).
Section number: ${slide.num}.
${slide.prompt}
Vertical aspect ratio 2:3 (1024x1536). High quality JPEG graphic.`;

  console.log(`   🎨 ${slide.file}`);

  const refFile = loadReferenceFile();
  if (refFile) {
    try {
      const ref = await openai.images.edit({
        model: "gpt-image-1",
        image: refFile,
        prompt,
        size: "1024x1536",
        n: 1,
      });
      const b64 = ref.data[0]?.b64_json;
      if (b64) {
        console.log("   (reference edit)");
        return Buffer.from(b64, "base64");
      }
    } catch (e) {
      console.warn(`   ⚠️  edit fallback: ${e.message}`);
    }
  }

  const r = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1536",
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

async function upsertDetail(serviceId, urls) {
  const existing = await sql`
    SELECT id FROM service_detail_pages
    WHERE service_id = ${serviceId} AND locale = 'ko' LIMIT 1
  `;
  if (existing.length) {
    await sql`
      UPDATE service_detail_pages
      SET detail_image_urls = ${urls}, status = 'published', updated_at = NOW()
      WHERE id = ${existing[0].id}
    `;
  } else {
    await sql`
      INSERT INTO service_detail_pages (service_id, locale, detail_image_urls, status)
      VALUES (${serviceId}, 'ko', ${urls}, 'published')
    `;
  }
}

const onlyId = process.argv.find((a) => a.startsWith("--id="))?.split("=")[1];

async function main() {
  const rows = await sql`SELECT id, title FROM services ORDER BY id`;
  const map = Object.fromEntries(rows.map((r) => [r.title, r.id]));

  for (const svc of BANNERS) {
    const serviceId = map[svc.titleKo];
    if (!serviceId) {
      console.warn(`⚠️  skip: ${svc.titleKo}`);
      continue;
    }
    if (onlyId && String(serviceId) !== onlyId) continue;

    console.log(`\n📋 ${svc.titleKo} (ID ${serviceId})`);
    const urls = [];
    for (const slide of svc.slides) {
      try {
        const buf = await generateBanner(slide, svc.titleKo, svc.gender);
        const url = await upload(slide.file, buf);
        urls.push(url);
        console.log(`   ✅ ${url}`);
        await new Promise((r) => setTimeout(r, 2500));
      } catch (e) {
        console.error(`   ❌ ${e.message}`);
      }
    }
    if (urls.length) {
      await upsertDetail(serviceId, urls);
      console.log("   💾 DB saved");
    }
  }
  console.log("\n✅ Done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
