import React, { useState } from 'react';
import CyberGlobe from './components/CyberGlobe';
import URLInput from './components/URLInput';
import ResultCard from './components/ResultCard';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [url, setUrl] = useState('');
  const [scanState, setScanState] = useState('IDLE'); // 'IDLE', 'SCANNING', 'ANALYZING', 'DONE'
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (overrideUrl) => {
    const target = (overrideUrl || url).trim();

    if (!target) {
      setError('Please enter a URL.');
      setResult(null);
      return;
    }

    setError(null);
    setResult(null);
    setScanState('SCANNING');

    // Simple two-stage animation transition before displaying result
    const timer = setTimeout(() => {
      setScanState('ANALYZING');
    }, 400);

    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target }),
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setScanState('DONE');
    } catch (err) {
      clearTimeout(timer);
      setScanState('IDLE');
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot connect to ML backend. Make sure FastAPI is running on port 8000.');
      } else {
        setError(err.message || 'Error occurred during prediction.');
      }
    }
  };

  const isScanning = scanState === 'SCANNING' || scanState === 'ANALYZING';

  return (
    <div className="container">
      {/* Header */}
      <header className="header-section">
        <h1 className="title-gradient">PHISHGUARD AI</h1>
        <p className="subtitle">Machine Learning Phishing URL Detector (Test Prototype)</p>
      </header>

      {/* 3D Cyber Sphere */}
      <CyberGlobe isScanning={isScanning} />

      {/* URL Input Form */}
      <URLInput
        url={url}
        setUrl={setUrl}
        onAnalyze={handleAnalyze}
        isScanning={isScanning}
        error={error}
      />

      {/* Scanning status banner */}
      {isScanning && (
        <div className="glass-card scanning-bar">
          {scanState === 'SCANNING' ? 'SCANNING...' : 'ANALYZING...'}
        </div>
      )}

      {/* Result Card */}
      {result && scanState === 'DONE' && (
        <ResultCard result={result} />
      )}
    </div>
  );
}
