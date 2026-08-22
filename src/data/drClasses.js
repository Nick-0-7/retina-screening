// Data for Diabetic Retinopathy Severity Stages & Specifications

export const DR_STAGES = [
  {
    id: "No_DR",
    key: "No_DR",
    name: "No Diabetic Retinopathy",
    grade: 0,
    shortName: "No DR",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    gradientColor: "from-emerald-500 to-teal-600",
    barColor: "bg-emerald-500",
    textColor: "text-emerald-600 dark:text-emerald-400",
    description: "No signs of diabetic retinopathy detected in the fundus image. Retinal blood vessels appear healthy without microaneurysms or hemorrhages.",
    symptoms: [
      "Normal retinal vascular structure",
      "Sharp optic disc margins",
      "Clear macular region without exudates",
      "No visible microaneurysms"
    ],
    recommendation: "Routine annual diabetic eye screening recommended. Maintain glycemic control and blood pressure target levels.",
    followUp: "12 Months",
    icd10: "E11.319 (Without retinopathy)",
    sampleImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "Mild",
    key: "Mild",
    name: "Mild Diabetic Retinopathy",
    grade: 1,
    shortName: "Mild",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    gradientColor: "from-blue-500 to-cyan-600",
    barColor: "bg-blue-500",
    textColor: "text-blue-600 dark:text-blue-400",
    description: "Microaneurysms only. Early localized balloon-like swellings in small retinal blood vessels.",
    symptoms: [
      "Isolated microaneurysms present",
      "Minimal capillary dilation",
      "No retinal hemorrhages observed",
      "Macula remains uninvolved"
    ],
    recommendation: "Schedule a follow-up dilated eye examination in 6-12 months. Optimize HbA1c and lipid levels.",
    followUp: "6 - 12 Months",
    icd10: "E11.329 (Mild nonproliferative DR)",
    sampleImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "Moderate",
    key: "Moderate",
    name: "Moderate Diabetic Retinopathy",
    grade: 2,
    shortName: "Moderate",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    gradientColor: "from-amber-500 to-orange-600",
    barColor: "bg-amber-500",
    textColor: "text-amber-600 dark:text-amber-400",
    description: "More than microaneurysms but less than Severe NPDR. Features intraretinal hemorrhages, hard exudates, or cotton wool spots.",
    symptoms: [
      "Multiple microaneurysms and dot hemorrhages",
      "Hard exudates around macular periphery",
      "Mild venous beading in 1 quadrant",
      "Cotton wool spots (microinfarcts)"
    ],
    recommendation: "Comprehensive ophthalmic evaluation every 3-6 months. Consider Optical Coherence Tomography (OCT) scan to evaluate macular edema.",
    followUp: "3 - 6 Months",
    icd10: "E11.339 (Moderate nonproliferative DR)",
    sampleImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "Severe",
    key: "Severe",
    name: "Severe Diabetic Retinopathy",
    grade: 3,
    shortName: "Severe",
    badgeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
    gradientColor: "from-orange-500 to-red-500",
    barColor: "bg-orange-500",
    textColor: "text-orange-600 dark:text-orange-400",
    description: "Severe Non-Proliferative DR (4-2-1 rule met): Intraretinal hemorrhages in 4 quadrants, venous beading in 2+ quadrants, or IRMA in 1+ quadrant.",
    symptoms: [
      "Widespread intraretinal hemorrhages in >4 quadrants",
      "Venous beading in 2 or more quadrants",
      "Intraretinal microvascular abnormalities (IRMA)",
      "High risk of progression to proliferative stage"
    ],
    recommendation: "Prompt referral to a retina specialist within 2-4 weeks. Panretinal photocoagulation (PRP) or Anti-VEGF therapy evaluation.",
    followUp: "2 - 4 Weeks (Specialist Referral)",
    icd10: "E11.349 (Severe nonproliferative DR)",
    sampleImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "Proliferate_DR",
    key: "Proliferate_DR",
    name: "Proliferative Diabetic Retinopathy",
    grade: 4,
    shortName: "Proliferative DR",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    gradientColor: "from-rose-600 to-red-700",
    barColor: "bg-rose-600",
    textColor: "text-rose-600 dark:text-rose-400",
    description: "Advanced stage characterized by Neovascularization (growth of fragile new abnormal blood vessels). High risk of vitreous hemorrhage or retinal detachment.",
    symptoms: [
      "Neovascularization at disc (NVD) or elsewhere (NVE)",
      "Preretinal or vitreous hemorrhage",
      "Fibrovascular tissue proliferation",
      "Tractional retinal detachment risk"
    ],
    recommendation: "URGENT referral to retina specialist. Immediate panretinal photocoagulation (PRP) laser or anti-VEGF injections required to preserve vision.",
    followUp: "Urgent (Within 48-72 hours)",
    icd10: "E11.359 (Proliferative DR with maculopathy)",
    sampleImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
  }
];

export const MODEL_SPECS = {
  name: "EfficientNetB0",
  architecture: "Convolutional Neural Network (Compound Scaling)",
  inputDimensions: "224 × 224 × 3 (RGB)",
  totalClasses: 5,
  weights: "ImageNet Pre-trained + Fine-Tuned on Kaggle EyePACS / APTOS 2019 Datasets",
  framework: "TensorFlow 2.x / Keras",
  accuracy: "94.2% Validation Accuracy",
  aucRoc: "0.968 Mean AUC-ROC",
  inferenceTime: "~120ms (GPU) / ~380ms (CPU)"
};

