import React from 'react';
import CyberGlobe from '../components/CyberGlobe';
import URLScanner from '../components/URLScanner';
import ScanAnimation from '../components/ScanAnimation';
import PredictionCard from '../components/PredictionCard';
import FeaturePanel from '../components/FeaturePanel';
import ThreatIndicators from '../components/ThreatIndicators';
import ModelMetrics from '../components/ModelMetrics';
import ScanHistory from '../components/ScanHistory';
import { Shield, Sparkles, AlertCircle } from 'lucide-react';

export default function Dashboard({
  url,
  setUrl,
  onScan,
  isScanning,
  error,
  predictionData,
  history,
  onClearHistory,
  modelInfo,
  backendOnline
}) {
  return (
    <div className="space-y-10 pb-16">
      
      {/* Backend Offline Warning Banner */}
      {!backendOnline && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold">FastAPI Backend Unreachable:</span> Make sure the backend server is running at{' '}
            <code className="bg-slate-900 px-2 py-0.5 rounded text-amber-300 font-mono">
              http://127.0.0.1:8000
            </code>
            . Run <code className="bg-slate-900 px-2 py-0.5 rounded font-mono">uvicorn app:app --reload</code> inside backend.
          </div>
        </div>
      )}

      {/* Hero Section with 3D Cyber Globe */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        
        {/* Left Column: Headings and URL Scanner */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>II Year Cybersecurity ML Hackathon Project</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-100">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                PHISHGUARD AI
              </span>
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-300">
                AI-Powered Phishing URL Detection
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
              Analyze URL structure with machine learning —{' '}
              <span className="text-cyan-300 font-semibold">without visiting the website</span>.
              Static character n-gram TF-IDF and Logistic Regression threat evaluation.
            </p>
          </div>

          {/* Scanner Input and Demo Mode */}
          <div className="pt-2">
            <URLScanner
              url={url}
              setUrl={setUrl}
              onScan={onScan}
              isScanning={isScanning}
              error={error}
            />
          </div>
        </div>

        {/* Right Column: 3D Cyber Globe Visual */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[380px] h-[340px] rounded-3xl glass-card border border-cyan-500/20 p-2 overflow-hidden shadow-2xl shadow-cyan-950/50">
            <div className="absolute top-3 left-4 z-10">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400/90 uppercase font-semibold">
                Network Threat Globe
              </span>
            </div>
            <CyberGlobe
              isScanning={isScanning}
              riskLevel={predictionData?.risk_level || 'LOW'}
            />
          </div>
        </div>

      </section>

      {/* Scanning Radar Progress */}
      {isScanning && (
        <section className="pt-2">
          <ScanAnimation isScanning={isScanning} />
        </section>
      )}

      {/* Threat Analysis Results Section */}
      {predictionData && !isScanning && (
        <section className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-100">
              Threat Analysis Report
            </h2>
          </div>

          {/* Result Card */}
          <PredictionCard predictionData={predictionData} />

          {/* Two-column layout: Feature Panel & Why Flagged */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            <div className="lg:col-span-7">
              <FeaturePanel features={predictionData.features} />
            </div>
            <div className="lg:col-span-5">
              <ThreatIndicators
                indicators={predictionData.indicators}
                prediction={predictionData.prediction}
              />
            </div>
          </div>
        </section>
      )}

      {/* Model Metrics & Live Performance */}
      <section className="pt-4">
        <ModelMetrics modelInfo={modelInfo} />
      </section>

      {/* Scan History (localStorage) */}
      <section className="pt-2">
        <ScanHistory
          history={history}
          onSelectUrl={(selectedUrl) => {
            setUrl(selectedUrl);
            onScan(selectedUrl);
          }}
          onClearHistory={onClearHistory}
        />
      </section>

    </div>
  );
}
