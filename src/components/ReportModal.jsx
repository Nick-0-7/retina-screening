import React, { useState } from 'react';
import { DR_STAGES } from '../data/drClasses';
import { X, Printer, Download, Activity, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function ReportModal({ isOpen, onClose, predictionResult, selectedImage }) {
  const { t, getDRStage } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !predictionResult) return null;

  const predictedClassKey = predictionResult.predicted_class || 'Moderate';
  const confidencePercent = (predictionResult.confidence * 100).toFixed(1);
  const currentStage = getDRStage(predictedClassKey) || getDRStage('Moderate');
  const probabilities = predictionResult.probabilities || {};

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const reportElement = document.getElementById('printable-report-area');
      
      // Temporary override styles for better PDF rendering if needed
      // (e.g. force light mode colors for printing)
      reportElement.classList.add('pdf-export-mode');
      
      const canvas = await html2canvas(reportElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      reportElement.classList.remove('pdf-export-mode');

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`DR_Vision_Report_${predictedClassKey}.pdf`);
    } catch (error) {
      console.error("PDF generation failed", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 text-slate-900 dark:text-white shadow-2xl space-y-6 my-8">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
            <Activity className="w-4 h-4 text-teal-500" />
            <span>{t('reportModal.brand')}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{t('reportModal.print')}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isDownloading ? 'Generating...' : t('reportModal.download')}</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT CONTENT */}
        <div id="printable-report-area" className="space-y-6 text-left bg-white dark:bg-slate-900 p-2">
          
          {/* Header Branding */}
          <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">
                DR Vision AI
              </h1>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('reportModal.subtitle')}
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-500 space-y-1">
              <div><strong className="text-slate-700 dark:text-slate-300">{t('reportModal.reportId')}:</strong> DR-{Math.floor(100000 + Math.random() * 900000)}</div>
              <div><strong className="text-slate-700 dark:text-slate-300">{t('reportModal.date')}:</strong> {new Date().toLocaleDateString()}</div>
              <div><strong className="text-slate-700 dark:text-slate-300">{t('reportModal.model')}:</strong> EfficientNetB0</div>
            </div>
          </div>

          {/* Primary Result Box */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">{t('reportModal.diagnosis')}</div>
              <div className={`text-2xl font-extrabold ${currentStage.textColor}`}>
                {currentStage.name} ({t('reportModal.grade')} {currentStage.grade})
              </div>
              <div className="text-xs text-slate-500 font-mono mt-1">ICD-10: {currentStage.icd10}</div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 uppercase">{t('reportModal.confidence')}</div>
              <div className="text-3xl font-black text-teal-600 dark:text-teal-400">{confidencePercent}%</div>
            </div>
          </div>

          {/* Image & Probability Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Image Preview */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">{t('reportModal.imageScan')}</div>
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-black border border-slate-800">
                <img src={selectedImage?.url} alt="Fundus Scan" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Probability breakdown */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase">{t('reportModal.probabilities')}</div>
              <div className="space-y-2">
                {DR_STAGES.map((stageBase) => {
                  const prob = probabilities[stageBase.key] ?? probabilities[stageBase.name] ?? 0;
                  const probPct = (prob * 100).toFixed(1);
                  const isPredicted = stageBase.key === currentStage.key;
                  const stageLocal = getDRStage(stageBase.key);
                  return (
                    <div key={stageBase.key} className="text-xs space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className={isPredicted ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500'}>
                          {stageLocal.name}
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
            <div className="font-bold text-blue-900 dark:text-blue-300 uppercase">{t('reportModal.recommendation')}</div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{currentStage.recommendation}</p>
            <div className="font-mono text-teal-700 dark:text-teal-400 font-bold pt-1">
              {t('reportModal.followUp')}: {currentStage.followUp}
            </div>
          </div>

          {/* Disclaimer footer */}
          <div className="text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4 text-center">
            {t('reportModal.disclaimer')}
          </div>

        </div>

      </div>
    </div>
  );
}

