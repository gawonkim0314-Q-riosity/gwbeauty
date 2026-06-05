/**
 * 쿠팡식 세로 상세 슬라이드 (설명·후킹 포함) — 시술당 3장 1024×1536
 * node scripts/generate-long-detail-slides.mjs --id=1
 * node scripts/generate-long-detail-slides.mjs --skip=1
 */

import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GW_REF = path.join(__dirname, "../public/images/gw.png");

const GW_LAYOUT = `
Korean premium clinic VERTICAL product detail slide (1024x1536), like BAKSAL/DA Coupang detail reference:
STRUCTURE top to bottom:
1) WHITE top block (~40%): top-left small category label (exact text provided), top-right "GW BEAUTY" in light grey
2) HUGE section number (01/02/03) in GW pink #E8748A or lavender #B89AE8
3) Bold readable KOREAN headline (exact text provided below — must be legible)
4) 2 lines smaller Korean body copy (exact text provided)
5) Pink-lavender horizontal highlight bar with Korean callout text inside
6) MIDDLE: warm professional clinic photo — Korean woman patient + doctor consultation, photorealistic
7) BOTTOM: dark purple #2D1B4E footer bar with THREE columns, gold-pink numbers 01 02 03 and white Korean labels

Brand: GW Beauty — use pink #E8748A and purple #8B64C8 accents, NOT green, NOT mustard gold.
Same Korean woman model on all 3 slides. Print-quality brochure graphic design mixed with photo.
`;

function svc(slug, categoryLabel, callout, slides) {
  return {
    slug,
    categoryLabel,
    callout,
    slides: slides.map((s, i) => ({
      file: `${slug}-long-0${i + 1}.jpg`,
      num: String(i + 1).padStart(2, "0"),
      callout,
      ...s,
    })),
  };
}

