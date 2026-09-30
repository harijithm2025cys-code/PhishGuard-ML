import React from 'react';
import { Search, ShieldAlert, Sparkles, X, ArrowRight, Lock } from 'lucide-react';

const DEMO_URLS = [
  { label: 'Google (Legit)', url: 'https://www.google.com', type: 'legit' },
  { label: 'Wikipedia (Legit)', url: 'https://www.wikipedia.org', type: 'legit' },
  { label: 'Account Verify (Test)', url: 'http://secure-account-verify.example.invalid/login', type: 'phish' },
  { label: 'Raw IP Verify (Test)', url: 'http://192.0.2.10/account/verify/login', type: 'phish' },
];

export default function URLScanner({ 
  url, 
  setUrl, 
  onScan, 
  isScanning, 
  error 
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim() || isScanning) return;
    onScan(url.trim());
  };

  const handleSelectDemo = (demoUrl) => {
    setUrl(demoUrl);
    onScan(demoUrl);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-xl shadow-cyan-950/40 p-2 sm:p-2.5 transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-cyan-500/20 focus-within:shadow-2xl">
          
          <div className="pl-3 pr-2 text-cyan-400">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 opacity-75" />
          </div>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a URL to analyze (e.g. https://www.google.com or suspicious link)..."
            disabled={isScanning}
            className="w-full bg-transparent px-2 py-2 sm:py-2.5 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono"
          />

          {url && !isScanning && (
            <button
              type="button"
              onClick={() => setUrl('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={!url.trim() || isScanning}
            className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide uppercase transition-all duration-300 ${
              isScanning
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <span>{isScanning ? 'Analyzing...' : 'Analyze URL'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Input Error Message */}
        {error && (
          <div className="mt-2.5 flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs sm:text-sm">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Demo Mode Selector (Requirement 39) */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400/90 font-semibold uppercase tracking-wider mr-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Demo Only:</span>
        </div>
        
        {DEMO_URLS.map((demo, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectDemo(demo.url)}
            disabled={isScanning}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-mono transition-all duration-200 ${
              demo.type === 'legit'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300 hover:bg-rose-900/60 hover:border-rose-400'
            }`}
          >
            {demo.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
        <Lock className="w-3 h-3 text-cyan-500/80" />
        <span>Safe Static Analysis: URL characters are inspected directly without establishing network connections.</span>
      </div>
    </div>
  );
}
