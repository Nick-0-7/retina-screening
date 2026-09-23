import React from 'react';
import { Eye, Activity, Moon, Sun } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function Navbar({
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab
}) {
  const navigate = useNavigate();
  return (
    <nav className="main-navbar absolute top-0 left-0 w-full z-50">

      <div className="w-full px-8">
        <div className="flex items-center h-16">

          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('hero')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-teal-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
              <Eye className="w-6 h-6 animate-pulse" />

              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></span>
              </span>
            </div>

            <div>
              <span className="text-xl font-extrabold text-grey tracking-tight">
                DR Vision <span className="text-grey">AI</span>
              </span>

              <p className="text-[10px] font-medium uppercase tracking-wider text-grey -mt-1">
                Medical Retina Analytics
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 ml-auto mr-16">

            {[
              { id: 'hero', label: 'Home' },
              { id: 'how-it-works', label: 'How It Works' },
              { id: 'model-specs', label: 'Model Architecture' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'text-white font-semibold'
                    : 'text-white hover:text-cyan-300'
                }`}
              >
                {item.label}
              </button>
            ))}

          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">

            {/* Backend Endpoint Status */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-white text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold">POST /predict</span>
            </div>

            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            <button
  onClick={() => navigate("/login")}
  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all"
>
  Login
</button>

          </div>

        </div>
      </div>
    </nav>
  );
}