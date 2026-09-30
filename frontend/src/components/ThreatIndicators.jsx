import React from 'react';
import { AlertTriangle, CheckCircle, Info, Eye } from 'lucide-react';

export default function ThreatIndicators({ indicators = [], prediction = 'legitimate' }) {
  const isPhishing = prediction?.toLowerCase() === 'phishing';

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
          <Eye className={`w-5 h-5 ${isPhishing ? 'text-amber-400' : 'text-cyan-400'}`} />
          <span className="tracking-wide uppercase font-mono text-sm sm:text-base">
            OBSERVABLE URL INDICATORS
          </span>
        </h3>
        <span className="text-[11px] font-mono text-slate-400">
          Structural Context
        </span>
      </div>

      <div className="space-y-2.5">
        {indicators && indicators.length > 0 ? (
          indicators.map((ind, idx) => {
            const isCleanNotice = ind.toLowerCase().includes('no obvious');
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-colors ${
                  isCleanNotice
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                }`}
              >
                {isCleanNotice ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-semibold mr-1 font-mono">
                    {isCleanNotice ? '[CLEAN]' : '[OBSERVED]'}
                  </span>
                  <span>{ind}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs sm:text-sm">
            <Info className="w-4 h-4 text-slate-400" />
            <span>No obvious lexical indicators detected.</span>
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-400 font-mono italic pt-1 leading-relaxed border-t border-slate-800/80">
        * These indicators are explanations based purely on observable URL characteristics and must not be presented as proof that the URL is malicious.
      </div>
    </div>
  );
}
