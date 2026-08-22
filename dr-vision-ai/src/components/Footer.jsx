import React from 'react';
import { Eye, ShieldCheck, Activity, Code, Globe } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('hero')}>
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white shadow-md">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                DR Vision <span className="text-teal-400">AI</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A modern healthcare AI web application powered by EfficientNetB0 deep learning for Diabetic Retinopathy detection and severity classification.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3 text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">Navigation</div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('hero')} className="hover:text-teal-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-teal-400 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analyze')} className="hover:text-teal-400 transition-colors">
                  AI Retinal Analysis
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('model-specs')} className="hover:text-teal-400 transition-colors">
                  Model Specifications
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & API */}
          <div className="md:col-span-4 space-y-3 text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">System Specs & API</div>
            <div className="space-y-2 text-xs font-mono">
              <div className="text-slate-300">Architecture: EfficientNetB0</div>
              <div className="text-slate-300">Input Spec: 224 × 224 × 3 RGB</div>
              <div className="text-teal-400">Endpoint: POST /predict</div>
              <div className="text-slate-400">Classes: 5 (Grade 0 to Grade 4)</div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DR Vision AI System. Built with React & Tailwind CSS.</p>
          <div className="flex items-center space-x-2">
            <span>Healthcare AI Innovation</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
