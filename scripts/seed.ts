import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const seedServices = [
  // 눈 성형
  {
    title: "쌍꺼풀 수술",
    titleEn: "Double Eyelid Surgery",
    category: "eye",
    description: "자연스럽고 또렷한 눈매를 만드는 맞춤형 쌍꺼풀 수술",
    descriptionEn: "Customized double eyelid surgery for natural and clear eyes",
    detail: "매몰법, 절개법 등 개인의 눈 상태에 따라 최적의 방법을 선택합니다.",
    price: "상담 후 안내",
    tags: ["눈 성형", "쌍꺼풀"],
    order: 1,
    isActive: true,
  },
  {
    title: "눈매교정",
    titleEn: "Ptosis Correction",
    category: "eye",
    description: "눈을 뜨는 힘을 강화하여 또렷한 눈매로 교정",
    descriptionEn: "Strengthening the eye-opening muscle for brighter eyes",
    detail: "안검하수 교정으로 생동감 있는 눈매를 만듭니다.",
    price: "상담 후 안내",
    tags: ["눈 성형", "눈매교정"],
    order: 2,
    isActive: true,
  },
  {
    title: "앞트임·뒤트임",
    titleEn: "Epicanthoplasty",
    category: "eye",
    description: "눈의 폭과 길이를 조정하여 이상적인 비율로 개선",
    descriptionEn: "Adjusting eye width and length for ideal proportions",
    price: "상담 후 안내",
    tags: ["눈 성형", "트임"],
    order: 3,
    isActive: true,
  },
  // 코 성형
  {
    title: "융비술",
    titleEn: "Rhinoplasty (Augmentation)",
    category: "nose",
    description: "자연스럽고 아름다운 콧날을 완성하는 코 높이기 수술",
    descriptionEn: "Nose augmentation for naturally beautiful nose bridge",
    price: "상담 후 안내",
    tags: ["코 성형", "융비술"],
    order: 4,
    isActive: true,
  },
  {
    title: "코끝 성형",
    titleEn: "Tip Rhinoplasty",
    category: "nose",
    description: "매력적인 코끝 라인을 만드는 정밀 시술",
    descriptionEn: "Precise procedure for attractive nose tip contour",
    price: "상담 후 안내",
    tags: ["코 성형", "코끝"],
    order: 5,
    isActive: true,
  },
  {
    title: "매부리코 교정",
    titleEn: "Hump Nose Correction",
    category: "nose",
    description: "돌출된 코 뼈와 연골을 다듬어 세련된 콧날 완성",
    descriptionEn: "Refining the nose profile by correcting the hump",
    price: "상담 후 안내",
    tags: ["코 성형", "매부리코"],
    order: 6,
    isActive: true,
  },
  // 리프팅
  {
    title: "실 리프팅",
    titleEn: "Thread Lifting",
    category: "lifting",
    description: "절개 없이 처진 피부를 당겨 탄력 있는 얼굴선으로 복원",
    descriptionEn: "Non-surgical thread lift to restore youthful facial contours",
    price: "상담 후 안내",
    tags: ["리프팅", "실리프팅"],
    order: 7,
    isActive: true,
  },
  {
    title: "안면거상술",
    titleEn: "Facelift",
    category: "lifting",
    description: "피부와 근막을 동시에 교정하는 근본적 리프팅 수술",
    descriptionEn: "Comprehensive surgical lifting of skin and facial muscles",
    price: "상담 후 안내",
    tags: ["리프팅", "거상술"],
    order: 8,
    isActive: true,
  },
  {
    title: "이마 리프팅",
    titleEn: "Brow Lifting",
    category: "lifting",
    description: "처진 이마와 눈썹을 교정하여 생기 있는 인상으로",
    descriptionEn: "Forehead and brow lift for a more youthful appearance",
    price: "상담 후 안내",
    tags: ["리프팅", "이마"],
    order: 9,
    isActive: true,
  },
  // 쁘띠
  {
    title: "보톡스",
    titleEn: "Botox",
    category: "petit",
    description: "주름 완화부터 윤곽 교정까지, 정밀한 보톡스 시술",
    descriptionEn: "Precise Botox treatment for wrinkle reduction and contouring",
    price: "상담 후 안내",
    tags: ["쁘띠", "보톡스"],
    order: 10,
    isActive: true,
  },
  {
    title: "필러",
    titleEn: "Filler",
    category: "petit",
    description: "볼륨 복원과 윤곽 개선을 위한 히알루론산 필러",
    descriptionEn: "Hyaluronic acid filler for volume restoration and contouring",
    price: "상담 후 안내",
    tags: ["쁘띠", "필러"],
    order: 11,
    isActive: true,
  },
  {
    title: "스킨부스터",
    titleEn: "Skin Booster",
    category: "petit",
    description: "피부 속 수분과 탄력을 채워주는 광채 피부 시술",
    descriptionEn: "Treatment to boost skin hydration and elasticity from within",
    price: "상담 후 안내",
    tags: ["쁘띠", "스킨케어"],
    order: 12,
    isActive: true,
  },
];

async function main() {
  console.log("Seeding database...");
  await db.insert(schema.services).values(seedServices).onConflictDoNothing();
  console.log("Done!");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
