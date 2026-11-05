import React, { useState } from "react";
import {
  Compass,
  Zap,
  Globe,
  Layers,
  BookOpen,
  Rocket,
  Library,
  FileCode,
  FileText,
  ChevronDown,
  ChevronRight,
  Filter,
  X,
  Laptop,
} from "lucide-react";
import { DOC_SECTIONS, DocItem, DocSection } from "../docs-data";

interface SidebarProps {
  activeDocId: string;
  onSelectDoc: (id: string) => void;
  onCloseMobileMenu?: () => void;
  isMobileDrawer?: boolean;
}

const SECTION_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Compass,
  Zap,
  Globe,
  Layers,
  BookOpen,
  Rocket,
  Library,
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeDocId,
  onSelectDoc,
  onCloseMobileMenu,
  isMobileDrawer = false,
}) => {
  const [filterText, setFilterText] = useState("");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleItemClick = (id: string) => {
    onSelectDoc(id);
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  return (
    <aside className="w-full h-full flex flex-col bg-[#0b0f17] border-r border-[#1e293b]/70 select-none">
      {/* Mobile Drawer Top Bar with Close Button */}
      {isMobileDrawer && (
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b] bg-[#121926]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">Trilha de Aulas</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-semibold">
              TypeScript Hub
            </span>
          </div>
          <button
            onClick={onCloseMobileMenu}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Fechar Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Quick Filter */}
      <div className="p-3.5 border-b border-[#1e293b]/60">
        <div className="relative">
          <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Filtrar aulas e códigos..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-900/90 text-slate-200 placeholder-slate-500 rounded-lg border border-slate-800 focus:outline-none focus:border-brand-500/50 transition"
          />
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {DOC_SECTIONS.map((section: DocSection) => {
          const IconComponent = SECTION_ICONS[section.icon] || Compass;
          const isCollapsed = !filterText && collapsedSections[section.id];

          const filteredItems = section.items.filter((item: DocItem) =>
            item.title.toLowerCase().includes(filterText.toLowerCase())
          );

          if (filterText && filteredItems.length === 0) {
            return null;
          }

          return (
            <div key={section.id} className="space-y-1">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition rounded-md group touch-manipulation"
              >
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4 text-brand-400 group-hover:text-brand-300 transition shrink-0" />
                  <span className="truncate">{section.title}</span>
                </div>
                {!filterText && (
                  <span className="text-slate-500 group-hover:text-slate-300 transition shrink-0">
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </span>
                )}
              </button>

              {/* Items List */}
              {!isCollapsed && (
                <div className="mt-1 space-y-0.5 pl-2 border-l border-slate-800/80 ml-3">
                  {filteredItems.map((item: DocItem) => {
                    const isActive = activeDocId === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full text-left flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition duration-150 touch-manipulation ${
                          isActive
                            ? "bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold shadow-sm shadow-brand-500/5"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 active:bg-slate-800/80"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {item.isCode ? (
                            <FileCode
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? "text-brand-400" : "text-amber-400/80"
                              }`}
                            />
                          ) : (
                            <FileText
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? "text-brand-400" : "text-slate-500"
                              }`}
                            />
                          )}
                          <span className="truncate">{item.title}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold shrink-0 ${
                              item.badge === "TS Code"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : item.badge === "Run Me"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : item.badge === "Anti-pattern"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Drawer Hint */}
      {isMobileDrawer && (
        <div className="p-3 bg-emerald-950/20 border-t border-emerald-500/20 text-[11px] text-emerald-300/80 flex items-center gap-2">
          <Laptop className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Comandos CLI de terminal rodam no PC</span>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 border-t border-[#1e293b]/70 text-[11px] text-slate-500 flex items-center justify-between">
        <span>TypeScript 5.7+</span>
        <span className="text-brand-400 font-mono">100% Strict</span>
      </div>
    </aside>
  );
};
