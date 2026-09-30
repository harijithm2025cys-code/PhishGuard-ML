import React, { useState } from 'react';
import { Upload, FileText, Download, ShieldCheck, ShieldAlert, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function BatchScanner({ backendUrl = 'http://127.0.0.1:8000' }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResults, setBatchResults] = useState(null);
  const [csvDownloadData, setCsvDownloadData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.name.endsWith('.csv') && !selected.name.endsWith('.txt')) {
        setError('Please upload a valid CSV file.');
        setFile(null);
        return;
      }
      setFile(selected);
      setError(null);
      setBatchResults(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${backendUrl}/batch-predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setBatchResults(data.results || []);
      setCsvDownloadData(data.csv_data || null);
    } catch (err) {
      setError(err.message || 'Failed to process batch CSV. Ensure backend is running.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadResults = () => {
    if (!csvDownloadData) return;
    const blob = new Blob([csvDownloadData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `phishguard_batch_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 flex items-center gap-3">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
            Batch URL Threat Analyzer
          </span>
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Upload a CSV file containing URL strings to perform high-throughput threat analysis.
          Inspect results in real-time and export annotated predictions.
        </p>
      </div>

      {/* Upload Box */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/80">
        <form onSubmit={handleUpload} className="space-y-4">
          <label className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/40">
            <Upload className="w-10 h-10 text-cyan-400 mb-3" />
            <span className="text-sm font-semibold text-slate-200">
              {file ? file.name : 'Click to select or drag and drop CSV file'}
            </span>
            <span className="text-xs text-slate-500 mt-1 font-mono">
              Expected column: 'url' or 'URL' (up to 500 records per batch)
            </span>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-400 font-mono">
              {file ? `Selected file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)` : 'No file chosen'}
            </div>

            <button
              type="submit"
              disabled={!file || isProcessing}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all ${
                !file || isProcessing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              }`}
            >
              {isProcessing && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{isProcessing ? 'Processing Batch...' : 'Start Batch Analysis'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Table */}
      {batchResults && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/80 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Batch Evaluation Results</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Processed {batchResults.length} records with Character TF-IDF & Logistic Regression
              </p>
            </div>

            <button
              onClick={handleDownloadResults}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wider uppercase transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Results CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Prediction</th>
                  <th className="px-4 py-3">Phishing Prob</th>
                  <th className="px-4 py-3">Legit Prob</th>
                  <th className="px-4 py-3">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                {batchResults.map((item, idx) => {
                  const isPhishing = item.prediction?.toLowerCase() === 'phishing';
                  return (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                      <td className="px-4 py-3 text-slate-200 max-w-xs truncate" title={item.url}>
                        {item.url}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 font-bold uppercase ${
                          isPhishing ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {isPhishing ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                          {item.prediction}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-rose-300">
                        {(item.phishing_probability * 100).toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-emerald-300">
                        {(item.legitimate_probability * 100).toFixed(2)}%
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          item.risk_level === 'HIGH'
                            ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                            : item.risk_level === 'MEDIUM'
                            ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                            : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        }`}>
                          {item.risk_level}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
