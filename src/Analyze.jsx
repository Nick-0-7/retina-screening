
import React, { useState, useEffect } from "react";
import {
  UserRound,
  Calendar,
  Droplets,
  Glasses,
  Eye,
  Activity,
  Upload,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  History,
  Settings,
  LogOut,
  FileText,
  Plus,
  ShieldCheck,
} from "lucide-react";

import Analyzer from "./components/Analyzer";
import ScanningModal from "./components/ScanningModal";
import Results from "./components/Results";
import ReportModal from "./components/ReportModal";

import { analyzeRetinalImage } from "./services/api";

export default function Analyze() {

  // ======================================================
  // DARK MODE
  // ======================================================

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("dr_vision_theme");

    if (savedTheme !== null) {
      return savedTheme === "dark";
    }

    return window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
  });


  // ======================================================
  // SIDEBAR
  // ======================================================

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [doctorMenuOpen, setDoctorMenuOpen] = useState(false);


  // ======================================================
  // PATIENT INFORMATION
  // ======================================================

  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    sex: "",
    bloodSugar: "",
    spectacleNumber: "",
    vision: "",
    floatingSpots: "",
    affectedEye: "",
  });


  // ======================================================
  // ANALYSIS STATE
  // ======================================================

  const [selectedImage, setSelectedImage] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showReport, setShowReport] = useState(false);

  // Selected patient from sidebar history
  const [selectedHistoryPatient, setSelectedHistoryPatient] =
    useState(null);


  // ======================================================
  // DOCTOR
  // ======================================================

  const doctor = {
    name: "Dr. Ananya Sharma",
    specialization: "Ophthalmologist",
    registration: "MMC-123456",
    medicalCouncil: "Maharashtra Medical Council",
    center: "Rural Health Center, Kolhapur",
  };


  // ======================================================
  // HISTORY
  // ======================================================
  // Demo data for now.
  // Later this can come from your backend/database.
  // ======================================================

  const analysisHistory = [
    {
      id: 1,
      patient: "Rahul Patil",
      result: "Moderate DR",
      date: "Today, 10:42 AM",

      patientData: {
        name: "Rahul Patil",
        age: "52",
        sex: "Male",
        bloodSugar: "168 mg/dL",
        spectacleNumber: "R -1.50 / L -1.75",
        vision: "6/12",
        floatingSpots: "Yes",
        affectedEye: "Both Eyes",
      },

      predictionResult: {
        prediction: "Moderate DR",
        confidence: 92,
        severity: "Moderate",
      },

      image: "/images/rahul-fundus.jpg",
    },

    {
      id: 2,
      patient: "Sneha Joshi",
      result: "No DR",
      date: "Today, 09:18 AM",

      patientData: {
        name: "Sneha Joshi",
        age: "45",
        sex: "Female",
        bloodSugar: "112 mg/dL",
        spectacleNumber: "R -0.75 / L -1.00",
        vision: "6/6",
        floatingSpots: "No",
        affectedEye: "None",
      },

      predictionResult: {
        prediction: "No DR",
        confidence: 97,
        severity: "No DR",
      },

      image: "/images/sneha-fundus.jpg",
    },

    {
      id: 3,
      patient: "Amit Kulkarni",
      result: "Mild DR",
      date: "Yesterday, 04:35 PM",

      patientData: {
        name: "Amit Kulkarni",
        age: "58",
        sex: "Male",
        bloodSugar: "154 mg/dL",
        spectacleNumber: "R -2.00 / L -1.50",
        vision: "6/9",
        floatingSpots: "Yes",
        affectedEye: "Right Eye",
      },

      predictionResult: {
        prediction: "Mild DR",
        confidence: 89,
        severity: "Mild",
      },

      image: "/images/amit-fundus.jpg",
    },

    {
      id: 4,
      patient: "Priya Deshmukh",
      result: "Severe DR",
      date: "Yesterday, 11:20 AM",

      patientData: {
        name: "Priya Deshmukh",
        age: "61",
        sex: "Female",
        bloodSugar: "210 mg/dL",
        spectacleNumber: "R -3.00 / L -2.50",
        vision: "6/18",
        floatingSpots: "Yes",
        affectedEye: "Both Eyes",
      },

      predictionResult: {
        prediction: "Severe DR",
        confidence: 95,
        severity: "Severe",
      },

      image: "/images/priya-fundus.jpg",
    },
  ];


  // ======================================================
  // DARK MODE
  // ======================================================

  useEffect(() => {

    if (darkMode) {

      document.documentElement.classList.add("dark");

      localStorage.setItem(
        "dr_vision_theme",
        "dark"
      );

    } else {

      document.documentElement.classList.remove("dark");

      localStorage.setItem(
        "dr_vision_theme",
        "light"
      );
    }

  }, [darkMode]);


  // ======================================================
  // HANDLE PATIENT INPUT
  // ======================================================

  const handlePatientChange = (e) => {

    const { name, value } = e.target;

    setPatientData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMsg(null);
  };


  // ======================================================
  // CHECK PATIENT FORM
  // ======================================================

  const isPatientFormComplete = () => {

    return (
      patientData.name.trim() !== "" &&
      patientData.age !== "" &&
      patientData.sex !== "" &&
      patientData.bloodSugar.trim() !== "" &&
      patientData.spectacleNumber.trim() !== "" &&
      patientData.vision.trim() !== "" &&
      patientData.floatingSpots !== "" &&
      patientData.affectedEye !== ""
    );
  };


  // ======================================================
  // ANALYZE IMAGE
  // ======================================================

  const handleAnalyzeTrigger = async () => {

    if (!isPatientFormComplete()) {

      setErrorMsg(
        "Please complete all patient information before analysis."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }


    if (!selectedImage) {
      setErrorMsg(
        "Please upload a retinal fundus image."
      );
      return;
    }

    if (selectedImage.isRetinalValid === false) {
      setErrorMsg(
        selectedImage.validationMessage ||
        "The uploaded file is not an authentic ocular fundus photograph. Please upload a valid retinal scan."
      );
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const result = await analyzeRetinalImage(
        selectedImage.file || selectedImage.url
      );

      setPredictionResult(result);
      setIsProcessing(false);

      setTimeout(() => {
        const resultsElement =
          document.getElementById("results");

        if (resultsElement) {
          resultsElement.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 100);

    } catch (err) {
      console.error(err);
      setPredictionResult(null);
      setErrorMsg(
        err.message ||
        "Failed to complete retinal image analysis."
      );
      setIsProcessing(false);
    }
  };


  // ======================================================
  // RESET
  // ======================================================

  const handleReset = () => {

    setSelectedImage(null);

    setPredictionResult(null);

    setErrorMsg(null);

    setSelectedHistoryPatient(null);

    setPatientData({
      name: "",
      age: "",
      sex: "",
      bloodSugar: "",
      spectacleNumber: "",
      vision: "",
      floatingSpots: "",
      affectedEye: "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // ======================================================
  // OPEN HISTORY REPORT
  // ======================================================

  const handleHistoryClick = (patient) => {

    setSelectedHistoryPatient(patient);

    setShowReport(true);
  };


  // ======================================================
  // CLOSE REPORT
  // ======================================================

  const handleCloseReport = () => {

    setShowReport(false);

    setSelectedHistoryPatient(null);
  };


  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {

    localStorage.removeItem(
      "doctor_logged_in"
    );

    window.location.href = "/login";
  };


  // ======================================================
  // INPUT STYLE
  // ======================================================

  const inputClass = `
    w-full
    px-4
    py-3
    rounded-xl
    border
    border-slate-200
    dark:border-slate-700
    bg-slate-50
    dark:bg-slate-800
    text-slate-900
    dark:text-white
    outline-none
    focus:border-cyan-500
    focus:ring-4
    focus:ring-cyan-500/10
    transition
  `;


  return (

    <div className="
      min-h-screen
      bg-slate-50
      dark:bg-slate-950
      text-slate-900
      dark:text-slate-100
    ">


      {/* ==================================================
          MOBILE MENU
      ================================================== */}

      <button
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
        className="
          fixed
          top-4
          left-4
          z-50
          lg:hidden
          w-10
          h-10
          rounded-xl
          bg-white
          dark:bg-slate-900
          border
          border-slate-200
          dark:border-slate-800
          flex
          items-center
          justify-center
          shadow-md
        "
      >

        {sidebarOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}

      </button>


      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-40
          h-screen
          w-72
          bg-white
          dark:bg-slate-900
          border-r
          border-slate-200
          dark:border-slate-800
          flex
          flex-col
          transition-transform
          duration-300

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >


        {/* LOGO */}

        <div className="
          h-20
          px-6
          flex
          items-center
          border-b
          border-slate-100
          dark:border-slate-800
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-gradient-to-br
              from-blue-600
              to-cyan-400
              flex
              items-center
              justify-center
            ">

              <Activity
                className="w-5 h-5 text-white"
              />

            </div>

            <div>

              <h1 className="
                font-bold
                text-lg
              ">
                DR Vision AI
              </h1>

              <p className="
                text-[10px]
                tracking-widest
                text-slate-400
              ">
                DOCTOR PORTAL
              </p>

            </div>

          </div>

        </div>


        {/* SIDEBAR CONTENT */}

        <div className="
          flex-1
          overflow-y-auto
          px-4
          py-6
        ">


          {/* NEW ANALYSIS */}

          <button
            onClick={handleReset}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              text-white
              font-semibold
              shadow-lg
              mb-7
            "
          >

            <Plus className="w-5 h-5" />

            New Analysis

          </button>


          {/* HISTORY */}

          <div>

            <div className="
              flex
              items-center
              gap-2
              px-3
              mb-3
            ">

              <History
                className="
                  w-4
                  h-4
                  text-slate-400
                "
              />

              <p className="
                text-[11px]
                font-semibold
                uppercase
                tracking-widest
                text-slate-400
              ">
                Analysis History
              </p>

            </div>


            <div className="space-y-1">

              {analysisHistory.map(
                (item) => (

                  <button
                    key={item.id}
                    onClick={() =>
                      handleHistoryClick(item)
                    }
                    className={`
                      w-full
                      text-left
                      px-3
                      py-3
                      rounded-xl
                      transition
                      hover:bg-slate-50
                      dark:hover:bg-slate-800
                      ${
                        selectedHistoryPatient?.id === item.id
                          ? "bg-slate-100 dark:bg-slate-800"
                          : ""
                      }
                    `}
                  >

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">

                      <div className="
                        w-8
                        h-8
                        rounded-lg
                        bg-slate-100
                        dark:bg-slate-800
                        flex
                        items-center
                        justify-center
                      ">

                        <FileText
                          className="
                            w-4
                            h-4
                            text-slate-400
                          "
                        />

                      </div>


                      <div className="min-w-0">

                        <p className="
                          text-sm
                          font-medium
                          truncate
                        ">
                          {item.patient}
                        </p>

                        <p className="
                          text-xs
                          text-slate-400
                        ">
                          {item.date}
                        </p>

                        <p className="
                          text-[11px]
                          text-cyan-600
                          dark:text-cyan-400
                          mt-0.5
                        ">
                          {item.result}
                        </p>

                      </div>

                    </div>

                  </button>

                )
              )}

            </div>

          </div>

        </div>


        {/* DOCTOR PROFILE */}

        <div className="
          border-t
          border-slate-200
          dark:border-slate-800
          p-4
        ">

          <button
            onClick={() =>
              setDoctorMenuOpen(
                !doctorMenuOpen
              )
            }
            className="
              w-full
              flex
              items-center
              gap-3
              p-2
              rounded-xl
              hover:bg-slate-50
              dark:hover:bg-slate-800
            "
          >

            <div className="
              w-10
              h-10
              rounded-full
              bg-gradient-to-br
              from-blue-500
              to-cyan-400
              flex
              items-center
              justify-center
              text-white
              font-bold
            ">
              AS
            </div>


            <div className="
              flex-1
              text-left
              min-w-0
            ">

              <p className="
                text-sm
                font-semibold
                truncate
              ">
                {doctor.name}
              </p>

              <p className="
                text-xs
                text-slate-400
                truncate
              ">
                {doctor.specialization}
              </p>

            </div>

          </button>


          {doctorMenuOpen && (

            <div className="mt-2 space-y-1">

              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-lg
                  text-sm
                  hover:bg-slate-50
                  dark:hover:bg-slate-800
                "
              >

                <Settings
                  className="w-4 h-4"
                />

                Settings

              </button>


              <button
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-lg
                  text-sm
                  text-red-500
                  hover:bg-red-50
                "
              >

                <LogOut
                  className="w-4 h-4"
                />

                Logout

              </button>

            </div>

          )}

        </div>

      </aside>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="
        lg:ml-72
        min-h-screen
      ">


        {/* HEADER */}

        <header className="
          h-20
          bg-white
          dark:bg-slate-900
          border-b
          border-slate-200
          dark:border-slate-800
          flex
          items-center
          justify-between
          px-6
          lg:px-10
        ">

          <div className="ml-12 lg:ml-0">

            <p className="
              text-xs
              font-semibold
              text-cyan-600
              uppercase
              tracking-wider
            ">
              Clinical Workspace
            </p>

            <h2 className="
              text-xl
              font-bold
            ">
              New Retinal Analysis
            </h2>

          </div>


          <div className="
            hidden
            sm:flex
            items-center
            gap-2
            px-3
            py-2
            rounded-full
            bg-emerald-50
            text-emerald-600
            text-xs
            font-medium
          ">

            <ShieldCheck
              className="w-4 h-4"
            />

            Secure Session

          </div>

        </header>


        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="
          max-w-6xl
          mx-auto
          px-4
          sm:px-6
          lg:px-10
          py-8
        ">


          {/* INTRO */}

          <div className="mb-8">

            <h1 className="
              text-2xl
              sm:text-3xl
              font-bold
            ">
              Patient Information
            </h1>

            <p className="
              mt-1
              text-slate-500
              dark:text-slate-400
            ">
              Enter the patient's clinical details before
              uploading the retinal fundus image.
            </p>

          </div>


          {/* ==================================================
              PATIENT INFORMATION CARD
          ================================================== */}

          <div className="
            bg-white
            dark:bg-slate-900
            rounded-2xl
            border
            border-slate-200
            dark:border-slate-800
            p-6
            sm:p-8
            shadow-sm
            mb-6
          ">

            <div className="
              flex
              items-center
              gap-3
              mb-6
            ">

              <div className="
                w-10
                h-10
                rounded-xl
                bg-blue-50
                dark:bg-blue-950/40
                flex
                items-center
                justify-center
              ">

                <UserRound
                  className="
                    w-5
                    h-5
                    text-blue-600
                  "
                />

              </div>

              <div>

                <h2 className="
                  font-bold
                  text-lg
                ">
                  Patient Details
                </h2>

                <p className="
                  text-xs
                  text-slate-400
                ">
                  Basic patient information
                </p>

              </div>

            </div>


            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            ">


              {/* NAME */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  mb-2
                ">
                  Patient Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={patientData.name}
                  onChange={handlePatientChange}
                  placeholder="Enter patient's full name"
                  className={inputClass}
                />

              </div>


              {/* AGE */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  mb-2
                ">
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  value={patientData.age}
                  onChange={handlePatientChange}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                  className={inputClass}
                />

              </div>


              {/* SEX */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  mb-2
                ">
                  Sex
                </label>

                <select
                  name="sex"
                  value={patientData.sex}
                  onChange={handlePatientChange}
                  className={inputClass}
                >

                  <option value="">
                    Select sex
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              {/* BLOOD SUGAR */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  mb-2
                ">
                  Blood Sugar Level
                </label>

                <div className="relative">

                  <Droplets
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      w-4
                      h-4
                      text-slate-400
                    "
                  />

                  <input
                    type="text"
                    name="bloodSugar"
                    value={patientData.bloodSugar}
                    onChange={handlePatientChange}
                    placeholder="e.g. 126 mg/dL"
                    className={`${inputClass} pl-11`}
                  />

                </div>

              </div>


              {/* SPECTACLE NUMBER */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  mb-2
                ">
                  Spectacle Number
                </label>

                <div className="relative">

                  <Glasses
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      w-4
                      h-4
                      text-slate-400
                    "
                  />

                  <input
                    type="text"
                    name="spectacleNumber"
                    value={patientData.spectacleNumber}
                    onChange={handlePatientChange}
                    placeholder="e.g. R -2.00 / L -1.50"
                    className={`${inputClass} pl-11`}
                  />

                </div>

              </div>


              {/* VISION */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  mb-2
                ">
                  Vision
                </label>

                <input
                  type="text"
                  name="vision"
                  value={patientData.vision}
                  onChange={handlePatientChange}
                  placeholder="e.g. 6/6, 6/12"
                  className={inputClass}
                />

              </div>

            </div>

          </div>


          {/* ==================================================
              MEDICAL HISTORY
          ================================================== */}

          <div className="
            bg-white
            dark:bg-slate-900
            rounded-2xl
            border
            border-slate-200
            dark:border-slate-800
            p-6
            sm:p-8
            shadow-sm
            mb-6
          ">

            <div className="
              flex
              items-center
              gap-3
              mb-6
            ">

              <div className="
                w-10
                h-10
                rounded-xl
                bg-cyan-50
                dark:bg-cyan-950/40
                flex
                items-center
                justify-center
              ">

                <Eye
                  className="
                    w-5
                    h-5
                    text-cyan-600
                  "
                />

              </div>

              <div>

                <h2 className="
                  font-bold
                  text-lg
                ">
                  Visual Symptoms
                </h2>

                <p className="
                  text-xs
                  text-slate-400
                ">
                  Record the patient's reported symptoms
                </p>

              </div>

            </div>


            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            ">


              {/* FLOATING DARK SPOTS */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  mb-3
                ">
                  Seeing Floating Dark Spots?
                </label>

                <label className="
                  flex
                  items-center
                  gap-3
                  cursor-pointer
                  w-fit
                ">

                  <input
                    type="checkbox"
                    checked={
                      patientData.floatingSpots === "Yes"
                    }
                    onChange={(e) =>
                      setPatientData({
                        ...patientData,
                        floatingSpots:
                          e.target.checked
                            ? "Yes"
                            : "No",
                      })
                    }
                    className="
                      w-4
                      h-4
                      accent-blue-600
                      cursor-pointer
                    "
                  />

                  <span className="
                    text-sm
                    text-slate-700
                    dark:text-slate-300
                  ">
                    Yes, patient reports floating dark spots
                  </span>

                </label>

              </div>


              {/* AFFECTED EYE */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  mb-3
                ">
                  Affected Eye / Difficulty in Vision
                </label>

                <div className="space-y-2">


                  {/* LEFT EYE */}

                  <label className="
                    flex
                    items-center
                    gap-3
                    cursor-pointer
                    w-fit
                  ">

                    <input
                      type="checkbox"
                      checked={
                        patientData.affectedEye ===
                        "Left Eye"
                      }
                      onChange={(e) =>
                        setPatientData({
                          ...patientData,
                          affectedEye:
                            e.target.checked
                              ? "Left Eye"
                              : "",
                        })
                      }
                      className="
                        w-4
                        h-4
                        accent-cyan-600
                        cursor-pointer
                      "
                    />

                    <span className="
                      text-sm
                      text-slate-700
                      dark:text-slate-300
                    ">
                      Left Eye
                    </span>

                  </label>


                  {/* RIGHT EYE */}

                  <label className="
                    flex
                    items-center
                    gap-3
                    cursor-pointer
                    w-fit
                  ">

                    <input
                      type="checkbox"
                      checked={
                        patientData.affectedEye ===
                        "Right Eye"
                      }
                      onChange={(e) =>
                        setPatientData({
                          ...patientData,
                          affectedEye:
                            e.target.checked
                              ? "Right Eye"
                              : "",
                        })
                      }
                      className="
                        w-4
                        h-4
                        accent-cyan-600
                        cursor-pointer
                      "
                    />

                    <span className="
                      text-sm
                      text-slate-700
                      dark:text-slate-300
                    ">
                      Right Eye
                    </span>

                  </label>


                  {/* BOTH EYES */}

                  <label className="
                    flex
                    items-center
                    gap-3
                    cursor-pointer
                    w-fit
                  ">

                    <input
                      type="checkbox"
                      checked={
                        patientData.affectedEye ===
                        "Both Eyes"
                      }
                      onChange={(e) =>
                        setPatientData({
                          ...patientData,
                          affectedEye:
                            e.target.checked
                              ? "Both Eyes"
                              : "",
                        })
                      }
                      className="
                        w-4
                        h-4
                        accent-cyan-600
                        cursor-pointer
                      "
                    />

                    <span className="
                      text-sm
                      text-slate-700
                      dark:text-slate-300
                    ">
                      Both Eyes
                    </span>

                  </label>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              FUNDUS IMAGE
          ================================================== */}

          <div className="
            bg-white
            dark:bg-slate-900
            rounded-2xl
            border
            border-slate-200
            dark:border-slate-800
            p-6
            sm:p-8
            shadow-sm
          ">

            <div className="
              flex
              items-center
              gap-3
              mb-6
            ">

              <div className="
                w-10
                h-10
                rounded-xl
                bg-teal-50
                dark:bg-teal-950/40
                flex
                items-center
                justify-center
              ">

                <Upload
                  className="
                    w-5
                    h-5
                    text-teal-600
                  "
                />

              </div>

              <div>

                <h2 className="
                  font-bold
                  text-lg
                ">
                  Retinal Fundus Image
                </h2>

                <p className="
                  text-xs
                  text-slate-400
                ">
                  Upload the patient's retinal image
                </p>

              </div>

            </div>


            {/* Existing Analyzer */}

            <Analyzer
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              onAnalyzeTrigger={handleAnalyzeTrigger}
              isProcessing={isProcessing}
              errorMsg={errorMsg}
              setErrorMsg={setErrorMsg}
            />

          </div>


          {/* ERROR */}

          {errorMsg && (

            <div className="
              mt-5
              p-4
              rounded-xl
              bg-red-50
              border
              border-red-200
              text-red-600
              text-sm
              font-medium
            ">

              {errorMsg}

            </div>

          )}


          {/* ==================================================
              ANALYSIS BUTTON
          ================================================== */}

          <div className="
            flex
            justify-end
            mt-6
          ">

            <button
              onClick={handleAnalyzeTrigger}
              disabled={
                isProcessing ||
                !selectedImage
              }
              className="
                inline-flex
                items-center
                gap-2
                px-6
                py-3.5
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                text-white
                font-semibold
                shadow-lg
                hover:shadow-xl
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >

              {isProcessing
                ? "Analyzing..."
                : "Analyze Retinal Image"
              }

              {!isProcessing && (
                <ArrowRight
                  className="w-4 h-4"
                />
              )}

            </button>

          </div>


          {/* ==================================================
              RESULTS
          ================================================== */}

          {predictionResult && (

            <Results
              predictionResult={
                predictionResult
              }
              selectedImage={
                selectedImage
              }
              onReset={handleReset}
              onOpenReport={() =>
                setShowReport(true)
              }
            />

          )}

        </div>

      </main>


      {/* ==================================================
          SCANNING MODAL
      ================================================== */}

      <ScanningModal
        isOpen={isProcessing}
        imagePreview={
          selectedImage?.url
        }
      />


      {/* ==================================================
          REPORT MODAL
      ================================================== */}

      <ReportModal
        isOpen={showReport}
        onClose={handleCloseReport}

        predictionResult={
          selectedHistoryPatient
            ? selectedHistoryPatient.predictionResult
            : predictionResult
        }

        selectedImage={
          selectedHistoryPatient
            ? {
                url: selectedHistoryPatient.image,
              }
            : selectedImage
        }

        patientData={
          selectedHistoryPatient
            ? selectedHistoryPatient.patientData
            : patientData
        }

        doctorData={doctor}
      />

    </div>
  );
}

