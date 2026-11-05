import React, { useEffect, useRef } from "react";
import { marked } from "marked";
import hljs from "highlight.js";

interface MarkdownRendererProps {
  content: string;
  onNavigateToDoc?: (docPath: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  onNavigateToDoc,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Configuração customizada do marked
  useEffect(() => {
    // Configura opções do marked
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
  }, []);

  const renderedHtml = React.useMemo(() => {
    return marked.parse(content) as string;
  }, [content]);

  // Pós-processamento de blocos de código com Highlight.js e botões de cópia
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Aplica syntax highlighting a todos os blocos de código
    const codeBlocks = containerRef.current.querySelectorAll("pre code");
    codeBlocks.forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });

    // 2. Adiciona botões de cópia interativos acima de cada <pre>
    const preBlocks = containerRef.current.querySelectorAll("pre");
    preBlocks.forEach((pre) => {
      // Evita duplicar se já foi adicionado
      if (pre.parentElement?.classList.contains("code-block-wrapper")) return;

      const codeElem = pre.querySelector("code");
      const codeText = codeElem?.textContent || "";
      const classNames = codeElem?.className || "";
      const langMatch = classNames.match(/language-(\w+)/);
      const language = langMatch ? langMatch[1] : "code";

      // Cria container estilizado (Mintlify style)
      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper my-6 rounded-xl overflow-hidden border border-slate-800 bg-[#0d121b] shadow-xl";

      // Header com nome da linguagem e botão de copiar
      const header = document.createElement("div");
      header.className = "flex items-center justify-between px-4 py-2 bg-[#121926] border-b border-slate-800/80 text-xs text-slate-400 font-mono";

      const langSpan = document.createElement("span");
      langSpan.className = "flex items-center gap-1.5 uppercase font-semibold text-slate-300";
      langSpan.innerHTML = `<span class="w-2 h-2 rounded-full bg-brand-500 inline-block"></span> ${language}`;

      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-btn flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition font-sans text-xs";
      copyBtn.innerHTML = `<span>Copiar</span>`;

      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(codeText);
          copyBtn.innerHTML = `<span class="text-emerald-400">✓ Copiado!</span>`;
          setTimeout(() => {
            copyBtn.innerHTML = `<span>Copiar</span>`;
          }, 2000);
        } catch {
          // Fallback
        }
      });

      header.appendChild(langSpan);
      header.appendChild(copyBtn);

      // Envelopa o pre
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      pre.className = "p-4 overflow-x-auto text-sm text-slate-200 bg-transparent";
    });

    // 3. Intercepta links internos em Markdown para navegar dentro da SPA
    const links = containerRef.current.querySelectorAll("a");
    links.forEach((a) => {
      const href = a.getAttribute("href");
      if (href && (href.endsWith(".md") || href.endsWith(".ts"))) {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          if (onNavigateToDoc) {
            onNavigateToDoc(href);
          }
        });
      }
    });
  }, [renderedHtml, onNavigateToDoc]);

  return (
    <div
      ref={containerRef}
      className="markdown-body max-w-none text-slate-300"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
