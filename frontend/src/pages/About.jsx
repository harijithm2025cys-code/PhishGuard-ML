import React from 'react';
import { ShieldCheck, Database, Cpu, Code2, AlertTriangle, BookOpen, Layers, ExternalLink } from 'lucide-react';

export default function About() {
  const projectDetails = [
    { label: 'Project Name', value: 'PhishGuard AI' },
    { label: 'Academic Scope', value: 'II Year Cybersecurity Machine Learning Hackathon' },
    { label: 'Category', value: 'Machine Learning for Cybersecurity Threat Detection' },
    { label: 'Core Problem', value: 'Malicious and deceptive phishing URL classification' },
    { label: 'Primary Model', value: 'Character-level TF-IDF + Logistic Regression' },
    { label: 'Dataset', value: 'PhiUSIIL Phishing URL Dataset (UCI ML Repository, 235,795 URLs)' },
    { label: 'Model Accuracy', value: '99.65% on 47,074 unseen test URLs' },
    { label: 'Analysis Mode', value: '100% Air-Gapped Static URL Lexical Analysis (Zero network calls)' },
  ];

  const techStack = [
    { name: 'Python 3.12', role: 'Core runtime & machine learning development' },
    { name: 'Scikit-learn', role: 'TF-IDF vectorization & Logistic Regression classifier' },
    { name: 'FastAPI & Uvicorn', role: 'High-performance asynchronous REST backend' },
    { name: 'Pandas & NumPy', role: 'Dataset auditing, cleaning, and mathematical operations' },
    { name: 'React 19 & Vite', role: 'Modern, fast reactive frontend interface' },
    { name: 'Tailwind CSS v4', role: 'Futuristic cybersecurity dark-mode design system' },
    { name: 'Three.js', role: '3D interactive cyber globe and particle network visualizer' },
    { name: 'Lucide React', role: 'Crisp cybersecurity iconography' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academic Hackathon Specification</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
          About PhishGuard AI
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          An explainable, robust machine learning system designed to protect users against malicious URLs by inspecting their character anatomy.
        </p>
      </div>

      {/* Project Overview Table */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/80 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Project Specifications</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {projectDetails.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {item.label}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/80 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-sky-400" />
          <span>Technology Stack</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {techStack.map((tech, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-3">
              <Code2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-200">{tech.name}</span>
                <p className="text-xs text-slate-400 mt-0.5">{tech.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset Attribution */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/80 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" />
          <span>Dataset Citation & Source</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Trained on the <strong>PhiUSIIL Phishing URL Dataset</strong>, published via the UCI Machine Learning Repository.
          The dataset provides a comprehensive, modern collection of both legitimate enterprise websites and verified phishing campaign URLs.
        </p>
        <div className="pt-2">
          <a
            href="https://archive.ics.uci.edu/dataset/967/phiusiil+phishing+url+dataset"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-500/30"
          >
            <span>UCI Dataset Catalog Entry</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Honest Limitations & Future Scope */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/80 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>System Limitations & Future Scope</span>
        </h3>
        
        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>Current Limitations:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
            <li>URL shorteners (e.g. bit.ly, tinyurl) mask target lexical characteristics.</li>
            <li>Static analysis does not detect compromised benign web servers hosting phishing forms on legitimate domains.</li>
            <li>Zero-day obfuscation techniques may disguise character patterns.</li>
          </ul>

          <p className="pt-2">
            <strong>Future Enhancements:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
            <li>Lightweight Chrome / Edge browser extension for active browsing protection.</li>
            <li>Real-time threat intelligence feed aggregation (PhishTank, OpenPhish, VirusTotal).</li>
            <li>Safe server-side redirect chain unwinding for shortened URLs.</li>
            <li>Explainable AI (SHAP / LIME) visual feature attribution overlays.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
