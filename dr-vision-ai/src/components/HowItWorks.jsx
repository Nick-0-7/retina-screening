import React from 'react';
import { Upload, Cpu, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onStartUpload }) {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Image",
      subtitle: "Upload Retinal Fundus",
      description: "Upload a high-resolution retinal fundus photo (JPG, JPEG, PNG) or select one of our pre-configured clinical test samples.",
      color: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/20",
      accent: "text-blue-600 dark:text-blue-400",
      bgBadge: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    },
    {
      number: "02",
      icon: Cpu,
      title: "AI Analysis",
      subtitle: "EfficientNetB0 Processing",
      description: "The deep learning model resizes image to 224×224, extracts microvascular features, and evaluates lesion patterns across neural layers.",
      color: "from-teal-500 to-emerald-600",
      shadow: "shadow-teal-500/20",
      accent: "text-teal-600 dark:text-teal-400",
      bgBadge: "bg-teal-500/10 text-teal-600 dark:text-teal-400"
    },
    {
      number: "03",
      icon: CheckCircle2,
      title: "Get Results",
      subtitle: "Severity & Biomarkers",
      description: "View the predicted diabetic retinopathy severity stage (0-4), confidence score, full probability distribution, and clinical recommendations.",
      color: "from-cyan-500 to-blue-600",
      shadow: "shadow-cyan-500/20",
      accent: "text-cyan-600 dark:text-cyan-400",
      bgBadge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            Simple 3-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How DR Vision AI Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Our automated deep learning workflow evaluates retinal fundus images in seconds to support early detection and grading.
          </p>
        </div>

        {/* 3 Step Cards Grid with Connecting Lines */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Horizontal Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] -translate-y-8 h-0.5 bg-gradient-to-r from-blue-500/30 via-teal-500/50 to-cyan-500/30 z-0 pointer-events-none" />

          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col justify-between p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  {/* Top Badge & Step Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg ${step.shadow} group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Step {idx + 1}: {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Step Indicator */}
                <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${step.bgBadge}`}>
                    Verified Pipeline
                  </span>
                  {idx < 2 ? (
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  )}
                </div>

              </div>
            );
          })}

        </div>

        {/* CTA Banner */}
        <div className="mt-16 text-center">
          <button
            onClick={onStartUpload}
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all hover:scale-[1.02]"
          >
            <span>Try AI Analysis Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
