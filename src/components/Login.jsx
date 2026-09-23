import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck, Stethoscope, ArrowLeft } from "lucide-react";

export default function Login({ onBack, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    council: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Temporary hardcoded doctor account
  const DEMO_DOCTOR = {
    registrationNumber: "MMC-123456",
    council: "Maharashtra Medical Council",
    email: "doctor@drvision.ai",
    password: "Doctor@123",
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid =
      formData.registrationNumber === DEMO_DOCTOR.registrationNumber &&
      formData.council === DEMO_DOCTOR.council &&
      formData.email === DEMO_DOCTOR.email &&
      formData.password === DEMO_DOCTOR.password;

    if (isValid) {
      // Temporary login state
      localStorage.setItem("doctor_logged_in", "true");

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setError(
        "Invalid doctor credentials. Please check your registration details."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden md:flex relative bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 p-10 text-white flex-col justify-between">

          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Eye className="w-7 h-7 text-white" />
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  DR Vision AI
                </h1>
                <p className="text-xs text-white/80 tracking-wide">
                  MEDICAL RETINA ANALYTICS
                </p>
              </div>
            </div>

            <div className="max-w-sm">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
                <Stethoscope className="w-7 h-7" />
              </div>

              <h2 className="text-4xl font-bold leading-tight mb-5">
                Clinical Intelligence
                <br />
                for Better Vision Care
              </h2>

              <p className="text-white/85 leading-relaxed">
                Secure access for registered medical professionals
                using DR Vision AI's retinal screening platform.
              </p>
            </div>
          </div>

          {/* Verification info */}
          <div className="flex items-center gap-3 text-sm text-white/90">
            <ShieldCheck className="w-5 h-5" />
            <span>Doctor verification required</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-7 sm:p-10 md:p-12">

          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                DR Vision AI
              </h1>
              <p className="text-[10px] text-slate-500 tracking-wide">
                MEDICAL RETINA ANALYTICS
              </p>
            </div>
          </div>

          {/* Back */}
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          {/* Heading */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-cyan-600 mb-2">
              DOCTOR PORTAL
            </p>

            <h2 className="text-3xl font-bold text-slate-900">
              Welcome back, Doctor
            </h2>

            <p className="text-slate-500 mt-2">
              Sign in to access retinal analysis tools.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Medical Registration Number
              </label>

              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="e.g. MMC-123456"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition text-slate-900 placeholder:text-slate-500 font-medium"
              />
            </div>

            {/* Medical Council */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Medical Council
              </label>

              <select
                name="council"
                value={formData.council}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition text-slate-900 font-medium"
              >
                <option value="">Select Medical Council</option>
                <option value="Maharashtra Medical Council">
                  Maharashtra Medical Council
                </option>
                <option value="National Medical Commission">
                  National Medical Commission
                </option>
                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Professional Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="doctor@hospital.com"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition text-slate-900 placeholder:text-slate-500 font-medium"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition text-slate-900 placeholder:text-slate-500 font-medium"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-cyan-200 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Sign In to Doctor Portal
            </button>

          </form>

          {/* Create account - LAST */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Not registered yet?
            </p>

            <button
              type="button"
              className="mt-1 text-sm font-semibold text-blue-600 hover:text-cyan-600 transition"
              onClick={() => alert("Doctor registration page coming soon.")}
            >
              Create a Doctor Account →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}