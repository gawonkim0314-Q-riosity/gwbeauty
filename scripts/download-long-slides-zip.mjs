/**
 * 시술 1~7 세로 상세 슬라이드 이미지 다운로드 → ZIP
 * node scripts/download-long-slides-zip.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "downloads", "long-detail-slides-1-7");
const ZIP_PATH = path.join(ROOT, "downloads", "long-detail-slides-1-7.zip");

const BASE = "https://ievobqd5agb7g3ug.public.blob.vercel-storage.com/services/detail";

const SERVICES = [
  { id: 1, name: "쌍꺼풀수술", files: ["eye-double-long-01.jpg", "eye-double-long-02.jpg", "eye-double-long-03.jpg"] },
  { id: 2, name: "눈매교정", files: ["ptosis-long-01.jpg", "ptosis-long-02.jpg", "ptosis-long-03.jpg"] },
  { id: 3, name: "앞트임뒤트임", files: ["epicanthoplasty-long-01.jpg", "epicanthoplasty-long-02.jpg", "epicanthoplasty-long-03.jpg"] },
  { id: 4, name: "융비술", files: ["rhino-long-01.jpg", "rhino-long-02.jpg", "rhino-long-03.jpg"] },
  { id: 5, name: "코끝성형", files: ["nose-tip-long-01.jpg", "nose-tip-long-02.jpg", "nose-tip-long-03.jpg"] },
  { id: 6, name: "매부리코교정", files: ["hump-nose-long-01.jpg", "hump-nose-long-02.jpg", "hump-nose-long-03.jpg"] },
  { id: 7, name: "실리프팅", files: ["thread-lift-long-01.jpg", "thread-lift-long-02.jpg", "thread-lift-long-03.jpg"] },
];

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

function safeFolder(id, name) {
  return `${String(id).padStart(2, "0")}_${name}`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(ROOT, "downloads"), { recursive: true });

  let count = 0;
  for (const svc of SERVICES) {
    const folder = path.join(OUT_DIR, safeFolder(svc.id, svc.name));
    fs.mkdirSync(folder, { recursive: true });

    for (let i = 0; i < svc.files.length; i++) {
      const file = svc.files[i];
      const url = `${BASE}/${file}`;
      const dest = path.join(folder, `${String(i + 1).padStart(2, "0")}_${file}`);
      process.stdout.write(`⬇️  ${safeFolder(svc.id, svc.name)}/${path.basename(dest)} ... `);
      await download(url, dest);
      console.log("OK");
      count++;
    }
  }

  if (fs.existsSync(ZIP_PATH)) fs.unlinkSync(ZIP_PATH);

  // Windows: Compress-Archive
  const src = OUT_DIR.replace(/\\/g, "/");
  const zip = ZIP_PATH.replace(/\\/g, "/");
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${src}/*' -DestinationPath '${zip}' -Force"`,
    { stdio: "inherit" }
  );

  const sizeMb = (fs.statSync(ZIP_PATH).size / 1024 / 1024).toFixed(2);
  console.log(`\n✅ ${count}장 다운로드 완료`);
  console.log(`📦 ZIP: ${ZIP_PATH} (${sizeMb} MB)`);
  console.log(`📁 폴더: ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
