import React, { useState, useEffect } from 'react';
import { Cpu, Loader2 } from 'lucide-react';

export default function ScanningModal({ isOpen }) {
  const [progress, setProgress] = useState(15);
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    "Preparing retinal image...",
    "Enhancing image quality...",
    "Extracting retinal features...",
    "Analyzing retinal patterns...",
    "Evaluating disease severity...",
    "Calculating AI prediction...",
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
          return 95;
        }

        return prev + 8;
      });

      setStatusIndex((prev) => {
        return (prev + 1) % statusMessages.length;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center text-white shadow-2xl">

        {/* Loading Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            
            <Loader2
              className="w-8 h-8 text-cyan-400 animate-spin"
            />

            <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping" />
          </div>
        </div>

        {/* AI Engine */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Analysis Engine</span>
        </div>

        {/* Heading */}
        <h3 className="text-xl font-semibold text-white">
          Analyzing retinal image
        </h3>

        {/* Current Status */}
        <p className="mt-2 h-5 text-sm text-slate-400 transition-all duration-300">
          {statusMessages[statusIndex]}
        </p>

        {/* Progress */}
        <div className="mt-7">

          <div className="flex justify-between mb-2 text-xs text-slate-400">
            <span>Processing</span>

            <span className="text-cyan-400 font-semibold">
              {progress}%
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

        {/* Bottom Message */}
        <p className="mt-5 text-xs text-slate-500">
          Please wait while the AI processes the retinal features...
        </p>

      </div>
    </div>
  );
}