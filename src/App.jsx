import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Analyzer from './components/Analyzer';
import ScanningModal from './components/ScanningModal';
import Results from './components/Results';
import ModelSpecs from './components/ModelSpecs';
import Disclaimer from './components/Disclaimer';
import ReportModal from './components/ReportModal';
import Footer from './components/Footer';
import { analyzeRetinalImage } from './services/api';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('dr_vision_theme');
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [activeTab, setActiveTab] = useState('hero');

  // Analysis State
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showReport, setShowReport] = useState(false);

  // Sync Dark Mode class to <html> element & localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dr_vision_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dr_vision_theme', 'light');
    }
  }, [darkMode]);

  // Handle Triggering Analysis
  const handleAnalyzeTrigger = async () => {
    if (!selectedImage) return;

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      // Call backend API service to analyze the real retinal image
      const result = await analyzeRetinalImage(selectedImage.file || selectedImage.url);
      setPredictionResult(result);
      setIsProcessing(false);

      // Smooth scroll down to results section
      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to complete retinal image analysis. Please try again.');
      setIsProcessing(false);
    }
  };

  // Reset analysis
  const handleReset = () => {
    setSelectedImage(null);
    setPredictionResult(null);
    setErrorMsg(null);
    const analyzeElement = document.getElementById('analyze');
    if (analyzeElement) {
      analyzeElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigation tab click scroll helper
  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    const targetElement = document.getElementById(tabId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* Sticky Header Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={handleNavigate}

        className="navigation"
      />

      {/* Main Page Layout */}
      <main>
        {/* 1. Hero Section */}
        <Hero
          onAnalyzeClick={() => handleNavigate('analyze')}
          onHowItWorksClick={() => handleNavigate('how-it-works')}
          className="main-hero"
        />

        {/* 2. How It Works Section */}
        <HowItWorks
          onStartUpload={() => handleNavigate('analyze')}
        />

        {/* 3. AI Analysis Upload Card */}
        <Analyzer
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          onAnalyzeTrigger={handleAnalyzeTrigger}
          isProcessing={isProcessing}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />

        {/* 4. AI Scanning Loading Animation Overlay */}
        <ScanningModal
          isOpen={isProcessing}
          imagePreview={selectedImage?.url}
        />

        {/* 5. Clinical Diagnostic Results Dashboard */}
        {predictionResult && (
          <Results
            predictionResult={predictionResult}
            selectedImage={selectedImage}
            onReset={handleReset}
            onOpenReport={() => setShowReport(true)}
          />
        )}

        {/* 6. Model Architecture Specifications */}
        <ModelSpecs />

        {/* 7. Medical Legal Disclaimer Notice */}
        <Disclaimer />
      </main>

      {/* 8. Export Medical Evaluation Report Modal */}
      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        predictionResult={predictionResult}
        selectedImage={selectedImage}
      />

      {/* 9. Page Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