const SERVICES = {
  "쌍꺼풀 수술": svc("eye-double", "EYE DESIGN", "라인보다 먼저 눈의 힘과 비율을 봅니다", [
    {
      headline: "또렷함은 더하고 과한 인상 변화는 줄이는 설계",
      body: "눈뜨는 힘, 피부 두께, 좌우 비대칭을 함께 확인해 오래 봐도 자연스러운 눈매 라인을 계획합니다.",
      photo: "Korean doctor consulting patient about double eyelid, pointing at eye, bright clinic",
      footer: ["눈뜨는 힘 진단", "자연스러운 라인", "좌우 균형 점검"],
    },
    {
      headline: "정면과 측면에서 모두 어색하지 않은 눈매",
      body: "쌍꺼풀 라인만이 아니라 눈썹·동공 노출·얼굴 인상 흐름까지 함께 설계합니다.",
      photo: "Doctor marking eyelid line with tool, patient calm, premium clinic",
      footer: ["라인 시뮬레이션", "과교정 방지", "회복 리듬 안내"],
    },
    {
      headline: "상담부터 회복까지 차분하게 예측 가능한 플랜",
      body: "붓기와 멍의 개인차를 고려해 내원 일정과 애프터케어 시점을 미리 안내합니다.",
      photo: "Doctor measuring eyelid with silver instrument, warm cinematic clinic",
      footer: ["개인별 계획", "사후관리", "자연스러운 변화"],
    },
  ]),
  "눈매교정": svc("ptosis", "EYE DESIGN", "졸려 보이는 인상, 눈뜨는 힘부터 진단합니다", [
    {
      headline: "피곤해 보이는 눈매, 원인부터 정확히 짚습니다",
      body: "눈꺼풀 처짐·눈뜨는 근육 약화·눈썹 위치를 함께 확인해 맞춤 교정을 설계합니다.",
      photo: "Doctor examining patient upper eyelid and brow, medical consultation, bright clinic",
      footer: ["눈뜨는 힘 측정", "동공 노출 분석", "맞춤 교정 계획"],
    },
    {
      headline: "또렷한 시선, 인위적이지 않은 눈매로",
      body: "과한 교정 없이 자연스러운 눈뜨임과 또렷함의 균형을 목표로 합니다.",
      photo: "Close-up consultation on eye opening, professional Korean clinic",
      footer: ["교정 강도 조절", "좌우 대칭", "자연스러운 결과"],
    },
    {
      headline: "회복 기간까지 미리 안내하는 케어 플랜",
      body: "개인별 붓기·멍 패턴을 고려해 내원·관리 일정을 단계별로 안내합니다.",
      photo: "Doctor explaining recovery chart to patient, warm clinic interior",
      footer: ["회복 일정 안내", "사후 점검", "안정적 결과"],
    },
  ]),
  "앞트임·뒤트임": svc("epicanthoplasty", "EYE DESIGN", "눈의 가로·세로 비율을 함께 봅니다", [
    {
      headline: "답답해 보이는 눈매, 비율부터 다시 설계",
      body: "앞트임·뒤트임 필요 여부를 눈 간격·눈꼬리 각도와 함께 판단합니다.",
      photo: "Doctor analyzing inner and outer eye corners with patient, clinic consultation",
      footer: ["눈 간격 분석", "트임 범위 설계", "인상 변화 예측"],
    },
    {
      headline: "정면에서도 어색하지 않은 눈 비율",
      body: "과한 트임 없이 자연스럽고 또렷한 눈 형태를 목표로 합니다.",
      photo: "Precise marking near canthus area, premium aesthetic clinic",
      footer: ["과교정 방지", "라인 조화", "3D 비율 점검"],
    },
    {
      headline: "상담부터 관리까지 체계적인 안내",
      body: "시술 전후 주의사항과 회복 포인트를 단계별로 안내합니다.",
      photo: "Friendly consultation scene, doctor and patient discussing eye design",
      footer: ["맞춤 상담", "회복 가이드", "사후 관리"],
    },
  ]),
  "융비술": svc("rhino", "NOSE DESIGN", "코 라인은 얼굴 전체 비율과 함께 봅니다", [
    {
      headline: "낮고 넓어 보이는 콧대, 얼굴에 맞는 높이로",
      body: "콧대·콧등·콧망울 비율을 분석해 자연스럽고 세련된 라인을 계획합니다.",
      photo: "Doctor consulting patient about rhinoplasty with nose profile view, modern clinic",
      footer: ["3D 비율 분석", "맞춤 높이 설계", "자연스러운 라인"],
    },
    {
      headline: "정면·측면 모두 조화로운 코 실루엣",
      body: "과한 높이 없이 얼굴형에 어울리는 융비 라인을 목표로 합니다.",
      photo: "Side profile consultation, dotted planning lines on nose bridge concept",
      footer: ["콧등 라인", "콧끝 각도", "좌우 대칭"],
    },
    {
      headline: "회복과 결과를 예측 가능하게 안내",
      body: "개인별 붓기·멍·내원 일정을 미리 설명해 차분한 회복을 돕습니다.",
      photo: "Surgeon explaining nose surgery plan with model, warm clinic lighting",
      footer: ["개인별 계획", "회복 안내", "사후 관리"],
    },
  ]),
  "코끝 성형": svc("nose-tip", "NOSE DESIGN", "콧끝 모양이 인상을 좌우합니다", [
    {
      headline: "뭉툭해 보이는 콧끝, 세련된 각도로",
      body: "콧끝 높이·회전·콧망울 폭을 함께 분석해 얼굴에 맞는 디자인을 제안합니다.",
      photo: "Close consultation on nose tip, 3/4 face angle, premium clinic",
      footer: ["콧끝 분석", "각도 설계", "콧망울 조화"],
    },
    {
      headline: "정면에서도 자연스러운 콧끝 라인",
      body: "과한 뾰족함 없이 부드럽고 고급스러운 콧끝을 목표로 합니다.",
      photo: "Doctor marking nose tip area, patient calm, bright clinic",
      footer: ["과교정 방지", "비율 점검", "자연스러운 결과"],
    },
    {
      headline: "상담부터 사후관리까지 단계별 케어",
      body: "회복 기간과 관리 포인트를 미리 안내해 안심하고 시술받을 수 있도록 합니다.",
      photo: "Post-consultation discussion, nose surgery specialty clinic",
      footer: ["맞춤 상담", "회복 가이드", "정기 점검"],
    },
  ]),
  "매부리코 교정": svc("hump-nose", "NOSE DESIGN", "매끄러운 콧등 라인이 핵심입니다", [
    {
      headline: "매부리 콧등, 매끈한 라인으로 정리",
      body: "콧등 돌출·비대칭을 분석해 정면·측면 모두 자연스러운 라인을 설계합니다.",
      photo: "Side profile nose consultation, hump nose correction discussion, clinic",
      footer: ["콧등 분석", "라인 시뮬레이션", "얼굴 조화"],
    },
    {
      headline: "인위적이지 않은 직선 콧등",
      body: "과한 제거 없이 얼굴형에 맞는 매끈한 콧등을 목표로 합니다.",
      photo: "Doctor explaining bridge profile on tablet with patient",
      footer: ["교정 범위", "콧끝 연계", "자연스러운 각도"],
    },
    {
      headline: "예측 가능한 회복 플랜",
      body: "개인별 회복 차이를 고려한 내원·관리 일정을 안내합니다.",
      photo: "Warm consultation room, rhinoplasty specialist with patient",
      footer: ["회복 안내", "사후 관리", "결과 점검"],
    },
  ]),
  "실 리프팅": svc("thread-lift", "LIFTING DESIGN", "처진 라인은 방향과 강도가 중요합니다", [
    {
      headline: "처진 턱선·볼살, 탄력 있는 윤곽으로",
      body: "피부 두께·처짐 정도·얼굴형을 분석해 맞춤 실 리프팅을 설계합니다.",
      photo: "Doctor consulting patient on jawline lifting, aesthetic clinic",
      footer: ["처짐 진단", "리프팅 벡터", "V라인 설계"],
    },
    {
      headline: "과한 당김 없이 자연스러운 리프팅",
      body: "표정이 어색해지지 않도록 강도와 고정 포인트를 조절합니다.",
      photo: "Facial lifting consultation, gentle marking on cheek and jaw",
      footer: ["강도 조절", "좌우 균형", "자연스러운 결과"],
    },
    {
      headline: "시술 후 관리까지 함께 안내",
      body: "붓기·멍·일상 복귀 시점을 개인별로 안내합니다.",
      photo: "Aftercare explanation scene, premium Korean lifting clinic",
      footer: ["회복 가이드", "생활 수칙", "유지 관리"],
    },
  ]),
  "안면거상술": svc("facelift", "LIFTING DESIGN", "전체 얼굴 처짐을 구역별로 봅니다", [
    {
      headline: "깊어진 팔자·처진 하안면, 젊은 윤곽으로",
      body: "중안면·하안면·턱선 처짐을 구역별로 분석해 맞춤 거상을 계획합니다.",
      photo: "Mature Korean woman facelift consultation with doctor, elegant clinic",
      footer: ["구역별 진단", "거상 범위", "인상 개선"],
    },
    {
      headline: "과한 당김 없이 자연스러운 리juvenation",
      body: "표정과 피부 질감을 살리면서 처짐을 개선하는 것을 목표로 합니다.",
      photo: "Doctor explaining facelift zones on face diagram, professional setting",
      footer: ["자연스러운 결과", "흉터 최소화", "맞춤 설계"],
    },
    {
      headline: "회복 기간을 미리 공유하는 케어",
      body: "개인별 회복 속도에 맞춘 내원·관리 일정을 안내합니다.",
      photo: "Supportive consultation, facelift specialty clinic atmosphere",
      footer: ["회복 일정", "사후 관리", "결과 유지"],
    },
  ]),
  "이마 리프팅": svc("brow-lift", "LIFTING DESIGN", "눈썹 위치가 인상을 바꿉니다", [
    {
      headline: "처진 눈썹·이마 주름, 또렷한 상안면으로",
      body: "눈썹 위치·이마 탄력·눈꺼풀 여유를 함께 보고 맞춤 리프팅을 설계합니다.",
      photo: "Upper face consultation, brow and forehead assessment, clinic",
      footer: ["눈썹 위치", "이마 탄력", "눈매 개선"],
    },
    {
      headline: "인상이 밝아지는 자연스러운 상안면",
      body: "과한 당김 없이 생기 있고 편안한 인상을 목표로 합니다.",
      photo: "Doctor examining forehead and brow area with patient",
      footer: ["과교정 방지", "대칭 점검", "자연스러운 라인"],
    },
    {
      headline: "상담부터 회복까지 차분한 안내",
      body: "시술 전후 관리 포인트와 회복 일정을 단계별로 설명합니다.",
      photo: "Warm brow lift consultation, premium aesthetic clinic",
      footer: ["맞춤 상담", "회복 안내", "사후 점검"],
    },
  ]),
  "보톡스": svc("botox", "PETIT DESIGN", "표정은 살리고 주름만 정리합니다", [
    {
      headline: "깊어진 표정 주름, 자연스럽게 완화",
      body: "이마·미간·눈가 주름과 표정 습관을 함께 보고 맞춤 시술을 계획합니다.",
      photo: "Doctor marking botox injection zones on forehead, bright clinic",
      footer: ["주름 분석", "용량 설계", "표정 보존"],
    },
    {
      headline: "딱딱해 보이지 않는 자연스러운 결과",
      body: "과한 시술 없이 부드럽고 편안한 인상을 목표로 합니다.",
      photo: "Gentle consultation on glabella and crow's feet areas",
      footer: ["과시술 방지", "맞춤 부위", "자연스러운 라인"],
    },
    {
      headline: "짧은 시술, 체계적인 사후 안내",
      body: "시술 직후 주의사항과 효과 유지 팁을 안내합니다.",
      photo: "Quick petit treatment consultation, modern Korean beauty clinic",
      footer: ["시술 안내", "주의 사항", "유지 관리"],
    },
  ]),
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

function buildPrompt(slide, cfg) {
  const footerLine = slide.footer
    .map((t, i) => `Column ${i + 1}: "0${i + 1}" + "${t}"`)
    .join("; ");
  return `${GW_LAYOUT}
Category label: ${cfg.categoryLabel}
Section number: ${slide.num}
Headline (Korean, exact): ${slide.headline}
Body (Korean, exact): ${slide.body}
Callout bar text (Korean, exact): ${slide.callout}
Footer three columns (Korean, exact): ${footerLine}
Photo scene: ${slide.photo}
Vertical 2:3 aspect ratio, high quality JPEG marketing slide.`;
}

async function generateImage(prompt) {
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
      if (b64) return Buffer.from(b64, "base64");
    } catch (e) {
      console.warn(`   edit fallback: ${e.message}`);
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

async function saveLongImages(serviceId, urls) {
  const [row] = await sql`
    SELECT id FROM service_detail_pages
    WHERE service_id = ${serviceId} AND locale = 'ko' LIMIT 1
  `;
  if (row) {
    await sql`
      UPDATE service_detail_pages
      SET detail_long_image_urls = ${urls}, updated_at = NOW()
      WHERE id = ${row.id}
    `;
  } else {
    await sql`
      INSERT INTO service_detail_pages (service_id, locale, detail_long_image_urls, status)
      VALUES (${serviceId}, 'ko', ${urls}, 'published')
    `;
  }
}

const onlyId = process.argv.find((a) => a.startsWith("--id="))?.split("=")[1];
const skipIds = new Set(
  process.argv.filter((a) => a.startsWith("--skip=")).map((a) => a.split("=")[1])
);

async function main() {
  const rows = await sql`SELECT id, title FROM services ORDER BY id`;
  const map = Object.fromEntries(rows.map((r) => [r.title, r.id]));

  let ok = 0;
  let fail = 0;

  for (const [titleKo, cfg] of Object.entries(SERVICES)) {
    const serviceId = map[titleKo];
    if (!serviceId) {
      console.warn(`skip: ${titleKo}`);
      continue;
    }
    if (onlyId && String(serviceId) !== onlyId) continue;
    if (skipIds.has(String(serviceId))) {
      console.log(`\n⏭️  ${titleKo} (ID ${serviceId})`);
      continue;
    }

    console.log(`\n📋 ${titleKo} (ID ${serviceId}) — long detail slides`);
    try {
      const urls = [];
      for (const slide of cfg.slides) {
        console.log(`   🎨 ${slide.file}`);
        const buf = await generateImage(buildPrompt(slide, cfg));
        const url = await upload(slide.file, buf);
        urls.push(url);
        console.log(`   ✅ ${url}`);
        await new Promise((r) => setTimeout(r, 3000));
      }
      await saveLongImages(serviceId, urls);
      console.log("   💾 detail_long_image_urls updated");
      ok++;
      await new Promise((r) => setTimeout(r, 4000));
    } catch (e) {
      fail++;
      console.error(`   ❌ ${titleKo}: ${e.message}`);
    }
  }
  console.log(`\n✅ Done — success: ${ok}, failed: ${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
