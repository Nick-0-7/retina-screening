import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export default function Disclaimer() {
  return (
    <section className="py-8 bg-slate-100/80 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="space-y-1 text-left flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Medical Research & Educational Notice
              </h4>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-amber-800 dark:text-amber-300/90 font-medium">
              "This AI system is developed for educational and research purposes. It should not be used as a substitute for professional medical diagnosis."
            </p>
          </div>

          <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/30 whitespace-nowrap">
            Non-Clinical Demo
          </div>

        </div>
      </div>
    </section>
  );
}
