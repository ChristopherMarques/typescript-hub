import React, { useState } from "react";
import hljs from "highlight.js";
import { Copy, Check, FileCode, Play } from "lucide-react";

interface CodeViewerProps {
  title: string;
  filePath: string;
  code: string;
  runCommand?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  title,
  filePath,
  code,
  runCommand,
}) => {
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const highlightedCode = React.useMemo(() => {
    return hljs.highlight(code, { language: "typescript" }).value;
  }, [code]);

  const lines = code.split("\n");

  const copyFileToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const copyCommandToClipboard = async () => {
    if (!runCommand) return;
    await navigator.clipboard.writeText(runCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Path */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md w-fit mb-3">
          <FileCode className="w-3.5 h-3.5" />
          <span>TypeScript Source File</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">{title}</h1>
        <p className="text-xs font-mono text-slate-400 mt-1">{filePath}</p>
      </div>

      {/* CLI Run Banner (Mintlify callout style) */}
      {runCommand && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 mt-0.5 sm:mt-0">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-emerald-400 tracking-wider">Como Executar no Terminal (PC)</span>
              <p className="text-sm font-mono text-emerald-200 mt-0.5 break-all">{runCommand}</p>
              <p className="text-[11px] text-slate-400 sm:hidden mt-1">
                💻 Execute este comando no terminal da sua máquina com Node.js instalado.
              </p>
            </div>
          </div>

          <button
            onClick={copyCommandToClipboard}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-300 bg-emerald-900/60 hover:bg-emerald-800/80 active:bg-emerald-700/80 border border-emerald-500/40 rounded-lg transition"
          >
            {copiedCmd ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Comando</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Code Editor Container */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d121c] overflow-hidden shadow-2xl">
        {/* Editor Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#131a27] border-b border-slate-800/80 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
            <span className="ml-2 text-slate-300 font-semibold">{filePath.split("/").pop()}</span>
            <span className="text-slate-500">({lines.length} linhas)</span>
          </div>

          <button
            onClick={copyFileToClipboard}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-sans text-xs"
          >
            {copiedFile ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Código Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Todo o Código</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <pre className="p-6 overflow-x-auto text-xs sm:text-sm text-slate-200 bg-[#0b0f17] leading-relaxed">
          <code
            className="font-mono"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  );
};
