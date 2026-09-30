import React from 'react';

/**
 * RiskScore Circular Gauge Component
 * 
 * Thresholds:
 *   0.00 <= phishing_probability < 0.30 -> LOW
 *   0.30 <= phishing_probability < 0.70 -> MEDIUM
 *   0.70 <= phishing_probability <= 1.00 -> HIGH
 * 
 * Uses full floating-point probability from the backend model,
 * rounding only for UI display.
 */
export default function RiskScore({ phishingProbability = 0, riskLevel }) {
  // Enforce consistent risk level logic matching backend
  const resolvedRiskLevel = riskLevel || (
    phishingProbability < 0.30 ? 'LOW' :
    phishingProbability < 0.70 ? 'MEDIUM' : 'HIGH'
  );

  // Display percentage with 2 decimal places (e.g. 67.48%, 70.12%)
  const displayPercentage = (phishingProbability * 100).toFixed(2);

  // SVG Gauge calculations using exact floating-point probability
  const size = 190;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProb = Math.min(1.0, Math.max(0.0, phishingProbability));
  const strokeDashoffset = circumference - (clampedProb * circumference);

  let strokeColor = '#10b981'; // Green for LOW
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let textColor = 'text-emerald-400';
  let badgeBg = 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300';

  if (resolvedRiskLevel === 'HIGH') {
    strokeColor = '#ef4444';
    glowColor = 'rgba(239, 68, 68, 0.45)';
    textColor = 'text-rose-400';
    badgeBg = 'bg-rose-950/60 border-rose-500/40 text-rose-300';
  } else if (resolvedRiskLevel === 'MEDIUM') {
    strokeColor = '#f59e0b';
    glowColor = 'rgba(245, 158, 11, 0.4)';
    textColor = 'text-amber-400';
    badgeBg = 'bg-amber-950/60 border-amber-500/40 text-amber-300';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* SVG Progress Circle */}
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active colored progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.4s ease',
              filter: `drop-shadow(0 0 10px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center Information */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
          <span className={`text-3xl sm:text-4xl font-black tracking-tight font-mono ${textColor}`}>
            {displayPercentage}%
          </span>
          <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">
            Risk Score
          </span>
        </div>
      </div>

      {/* Probability Label & Badge */}
      <div className="mt-3 flex flex-col items-center space-y-1.5">
        <span className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
          PHISHING PROBABILITY
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${badgeBg}`}>
          {resolvedRiskLevel} RISK
        </span>
      </div>
    </div>
  );
}
