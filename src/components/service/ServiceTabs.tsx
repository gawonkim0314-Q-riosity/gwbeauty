"use client";

interface Tab {
  key: string;
  label: string;
}

interface ServiceTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function ServiceTabs({ tabs, activeTab, onTabChange }: ServiceTabsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
              ${isActive
                ? "text-white shadow-md"
                : "bg-white text-[var(--text-2)] border border-[var(--border)] hover:border-[var(--purple-light)]"
              }
            `}
            style={
              isActive
                ? { background: "var(--gradient-btn)" }
                : {}
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
