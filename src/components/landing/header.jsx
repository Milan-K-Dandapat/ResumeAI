import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path if your Header is inside components/landing/

// 🔥 IMPORT YOUR TEMPLATE IMAGES HERE
// Make sure to put your images in the src/assets/templates/ folder with these exact names
import template1 from "../../assets/templates/modern.jpeg";
import template2 from "../../assets/templates/tech.jpeg";
import template3 from "../../assets/templates/creative.jpeg";
import template4 from "../../assets/templates/executive.jpeg";
import template5 from "../../assets/templates/developer.jpeg";
import template6 from "../../assets/templates/startup.jpeg";
import template7 from "../../assets/templates/corporate.jpeg";
import template8 from "../../assets/templates/agency.jpeg";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false); // 🔥 State for modal
  const navigate = useNavigate();
  const { user } = useAuth(); // Pulling the real user from Firebase

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  // 🔥 MOCK DATA STRUCTURE FOR TEMPLATES LINKED TO YOUR IMAGES
  const mockTemplates = [
    { id: 1, name: "Modern Minimal", imgUrl: template1 },
    { id: 2, name: "Tech Pro", imgUrl: template2 },
    { id: 3, name: "Creative Bold", imgUrl: template3 },
    { id: 4, name: "Executive Clean", imgUrl: template4 },
    { id: 5, name: "Developer Dark", imgUrl: template5 },
    { id: 6, name: "Startup Agile", imgUrl: template6 },
    { id: 7, name: "Corporate Classic", imgUrl: template7 },
    { id: 8, name: "Agency Fresh", imgUrl: template8 }
  ];

  return (
    <>
      {/* Custom CSS for 3D flip animations and custom scrollbar */}
      <style>{`
        .perspective { perspective: 1000px; }
        .flip-card-inner { transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1); transform-style: preserve-3d; }
        .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .flip-card-back { transform: rotateY(180deg); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

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
          {/* Modified onclick for desktop to open the modal */}
          <button onClick={() => setShowTemplatesModal(true)} className="hover:text-white hover:text-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">
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
              {/* Modified onclick for mobile to open the modal */}
              <button onClick={() => { setShowTemplatesModal(true); setIsMobileMenuOpen(false); }} className="py-2 hover:text-white hover:bg-white/5 rounded-lg transition-all">
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

      {/* 🔥 ANIMATED TEMPLATES MODAL */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center bg-slate-950/90 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          
          {/* Header of Modal */}
          <div className="flex w-full items-center justify-between p-6 sm:px-12 sm:py-8">
            <h2 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Template Previews
            </h2>
            <button 
              onClick={() => setShowTemplatesModal(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:rotate-90 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Grid of Flipping Cards */}
          <div className="w-full flex-1 overflow-y-auto px-6 pb-12 sm:px-12 hide-scrollbar">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
              {mockTemplates.map((item) => (
                <div 
                  key={item.id} 
                  className="flip-card perspective h-[380px] w-full cursor-pointer animate-in fade-in slide-in-from-bottom-10" 
                  style={{ animationDelay: `${(item.id - 1) * 100}ms`, animationFillMode: 'both' }}
                >
                  <div className="flip-card-inner relative w-full h-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-3xl">
                    
                    {/* Front of Card (WITH YOUR IMAGES) */}
                    <div className="flip-card-front absolute w-full h-full bg-slate-800 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center border border-white/10 overflow-hidden group">
                      
                      {/* 🔥 Image Layer using your imported variables */}
                      <img 
                        src={item.imgUrl} 
                        alt={item.name} 
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-80 transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                      {/* Text Content overlaying the image */}
                      <div className="relative z-10 flex flex-col items-center justify-end w-full h-full p-6">
                        <h3 className="text-white font-bold text-2xl drop-shadow-lg text-center mb-2">{item.name}</h3>
                        <p className="text-slate-200 text-xs bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">Hover to flip 🔄</p>
                      </div>
                    </div>

                    {/* Back of Card */}
                    <div className="flip-card-back absolute w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-3xl flex flex-col items-center justify-center p-8 text-center border border-white/20">
                      <div className="h-16 w-16 mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                        <span className="text-3xl text-white">✨</span>
                      </div>
                      <h3 className="text-white font-bold text-2xl mb-2">{item.name}</h3>
                      <p className="text-white/80 text-sm mb-6 leading-relaxed">
                        Optimized for ATS software. Beautifully crafted to help you stand out to top tech recruiters.
                      </p>
                      
                      {/* Non-clickable badge */}
                      <div className="bg-white/10 border border-white/30 text-white px-6 py-2.5 rounded-full font-bold text-sm backdrop-blur-sm">
                        Preview Mode Only
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}