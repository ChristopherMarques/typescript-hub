import React, { useState, useEffect, useRef } from "react";
import { Search, X, FileText, FileCode } from "lucide-react";
import { ALL_DOCS, getFileContent } from "../docs-data";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDoc: (id: string) => void;
}

interface SearchResult {
  id: string;
  title: string;
  sectionTitle: string;
  isCode?: boolean;
  matchedSnippet: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectDoc,
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Foco automático ao abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Tecla Escape para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Busca em tempo real nos títulos e conteúdos dos arquivos
  const results: SearchResult[] = React.useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const matches: SearchResult[] = [];

    for (const doc of ALL_DOCS) {
      const content = getFileContent(doc.filePath);
      const titleMatch = doc.title.toLowerCase().includes(lowerQuery);
      const contentLower = content.toLowerCase();
      const contentMatchIndex = contentLower.indexOf(lowerQuery);

      if (titleMatch || contentMatchIndex !== -1) {
        let snippet = "";
        if (contentMatchIndex !== -1) {
          const start = Math.max(0, contentMatchIndex - 40);
          const end = Math.min(content.length, contentMatchIndex + 80);
          snippet = "..." + content.slice(start, end).replace(/\n/g, " ") + "...";
        } else {
          snippet = content.slice(0, 100).replace(/\n/g, " ") + "...";
        }

        matches.push({
          id: doc.id,
          title: doc.title,
          sectionTitle: doc.sectionTitle,
          isCode: doc.isCode,
          matchedSnippet: snippet,
        });

        if (matches.length >= 10) break; // Limite para máxima velocidade
      }
    }

    return matches;
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0f141d] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-[#141b27]">
          <Search className="w-5 h-5 text-brand-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Digite para buscar conceitos, SOLID, Generics, UseCases..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {query && results.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-500">
              Nenhum resultado encontrado para "<span className="text-slate-300">{query}</span>".
            </div>
          )}

          {!query && (
            <div className="p-6 text-xs text-slate-500 flex flex-col gap-2">
              <span className="font-semibold text-slate-400 uppercase tracking-wider">Dicas Rápidas de Busca</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {["Discriminated Unions", "Generics", "SRP", "LSP", "Clean Architecture", "Product Entity"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition text-[11px]"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {results.map((res) => (
            <button
              key={res.id}
              onClick={() => {
                onSelectDoc(res.id);
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-800/60 transition group flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {res.isCode ? (
                    <FileCode className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-brand-400 shrink-0" />
                  )}
                  <span className="text-sm font-semibold text-white group-hover:text-brand-300 transition">
                    {res.title}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  {res.sectionTitle}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 pl-6 font-mono leading-relaxed">
                {res.matchedSnippet}
              </p>
            </button>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-[#0b0f17] border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">Enter</kbd> para selecionar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">Esc</kbd> para fechar
            </span>
          </div>
          <span className="text-brand-400 font-semibold">Busca Full-Text Ativa</span>
        </div>
      </div>
    </div>
  );
};
