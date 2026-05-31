/**
 * GW Beauty Clinic — Site Image Generator
 * Uses gpt-image-2 via OpenAI API to generate all site assets.
 * Run: node scripts/generate-site-images.mjs
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env manually ──────────────────────────────────────────────────────
const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const idx = line.indexOf("=");
    if (idx !== -1) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      if (key) process.env[key] = val;
    }
  }
}

const openai = new OpenAI({ apiKey: process.env.OPEN_API_SECRET_KEY });
const OUT = path.join(__dirname, "../public/images");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// ── Image manifest ───────────────────────────────────────────────────────────
const IMAGES = [
  // ── HERO ──────────────────────────────────────────────────────────────────
  {
    filename: "hero-dark.jpg",
    size: "1536x1024",
    quality: "high",
    prompt:
      "Cinematic beauty portrait of an elegant Korean woman surrounded by large soft pink peonies, dark moody background transitioning from deep charcoal to black, high-key soft lighting on face, ultra realistic professional photography, luxury plastic surgery clinic editorial style, shallow depth of field, magazine quality",
  },

  // ── PHILOSOPHY ────────────────────────────────────────────────────────────
  {
    filename: "philosophy.jpg",
    size: "1024x1536",
    quality: "high",
    prompt:
      "Elegant portrait of a beautiful Korean woman delicately touching her cheek with both hands, flawless luminous skin, minimal natural glam makeup, warm beige studio background with soft directional lighting, high-end plastic surgery clinic photography, editorial beauty style, ultra realistic, premium quality",
  },

  // ── SERVICE PILLARS ───────────────────────────────────────────────────────
  {
    filename: "service-face.jpg",
    size: "1024x1536",
    quality: "medium",
    prompt:
      "Close-up artistic portrait of a beautiful Korean woman with perfect symmetrical facial features, natural elegant makeup, dark warm studio background, high-end beauty clinic editorial photography, focused on face and refined bone structure, professional quality",
  },
  {
    filename: "service-body.jpg",
    size: "1024x1536",
    quality: "medium",
    prompt:
      "Elegant artistic portrait of a slim Korean woman in a cream silk robe, tasteful body silhouette, luxury spa setting, soft warm lighting, high-end clinic photography, sophisticated and professional, artistic beauty editorial",
  },
  {
    filename: "service-skin.jpg",
    size: "1024x1536",
    quality: "medium",
    prompt:
      "Professional close-up of a beautiful Korean woman receiving a luxurious facial skin treatment at a premium clinic, beautician's gloved hands gently treating face, eyes closed, clinical aesthetic setting, warm soft lighting, high-end medical spa photography",
  },

  // ── SCROLLING TREATMENT CARDS ─────────────────────────────────────────────
  {
    filename: "scroll-rhinoplasty.jpg",
    size: "1024x1536",
    quality: "medium",
    prompt:
      "Portrait of a beautiful Korean woman elegantly touching her nose with one finger, looking upward, flawless skin, dark warm studio background, beauty clinic photography editorial style, professional quality",
  },
  {
    filename: "scroll-facelift.jpg",
    size: "1024x1536",
    quality: "medium",
    prompt:
      "Elegant portrait of a mature Korean woman looking youthful and confident, touching her jawline gently, refined features, warm studio lighting with dark background, premium plastic surgery clinic photography",
  },
  {
    filename: "scroll-eyes.jpg",
    size: "1024x1536",
    quality: "medium",
    prompt:
      "Dramatic close-up portrait of a Korean woman with striking natural eyes highlighted by minimal eye makeup, dark moody studio background, beauty photography emphasizing eye area, editorial quality",
  },
  {
    filename: "scroll-lips.jpg",
    size: "1024x1536",
    quality: "medium",
    prompt:
      "Artistic close-up portrait of a beautiful Korean woman with naturally rosy soft lips, glossy finish, gentle lighting, dark warm background, beauty clinic editorial photography, professional quality",
  },
  {
    filename: "scroll-liposuction.jpg",
    size: "1024x1536",
    quality: "medium",
    prompt:
      "Elegant artistic portrait of a slim Korean woman with toned midriff visible, tasteful and sophisticated, cream/beige background, high-end body contouring clinic photography, professional editorial style",
  },

  // ── BEFORE / AFTER ────────────────────────────────────────────────────────
  {
    filename: "before-face.jpg",
    size: "1024x1024",
    quality: "medium",
    prompt:
      "Natural portrait of a Korean woman with minimal makeup, soft natural features without enhancement, neutral studio lighting, clean light gray background, before treatment reference photo style, clinical photography",
  },
  {
    filename: "after-face.jpg",
    size: "1024x1024",
    quality: "medium",
    prompt:
      "Portrait of a Korean woman with refined elegant features, luminous glowing skin, subtle natural enhancement, confident serene expression, same neutral studio lighting as a before photo, clean light gray background, after treatment reference photo style, clinical photography",
  },

  // ── DOCTORS ───────────────────────────────────────────────────────────────
  {
    filename: "doctor-01.jpg",
    size: "1024x1024",
    quality: "medium",
    prompt:
      "Professional headshot of a Korean female doctor in her 40s wearing a white lab coat, warm confident professional smile, clean light gray studio background, medical professional photography, highly competent appearance",
  },
  {
    filename: "doctor-02.jpg",
    size: "1024x1024",
    quality: "medium",
    prompt:
      "Professional headshot of a Korean male doctor in his 50s wearing a white lab coat, distinguished experienced appearance, clean warm studio background, medical professional photography, authoritative and trustworthy",
  },
  {
    filename: "doctor-03.jpg",
    size: "1024x1024",
    quality: "medium",
    prompt:
      "Professional headshot of a young Korean female doctor in her 30s wearing a white lab coat, friendly approachable professional smile, clean studio background, medical professional photography, skilled and warm",
  },

  // ── PRODUCTS ──────────────────────────────────────────────────────────────
  {
    filename: "product-01.jpg",
    size: "1024x1024",
    quality: "medium",
    prompt:
      "Luxury Korean skincare serum glass bottle with gold dropper cap, minimal elegant packaging with gold and white design, white marble background, product photography, premium beauty brand aesthetic",
  },
  {
    filename: "product-02.jpg",
    size: "1024x1024",
    quality: "medium",
    prompt:
      "Premium Korean moisturizer cream in a white and gold jar with lid open showing cream texture, soft pink floral background, luxury skincare product photography, editorial quality",
  },
  {
    filename: "product-03.jpg",
    size: "1024x1024",
    quality: "medium",
    prompt:
      "Elegant Korean toner essence bottle in clear glass with minimalist white and rose gold packaging, light beige background with soft shadows, luxury skincare product photography",
  },
  {
    filename: "product-04.jpg",
    size: "1024x1024",
    quality: "medium",
    prompt:
      "Premium Korean eye cream tube with gold applicator tip, sophisticated white and gold packaging, clean white background with subtle shadow, luxury medical skincare product photography",
  },

  // ── BLOG THUMBNAILS ───────────────────────────────────────────────────────
  {
    filename: "blog-01.jpg",
    size: "1536x1024",
    quality: "medium",
    prompt:
      "Korean woman receiving professional facial skin care treatment at a luxury aesthetic clinic, beautician applying treatment, clinical warm setting, professional medical spa photography",
  },
  {
    filename: "blog-02.jpg",
    size: "1536x1024",
    quality: "medium",
    prompt:
      "Beautiful Korean woman with radiant glowing skin looking in a mirror, touching face gently, warm elegant bathroom setting, beauty and skincare concept photography, lifestyle editorial",
  },
  {
    filename: "blog-03.jpg",
    size: "1536x1024",
    quality: "medium",
    prompt:
      "Elegant Korean woman consulting with a doctor at a luxury plastic surgery clinic, both looking at a tablet, professional clinical setting, trust and care concept, warm professional photography",
  },

  // ── NEWSLETTER / CTA ──────────────────────────────────────────────────────
  {
    filename: "newsletter-bg.jpg",
    size: "1536x1024",
    quality: "high",
    prompt:
      "Ethereal close-up portrait of a beautiful Korean woman's face and neck, dark moody atmospheric background transitioning from deep blue to black, golden hour skin glow, minimal jewelry, ultra cinematic photography, luxury brand aesthetic, ultra realistic",
  },

  // ── CONSULTATION BG ───────────────────────────────────────────────────────
  {
    filename: "consultation-portrait.jpg",
    size: "1024x1536",
    quality: "high",
    prompt:
      "Striking portrait of a beautiful Korean woman with direct confident gaze toward camera, flawless natural skin, minimal makeup, dark warm studio background, cinematic lighting, luxury plastic surgery clinic photography, ultra realistic, professional quality",
  },
];

// ── Generator ────────────────────────────────────────────────────────────────
async function generate(img) {
  const outPath = path.join(OUT, img.filename);
  if (fs.existsSync(outPath)) {
    console.log(`⏭  Skip  ${img.filename} (already exists)`);
    return;
  }

  console.log(`🎨 Generating ${img.filename} ...`);
  try {
    const result = await openai.images.generate({
      model: "gpt-image-2",
      prompt: img.prompt,
      size: img.size,
      quality: img.quality ?? "medium",
      output_format: "jpeg",
      n: 1,
    });

    const b64 = result.data[0].b64_json;
    fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
    console.log(`✅ Saved  ${img.filename}`);
  } catch (err) {
    console.error(`❌ Failed ${img.filename}:`, err.message ?? err);
  }

  // Respect rate limit
  await new Promise((r) => setTimeout(r, 800));
}

// ── Run sequentially ─────────────────────────────────────────────────────────
console.log(`\n🌸 GW Beauty — Image Generator  (${IMAGES.length} images)\n`);
for (const img of IMAGES) {
  await generate(img);
}
console.log("\n✨ Done!\n");
