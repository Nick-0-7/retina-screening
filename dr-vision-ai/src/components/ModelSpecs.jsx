import React from 'react';
import { MODEL_SPECS, DR_STAGES } from '../data/drClasses';
import { Cpu, Layers, Image as ImageIcon, Target, Award, CheckCircle } from 'lucide-react';

export default function ModelSpecs() {
  return (
    <section id="model-specs" className="py-16 md:py-24 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-blue-500" />
            <span>Deep Learning Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            DenseNet Model Specifications
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Engineered with dense connectivity for optimal feature reuse, gradient flow, and high accuracy.
          </p>
        </div>

        {/* 4 Core Parameter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Architecture</span>
              <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              DenseNet
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Densely Connected Convolutional Networks
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Input Resolution</span>
              <ImageIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              224 × 224
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              3 Channels (RGB Fundus Input)
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Classes</span>
              <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              5 Severity Classes
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Grade 0 to Grade 4 Multi-class Softmax
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Performance</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              94.2% Acc / 0.968 AUC
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              EyePACS & APTOS 2019 Fine-Tuned
            </p>
          </div>

        </div>

        {/* Breakdown of 5 Classification Classes */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                5 Classification Classes & Severity Grades
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ICD-10 clinical grading criteria recognized by international ophthalmology standards
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold">
              Keras Dense(5, activation='softmax')
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {DR_STAGES.map((stage) => (
              <div
                key={stage.key}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">Grade {stage.grade}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.barColor}`} />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {stage.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    {stage.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] font-mono text-teal-600 dark:text-teal-400">
                  Follow-up: {stage.followUp}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
