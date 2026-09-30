import React from 'react';
import { Search, ArrowRight } from 'lucide-react';

export default function URLInput({ url, setUrl, onAnalyze, isScanning, error }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze();
  };

  const sampleUrls = [
    { label: 'Example.com (Legit)', url: 'https://example.com' },
    { label: 'Example Login (Legit)', url: 'https://example.org/login' },
    { label: 'Invalid Secure Login (Phish)', url: 'http://secure-login.example.invalid/verify' },
  ];

  return (
    <div className="glass-card">
      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
          Target URL (Untrusted Text Input):
        </label>
        
        <div className="input-group">
          <input
            type="text"
            className="cyber-input"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isScanning}
          />
          <button
            type="submit"
            className="cyber-button"
            disabled={isScanning}
          >
            <span>ANALYZE URL</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}
      </form>

      {/* Demo helper buttons */}
      <div className="demo-buttons">
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Try test input:</span>
        {sampleUrls.map((item, idx) => (
          <button
            key={idx}
            type="button"
            className="demo-btn"
            onClick={() => {
              setUrl(item.url);
              onAnalyze(item.url);
            }}
            disabled={isScanning}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
