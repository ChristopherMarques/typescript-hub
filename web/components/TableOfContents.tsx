import React from "react";
import { ListTree } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const headings = React.useMemo(() => {
    const items: TocItem[] = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1]!.length; // 2 ou 3
        const rawText = match[2]!.replace(/[*_`]/g, "").trim();
        // Gera ID slug amigável
        const id = rawText
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");

        items.push({ id, text: rawText, level });
      }
    }

    return items;
  }, [content]);

  if (headings.length === 0) {
    return null;
  }

  const scrollToHeading = (text: string) => {
    // Procura por um h2 ou h3 cujo texto coincida
    const headers = document.querySelectorAll("h2, h3");
    for (const h of Array.from(headers)) {
      if (h.textContent?.includes(text)) {
        h.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
    }
  };

  return (
    <div className="w-64 hidden xl:block shrink-0 pl-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
        <ListTree className="w-3.5 h-3.5 text-brand-400" />
        <span>Nesta Página</span>
      </div>

      <nav className="space-y-1 text-xs border-l border-slate-800/80">
        {headings.map((h, i) => (
          <button
            key={i}
            onClick={() => scrollToHeading(h.text)}
            className={`block w-full text-left truncate py-1.5 transition ${
              h.level === 3 ? "pl-6 text-slate-500 hover:text-slate-300" : "pl-3 text-slate-400 hover:text-brand-400"
            }`}
          >
            {h.text}
          </button>
        ))}
      </nav>
    </div>
  );
};

