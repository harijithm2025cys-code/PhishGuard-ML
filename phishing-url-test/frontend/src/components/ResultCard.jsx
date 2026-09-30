import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

export default function ResultCard({ result }) {
  if (!result) return null;

  const isPhishing = result.prediction.toLowerCase() === 'phishing';
  const phishPercent = Math.round(result.phishing_probability * 100);
  const legitPercent = Math.round(result.legitimate_probability * 100);

  return (
    <div className="glass-card" style={{ borderColor: isPhishing ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isPhishing ? (
            <ShieldAlert size={28} color="#f87171" />
          ) : (
            <ShieldCheck size={28} color="#34d399" />
          )}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ANALYSIS RESULT
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isPhishing ? '#f87171' : '#34d399' }}>
              {result.prediction.toUpperCase()}
            </div>
          </div>
        </div>

        <span className={isPhishing ? 'badge-phish' : 'badge-legit'}>
          {isPhishing ? 'HIGH THREAT' : 'SAFE'}
        </span>
      </div>

      <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.6rem 0.8rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
        <span style={{ color: '#64748b' }}>URL: </span>
        <span style={{ color: '#e2e8f0' }}>{result.url}</span>
      </div>

      <div className="prob-grid">
        <div className="prob-box">
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
            Phishing Probability
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f87171', fontFamily: 'monospace' }}>
            {phishPercent}%
          </div>
        </div>

        <div className="prob-box">
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
            Legitimate Probability
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#34d399', fontFamily: 'monospace' }}>
            {legitPercent}%
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem' }}>
        <Cpu size={14} color="#00f0ff" />
        <span>Model: TF-IDF + Logistic Regression</span>
      </div>
    </div>
  );
}
