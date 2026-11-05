import React, { useState } from "react";
import { Terminal, Copy, Check, X } from "lucide-react";

interface CliModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CliCommand {
  label: string;
  command: string;
  description: string;
  tag: string;
}

const COMMANDS: CliCommand[] = [
  {
    label: "Projeto Hands-On Completo",
    command: "npm run start:project",
    description: "Executa o mini-sistema comercial completo com validação de schemas, entidades ricas e Motion Timeline animada.",
    tag: "Hands-on",
  },
  {
    label: "Fundamentos: Primitivos e Tuplas",
    command: "npm run play:basics",
    description: "Testa inferência, imutabilidade, readonly arrays e const assertions (as const).",
    tag: "Módulo 01",
  },
  {
    label: "Generics: Sawabona-Forms Pattern",
    command: "npm run play:generics",
    description: "Executa o motor genérico de validação de schemas e inferência estrita.",
    tag: "Módulo 01",
  },
  {
    label: "Unions: Motion State Machine",
    command: "npm run play:unions",
    description: "Executa a máquina de estados finitos inspirada no sawabona-motion-engine com curvas de interpolação.",
    tag: "Módulo 01",
  },
  {
    label: "Anti-padrão: Violações do SOLID",
    command: "npm run play:solid:violations",
    description: "Mostra a God Class acoplada violando SRP, OCP, LSP, ISP e DIP.",
    tag: "Módulo 03",
  },
  {
    label: "Clean Code: Sistema Refatorado",
    command: "npm run play:solid",
    description: "Executa o mesmo sistema comercial com inversão de dependência e desacoplamento total.",
    tag: "Módulo 03",
  },
  {
    label: "Typecheck Estrito do Projeto",
    command: "npm run typecheck",
    description: "Roda tsc --noEmit para validar que 100% dos tipos compilam com zero erros.",
    tag: "Type Safety",
  },
  {
    label: "Executar Toda a Suíte",
    command: "npm run test:all",
    description: "Roda a checagem de tipos e todos os laboratórios do hub em sequência.",
    tag: "All Tests",
  },
];

export const CliModal: React.FC<CliModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = async (cmd: string) => {
    await navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0f141d] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#141b27] border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Comandos CLI do TypeScript Hub</h2>
              <p className="text-xs text-slate-400">Todos os scripts prontos para rodar no seu terminal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Notice inside modal */}
        <div className="mx-4 mt-4 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
          <span className="text-base shrink-0">💻</span>
          <p>
            <strong>Atenção:</strong> Estes comandos são feitos para rodar no terminal do seu computador com Node.js. No celular você pode consultar a função de cada um e copiá-los para sua máquina.
          </p>
        </div>

        {/* Content list */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {COMMANDS.map((c) => (
            <div
              key={c.command}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{c.label}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {c.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
                <code className="text-xs font-mono text-emerald-400 block pt-1">{c.command}</code>
              </div>

              <button
                onClick={() => copyToClipboard(c.command)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                {copiedCmd === c.command ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0b0f17] border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Requer Node.js 22+ e npm</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
