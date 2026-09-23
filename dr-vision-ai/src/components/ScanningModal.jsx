import React, { useState, useEffect } from 'react';
import { Cpu, Eye, Activity, CheckCircle, Sparkles } from 'lucide-react';

export default function ScanningModal({ isOpen, imagePreview }) {
  const [progress, setProgress] = useState(15);
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    "Resizing input to 224 × 224 × 3 tensor...",
    "Applying Green Channel contrast enhancement...",
    "Extracting retinal microvascular features...",
    "Evaluating DenseNet dense blocks...",
    "Analyzing lesion distribution patterns...",
    "Computing 5-class Softmax probability tensor...",
    "Finalizing diagnostic report..."
  ];

  useEffect(() => {
    if (!isOpen) {
      setProgress(15);
      setStatusIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 12;
      });

      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 240);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center text-white shadow-2xl space-y-6 overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Retinal Frame with Scanning Laser */}
        <div className="relative w-44 h-44 mx-auto rounded-2xl overflow-hidden bg-black border-2 border-cyan-500/40 shadow-xl group">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Scanning Fundus"
              className="w-full h-full object-cover filter contrast-125"
            />
          ) : (
            <div className="w-full h-full bg-red-950 flex items-center justify-center">
              <Eye className="w-16 h-16 text-red-500 animate-pulse" />
            </div>
          )}

          {/* Animated Laser Scanning Line */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser-scan" />
          
          {/* Target Reticle Grid */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-dashed border-cyan-400/50 animate-spin-slow" />
          </div>
        </div>

        {/* Status Headline */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
            <Cpu className="w-3.5 h-3.5 animate-spin" />
            <span>DenseNet Engine</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Analyzing retinal features...
          </h3>
          <p className="text-xs font-mono text-cyan-300 h-5 transition-all duration-300">
            {statusMessages[statusIndex]}
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>Neural Inference</span>
            <span className="text-teal-400 font-bold">{progress}%</span>
          </div>
          
          <div className="w-full h-3 rounded-full bg-slate-800 p-0.5 overflow-hidden border border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-teal-400 to-cyan-400 transition-all duration-300 shadow-[0_0_10px_#22d3ee]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 font-mono">
          Please wait while the feature tensors are processed...
        </p>

      </div>
    </div>
  );
}
