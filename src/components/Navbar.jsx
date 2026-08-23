import React, { useState } from 'react';
import { Eye, Activity, Moon, Sun, Menu, X } from 'lucide-react';

export default function Navbar({
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'analyze', label: 'AI Analysis' },
    { id: 'model-specs', label: 'Model Architecture' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="main-navbar fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavClick('hero')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-teal-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
              <Eye className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></span>
              </span>
            </div>

            <div>
              <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                DR Vision <span className="text-teal-400">AI</span>
              </span>
              <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-slate-400 -mt-1">
                Medical Retina Analytics
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'text-teal-400 font-bold border-b-2 border-teal-400 pb-1'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Actions (Desktop & Mobile) */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Backend Endpoint Status (Hidden on mobile) */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold">POST /predict</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors focus:outline-none"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-300" />
              )}
            </button>

            {/* Scan Retina CTA (Desktop) */}
            <button
              onClick={() => handleNavClick('analyze')}
              className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium text-sm shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Activity className="w-4 h-4" />
              <span>Scan Retina</span>
            </button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-teal-400" />
              ) : (
                <Menu className="w-6 h-6 text-slate-200" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer / Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600/20 to-teal-600/20 text-teal-400 border border-teal-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('analyze')}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold text-sm shadow-md"
            >
              <Activity className="w-4 h-4" />
              <span>Scan Retinal Image Now</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}