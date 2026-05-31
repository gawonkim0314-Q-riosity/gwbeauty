export const siteConfig = {
  name: "GW Beauty",
  legalName: "주식회사 GW Beauty",
  tagline: "Aesthetic Intelligence. Surgical Precision.",
  description:
    "자연스러운 아름다움과 섬세한 디테일을 추구하는 프리미엄 성형외과 클리닉 GW Beauty",
  phone: "02-0000-0000",
  email: "contact@gwbeauty.co.kr",
  address: "서울특별시 강남구 테헤란로 000",
  addressDetail: "GW Beauty 빌딩 0층",
  businessNumber: "000-00-00000",
  hours: "평일 10:00 – 19:00",
  hoursSat: "토요일 10:00 – 15:00",
  hoursNote: "일요일 및 공휴일 휴진",
  instagram: "https://instagram.com/gwbeauty",
  youtube: "https://youtube.com/@gwbeauty",
  kakao: "https://pf.kakao.com/gwbeauty",
  nav: [
    { label: "About Us", href: "/about" },
    { label: "Service", href: "/service" },
    { label: "Blog", href: "/blog" },
    { label: "Inquire", href: "/inquire" },
  ] as const,
  doctors: [
    {
      name: "김O원 원장",
      title: "대표원장 · 성형외과 전문의",
      specialty: "안면윤곽 · 눈코 전문",
      image: "/images/doctor-01.jpg",
    },
    {
      name: "이O준 원장",
      title: "성형외과 전문의",
      specialty: "체형 교정 · 지방성형",
      image: "/images/doctor-02.jpg",
    },
    {
      name: "박O현 원장",
      title: "피부과 전문의",
      specialty: "피부 재생 · 비침습 시술",
      image: "/images/doctor-03.jpg",
    },
  ],
};

export type NavItem = (typeof siteConfig.nav)[number];
