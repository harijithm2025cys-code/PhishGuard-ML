import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, BarChart2, Layers, Award, Shield, RefreshCw } from 'lucide-react';

export default function ModelMetrics({ modelInfo }) {
  const metrics = modelInfo?.metrics || {};
  const comparison = metrics?.comparison || [];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/80 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              Machine Learning Model Performance
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Trained on PhiUSIIL Phishing URL Dataset (235,795 records)
            </p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono">
          Evaluated on 47,074 Test URLs
        </span>
      </div>

      {/* Model Spec Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Input Type</span>
          <p className="text-xs font-semibold text-slate-200 mt-0.5">Raw URL String</p>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Feature Vector</span>
          <p className="text-xs font-semibold text-cyan-300 mt-0.5">Char TF-IDF (3-5 n-grams)</p>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Classifier</span>
          <p className="text-xs font-semibold text-slate-200 mt-0.5">Logistic Regression</p>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Output</span>
          <p className="text-xs font-semibold text-emerald-300 mt-0.5">Phishing Probability</p>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 text-center">
          <span className="text-xs text-slate-400 font-mono">Accuracy</span>
          <div className="text-2xl font-black text-cyan-300 font-mono mt-1">
            {metrics.accuracy ? `${(metrics.accuracy * 100).toFixed(2)}%` : '---'}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Overall correct</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-sky-500/20 text-center">
          <span className="text-xs text-slate-400 font-mono">Precision</span>
          <div className="text-2xl font-black text-sky-300 font-mono mt-1">
            {metrics.precision ? `${(metrics.precision * 100).toFixed(2)}%` : '---'}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Low false alarms</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20 text-center">
          <span className="text-xs text-slate-400 font-mono">Recall</span>
          <div className="text-2xl font-black text-indigo-300 font-mono mt-1">
            {metrics.recall ? `${(metrics.recall * 100).toFixed(2)}%` : '---'}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Phishing detected</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-purple-500/20 text-center">
          <span className="text-xs text-slate-400 font-mono">F1 Score</span>
          <div className="text-2xl font-black text-purple-300 font-mono mt-1">
            {metrics.f1 ? `${(metrics.f1 * 100).toFixed(2)}%` : '---'}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Harmonic balance</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/20 text-center col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-400 font-mono">Log Loss</span>
          <div className="text-2xl font-black text-emerald-300 font-mono mt-1">
            {metrics.log_loss !== undefined ? metrics.log_loss.toFixed(4) : '---'}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Cross-entropy</span>
        </div>
      </div>

      {/* Model Comparison Table (Requirement 35) */}
      {comparison && comparison.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-slate-200">
              Academic Model Comparison
            </h4>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Accuracy</th>
                  <th className="px-4 py-3">Precision</th>
                  <th className="px-4 py-3">Recall</th>
                  <th className="px-4 py-3">F1 Score</th>
                  <th className="px-4 py-3">Log Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                {comparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-200 flex items-center gap-1.5">
                      {row.model === 'Logistic Regression' && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      )}
                      <span>{row.model}</span>
                    </td>
                    <td className="px-4 py-3 text-cyan-300">{(row.accuracy * 100).toFixed(2)}%</td>
                    <td className="px-4 py-3 text-sky-300">{(row.precision * 100).toFixed(2)}%</td>
                    <td className="px-4 py-3 text-indigo-300">{(row.recall * 100).toFixed(2)}%</td>
                    <td className="px-4 py-3 text-purple-300">{(row.f1 * 100).toFixed(2)}%</td>
                    <td className="px-4 py-3 text-emerald-300">{row.log_loss.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            * Objective measurements calculated on identical 47,074 stratified test samples. No model is artificially declared "best".
          </p>
        </div>
      )}

    </div>
  );
}
