import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { MarkdownRenderer } from "./components/MarkdownRenderer";
import { CodeViewer } from "./components/CodeViewer";
import { TableOfContents } from "./components/TableOfContents";
import { SearchModal } from "./components/SearchModal";
import { CliModal } from "./components/CliModal";
import { ALL_DOCS, getFileContent, DocItem } from "./docs-data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GithubIcon } from "./components/GithubIcon";

export const App: React.FC = () => {
  // Estado do documento ativo sincronizado com a hash da URL
  const [activeDocId, setActiveDocId] = useState<string>(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && ALL_DOCS.some((d: DocItem) => d.id === hash)) {
      return hash;
    }
    return "readme";
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [cliModalOpen, setCliModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sincroniza hash da URL quando o activeDocId muda
  useEffect(() => {
    window.location.hash = activeDocId;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeDocId]);

  // Listener para atalho de teclado Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Encontra o item ativo
  const currentDocIndex = ALL_DOCS.findIndex((d: DocItem) => d.id === activeDocId);
  const currentDoc: DocItem = ALL_DOCS[currentDocIndex] || ALL_DOCS[0]!;

  const prevDoc = currentDocIndex > 0 ? ALL_DOCS[currentDocIndex - 1] : null;
  const nextDoc = currentDocIndex < ALL_DOCS.length - 1 ? ALL_DOCS[currentDocIndex + 1] : null;

  // Carrega o conteúdo do arquivo
  const fileContent = getFileContent(currentDoc.filePath);

  // Navegação a partir de links internos do markdown
  const handleNavigateToDoc = (href: string) => {
    const cleanHref = href.replace(/^[./\\]+/, "").replace(/\\/g, "/");
    const matched = ALL_DOCS.find(
      (d: DocItem) =>
        d.filePath.endsWith(cleanHref) ||
        cleanHref.endsWith(d.filePath) ||
        d.filePath.includes(cleanHref)
    );
    if (matched) {
      setActiveDocId(matched.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navbar Superior */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        onOpenTestModal={() => setCliModalOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Desktop */}
        <div className="w-72 hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <Sidebar
            activeDocId={activeDocId}
            onSelectDoc={(id: string) => setActiveDocId(id)}
          />
        </div>

        {/* Sidebar Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-80 max-w-full h-full bg-[#0b0f17] shadow-2xl">
              <Sidebar
                activeDocId={activeDocId}
                onSelectDoc={(id: string) => setActiveDocId(id)}
                onCloseMobileMenu={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Artigo Central */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 max-w-4xl">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
            <span>TypeScript Hub</span>
            <span>/</span>
            <span className="text-slate-400 capitalize">{currentDoc.filePath.split("/")[0]}</span>
            <span>/</span>
            <span className="text-brand-400 truncate">{currentDoc.title}</span>
          </div>

          {/* Conteúdo Principal (Código ou Markdown) */}
          <article className="min-h-[60vh]">
            {currentDoc.isCode ? (
              <CodeViewer
                title={currentDoc.title}
                filePath={currentDoc.filePath}
                code={fileContent}
                runCommand={currentDoc.runCommand}
              />
            ) : (
              <MarkdownRenderer
                content={fileContent}
                onNavigateToDoc={handleNavigateToDoc}
              />
            )}
          </article>

          {/* Navegação Anterior / Próximo (Mintlify Style) */}
          <div className="mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevDoc ? (
              <button
                onClick={() => setActiveDocId(prevDoc.id)}
                className="group flex flex-col items-start p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-700 transition text-left"
              >
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 group-hover:text-brand-400 transition">
                  <ChevronLeft className="w-3.5 h-3.5" /> Lição Anterior
                </span>
                <span className="text-sm font-semibold text-white mt-1 group-hover:text-brand-300 transition">
                  {prevDoc.title}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextDoc && (
              <button
                onClick={() => setActiveDocId(nextDoc.id)}
                className="group flex flex-col items-end p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-700 transition text-right sm:col-start-2"
              >
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 group-hover:text-brand-400 transition">
                  Próxima Lição <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-sm font-semibold text-white mt-1 group-hover:text-brand-300 transition">
                  {nextDoc.title}
                </span>
              </button>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-6 pb-12 border-t border-slate-800/60 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              Desenvolvido por{" "}
              <a
                href="https://github.com/ChristopherMarques"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-brand-400 font-semibold underline underline-offset-2 transition"
              >
                Christopher Marques
              </a>
              . Licença MIT.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ChristopherMarques/typescript-hub"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-300 transition flex items-center gap-1"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Repositório GitHub</span>
              </a>
            </div>
          </footer>
        </main>

        {/* Tabela de Conteúdos da Página (Direita) */}
        {!currentDoc.isCode && <TableOfContents content={fileContent} />}
      </div>

      {/* Modais Globais */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectDoc={(id: string) => setActiveDocId(id)}
      />

      <CliModal
        isOpen={cliModalOpen}
        onClose={() => setCliModalOpen(false)}
      />
    </div>
  );
};
