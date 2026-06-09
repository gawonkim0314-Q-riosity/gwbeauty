export const gwConfig = {
  name: "GW",
  legalName: "주식회사 GW",
  tagline: "Web Development Partner",
  taglineKo: "웹 개발 파트너",
  email: "linking204@naver.com",
  phone: "010-6651-2091",
  phoneRaw: "01066512091",
  ceo: "Kim Gawon",
  ceoKo: "김가원",
  founded: "2026",
  noneLabel: "없음",
  noneLabelEn: "N/A",
  stats: {
    experience: "5+",
    siFinance: "SI · Finance",
    erp: "ERP",
    healthcare: "Healthcare Web",
  },
  capabilities: [
    {
      id: "fullstack",
      titleEn: "Full-stack Engineering",
      titleKo: "풀스택 엔지니어링",
      descEn:
        "End-to-end web development with React, Next.js, TypeScript, Node.js, and Python",
      descKo:
        "React, Next.js, TypeScript, Node.js, Python 기반 End-to-End 웹 개발",
    },
    {
      id: "ai",
      titleEn: "AI · ML Solutions",
      titleKo: "AI · ML 솔루션",
      descEn:
        "LLM, RAG, Vector Search — AI features integrated into production products",
      descKo:
        "LLM, RAG, Vector Search — 프로덕션 제품에 통합되는 AI 기능",
    },
    {
      id: "cloud",
      titleEn: "Cloud & DevOps",
      titleKo: "클라우드 · DevOps",
      descEn:
        "AWS, GCP, Firebase, Docker, Vercel — reliable production infrastructure",
      descKo:
        "AWS, GCP, Firebase, Docker, Vercel — 안정적인 프로덕션 인프라",
    },
    {
      id: "erp",
      titleEn: "ERP · Enterprise Systems",
      titleKo: "ERP · 엔터프라이즈",
      descEn:
        "ERP development and enterprise system integration with domain-driven design",
      descKo:
        "ERP 개발 및 도메인 중심 엔터프라이즈 시스템 연동",
    },
    {
      id: "consulting",
      titleEn: "Technical Consulting",
      titleKo: "기술 컨설팅",
      descEn:
        "Architecture design, tech stack selection, code review, and SI project support",
      descKo:
        "아키텍처 설계, 기술 스택 선정, 코드 리뷰, SI 프로젝트 기술 지원",
    },
  ],
  techStack: {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    backend: ["Node.js", "Python", "FastAPI", "Spring Boot"],
    cloud: ["AWS", "GCP", "Firebase", "Docker", "Vercel"],
    enterprise: ["ERP", "PostgreSQL", "Redis", "RAG / LLM"],
  },
} as const;
