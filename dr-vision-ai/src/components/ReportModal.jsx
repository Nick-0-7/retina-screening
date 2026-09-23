import React from 'react';
import { DR_STAGES } from '../data/drClasses';
import { X, Printer, Download, Eye, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, predictionResult, selectedImage }) {
  if (!isOpen || !predictionResult) return null;

  const predictedClassKey = predictionResult.predicted_class || 'Moderate';
  const confidencePercent = (predictionResult.confidence * 100).toFixed(1);
  const currentStage = DR_STAGES.find((s) => s.key === predictedClassKey) || DR_STAGES[2];
  const probabilities = predictionResult.probabilities || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 text-slate-900 dark:text-white shadow-2xl space-y-6 my-8">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
            <Activity className="w-4 h-4 text-teal-500" />
            <span>DR Vision AI — Clinical Diagnostic Report</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT CONTENT */}
        <div id="printable-report-area" className="space-y-6 text-left">
          
          {/* Header Branding */}
          <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">
                DR Vision AI
              </h1>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Automated Retinal Screening & Severity Assessment
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-500 space-y-1">
              <div><strong className="text-slate-700 dark:text-slate-300">Report ID:</strong> DR-{Math.floor(100000 + Math.random() * 900000)}</div>
              <div><strong className="text-slate-700 dark:text-slate-300">Date:</strong> {new Date().toLocaleDateString()}</div>
              <div><strong className="text-slate-700 dark:text-slate-300">Model:</strong> DenseNet</div>
            </div>
          </div>

          {/* Primary Result Box */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Primary Diagnosis</div>
              <div className={`text-2xl font-extrabold ${currentStage.textColor}`}>
                {currentStage.name} (Grade {currentStage.grade})
              </div>
              <div className="text-xs text-slate-500 font-mono mt-1">ICD-10: {currentStage.icd10}</div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 uppercase">AI Confidence</div>
              <div className="text-3xl font-black text-teal-600 dark:text-teal-400">{confidencePercent}%</div>
            </div>
          </div>

          {/* Image & Probability Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Image Preview */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">Retinal Fundus Image</div>
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-black border border-slate-800">
                <img src={selectedImage?.url} alt="Fundus Scan" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Probability breakdown */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase">Class Probabilities</div>
              <div className="space-y-2">
                {DR_STAGES.map((stage) => {
                  const prob = probabilities[stage.key] ?? probabilities[stage.name] ?? 0;
                  const probPct = (prob * 100).toFixed(1);
                  const isPredicted = stage.key === currentStage.key;
                  return (
                    <div key={stage.key} className="text-xs space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className={isPredicted ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500'}>
                          {stage.name}
                        </span>
                        <span className={isPredicted ? 'font-bold text-teal-600 dark:text-teal-400' : 'text-slate-500'}>
                          {probPct}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full ${isPredicted ? 'bg-blue-600' : 'bg-slate-400'}`}
                          style={{ width: `${probPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Recommendations & Follow-Up */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 text-xs space-y-2">
            <div className="font-bold text-blue-900 dark:text-blue-300 uppercase">Clinical Recommendation</div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{currentStage.recommendation}</p>
            <div className="font-mono text-teal-700 dark:text-teal-400 font-bold pt-1">
              Suggested Re-screening Timeline: {currentStage.followUp}
            </div>
          </div>

          {/* Disclaimer footer */}
          <div className="text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4 text-center">
            This report was automatically generated by DR Vision AI (DenseNet) for research/educational purposes only.
          </div>

        </div>

      </div>
    </div>
  );
}
