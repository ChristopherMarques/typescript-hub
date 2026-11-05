import React, { useState, useEffect } from "react";
import { Laptop, X } from "lucide-react";

export const MobileNoticeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("ts_hub_mobile_notice_dismissed");
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("ts_hub_mobile_notice_dismissed", "true");
  };

  if (dismissed) return null;

  return (
    <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 to-slate-900/60 shadow-lg text-slate-300 relative animate-in fade-in duration-200">
      <div className="flex items-start gap-3 pr-6">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 mt-0.5">
          <Laptop className="w-4 h-4" />
        </div>
        <div className="text-xs leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-300 text-sm">
            <span>Modo de Leitura Mobile</span>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Dica
            </span>
          </div>
          <p className="text-slate-300 text-xs">
            Esta interface foi pensada para você ler toda a teoria e explicações com tranquilidade no celular.
          </p>
          <p className="text-slate-400 text-xs">
            ⚠️ <strong>Importante:</strong> Para rodar os comandos no terminal (<code className="text-emerald-300 font-mono text-[11px]">npm run ...</code>) e praticar com a tipagem estrita, acesse o repositório em um computador com Node.js instalado.
          </p>
        </div>
      </div>

      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition"
        aria-label="Dispensar aviso"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
