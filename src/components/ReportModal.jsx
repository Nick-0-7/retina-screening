import React, { useMemo } from "react";
import html2pdf from "html2pdf.js";

import {
  X,
  Printer,
  Download,
  Activity,
  User,
  Eye,
  FileText,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

import { DR_STAGES } from "../data/drClasses";

export default function ReportModal({
  isOpen,
  onClose,
  predictionResult,
  selectedImage,
  patientData = {},
  doctorData = {},
}) {
  const reportId = useMemo(() => {
    return `DRV${new Date().getFullYear()}${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}${String(
      new Date().getDate()
    ).padStart(2, "0")}${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }, []);

  if (!isOpen || !predictionResult) return null;

  // =====================================================
  // RESULT DATA
  // =====================================================

  const predictedClassKey =
    predictionResult.predicted_class || "Moderate";

  const confidence =
    typeof predictionResult.confidence === "number"
      ? predictionResult.confidence
      : 0;

  const confidencePercent = (confidence * 100).toFixed(1);

  const currentStage =
    DR_STAGES.find(
      (stage) => stage.key === predictedClassKey
    ) || DR_STAGES[2];

  const probabilities =
    predictionResult.probabilities || {};

  // =====================================================
  // REPORT INFORMATION
  // =====================================================

  const reportDate = new Date().toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  // =====================================================
  // PATIENT DATA
  // =====================================================

  const patientName =
    patientData.name || "Not provided";

  const patientAge = patientData.age
    ? `${patientData.age} years`
    : "Not provided";

  const patientSex =
    patientData.sex || "Not provided";

  const bloodSugar =
    patientData.bloodSugar || "Not provided";

  const spectacleNumber =
    patientData.spectacleNumber ||
    "No spectacle correction reported";

  const vision =
    patientData.vision || "Not provided";

  const floatingSpots =
    patientData.floatingSpots === "Yes"
      ? "Yes"
      : patientData.floatingSpots === "No"
      ? "No"
      : "Not provided";

  const affectedEye =
    patientData.affectedEye || "Not provided";

  // =====================================================
  // DOCTOR DATA
  // =====================================================

  const doctorName =
    doctorData.name ||
    "Authorized Medical Professional";

  const doctorSpecialization =
    doctorData.specialization ||
    "Ophthalmologist";

  const doctorRegistration =
    doctorData.registration ||
    "Not provided";

  const medicalCouncil =
    doctorData.medicalCouncil ||
    "Not provided";

  const center =
    doctorData.center ||
    "Rural Health Center, Kolhapur";

  // =====================================================
  // SCREENING RESULT
  // =====================================================

  const isNoDR =
    predictedClassKey === "No DR" ||
    predictedClassKey === "No_DR" ||
    predictedClassKey === "NoDR" ||
    predictedClassKey === "Normal";

  const isPositive = !isNoDR;

  const riskCategory =
    predictedClassKey === "No DR" ||
    predictedClassKey === "Normal"
      ? "Low"
      : predictedClassKey === "Mild"
      ? "Moderate"
      : predictedClassKey === "Moderate"
      ? "High"
      : predictedClassKey === "Severe"
      ? "Very High"
      : "High";

  const screeningResult = isPositive
    ? "Positive for Diabetic Retinopathy"
    : "No Diabetic Retinopathy Detected";

  // =====================================================
  // RETINAL FINDINGS
  // =====================================================

  const retinalFindings =
    predictionResult.findings || {
      microaneurysms: null,
      hemorrhages: null,
      hardExudates: null,
      macularInvolvement: null,
      abnormalBloodVessels: null,
    };

  const findingStatus = (value) => {
    if (
      value === true ||
      value === "Detected"
    ) {
      return {
        label: "Detected",
        type: "detected",
      };
    }

    if (
      value === false ||
      value === "Not detected"
    ) {
      return {
        label: "Not detected",
        type: "not-detected",
      };
    }

    return {
      label: "Not assessed",
      type: "not-assessed",
    };
  };

  const findingRows = [
    {
      name: "Microaneurysms",
      key: "microaneurysms",
      symptom:
        "Usually no noticeable symptoms in early stages.",
    },
    {
      name: "Retinal Hemorrhages",
      key: "hemorrhages",
      symptom:
        "Blurred vision or visual disturbances may occur.",
    },
    {
      name: "Hard Exudates",
      key: "hardExudates",
      symptom:
        "Blurred or distorted vision may occur.",
    },
    {
      name: "Macular Involvement",
      key: "macularInvolvement",
      symptom:
        "May affect central or detailed vision.",
    },
    {
      name: "Abnormal Blood Vessels",
      key: "abnormalBloodVessels",
      symptom:
        "Abnormal vessel growth can occur in proliferative disease.",
    },
  ];

  // =====================================================
  // HEATMAP
  // =====================================================

  const heatmapUrl =
    predictionResult.heatmap_url ||
    predictionResult.heatmap ||
    null;

  // =====================================================
  // PRINT REPORT
  // =====================================================

  const handlePrint = () => {
    window.print();
  };

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const handleDownload = () => {
    const element =
      document.getElementById(
        "printable-report-area"
      );

    if (!element) return;

    const safeName = patientName
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-");

    const options = {
      margin: 0,

      filename: `DR-Vision-AI-Report-${safeName}.pdf`,

      image: {
        type: "jpeg",
        quality: 0.98,
      },

      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      },

      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },

      pagebreak: {
        mode: ["css", "legacy"],
        before: [".report-page-2"],
      },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save();
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-slate-950/80
        backdrop-blur-md
        overflow-y-auto
        p-3
        sm:p-6
        print:bg-white
        print:p-0
      "
    >

      {/* =================================================
          REPORT CONTAINER
      ================================================= */}

      <div
        className="
          relative
          w-full
          max-w-6xl
          mx-auto
          my-4
          bg-white
          text-slate-900
          shadow-2xl
          rounded-2xl
          overflow-hidden
          print:shadow-none
          print:rounded-none
        "
      >

        {/* =================================================
            ACTION BAR
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            px-5
            py-4
            border-b
            border-slate-200
            print:hidden
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-slate-600
            "
          >
            <Activity
              className="w-5 h-5 text-teal-600"
            />

            DR Vision AI — Clinical Screening Report
          </div>

          <div className="flex items-center gap-2">

            {/* DOWNLOAD */}

            <button
              onClick={handleDownload}
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-lg
                bg-emerald-600
                hover:bg-emerald-700
                text-white
                text-sm
                font-semibold
                transition
              "
            >
              <Download className="w-4 h-4" />

              Download PDF
            </button>

            {/* PRINT */}

            <button
              onClick={handlePrint}
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-lg
                bg-blue-600
                hover:bg-blue-700
                text-white
                text-sm
                font-semibold
                transition
              "
            >
              <Printer className="w-4 h-4" />

              Print Report
            </button>

            {/* CLOSE */}

            <button
              onClick={onClose}
              className="
                p-2
                rounded-lg
                bg-slate-100
                hover:bg-slate-200
                text-slate-600
              "
            >
              <X className="w-5 h-5" />
            </button>

          </div>

        </div>


        {/* =================================================
            PRINTABLE REPORT
        ================================================= */}

        <div id="printable-report-area">


          {/* =================================================
              PAGE 1
          ================================================= */}

          <div className="report-page">

            {/* ---------------------------------------------
                HEADER
            --------------------------------------------- */}

            <header
              className="
                report-header
                bg-slate-950
                text-white
                px-6
                sm:px-10
                py-5
              "
            >

              <div className="flex justify-between gap-5">

                <div>

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        w-12
                        h-12
                        rounded-full
                        border-4
                        border-slate-400
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Eye className="w-7 h-7" />
                    </div>

                    <div>

                      <h1 className="text-3xl font-black">
                        DR Vision{" "}
                        <span className="text-teal-400">
                          AI
                        </span>
                      </h1>

                      <p className="text-sm text-slate-300">
                        Early Detection • Clearer Tomorrows
                      </p>

                    </div>

                  </div>

                  <p className="mt-3 text-xs text-slate-300">
                    AI-Powered Diabetic Retinopathy Screening
                    <br />
                    for a Healthier India
                  </p>

                </div>


                <div
                  className="
                    text-xs
                    text-right
                    text-slate-300
                    space-y-1
                  "
                >

                  <p>
                    <strong className="text-white">
                      Report ID:
                    </strong>{" "}
                    {reportId}
                  </p>

                  <p>
                    <strong className="text-white">
                      Date:
                    </strong>{" "}
                    {reportDate}
                  </p>

                  <p>
                    <strong className="text-white">
                      Center:
                    </strong>{" "}
                    {center}
                  </p>

                  <p>
                    <strong className="text-white">
                      Generated by:
                    </strong>{" "}
                    DR Vision AI v1.0
                  </p>

                </div>

              </div>

            </header>


            {/* ---------------------------------------------
                REPORT TITLE
            --------------------------------------------- */}

            <section className="px-6 sm:px-10 pt-5">

              <h2 className="text-3xl font-black text-slate-900">
                Retinal Screening Report
              </h2>

              <p className="text-lg text-slate-700">
                AI-Assisted Screening for Diabetic Retinopathy
              </p>

              <p className="text-xs italic text-slate-500 mt-1">
                This report is generated using artificial
                intelligence and is intended for screening
                and referral support, not a final medical
                diagnosis.
              </p>

            </section>


            {/* ---------------------------------------------
                1. PATIENT INFORMATION
            --------------------------------------------- */}

            <ReportSection
              icon={<User className="w-5 h-5" />}
              title="1. Patient Information"
            >

              <div className="grid grid-cols-2 gap-x-8">

                <InfoRow
                  label="Name"
                  value={patientName}
                />

                <InfoRow
                  label="Age"
                  value={patientAge}
                />

                <InfoRow
                  label="Sex"
                  value={patientSex}
                />

                <InfoRow
                  label="Blood Sugar Level"
                  value={bloodSugar}
                />

                <InfoRow
                  label="Spectacle Number"
                  value={spectacleNumber}
                />

                <InfoRow
                  label="Vision"
                  value={vision}
                />

                <InfoRow
                  label="Floating Dark Spots"
                  value={floatingSpots}
                />

                <InfoRow
                  label="Affected Eye"
                  value={affectedEye}
                />

              </div>

            </ReportSection>


            {/* ---------------------------------------------
                EXAMINATION DETAILS
            --------------------------------------------- */}

            <ReportSection
              icon={<ShieldCheck className="w-5 h-5" />}
              title="Examination Details"
            >

              <div className="grid grid-cols-2 gap-x-8">

                <InfoRow
                  label="Examined By"
                  value={doctorName}
                />

                <InfoRow
                  label="Specialization"
                  value={doctorSpecialization}
                />

                <InfoRow
                  label="Medical Registration"
                  value={doctorRegistration}
                />

                <InfoRow
                  label="Medical Council"
                  value={medicalCouncil}
                />

              </div>

            </ReportSection>


            {/* ---------------------------------------------
                2. RETINAL FUNDUS EXAMINATION
            --------------------------------------------- */}

            <ReportSection
              icon={<Eye className="w-5 h-5" />}
              title="2. Retinal Fundus Examination"
            >

              <div className="grid grid-cols-2 gap-5">

                {/* ORIGINAL IMAGE */}

                <div>

                  <h3 className="text-center font-bold text-sm mb-2">
                    Original Fundus Image
                    {affectedEye !== "Not provided"
                      ? ` (${affectedEye})`
                      : ""}
                  </h3>

                  <div
                    className="
                      aspect-square
                      bg-black
                      rounded-lg
                      overflow-hidden
                      border
                      border-slate-300
                    "
                  >

                    {selectedImage?.url ? (

                      <img
                        src={selectedImage.url}
                        alt="Original retinal fundus"
                        className="
                          w-full
                          h-full
                          object-contain
                        "
                      />

                    ) : (

                      <div
                        className="
                          w-full
                          h-full
                          flex
                          items-center
                          justify-center
                          text-slate-400
                          text-sm
                        "
                      >
                        Fundus image unavailable
                      </div>

                    )}

                  </div>

                </div>


                {/* HEATMAP */}

                <div>

                  <h3 className="text-center font-bold text-sm mb-2">
                    AI Heatmap — Detected Regions
                  </h3>

                  <div
                    className="
                      aspect-square
                      bg-black
                      rounded-lg
                      overflow-hidden
                      border
                      border-slate-300
                    "
                  >

                    {heatmapUrl ? (

                      <img
                        src={heatmapUrl}
                        alt="AI retinal heatmap"
                        className="
                          w-full
                          h-full
                          object-contain
                        "
                      />

                    ) : (

                      <div
                        className="
                          w-full
                          h-full
                          flex
                          flex-col
                          items-center
                          justify-center
                          text-center
                          p-5
                        "
                      >

                        <Activity
                          className="
                            w-8
                            h-8
                            text-slate-500
                            mb-2
                          "
                        />

                        <p className="text-slate-300 font-semibold text-sm">
                          AI Heatmap Not Available
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          The current model response does not
                          contain a lesion or attention heatmap.
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              </div>


              {/* HEATMAP INFORMATION */}

              <div
                className="
                  mt-3
                  p-3
                  rounded-lg
                  bg-blue-50
                  border
                  border-blue-100
                  text-xs
                  text-blue-900
                "
              >

                <strong>
                  Heatmap interpretation:
                </strong>{" "}

                Highlighted regions, when provided by the
                AI model, represent areas contributing to
                the model prediction. They should not be
                interpreted as definitive lesion segmentation.

              </div>

            </ReportSection>


            {/* ---------------------------------------------
                3. RETINAL FINDINGS
            --------------------------------------------- */}

            <ReportSection
              icon={<FileText className="w-5 h-5" />}
              title="3. Detected Retinal Findings & Symptoms"
            >

              <div className="overflow-x-auto">

                <table className="w-full text-xs border-collapse">

                  <thead>

                    <tr className="bg-slate-100">

                      <th className="border border-slate-200 p-2 text-left">
                        Retinal Finding
                      </th>

                      <th className="border border-slate-200 p-2 text-left">
                        Detected in Fundus Image
                      </th>

                      <th className="border border-slate-200 p-2 text-left">
                        Associated Symptom / Notes
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {findingRows.map((finding) => {

                      const status =
                        findingStatus(
                          retinalFindings[
                            finding.key
                          ]
                        );

                      return (

                        <tr key={finding.key}>

                          <td
                            className="
                              border
                              border-slate-200
                              p-2
                              font-semibold
                            "
                          >
                            {finding.name}
                          </td>

                          <td className="border border-slate-200 p-2">

                            <StatusBadge
                              type={status.type}
                              label={status.label}
                            />

                          </td>

                          <td
                            className="
                              border
                              border-slate-200
                              p-2
                              text-slate-600
                            "
                          >

                            {status.type === "detected"
                              ? finding.symptom
                              : status.type ===
                                "not-detected"
                              ? "No corresponding finding detected by the current model."
                              : "The current AI model does not specifically assess this finding."}

                          </td>

                        </tr>

                      );

                    })}

                  </tbody>

                </table>

              </div>


              {/* PATIENT SYMPTOMS */}

              <div
                className="
                  mt-3
                  p-3
                  rounded-lg
                  bg-slate-50
                  border
                  border-slate-200
                "
              >

                <h4 className="font-bold text-xs mb-2">
                  Patient-Reported Symptoms
                </h4>

                <div className="grid grid-cols-3 gap-3 text-xs text-slate-700">

                  <div>
                    Floating dark spots:
                    <strong className="ml-1">
                      {floatingSpots}
                    </strong>
                  </div>

                  <div>
                    Vision:
                    <strong className="ml-1">
                      {vision}
                    </strong>
                  </div>

                  <div>
                    Affected eye:
                    <strong className="ml-1">
                      {affectedEye}
                    </strong>
                  </div>

                </div>

                <p className="text-[10px] text-slate-500 mt-2">
                  Symptoms such as floaters or blurred vision
                  are not specific to diabetic retinopathy and
                  may have other causes.
                </p>

              </div>

            </ReportSection>

          </div>


          {/* =================================================
              PAGE 2
          ================================================= */}

          <div className="report-page report-page-2">

            {/* ---------------------------------------------
                PAGE 2 HEADER
            --------------------------------------------- */}

            <div className="px-6 sm:px-10 pt-5">

              <h2 className="text-xl font-black text-slate-900">
                AI Assessment & Clinical Recommendation
              </h2>

              <p className="text-xs text-slate-500">
                Continuation of Retinal Screening Report —{" "}
                {patientName}
              </p>

            </div>


            {/* ---------------------------------------------
                4 / 5 / 6 RESULT CARDS
            --------------------------------------------- */}

            <div className="px-6 sm:px-10 mt-5 grid grid-cols-3 gap-4">


              {/* 4. SCREENING RESULT */}

              <div
                className="
                  border
                  border-slate-200
                  rounded-xl
                  overflow-hidden
                "
              >

                <div
                  className="
                    bg-slate-100
                    px-4
                    py-3
                    font-bold
                    text-sm
                  "
                >
                  4. AI Screening Result
                </div>

                <div className="p-4">

                  <div
                    className="
                      text-[10px]
                      font-bold
                      text-slate-500
                      uppercase
                    "
                  >
                    DR Positivity Risk
                  </div>

                  <div className="text-2xl font-black text-red-600 mt-1">
                    {riskCategory}
                  </div>

                  <div
                    className="
                      mt-4
                      text-[10px]
                      font-bold
                      text-slate-500
                      uppercase
                    "
                  >
                    AI Screening Result
                  </div>

                  <div className="text-sm font-extrabold text-red-600 mt-1">
                    {screeningResult}
                  </div>

                  <div className="mt-3 text-xs">
                    <strong>
                      AI Confidence:
                    </strong>{" "}
                    {confidencePercent}%
                  </div>

                </div>

              </div>


              {/* 5. SEVERITY */}

              <div
                className="
                  border
                  border-slate-200
                  rounded-xl
                  overflow-hidden
                "
              >

                <div
                  className="
                    bg-slate-100
                    px-4
                    py-3
                    font-bold
                    text-sm
                  "
                >
                  5. Severity Grade
                </div>

                <div className="p-4">

                  <div
                    className="
                      text-[10px]
                      font-bold
                      text-orange-600
                      uppercase
                    "
                  >
                    AI-Assessed Severity
                  </div>

                  <div
                    className="
                      text-base
                      font-extrabold
                      text-orange-700
                      mt-2
                    "
                  >
                    {currentStage.name}
                  </div>

                  <div className="text-xs text-slate-600 mt-1">
                    Grade {currentStage.grade}
                  </div>

                  <div
                    className="
                      mt-3
                      text-[10px]
                      font-bold
                      text-slate-500
                      uppercase
                    "
                  >
                    ICD-10
                  </div>

                  <div className="font-mono text-xs mt-1">
                    {currentStage.icd10}
                  </div>

                </div>

              </div>


              {/* 6. RECOMMENDATION */}

              <div
                className="
                  border
                  border-slate-200
                  rounded-xl
                  overflow-hidden
                "
              >

                <div
                  className="
                    bg-slate-100
                    px-4
                    py-3
                    font-bold
                    text-sm
                  "
                >
                  6. Recommendation
                </div>

                <div className="p-4">

                  <div className="font-bold text-green-700">
                    Referral Recommended
                  </div>

                  <div className="text-xl font-black">
                    {isPositive
                      ? "Yes"
                      : "As Clinically Indicated"}
                  </div>

                  <p
                    className="
                      text-xs
                      text-slate-600
                      mt-3
                      leading-relaxed
                    "
                  >
                    {currentStage.recommendation}
                  </p>

                  <div
                    className="
                      mt-3
                      p-2
                      rounded-lg
                      bg-blue-50
                      text-[10px]
                      text-blue-900
                    "
                  >
                    <strong>
                      Suggested follow-up:
                    </strong>{" "}
                    {currentStage.followUp}
                  </div>

                </div>

              </div>

            </div>


            {/* ---------------------------------------------
                7. CLASSIFICATION PROBABILITIES
            --------------------------------------------- */}

            <ReportSection
              icon={<BarChart3 className="w-5 h-5" />}
              title="7. AI Classification Probabilities"
            >

              <div className="space-y-3">

                {DR_STAGES.map((stage) => {

                  const prob =
                    probabilities[stage.key] ??
                    probabilities[stage.name] ??
                    0;

                  const probPct =
                    (prob * 100).toFixed(1);

                  const isPredicted =
                    stage.key ===
                    currentStage.key;

                  return (

                    <div key={stage.key}>

                      <div className="flex justify-between text-xs mb-1">

                        <span
                          className={
                            isPredicted
                              ? "font-bold"
                              : "text-slate-600"
                          }
                        >
                          {stage.name}
                        </span>

                        <span
                          className={
                            isPredicted
                              ? "font-bold text-blue-600"
                              : "text-slate-500"
                          }
                        >
                          {probPct}%
                        </span>

                      </div>

                      <div
                        className="
                          w-full
                          h-2
                          rounded-full
                          bg-slate-200
                          overflow-hidden
                        "
                      >

                        <div
                          className={`h-full ${
                            isPredicted
                              ? "bg-blue-600"
                              : "bg-slate-400"
                          }`}
                          style={{
                            width: `${probPct}%`,
                          }}
                        />

                      </div>

                    </div>

                  );

                })}

              </div>

            </ReportSection>


            {/* ---------------------------------------------
                CLINICAL INTERPRETATION
            --------------------------------------------- */}

            <section
              className="
                mx-6
                sm:mx-10
                mt-5
                p-4
                rounded-xl
                bg-blue-50
                border
                border-blue-100
              "
            >

              <h3 className="font-bold text-blue-900 text-sm">
                Clinical Interpretation & Recommendation
              </h3>

              <p
                className="
                  text-xs
                  text-slate-700
                  mt-2
                  leading-relaxed
                "
              >
                {currentStage.recommendation}
              </p>

              <p className="text-xs font-semibold text-blue-800 mt-3">
                Suggested Re-screening Timeline:{" "}
                {currentStage.followUp}
              </p>

            </section>


            {/* ---------------------------------------------
                DOCTOR SIGNATURE
            --------------------------------------------- */}

            <section
              className="
                mx-6
                sm:mx-10
                mt-8
                grid
                grid-cols-2
                gap-10
              "
            >

              <div>

                <p className="text-[10px] text-slate-500">
                  Report generated by
                </p>

                <p className="font-bold text-sm mt-1">
                  DR Vision AI
                </p>

                <p className="text-[10px] text-slate-500">
                  AI-Assisted Retinal Screening System
                </p>

              </div>


              <div className="text-right">

                <div className="h-8 border-b border-slate-400 mb-2" />

                <p className="font-bold text-sm">
                  {doctorName}
                </p>

                <p className="text-[10px] text-slate-500">
                  {doctorSpecialization}
                </p>

                <p className="text-[10px] text-slate-500">
                  Reg. No: {doctorRegistration}
                </p>

              </div>

            </section>


            {/* ---------------------------------------------
                FOOTER
            --------------------------------------------- */}

            <footer
              className="
                bg-slate-950
                text-white
                px-6
                py-4
                mt-8
              "
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="font-semibold text-sm">
                    DR Vision AI
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Explain • Detect • Empower
                  </p>

                </div>

                <p className="text-xs italic text-slate-300">
                  “Because every vision matters.”
                </p>

              </div>

              <div
                className="
                  border-t
                  border-slate-700
                  mt-3
                  pt-2
                  text-[9px]
                  text-slate-400
                  text-center
                "
              >
                This report is an AI-assisted screening output
                and is not a substitute for clinical examination,
                ophthalmological assessment, or professional
                medical diagnosis.
              </div>

            </footer>

          </div>

        </div>


        {/* =================================================
            PRINT CSS
        ================================================= */}

        <style>
          {`
            .report-page {
              background: #ffffff;
              width: 100%;
              box-sizing: border-box;
            }

            @media print {

              html,
              body {
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
              }

              body * {
                visibility: hidden;
              }

              #printable-report-area,
              #printable-report-area * {
                visibility: visible;
              }

              #printable-report-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                background: white;
              }

              .report-page {
                width: 100%;
                min-height: 277mm;
                box-sizing: border-box;

                page-break-after: always;
                break-after: page;

                overflow: hidden;
              }

              .report-page:last-child {
                page-break-after: auto;
                break-after: auto;
              }

              .report-page-2 {
                page-break-before: always;
                break-before: page;
              }

              @page {
                size: A4 portrait;
                margin: 8mm;
              }

              .report-header,
              footer,
              .bg-slate-100,
              .bg-blue-50,
              .bg-slate-50 {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }

              table,
              tr,
              img {
                break-inside: avoid;
              }

            }
          `}
        </style>

      </div>

    </div>
  );
}


// ========================================================
// REPORT SECTION
// ========================================================

function ReportSection({
  icon,
  title,
  children,
}) {
  return (
    <section
      className="
        mx-6
        sm:mx-10
        mt-5
        border
        border-slate-200
        rounded-xl
        overflow-hidden
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
          bg-slate-100
          px-4
          py-3
          text-slate-900
        "
      >

        <span className="text-slate-700">
          {icon}
        </span>

        <h2 className="font-bold text-lg">
          {title}
        </h2>

      </div>

      <div className="p-4">
        {children}
      </div>

    </section>
  );
}


// ========================================================
// INFORMATION ROW
// ========================================================

function InfoRow({
  label,
  value,
}) {
  return (
    <div
      className="
        grid
        grid-cols-[150px_15px_1fr]
        py-2
        border-b
        border-slate-100
        text-sm
      "
    >

      <span className="font-semibold text-slate-700">
        {label}
      </span>

      <span>
        :
      </span>

      <span className="text-slate-800">
        {value}
      </span>

    </div>
  );
}


// ========================================================
// STATUS BADGE
// ========================================================

function StatusBadge({
  type,
  label,
}) {

  const styles = {
    detected:
      "bg-green-100 text-green-700 border-green-200",

    "not-detected":
      "bg-red-100 text-red-700 border-red-200",

    "not-assessed":
      "bg-orange-100 text-orange-700 border-orange-200",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        px-2.5
        py-1
        rounded-md
        border
        text-xs
        font-semibold
        ${styles[type]}
      `}
    >
      {label}
    </span>
  );
}