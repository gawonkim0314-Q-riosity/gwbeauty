export const ludgiConfig = {
  name: "LUDGI Inc.",
  legalName: "주식회사 럿지",
  tagline: "Software Development Partner",
  taglineKo: "소프트웨어 개발 파트너",
  description:
    "공공 SI 실적과 30+ 민간 프로젝트 경험을 보유한 소프트웨어 개발사. KEPCO, KDN, 나라장터 등 고신뢰 프로젝트 수행.",
  url: "https://info.ludgi.ai",
  companyUrl: "https://info.ludgi.ai/company",
  email: "milli@molluhub.com",
  phone: "010-3006-9310",
  ceo: "Sangwoo Noh",
  ceoKo: "노상우",
  founded: "2024",
  businessNumber: "307-88-03283",
  duns: "963415644",
  address: "20F, A-dong, 323 Incheon Tower-daero, Yeonsu-gu, Incheon, South Korea",
  addressKo: "인천광역시 연수구 인천타워대로 323, A동 20층",
  stats: {
    projects: "30+",
    satisfaction: "98%",
    onTime: "95%",
    publicSector: "4+",
  },
  capabilities: [
    {
      id: "fullstack",
      titleEn: "Full-stack Engineering",
      titleKo: "풀스택 엔지니어링",
      descEn:
        "End-to-end product engineering across web and mobile with React, Next.js, Flutter, Node.js, Python",
      descKo:
        "React, Next.js, Flutter, Node.js, Python 기반 웹·모바일 End-to-End 제품 개발",
    },
    {
      id: "ai",
      titleEn: "AI · ML Solutions",
      titleKo: "AI · ML 솔루션",
      descEn:
        "LLM, RAG, Vector Search, Computer Vision — AI that integrates seamlessly into products",
      descKo:
        "LLM, RAG, Vector Search, Computer Vision — 제품에 자연스럽게 통합되는 AI",
    },
    {
      id: "cloud",
      titleEn: "Cloud & DevOps",
      titleKo: "클라우드 · DevOps",
      descEn:
        "AWS, GCP, Firebase, Docker, Kubernetes — infrastructure designed for production",
      descKo:
        "AWS, GCP, Firebase, Docker, Kubernetes — 프로덕션을 위한 인프라 설계",
    },
    {
      id: "public",
      titleEn: "Public Sector SI",
      titleKo: "공공 SI",
      descEn:
        "Government procurement, public sector contracts, security compliance, regulatory experience",
      descKo:
        "조달 등록, 공공 프로젝트, 보안·규제 준수 경험",
    },
    {
      id: "mvp",
      titleEn: "Startup MVP",
      titleKo: "스타트업 MVP",
      descEn:
        "From planning to design, development, and launch — one-stop MVP development",
      descKo:
        "기획·디자인·개발·런칭까지 원스톱 MVP 개발",
    },
    {
      id: "consulting",
      titleEn: "Technical Consulting",
      titleKo: "기술 컨설팅",
      descEn:
        "Architecture design, tech stack selection, code review, infrastructure audit",
      descKo:
        "아키텍처 설계, 기술 스택 선정, 코드 리뷰, 인프라 감사",
    },
  ],
  publicSector: [
    "Korean Gov Procurement (나라장터)",
    "Korea Electric Power Corp (KEPCO)",
    "KEPCO KDN",
  ],
  privateSectors: [
    "E-commerce Platforms",
    "SaaS · B2B Dashboards",
    "Healthcare · Medical AI",
    "Education · EdTech",
    "Logistics · TMS",
    "Real Estate · FinTech",
  ],
  techStack: {
    frontend: ["React", "Next.js", "TypeScript", "Flutter", "React Native", "Tailwind CSS"],
    backend: ["Node.js", "Python", "Django", "FastAPI", "Go", "Spring Boot"],
    cloud: ["AWS", "GCP", "Firebase", "Docker", "Kubernetes", "Vercel"],
    ai: ["LLM / RAG", "Computer Vision", "NLP", "TensorFlow", "PostgreSQL", "MongoDB"],
  },
} as const;
