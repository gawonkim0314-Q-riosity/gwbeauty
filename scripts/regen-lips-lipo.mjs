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
    filename: "scroll-lips.jpg",
    prompt:
      "Artistic portrait of a beautiful Korean woman with soft naturally rosy full lips, slight smile, glossy lip finish, flawless skin, minimal elegant makeup, pure white seamless studio background, bright clean even studio lighting, premium beauty clinic editorial photography, magazine quality, fresh and luminous",
  },
  {
    filename: "scroll-liposuction.jpg",
    prompt:
      "Elegant portrait of a slim Korean woman in a white fitted top showing refined body contours, tasteful sophisticated pose, radiant confident expression, pure white seamless studio background, bright clean lighting, high-end body contouring clinic photography, professional editorial beauty style, refined and fresh",
  },
];

for (const img of IMAGES) {
  console.log("Generating", img.filename);
  try {
    const r = await openai.images.generate({
      model: "gpt-image-1",
      prompt: img.prompt,
      size: "1024x1536",
      quality: "high",
      n: 1,
      output_format: "jpeg",
    });
    fs.writeFileSync(
      path.join(OUT, img.filename),
      Buffer.from(r.data[0].b64_json, "base64")
    );
    console.log("Saved", img.filename);
  } catch (e) {
    console.error("ERROR", img.filename, e.message);
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
console.log("Done!");
