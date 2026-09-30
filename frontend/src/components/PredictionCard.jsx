import React from 'react';
import { ShieldCheck, ShieldAlert, Clock, Cpu, Info } from 'lucide-react';
import RiskScore from './RiskScore';

export default function PredictionCard({ predictionData }) {
  if (!predictionData) return null;

  const {
    url,
    prediction,
    phishing_probability,
    legitimate_probability,
    risk_level,
    model,
    timestamp,
    disclaimer
  } = predictionData;

  const isPhishing = prediction?.toLowerCase() === 'phishing';

  // Ensure legitimate_probability is mathematically 1 - phishing_probability
  const phishProb = typeof phishing_probability === 'number' ? phishing_probability : 0;
  const legitProb = typeof legitimate_probability === 'number' ? legitimate_probability : (1.0 - phishProb);

  const phishDisplay = (phishProb * 100).toFixed(2);
  const legitDisplay = (legitProb * 100).toFixed(2);

  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-500 glass-card border ${
      risk_level === 'HIGH'
        ? 'border-rose-500/40 cyber-glow-red' 
        : risk_level === 'MEDIUM'
        ? 'border-amber-500/40 cyber-glow-amber'
        : 'border-emerald-500/40 cyber-glow-green'
    }`}>
      
      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${
            isPhishing ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
          }`}>
            {isPhishing ? (
              <ShieldAlert className="w-8 h-8" />
            ) : (
              <ShieldCheck className="w-8 h-8" />
            )}
          </div>
          <div>
            <div className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold">
              Threat Analysis Result
            </div>
            <div className={`text-2xl sm:text-3xl font-black tracking-wider uppercase font-mono ${
              isPhishing ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {prediction}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase border ${
            risk_level === 'HIGH'
              ? 'bg-rose-950/70 border-rose-500/50 text-rose-300'
              : risk_level === 'MEDIUM'
              ? 'bg-amber-950/70 border-amber-500/50 text-amber-300'
              : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
          }`}>
            {risk_level} RISK
          </span>
        </div>
      </div>

      {/* URL Display (Escaped, non-clickable for safety) */}
      <div className="mt-5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>Analyzed Target URL:</span>
          <span className="text-[10px] text-cyan-400/80">Static Text Analysis</span>
        </div>
        <div className="font-mono text-xs sm:text-sm text-slate-200 break-all select-all">
          {url}
        </div>
      </div>

      {/* Middle Grid: Gauge + Statistical Breakdown */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Circular Gauge */}
        <div className="md:col-span-5 flex justify-center">
          <RiskScore 
            phishingProbability={phishProb} 
            riskLevel={risk_level} 
          />
        </div>

        {/* Probabilities and Metrics Breakdown */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Phishing Probability Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Phishing Probability</span>
              <span className="font-bold text-rose-400 font-mono">
                {phishDisplay}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-red-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, phishProb * 100))}%` }}
              />
            </div>
          </div>

          {/* Legitimate Probability Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Legitimate Probability (1 - Phishing)</span>
              <span className="font-bold text-emerald-400 font-mono">
                {legitDisplay}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, legitProb * 100))}%` }}
              />
            </div>
          </div>

          {/* Model & Timestamp Tags */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mb-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Model</span>
              </div>
              <div className="text-xs font-semibold text-slate-200">
                {model || 'TF-IDF + Logistic Regression'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mb-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Timestamp</span>
              </div>
              <div className="text-xs font-mono text-slate-300">
                {timestamp ? new Date(timestamp).toLocaleTimeString() : 'Just now'}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Safety Disclaimer (Requirement 12) */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400/80 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {disclaimer || "Risk is a model-based estimate from URL characteristics. It is not proof that a URL is safe or malicious."}
        </p>
      </div>

    </div>
  );
}
