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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0f17]/85 border-b border-[#1e293b]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a href="#readme" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition duration-300">
              <span className="font-mono font-extrabold text-white text-base tracking-tighter">TS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base tracking-tight flex items-center gap-2">
                TypeScript Hub
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  Docs 2026
                </span>
              </span>
            </div>
          </a>
        </div>

        {/* Global Search Bar (Mintlify Style) */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl transition duration-200 group shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition" />
              <span>Pesquisar na documentação e código...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Action Items */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            aria-label="Pesquisar"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenTestModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-lg transition shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5 text-brand-400" />
            <span>CLI Scripts</span>
          </button>

          <a
            href="https://github.com/ChristopherMarques/typescript-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden md:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
