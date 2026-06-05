/**
 * scripts/generate-embeddings.mjs
 *
 * 1. 모든 시술에 대해 text-embedding-3-small 로 임베딩 생성
 * 2. services.embedding 컬럼 업데이트
 * 3. pgvector HNSW 인덱스 생성
 *
 * 실행: node scripts/generate-embeddings.mjs
 */

import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";
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
const DB_URL = process.env.DATABASE_URL;

if (!OAI_KEY || !DB_URL) {
  console.error("❌  OPEN_API_SECRET_KEY or DATABASE_URL not set");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OAI_KEY });
const sql = neon(DB_URL);

async function embed(text) {
  const r = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return r.data[0].embedding;
}

async function main() {
  console.log("🚀  Generating embeddings...\n");

  // 1. Get all services
  const services = await sql`
    SELECT id, title, title_en, description, description_en, category, tags
    FROM services
    ORDER BY id
  `;

  console.log(`Found ${services.length} services\n`);

  for (const s of services) {
    const text = [
      s.title,
      s.title_en,
      s.description,
      s.description_en,
      s.category,
      ...(s.tags ?? []),
    ]
      .filter(Boolean)
      .join(" ");

    console.log(`📌  [${s.id}] ${s.title} ...`);

    try {
      const vector = await embed(text);
      const vectorStr = `[${vector.join(",")}]`;

      await sql`
        UPDATE services
        SET embedding = ${vectorStr}::vector
        WHERE id = ${s.id}
      `;
      console.log(`   ✅ embedding saved (${vector.length}d)`);

      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error(`   ❌ ${err.message}`);
    }
  }

  // 2. Create HNSW index
  console.log("\n🔧  Creating HNSW index...");
  try {
    await sql`
      CREATE INDEX IF NOT EXISTS services_embedding_idx
      ON services
      USING hnsw (embedding vector_cosine_ops)
    `;
    console.log("✅  Index created");
  } catch (err) {
    console.error(`⚠️  Index creation: ${err.message}`);
  }

  console.log("\n✅  All embeddings generated!");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
