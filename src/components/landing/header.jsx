import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path if your Header is inside components/landing/

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // Pulling the real user from Firebase

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="relative z-50 mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl sm:px-6 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      
      {/* 🔥 LOGO */}
      <div 
        className="flex items-center gap-2 cursor-pointer group" 
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setIsMobileMenuOpen(false);
        }}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 shadow-[0_0_20px_rgba(147,51,234,0.6)] group-hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] transition-shadow duration-300">
          <span className="text-xl font-bold text-white">R+</span>
        </div>
        <div className="leading-tight">
          <p className="font-display text-sm font-semibold text-white sm:text-base">
            ResumePro+
          </p>
          <p className="text-[10px] text-slate-400 sm:text-xs">
            Smart Resume Builder
          </p>
        </div>
      </div>

      {/* 🔥 DESKTOP NAVIGATION */}
      <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 sm:flex">
        <button onClick={() => scrollToSection("features")} className="hover:text-white hover:text-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">
          Features
        </button>
        <button onClick={() => scrollToSection("templates")} className="hover:text-white hover:text-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">
          Templates
        </button>
        <button onClick={() => scrollToSection("companies")} className="hover:text-white hover:text-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">
          Companies
        </button>
        <button onClick={() => scrollToSection("pricing")} className="hover:text-white hover:text-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">
          Pricing
        </button>
      </nav>

      {/* 🔥 DYNAMIC AUTH BUTTONS & MOBILE TOGGLE */}
      <div className="flex items-center gap-3 lg:gap-4">
        
        {/* If user is logged in, show Dashboard button. Otherwise, show Login/Signup */}
        {user ? (
          <button
            onClick={() => navigate("/dashboard")}
            className="hidden sm:flex rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-5 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] hover:opacity-95 active:scale-95 transition-all sm:text-sm"
          >
            Go to Dashboard 🚀
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-5 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] hover:opacity-95 active:scale-95 transition-all sm:text-sm"
            >
              Sign Up Free
            </button>
          </div>
        )}

        {/* Hamburger Menu Button (Mobile Only) */}
        <button 
          className="p-1 text-slate-300 hover:text-white sm:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* 🔥 MOBILE NAVIGATION DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-full mt-2 w-full origin-top rounded-2xl border border-white/10 bg-slate-900/95 p-5 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] sm:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4 text-center text-sm font-medium text-slate-300">
            <button onClick={() => scrollToSection("features")} className="py-2 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              Features
            </button>
            <button onClick={() => scrollToSection("templates")} className="py-2 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              Templates
            </button>
            <button onClick={() => scrollToSection("companies")} className="py-2 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              Companies
            </button>
            <button onClick={() => scrollToSection("pricing")} className="py-2 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              Pricing
            </button>
            
            <div className="mt-2 h-px w-full bg-white/10" />
            
            {/* Dynamic Mobile Auth Buttons */}
            {user ? (
              <button 
                onClick={() => navigate("/dashboard")} 
                className="py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold"
              >
                Go to Dashboard
              </button>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <button 
                  onClick={() => navigate("/login")} 
                  className="py-2 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate("/signup")} 
                  className="py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}