import React from "react";
import { Search, Terminal, Menu, X } from "lucide-react";
import { GithubIcon } from "./GithubIcon";

interface NavbarProps {
  onOpenSearch: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onOpenTestModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  mobileMenuOpen,
  onToggleMobileMenu,
  onOpenTestModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0f17]/90 border-b border-[#1e293b]/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition shrink-0"
            aria-label="Abrir Menu de Navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-brand-400" /> : <Menu className="w-5 h-5" />}
          </button>

          <a href="#readme" className="flex items-center gap-2.5 group min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition duration-300 shrink-0">
              <span className="font-mono font-extrabold text-white text-sm sm:text-base tracking-tighter">TS</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-white text-sm sm:text-base tracking-tight truncate">
                TypeScript Hub
              </span>
              <span className="hidden lg:inline-flex text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20 shrink-0">
                Docs 2026
              </span>
            </div>
          </a>
        </div>

        {/* Global Search Bar (Visível apenas em telas médias e grandes md+) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl transition duration-200 group shadow-inner"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Search className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition shrink-0" />
              <span className="truncate">Pesquisar na documentação...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Action Items */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Botão de Pesquisa Mobile (ícone limpo) */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            aria-label="Pesquisar na documentação"
          >
            <Search className="w-5 h-5 text-brand-400" />
          </button>

          {/* Botão de Scripts CLI (somente telas médias md+) */}
          <button
            onClick={onOpenTestModal}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-lg transition shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5 text-brand-400" />
            <span>CLI Scripts</span>
          </button>

          {/* Link para o GitHub */}
          <a
            href="https://github.com/ChristopherMarques/typescript-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition shrink-0"
            aria-label="Abrir repositório no GitHub"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
