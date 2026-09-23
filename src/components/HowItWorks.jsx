import React from 'react';
import {
  Upload,
  ScanSearch,
  WandSparkles,
  Activity,
  Brain,
  FileText,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

import "../templates/Hero.css";

export default function HowItWorks({ onStartUpload }) {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Image",
      subtitle: "Retinal Fundus Image",
      description:
        "Upload a retinal fundus image in JPG, JPEG, or PNG format. The system accepts the image as the starting point for the automated screening pipeline.",
      color: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/20",
      accent: "text-blue-600 dark:text-blue-400",
      bgBadge: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    },

    {
      number: "02",
      icon: ScanSearch,
      title: "Quality Check",
      subtitle: "Image Compatibility",
      description:
        "The uploaded fundus image is checked for compatibility and quality to determine whether it is suitable for reliable AI-based retinal analysis.",
      color: "from-indigo-500 to-violet-600",
      shadow: "shadow-indigo-500/20",
      accent: "text-indigo-600 dark:text-indigo-400",
      bgBadge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
    },

    {
      number: "03",
      icon: WandSparkles,
      title: "Image Enhancement",
      subtitle: "Preprocessing & Optimization",
      description:
        "If required, the retinal image is enhanced and optimized according to the model requirements to improve its suitability for downstream analysis.",
      color: "from-violet-500 to-purple-600",
      shadow: "shadow-violet-500/20",
      accent: "text-violet-600 dark:text-violet-400",
      bgBadge: "bg-violet-500/10 text-violet-600 dark:text-violet-400"
    },

    {
      number: "04",
      icon: Activity,
      title: "Severity Detection",
      subtitle: "Diabetic Retinopathy Grading",
      description:
        "The deep learning model analyzes retinal features and predicts the diabetic retinopathy severity stage based on the detected retinal patterns.",
      color: "from-teal-500 to-emerald-600",
      shadow: "shadow-teal-500/20",
      accent: "text-teal-600 dark:text-teal-400",
      bgBadge: "bg-teal-500/10 text-teal-600 dark:text-teal-400"
    },

    {
      number: "05",
      icon: Brain,
      title: "Grad-CAM Heatmap",
      subtitle: "Explainable AI",
      description:
        "Grad-CAM generates a visual heatmap highlighting the regions of the retinal image that contributed most to the model's prediction.",
      color: "from-cyan-500 to-blue-600",
      shadow: "shadow-cyan-500/20",
      accent: "text-cyan-600 dark:text-cyan-400",
      bgBadge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
    },

    {
      number: "06",
      icon: FileText,
      title: "Generate Report",
      subtitle: "Clinical Screening Report",
      description:
        "The analysis results, severity grade, confidence information, and explainable AI findings are compiled into an easy-to-understand screening report.",
      color: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20",
      accent: "text-emerald-600 dark:text-emerald-400",
      bgBadge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    }
  ];

  return (
    <section
      id="how-it-works"
      className="py-16 md:py-24 border-y border-slate-200/80 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            6-Step AI Screening Pipeline
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How DR Vision AI Works
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            From retinal image quality assessment to explainable severity
            detection and automated reporting, our AI pipeline guides the
            image through every stage of the screening process.
          </p>

        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">

          {steps.map((step, idx) => {
            const IconComponent = step.icon;

            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col justify-between p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 group"
              >

                <div>

                  {/* Icon & Number */}
                  <div className="flex items-center justify-between mb-6">

                    <div
                      className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg ${step.shadow} group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>

                    <span className="text-3xl font-black text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors">
                      {step.number}
                    </span>

                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Step {idx + 1}: {step.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-3">
                    {step.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>

                </div>

                {/* Bottom Indicator */}
                <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">

                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-md ${step.bgBadge}`}
                  >
                    {idx === 4 ? "Explainable AI" : "AI Pipeline"}
                  </span>

                  {idx < steps.length - 1 ? (
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  )}

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}