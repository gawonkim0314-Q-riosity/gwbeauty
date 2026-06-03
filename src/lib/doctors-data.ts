export interface DoctorDetail {
  id: string;
  name: string;
  title: string;
  specialty: string;
  image: string;
  tagline: string;
  education: string[];
  career: string[];
  papers: string[];
  liveSurgery: string[];
  certifications: string[];
}

export const doctorsDetail: DoctorDetail[] = [
  {
    id: "kim-director",
    name: "김O원",
    title: "대표원장 · 성형외과 전문의",
    specialty: "안면윤곽 · 눈코 전문",
    image: "/images/doctor-01.jpg",
    tagline: "해부학적 비율과 개인의 아름다움을 존중하는 섬세한 수술 철학",
    education: [
      "서울대학교 의과대학 졸업",
      "서울대학교병원 성형외과 전공의 수료",
      "서울대학교 의학대학원 석사 (성형외과학)",
      "성형외과 전문의 취득",
    ],
    career: [
      "서울대학교병원 성형외과 임상강사 (2년)",
      "강남세브란스병원 성형외과 임상조교수 (3년)",
      "대한성형외과학회 정회원",
      "대한미용성형외과학회 정회원",
      "GW Beauty 클리닉 대표원장 (현)",
    ],
    papers: [
      "\"안면윤곽 수술 후 비율 분석에 관한 임상 연구\" — 대한성형외과학회지 (2019)",
      "\"최소 흉터 눈성형 기법 비교 연구\" — 미용성형외과학회지 (2021)",
      "\"코끝 성형에서 해부학적 접근법\" — 국제미용의학저널 (2022)",
      "\"리프팅 수술의 장기 결과 분석\" — 대한성형외과학회 춘계학술대회 발표 (2023)",
    ],
    liveSurgery: [
      "대한성형외과학회 춘계 라이브 서저리 — 안면윤곽 (2020)",
      "아시아태평양 성형외과학술대회 라이브 시연 — 눈 성형 (2021)",
      "대한미용성형외과학회 라이브 서저리 — 코 성형 (2022)",
      "GW Beauty 원내 라이브 서저리 세미나 강연자 (연 2회)",
    ],
    certifications: [
      "성형외과 전문의 (보건복지부)",
      "대한성형외과학회 인증의",
      "ISAPS (국제미용성형외과학회) 정회원",
    ],
  },
  {
    id: "lee-doctor",
    name: "이O준",
    title: "성형외과 전문의",
    specialty: "체형 교정 · 지방성형",
    image: "/images/doctor-02.jpg",
    tagline: "정밀한 체형 분석으로 자연스럽고 균형 잡힌 실루엣을 완성합니다",
    education: [
      "연세대학교 의과대학 졸업",
      "신촌세브란스병원 성형외과 전공의 수료",
      "성형외과 전문의 취득",
    ],
    career: [
      "신촌세브란스병원 성형외과 임상강사",
      "대한성형외과학회 정회원",
      "대한비만미용치료학회 정회원",
      "GW Beauty 클리닉 원장 (현)",
    ],
    papers: [
      "\"HD 지방흡입 기법의 임상적 효과\" — 대한성형외과학회 학술지 (2021)",
      "\"복부성형 수술 후 만족도 연구\" — 미용성형외과학회 (2022)",
    ],
    liveSurgery: [
      "대한성형외과학회 HD 지방흡입 라이브 시연 (2021)",
      "아시아 체형 성형학술대회 강연 (2023)",
    ],
    certifications: [
      "성형외과 전문의 (보건복지부)",
      "대한성형외과학회 인증의",
    ],
  },
  {
    id: "park-doctor",
    name: "박O현",
    title: "피부과 전문의",
    specialty: "피부 재생 · 비침습 시술",
    image: "/images/doctor-03.jpg",
    tagline: "피부 본연의 재생력을 극대화하는 과학적 접근으로 건강한 피부를 회복합니다",
    education: [
      "고려대학교 의과대학 졸업",
      "고려대학교병원 피부과 전공의 수료",
      "피부과 전문의 취득",
    ],
    career: [
      "고려대학교병원 피부과 임상강사",
      "대한피부과학회 정회원",
      "대한미용피부외과학회 정회원",
      "GW Beauty 클리닉 원장 (현)",
    ],
    papers: [
      "\"레이저 피부 재생 치료의 효과 비교\" — 대한피부과학회지 (2020)",
      "\"비침습 리프팅 시술의 임상 결과\" — 미용피부과학술지 (2022)",
    ],
    liveSurgery: [
      "대한피부과학회 레이저 라이브 시연 (2021)",
      "아시아 피부미용학술대회 강연 (2022)",
    ],
    certifications: [
      "피부과 전문의 (보건복지부)",
      "대한피부과학회 인증의",
      "레이저 안전 관리사 자격",
    ],
  },
];

export const leadDoctor = doctorsDetail[0];
