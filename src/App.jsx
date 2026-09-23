import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import ModelSpecs from "./components/ModelSpecs";
import Disclaimer from "./components/Disclaimer";
import Footer from "./components/Footer";

import Login from "./components/Login";
import Analyze from "./Analyze";


// ======================================================
// LANDING PAGE
// ======================================================

function LandingPage() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("dr_vision_theme");

    if (savedTheme !== null) {
      return savedTheme === "dark";
    }

    return window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
  });

  const [activeTab, setActiveTab] = useState("hero");


  // ======================================================
  // DARK MODE
  // ======================================================

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dr_vision_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dr_vision_theme", "light");
    }
  }, [darkMode]);


  // ======================================================
  // NAVIGATION / SCROLL
  // ======================================================

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);

    const targetElement = document.getElementById(tabId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  };


  // ======================================================
  // LANDING PAGE UI
  // ======================================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

      {/* ================= NAVBAR ================= */}

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        className="navigation"
      />


      {/* ================= MAIN ================= */}

      <main>

        {/* ---------- HERO ---------- */}

        <Hero
          onAnalyzeClick={() => navigate("/login")}
          onHowItWorksClick={() =>
            handleNavigate("how-it-works")
          }
          className="main-hero"
        />


        {/* ---------- HOW IT WORKS ---------- */}

        <HowItWorks
          onStartUpload={() => navigate("/login")}
        />


        {/* ---------- MODEL SPECS ---------- */}

        <ModelSpecs />


        {/* ---------- DISCLAIMER ---------- */}

        <Disclaimer />

      </main>


      {/* ================= FOOTER ================= */}

      <Footer
        onNavigate={handleNavigate}
      />

    </div>
  );
}


// ======================================================
// PROTECTED ANALYZE PAGE
// ======================================================

function ProtectedAnalyze() {

  const isLoggedIn =
    localStorage.getItem("doctor_logged_in") === "true";


  // If doctor is NOT logged in
  // redirect to login page

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // If logged in
  // open Analyze.jsx

  return <Analyze />;
}


// ======================================================
// LOGIN PAGE
// ======================================================

function LoginPage() {

  const navigate = useNavigate();


  // ======================================================
  // LOGIN SUCCESS
  // ======================================================

  const handleLoginSuccess = () => {

    // Store login state
    localStorage.setItem(
      "doctor_logged_in",
      "true"
    );


    // Redirect doctor to Analyze.jsx
    navigate(
      "/analyze",
      {
        replace: true,
      }
    );
  };


  // ======================================================
  // LOGIN UI
  // ======================================================

  return (
    <Login
      onBack={() => navigate("/")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}


// ======================================================
// APP ROUTES
// ======================================================

export default function App() {

  return (
    <Routes>

      {/* ============================================
          LANDING PAGE
          URL: /
      ============================================ */}

      <Route
        path="/"
        element={
          <LandingPage />
        }
      />


      {/* ============================================
          DOCTOR LOGIN
          URL: /login
      ============================================ */}

      <Route
        path="/login"
        element={
          <LoginPage />
        }
      />


      {/* ============================================
          PROTECTED ANALYSIS PAGE
          URL: /analyze
      ============================================ */}

      <Route
        path="/analyze"
        element={
          <ProtectedAnalyze />
        }
      />


      {/* ============================================
          UNKNOWN URL
          Redirect to landing page
      ============================================ */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}