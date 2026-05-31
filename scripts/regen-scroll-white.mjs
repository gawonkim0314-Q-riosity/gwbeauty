/**
 * Regenerate scroll treatment card images with pure white backgrounds
 * to match the scroll-eyes.jpg clean, bright aesthetic.
 * Run: node scripts/regen-scroll-white.mjs
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

const IMAGES = [
  {
    filename: "scroll-rhinoplasty.jpg",
    size: "1024x1536",
    quality: "high",
    prompt:
      "Portrait of a beautiful Korean woman elegantly touching the side of her nose with one finger, looking slightly upward with a serene expression, flawless luminous skin, soft natural makeup, pure white seamless studio background, bright clean studio lighting, high-end Korean beauty clinic editorial photography, professional magazine quality, no shadows, crisp and fresh",
  },
  {
    filename: "scroll-facelift.jpg",
    size: "1024x1536",
    quality: "high",
    prompt:
      "Elegant portrait of a youthful-looking Korean woman in her 40s gently touching her jawline and neck, confident serene expression, radiant glowing skin, refined natural features, pure white seamless studio background, bright even lighting, premium aesthetic clinic photography, editorial beauty style, professional quality, clean and fresh",
  },
  {
    filename: "scroll-lips.jpg",
    size: "1024x1536",
    quality: "high",
    prompt:
      "Artistic portrait of a beautiful Korean woman with soft naturally rosy full lips, slight smile, glossy lip finish, flawless skin, minimal elegant makeup, pure white seamless studio background, bright clean even studio lighting, premium beauty clinic editorial photography, magazine quality, fresh and luminous",
  },
  {
    filename: "scroll-liposuction.jpg",
    size: "1024x1536",
    quality: "high",
    prompt:
      "Elegant portrait of a slim Korean woman in a white fitted top showing refined body contours, tasteful and sophisticated pose, radiant confident expression, pure white seamless studio background, bright clean lighting, high-end body contouring clinic photography, professional editorial beauty style, refined and fresh",
  },
];

async function generateImage(img) {
  console.log(`Generating ${img.filename}...`);
  try {
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: img.prompt,
      size: img.size,
      quality: img.quality,
      n: 1,
      output_format: "jpeg",
    });

    const base64 = response.data[0].b64_json;
    const outPath = path.join(OUT, img.filename);
    fs.writeFileSync(outPath, Buffer.from(base64, "base64"));
    console.log(`  Saved: ${outPath}`);
    return true;
  } catch (err) {
    console.error(`  ERROR for ${img.filename}:`, err.message);
    return false;
  }
}

(async () => {
  console.log("Starting scroll image regeneration (pure white background)...\n");
  for (const img of IMAGES) {
    await generateImage(img);
    // Small delay between requests
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log("\nDone! All scroll images regenerated.");
})();
