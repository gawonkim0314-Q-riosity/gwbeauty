"use client";

import { useState } from "react";
import { useServices } from "@/hooks/use-services";
import { ServiceTabs } from "./ServiceTabs";
import { ServiceCard } from "./ServiceCard";

const TABS = [
  { key: "all", label: "전체" },
  { key: "eye", label: "눈 성형" },
  { key: "nose", label: "코 성형" },
  { key: "lifting", label: "리프팅" },
  { key: "petit", label: "쁘띠" },
];

interface ServiceGridProps {
  locale: string;
}

export function ServiceGrid({ locale }: ServiceGridProps) {
  const [activeTab, setActiveTab] = useState("all");
  const { data: services, isLoading, error } = useServices(activeTab);

  return (
    <div>
      {/* Tabs */}
      <div className="sticky top-[72px] z-10 py-4 bg-[var(--bg)]" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="section-container">
          <ServiceTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Grid */}
      <div className="section-container py-12">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-3xl animate-pulse"
                style={{ background: "var(--bg-2)" }}
              />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-[var(--text-3)]">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        )}

        {!isLoading && !error && services?.length === 0 && (
          <div className="text-center py-20 text-[var(--text-3)]">
            해당 카테고리의 시술이 없습니다.
          </div>
        )}

        {!isLoading && services && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
