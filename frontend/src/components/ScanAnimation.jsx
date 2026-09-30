import React, { useState, useEffect } from 'react';
import { Cpu, Terminal, Shield, CheckCircle2 } from 'lucide-react';

const SCAN_STEPS = [
  { id: 1, label: 'INITIALIZING SCANNER...', icon: Terminal },
  { id: 2, label: 'EXTRACTING URL FEATURES...', icon: Cpu },
  { id: 3, label: 'RUNNING MACHINE LEARNING MODEL...', icon: Shield },
  { id: 4, label: 'GENERATING RISK SCORE...', icon: CheckCircle2 },
];

export default function ScanAnimation({ isScanning, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isScanning) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < SCAN_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isScanning]);

  if (!isScanning) return null;

  return (
    <div className="w-full glass-card rounded-2xl p-6 border border-cyan-500/30 shadow-2xl shadow-cyan-950/50">
      <div className="flex flex-col items-center justify-center space-y-4">
        
        {/* Radar Scanning Ring */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
          <div className="absolute inset-1 rounded-full border border-dashed border-cyan-400 animate-spin" />
          <Cpu className="w-7 h-7 text-cyan-400 animate-pulse" />
        </div>

        {/* Current Active Step Text */}
        <div className="text-center space-y-1">
          <div className="font-mono text-sm tracking-widest text-cyan-300 font-bold uppercase animate-pulse">
            {SCAN_STEPS[currentStep].label}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Pipeline Stage {currentStep + 1} of {SCAN_STEPS.length}
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-3 pt-2">
          {SCAN_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-cyan-400 scale-100'
                      : isCurrent
                      ? 'bg-sky-300 scale-125 ring-4 ring-cyan-500/30 animate-pulse'
                      : 'bg-slate-700 scale-90'
                  }`}
                />
                {idx < SCAN_STEPS.length - 1 && (
                  <div
                    className={`w-8 h-0.5 rounded transition-all duration-300 ${
                      idx < currentStep ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
