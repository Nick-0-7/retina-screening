import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Eye, Zap, Activity, CheckCircle2 } from 'lucide-react';

export default function Hero({ onAnalyzeClick, onHowItWorksClick }) {
  return (
    <section className="relative overflow-hidden py-12 md:py-20 lg:py-24 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950">
      
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-400/20 to-teal-300/20 dark:from-blue-600/10 dark:to-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT SIDE: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Clinical AI Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide uppercase">
              <SparklesIcon className="w-4 h-4 text-blue-500 animate-pulse" />
              <span>EfficientNetB0 Deep Learning Model</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Detect Diabetic Retinopathy with{' '}
              <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Medical AI
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
              Upload a retinal fundus image and let our deep learning model analyze the severity of diabetic retinopathy with instant clinical confidence metrics.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                onClick={onAnalyzeClick}
                className="group relative inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Analyze Retina</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onHowItWorksClick}
                className="inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-base shadow-sm transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600"
              >
                <span>How It Works</span>
              </button>
            </div>

            {/* Key Value Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">94.2%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Val Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">5 Stages</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Severity Grading</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">&lt; 2 Sec</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Analysis Speed</div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Futuristic Medical AI Visualization */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Container Card */}
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-slate-900/90 p-4 border border-slate-800 shadow-2xl overflow-hidden group">
              
              {/* Radial Grid lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              {/* Animated Radar Circle background */}
              <div className="absolute inset-4 rounded-full border border-teal-500/20 animate-pulse-glow" />
              <div className="absolute inset-16 rounded-full border border-blue-500/20" />
              <div className="absolute inset-28 rounded-full border border-dashed border-cyan-500/30" />

              {/* Retinal Fundus Graphic Base */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-red-950 via-slate-950 to-slate-900">
                
                {/* SVG Retinal Scan Visualizer with Laser Beam */}
                <svg className="w-full h-full text-red-600" viewBox="0 0 400 400" fill="none">
                  {/* Fundus Background Globe */}
                  <circle cx="200" cy="200" r="170" fill="url(#fundusGrad)" />
                  <defs>
                    <radialGradient id="fundusGrad" cx="0.4" cy="0.4" r="0.8">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="40%" stopColor="#991b1b" />
                      <stop offset="85%" stopColor="#450a0a" />
                      <stop offset="100%" stopColor="#180202" />
                    </radialGradient>
                  </defs>

                  {/* Optic Disc */}
                  <circle cx="130" cy="190" r="32" fill="#fef08a" opacity="0.9" />
                  <circle cx="130" cy="190" r="16" fill="#ffffff" opacity="0.8" />

                  {/* Macula */}
                  <circle cx="250" cy="200" r="28" fill="#450a0a" opacity="0.9" />
                  <circle cx="250" cy="200" r="3" fill="#fef08a" opacity="0.8" />

                  {/* Retinal Blood Vessels */}
                  <path d="M130,190 Q120,130 90,80 M130,190 Q170,120 230,70 M130,190 Q110,250 80,310 M130,190 Q160,260 240,320 M130,190 Q200,195 245,200" stroke="#7f1d1d" strokeWidth="6" strokeLinecap="round" />
                  <path d="M130,190 Q120,130 90,80 M130,190 Q170,120 230,70 M130,190 Q110,250 80,310 M130,190 Q160,260 240,320" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Microaneurysms simulation points */}
                  <circle cx="220" cy="160" r="4" fill="#dc2626" />
                  <circle cx="270" cy="230" r="3" fill="#dc2626" />
                  <circle cx="240" cy="140" r="3.5" fill="#facc15" />
                  <circle cx="260" cy="160" r="5" fill="#facc15" />

                  {/* AI Target Bounding Boxes */}
                  <rect x="205" y="145" width="35" height="35" rx="4" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" fill="rgba(56, 189, 248, 0.1)" />
                  <circle cx="222" cy="162" r="14" stroke="#f43f5e" strokeWidth="1.5" fill="none" />
                </svg>

                {/* Animated Laser Scanning Beam */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser-scan" />

                {/* Medical Crosshair Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-[1px] bg-cyan-500/20" />
                  <div className="h-full w-[1px] bg-cyan-500/20 absolute" />
                  <div className="w-48 h-48 rounded-full border border-cyan-400/40 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                </div>

                {/* Top Telemetry HUD */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-cyan-400">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>AI LIVE SCAN: 224x224</span>
                  </div>
                  <span className="text-slate-400">FOV: 45°</span>
                </div>

                {/* Bottom Telemetry HUD */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Neural Architecture</div>
                    <div className="text-sm font-bold text-teal-400">EfficientNetB0 (Keras)</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Classification Target</div>
                    <div className="text-sm font-extrabold text-cyan-400">5 DR Severity Grades</div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

function SparklesIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
