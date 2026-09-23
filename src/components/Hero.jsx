import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Eye, Zap, Activity, CheckCircle2 } from 'lucide-react';
import eye from "../assets/eye.jpg";
import closeupeye from "../assets/closeupeye.png"
import innereye from "../assets/innereye.png"
import twoeyes from "../assets/twoeyes.png"
import "../templates/Hero.css";


export default function Hero({ onAnalyzeClick, onHowItWorksClick }) {
  return (
    <section className="hero-section">
      
           <div className="bg-image">
             <img src={eye} alt='eye-image' className='eye-image'/>
             <p className='hero-txt'>Early Detection of <br /> Diabetic Retinopathy</p>
          
            {/* Action Buttons */}
  <div className="action-buttons">
    <button
      onClick={onAnalyzeClick}
      className="group relative inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      <span>Analyze Retina</span>
      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
    </button>

    <button
      onClick={onHowItWorksClick}
      className="inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-base shadow-sm transition-all duration-300 hover:border-slate-300"
    >
      <span>How It Works</span>
    </button>
  </div>
          
           <div className="three">
             <img src={closeupeye}/>
             <img src={innereye}/>
             <img src={twoeyes}/>
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
