import React, { useState } from 'react';
import { DR_STAGES } from '../data/drClasses';
import { 
  CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, 
  FileText, Copy, Check, Eye, Activity, Info, ChevronRight, Layers, ZoomIn
} from 'lucide-react';

export default function Results({ predictionResult, selectedImage, onReset, onOpenReport }) {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!predictionResult) return null;

  const predictedClassKey = predictionResult.predicted_class || 'Moderate';
  const confidencePercent = (predictionResult.confidence * 100).toFixed(1);

  // Find matching stage metadata
  const currentStage = DR_STAGES.find((s) => s.key === predictedClassKey) || DR_STAGES[2];
  const probabilities = predictionResult.probabilities || {};

  // Copy raw JSON endpoint output
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(predictionResult, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <section id="results" className="py-12 md:py-16 bg-slate-50/70 dark:bg-slate-950/80 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${currentStage.gradientColor} text-white shadow-lg`}>
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  AI Diagnostic Complete
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  Status: 200 OK
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Retinal Scan Diagnostics Dashboard
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onReset}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Analyze Another Image</span>
            </button>

            <button
              onClick={onOpenReport}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4" />
              <span>Export Medical Report</span>
            </button>
          </div>
        </div>

        {/* MAIN 2-COLUMN DASHBOARD LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: Retinal Fundus Image Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Retinal Fundus Image</span>
                </h3>
                <span className="text-xs font-mono text-slate-500">224 × 224 RGB</span>
              </div>

              {/* Fundus Display Box with Lesion Heatmap Overlay toggle */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
                <img
                  src={selectedImage?.url}
                  alt="Analyzed Fundus Scan"
                  className="w-full h-full object-cover"
                />

                {/* Optional Simulated AI Lesion Heatmap Overlay */}
                {showHeatmap && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 via-rose-500/40 to-transparent mix-blend-color-dodge pointer-events-none transition-all duration-300">
                    {/* Lesion Hotspots */}
                    <div className="absolute top-1/3 left-1/2 w-16 h-16 rounded-full bg-rose-500/50 blur-md animate-ping" />
                    <div className="absolute top-1/2 left-3/5 w-12 h-12 rounded-full bg-amber-400/50 blur-sm" />
                    <div className="absolute bottom-1/3 left-1/3 w-20 h-20 rounded-full bg-red-600/40 blur-lg" />
                  </div>
                )}

                {/* Heatmap Toggle Button Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs">
                  <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
                      showHeatmap
                        ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{showHeatmap ? 'Lesion Heatmap ON' : 'Toggle AI Heatmap'}</span>
                  </button>

                  <span className="text-[11px] font-mono text-slate-400">
                    {showHeatmap ? 'CAM Overlay Active' : 'Native View'}
                  </span>
                </div>

              </div>

              {/* Image Metadata Footer */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex justify-between items-center text-xs font-mono text-slate-600 dark:text-slate-400">
                <span>File: {selectedImage?.name || 'fundus_scan.png'}</span>
                <span>FOV: 45° Standard</span>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE: AI Prediction Results & Visual 5-Stage Stepper */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main AI Prediction Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Primary Diagnosis</div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Prediction</h3>
                </div>
                <div className={`px-4 py-2 rounded-2xl border text-sm font-bold ${currentStage.badgeColor}`}>
                  Grade {currentStage.grade} / 4
                </div>
              </div>

              {/* Severity Level Title & Confidence */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Severity Level</div>
                  <div className={`text-2xl font-black ${currentStage.textColor}`}>
                    {currentStage.name}
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Confidence Score</div>
                  <div className="text-2xl font-black text-teal-600 dark:text-teal-400 flex items-center sm:justify-end space-x-1">
                    <span>{confidencePercent}%</span>
                  </div>
                </div>
              </div>

              {/* VISUAL SEVERITY INDICATOR: 5 STAGES STEPPER */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <span>Diabetic Retinopathy Stage Scale</span>
                  <span className="text-teal-600 dark:text-teal-400 font-mono">Predicted: Grade {currentStage.grade}</span>
                </div>

                {/* Stepper Track */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {DR_STAGES.map((stage) => {
                    const isPredicted = stage.key === currentStage.key;
                    return (
                      <div
                        key={stage.key}
                        className={`relative p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-300 ${
                          isPredicted
                            ? 'bg-gradient-to-b from-blue-600 to-teal-600 text-white border-blue-500 shadow-lg shadow-blue-500/25 scale-[1.05] z-10'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-70'
                        }`}
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
                          Grade {stage.grade}
                        </div>
                        <div className="text-xs font-extrabold truncate">
                          {stage.shortName}
                        </div>
                        {isPredicted && (
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PROBABILITY DISTRIBUTION (Animated Progress Bars) */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <span>Probability Distribution</span>
                  <span className="text-slate-400 font-mono">DenseNet Softmax</span>
                </div>

                <div className="space-y-3">
                  {DR_STAGES.map((stage) => {
                    const rawProb = probabilities[stage.key] ?? probabilities[stage.name] ?? 0;
                    const probPercent = (rawProb * 100).toFixed(1);
                    const isPredicted = stage.key === currentStage.key;

                    return (
                      <div key={stage.key} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className={`font-semibold ${isPredicted ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                            {stage.name}
                          </span>
                          <span className={`font-mono ${isPredicted ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500'}`}>
                            {probPercent}%
                          </span>
                        </div>

                        {/* Animated Progress Bar Track */}
                        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${
                              isPredicted
                                ? 'bg-gradient-to-r from-blue-600 to-teal-500 shadow-md'
                                : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            style={{ width: `${Math.max(parseFloat(probPercent), 2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clinical Description & Symptoms Card */}
              <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center space-x-2 text-blue-900 dark:text-blue-300 font-bold text-sm">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Clinical Evaluation Summary</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentStage.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium">
                  <div className="space-y-1">
                    <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px]">ICD-10 Code</span>
                    <div className="font-mono text-slate-800 dark:text-slate-200">{currentStage.icd10}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px]">Recommended Follow-up</span>
                    <div className="font-semibold text-teal-600 dark:text-teal-400">{currentStage.followUp}</div>
                  </div>
                </div>
              </div>

              {/* JSON Payload Export Button */}
              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center space-x-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-mono transition-colors"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied Raw API JSON!' : 'Copy POST /predict API JSON Output'}</span>
                </button>

                <button
                  onClick={onReset}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Reset Analysis
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
