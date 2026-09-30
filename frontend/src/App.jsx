import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import BatchScanner from './pages/BatchScanner';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import { ShieldCheck, Lock, ExternalLink, Heart } from 'lucide-react';

const BACKEND_URL = 'http://127.0.0.1:8000';
const LOCAL_STORAGE_KEY = 'phishguard_scan_history';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);

  // Initialize history from localStorage (Last 10 scans)
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Check backend health and retrieve genuine model metrics on initial load
  useEffect(() => {
    const fetchHealthAndMetrics = async () => {
      try {
        const healthRes = await fetch(`${BACKEND_URL}/health`);
        if (healthRes.ok) {
          setBackendOnline(true);
        } else {
          setBackendOnline(false);
        }

        const infoRes = await fetch(`${BACKEND_URL}/model-info`);
        if (infoRes.ok) {
          const data = await infoRes.json();
          setModelInfo(data);
        }
      } catch (err) {
        setBackendOnline(false);
        console.warn('Backend currently offline or starting up:', err);
      }
    };

    fetchHealthAndMetrics();
    const interval = setInterval(fetchHealthAndMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  // Primary URL Scanning Function
  const handleScan = async (urlToScan) => {
    const targetUrl = (urlToScan || url).trim();
    if (!targetUrl) {
      setError('Please provide a URL to analyze.');
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server responded with status ${response.status}`);
      }

      const result = await response.json();
      setPredictionData(result);
      setBackendOnline(true);

      // Append to history (keep max 10 records, deduplicate top)
      setHistory((prev) => {
        const newRecord = {
          url: result.url,
          prediction: result.prediction,
          phishing_probability: result.phishing_probability,
          risk_level: result.risk_level,
          timestamp: result.timestamp,
        };
        const filtered = prev.filter((item) => item.url !== result.url);
        return [newRecord, ...filtered].slice(0, 10);
      });
    } catch (err) {
      console.error('Prediction failed:', err);
      setError('Unable to connect to the ML backend. Make sure FastAPI is running at http://127.0.0.1:8000.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 cyber-grid flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        isOnline={backendOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activePage === 'dashboard' && (
          <Dashboard
            url={url}
            setUrl={setUrl}
            onScan={handleScan}
            isScanning={isScanning}
            error={error}
            predictionData={predictionData}
            history={history}
            onClearHistory={handleClearHistory}
            modelInfo={modelInfo}
            backendOnline={backendOnline}
          />
        )}

        {activePage === 'batch' && (
          <BatchScanner backendUrl={BACKEND_URL} />
        )}

        {activePage === 'how-it-works' && (
          <HowItWorks />
        )}

        {activePage === 'about' && (
          <About />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">PhishGuard AI</span>
            <span>•</span>
            <span>II Year Cybersecurity Machine Learning Hackathon</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <Lock className="w-3.5 h-3.5 text-cyan-500" />
            <span>Air-Gapped Character Evaluation</span>
            <span>•</span>
            <span>PhiUSIIL Dataset Trained</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
