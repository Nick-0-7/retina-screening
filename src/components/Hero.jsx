import React from 'react';
import { ArrowRight, Activity, Sparkles } from 'lucide-react';
import eye from "../assets/eye.jpg";
import closeupeye from "../assets/closeupeye.png";
import innereye from "../assets/innereye.png";
import twoeyes from "../assets/twoeyes.png";
import "../templates/Hero.css";

export default function Hero({ onAnalyzeClick, onHowItWorksClick }) {
  return (
    <section className="hero-section bg-slate-950 text-white">
      <div className="bg-image">
        
        {/* Background Retinal Image */}
        <img src={eye} alt="Retinal fundus background" className="eye-image" />
        
        {/* Top Badge */}
        <div className="relative z-10 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>AI-Powered Medical Retina Analytics</span>
        </div>

        {/* Hero Heading Text */}
        <h1 className="hero-txt">
          Early Detection of <br />
          <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Diabetic Retinopathy
          </span>
        </h1>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={onAnalyzeClick}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-base shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Activity className="w-5 h-5 mr-2 animate-pulse" />
            <span>Analyze Retina Image</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onHowItWorksClick}
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-200 font-semibold text-base backdrop-blur-md shadow-sm transition-all duration-300 hover:border-slate-500"
          >
            <span>How It Works</span>
          </button>
        </div>

        {/* 3 Fundus Image Cards */}
        <div className="three">
          <div className="relative group overflow-hidden rounded-2xl">
            <img src={closeupeye} alt="Fundus Closeup" />
            <div className="absolute bottom-1 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
              Macula Region
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-2xl">
            <img src={innereye} alt="Optic Disc" />
            <div className="absolute bottom-1 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
              Optic Disc Scan
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-2xl">
            <img src={twoeyes} alt="Bilateral Scan" />
            <div className="absolute bottom-1 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
              Vascular Network
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
