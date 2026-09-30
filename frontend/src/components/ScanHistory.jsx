import React from 'react';
import { History, Trash2, ArrowUpRight, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';

export default function ScanHistory({ history = [], onSelectUrl, onClearHistory }) {
  if (!history || history.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-6 border border-slate-800/80 text-center space-y-2">
        <div className="flex items-center justify-center text-slate-500 mb-1">
          <History className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-semibold text-slate-300">No Scan History Yet</h4>
        <p className="text-xs text-slate-500">
          Evaluated URLs are stored locally in your browser (last 10 records).
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200">
            Scan History ({history.length}/10)
          </h3>
        </div>

        <button
          onClick={onClearHistory}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {/* History Items List */}
      <div className="space-y-2">
        {history.map((item, idx) => {
          const isPhishing = item.prediction?.toLowerCase() === 'phishing';
          return (
            <div
              key={idx}
              onClick={() => onSelectUrl(item.url)}
              className="group flex items-center justify-between p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/60 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                  isPhishing ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
                }`}>
                  {isPhishing ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-mono text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                    {item.url}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Recent'}
                    </span>
                    <span>•</span>
                    <span className={isPhishing ? 'text-rose-400' : 'text-emerald-400'}>
                      {(item.phishing_probability * 100).toFixed(1)}% Phish
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border ${
                  isPhishing
                    ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                    : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                }`}>
                  {item.risk_level}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
