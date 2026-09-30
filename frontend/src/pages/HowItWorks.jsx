import React from 'react';
import { 
  Keyboard, Sparkles, FolderTree, Binary, Cpu, 
  Percent, ShieldCheck, ArrowDown, Lock, Shield 
} from 'lucide-react';

const PIPELINE_STEPS = [
  {
    step: '1',
    title: 'Enter URL',
    subtitle: 'User Input Handling',
    desc: 'The user supplies a candidate URL string via the interface or API. The input is treated strictly as untrusted text. No HTTP connection, DNS resolution, or web crawling is ever initiated.',
    icon: Keyboard,
    color: 'from-cyan-500 to-blue-500',
    details: 'Treating the URL strictly as text eliminates the cybersecurity risk of opening malicious domains or executing exploit payloads.'
  },
  {
    step: '2',
    title: 'Preprocess & Clean',
    subtitle: 'URL String Normalization',
    desc: 'The URL string is trimmed of extraneous whitespace, stripped of surrounding quotes or brackets, and prepared for static analysis. Original character casing and punctuation are preserved to preserve deceptive character sequences.',
    icon: Sparkles,
    color: 'from-blue-500 to-indigo-500',
    details: 'Phishing URLs frequently use subtle casing or punctuation changes to deceive victims. Casing patterns are kept intact.'
  },
  {
    step: '3',
    title: 'Extract Lexical Characteristics',
    subtitle: 'Static Structural Metrics',
    desc: 'Fourteen structural and lexical characteristics are extracted: URL length, domain length, path length, dot count, hyphen count, slash count, digit count, special character density, subdomain depth, protocol scheme, IPv4 host detection, and auth keywords.',
    icon: FolderTree,
    color: 'from-indigo-500 to-purple-500',
    details: 'These features power the human-readable explanation engine and dashboard telemetry cards.'
  },
  {
    step: '4',
    title: 'Character TF-IDF Representation',
    subtitle: 'N-gram Pattern Extraction',
    desc: 'A character-level TF-IDF (Term Frequency-Inverse Document Frequency) vectorizer transforms the URL characters into a 50,000-dimensional sparse feature vector using sublinear TF and n-gram ranges from 3 to 5 characters.',
    icon: Binary,
    color: 'from-purple-500 to-fuchsia-500',
    details: 'Character n-grams capture deceptive patterns like "paypa1", "sec-login", or unusual subdomain concatenations without needing rigid dictionaries.'
  },
  {
    step: '5',
    title: 'Logistic Regression Classification',
    subtitle: 'Linear Decision Boundary',
    desc: 'The high-dimensional TF-IDF vector is fed into a scikit-learn Logistic Regression classifier. The model applies learned weights and a bias term via the sigmoid link function to separate legitimate from phishing patterns.',
    icon: Cpu,
    color: 'from-fuchsia-500 to-pink-500',
    details: 'Logistic regression provides fast, mathematically sound probability estimates with zero risk of catastrophic overfitting.'
  },
  {
    step: '6',
    title: 'Probability Estimation',
    subtitle: 'predict_proba() Calculation',
    desc: 'The model produces continuous calibrated probability scores: legitimate_probability and phishing_probability, which sum to 1.0. A decision threshold of 0.50 assigns the primary binary class.',
    icon: Percent,
    color: 'from-pink-500 to-rose-500',
    details: 'Probabilities provide nuanced insight into how strongly the model associates the character patterns with phishing.'
  },
  {
    step: '7',
    title: 'Risk Display & Threat Explanation',
    subtitle: 'Interactive SOC Dashboard',
    desc: 'The probability score is mapped to a presentation risk band (LOW: 0-29%, MEDIUM: 30-69%, HIGH: 70-100%). The circular gauge, 3D threat globe, and observable lexical indicators display the complete threat profile to the user.',
    icon: ShieldCheck,
    color: 'from-rose-500 to-emerald-500',
    details: 'Provides cybersecurity analysts with transparent, explainable insights rather than a black-box answer.'
  }
];

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Shield className="w-3.5 h-3.5" />
          <span>Machine Learning Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
          How PhishGuard AI Works
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          From raw untrusted URL text to verified machine learning threat probabilities — without ever establishing a live connection.
        </p>
      </div>

      {/* Safety Alert */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex items-start gap-3">
        <Lock className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <strong className="text-cyan-300 font-semibold">Strict Air-Gapped Philosophy:</strong> PhishGuard AI is a URL character classifier, not a live web scraper or dynamic sandbox. Every submitted URL is analyzed completely as static text.
        </div>
      </div>

      {/* 7-Step Pipeline Walkthrough */}
      <div className="space-y-4">
        {PIPELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.step} className="space-y-3">
              <div className="glass-card rounded-3xl p-6 border border-slate-800/80 hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${step.color} p-0.5 flex-shrink-0 shadow-md`}>
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-cyan-300" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-cyan-400 font-bold">
                          STEP {step.step}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">•</span>
                        <span className="text-xs text-slate-400 font-mono">
                          {step.subtitle}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-100">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-cyan-200/90 font-mono">
                    💡 <span className="font-semibold text-slate-200">Why this matters:</span> {step.details}
                  </div>
                </div>
              </div>

              {idx < PIPELINE_STEPS.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="w-5 h-5 text-cyan-500/50 animate-bounce" />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
