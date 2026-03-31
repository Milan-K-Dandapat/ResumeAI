// src/pages/Landing.jsx
import React from "react";
import Header from "../components/landing/header";
import Hero from "../components/landing/Hero";
import { FiShield, FiZap, FiLayout, FiCheck, FiCpu, FiMessageSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Integrated real Auth

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Monitor auth state to update UI buttons instantly

  return (
    <div className="relative min-h-screen bg-slate-950 selection:bg-purple-500/30">
      {/* Global Neon Background Blurs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-20 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute top-40 -right-10 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-[600px] w-[600px] rounded-full bg-pink-600/10 blur-[120px]" />
        {/* Subtle Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Header />
        <Hero />

        {/* ==================== COMPANIES SECTION ==================== */}
        <section id="companies" className="mt-32 border-t border-white/5 pt-16">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-slate-400 mb-8">
            Architectures Tailored For Top-Tier ATS Systems
          </p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 opacity-60 grayscale transition-all hover:grayscale-0">
            <h3 className="text-2xl font-black tracking-tighter text-white">Google</h3>
            <h3 className="text-2xl font-black tracking-tighter text-white">amazon</h3>
            <h3 className="text-2xl font-bold tracking-widest text-blue-400">TCS</h3>
            <h3 className="text-2xl font-bold tracking-tight text-white">Infosys</h3>
            <h3 className="text-2xl font-black tracking-tighter text-green-500">Deloitte.</h3>
          </div>
        </section>

        {/* ==================== FEATURES SECTION ==================== */}
        <section id="features" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Not just a builder. <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">An unfair advantage.</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              We stripped away the bloated backends to give you a lightning-fast, privacy-first editing experience tailored exactly to what recruiters want to see.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl hover:bg-white/10 transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
                <FiShield className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cloud Sync Active</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Securely store your architectures in the cloud via Google Auth. Access your professional profiles from any device, anytime.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl hover:bg-white/10 transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
                <FiZap className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Targeted AI Tailoring</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Paste a job description and watch our engine rewrite your summary and impact metrics to perfectly match the ATS keywords required.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl hover:bg-white/10 transition-all hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 h-24 w-24 bg-pink-500/20 blur-2xl rounded-full" />
              <div className="h-12 w-12 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6 relative z-10">
                <FiLayout className="text-pink-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">Premium Lab</h3>
              <p className="text-sm text-slate-400 leading-relaxed relative z-10">
                From Service-IT matrix layouts to FAANG impact-driven templates. Select your dream company to auto-structure your entire profile.
              </p>
            </div>
          </div>
        </section>

        {/* ==================== LIVE SYSTEM STATUS ==================== */}
        <section className="mt-32 flex justify-center">
            <div className="inline-flex items-center gap-6 px-8 py-4 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">AI Hub Online</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="text-xs font-medium text-slate-400">
                    <span className="text-white font-bold">12,402</span> Professionals onboarded
                </div>
            </div>
        </section>

        {/* ==================== PRICING SECTION ==================== */}
        <section id="pricing" className="mt-32 mb-16">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Simple pricing. <span className="text-purple-400">Infinite potential.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Start building for free with our AI core, or upgrade to unlock deep tailoring and custom domain exports.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
            {/* Free Tier */}
            <div className="rounded-[2.5rem] border border-white/10 bg-black/40 p-8 sm:p-10 backdrop-blur-xl hover:border-white/20 transition-all group">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Developer</h3>
              <p className="text-sm text-slate-400 mb-6">Essential for freshers and students.</p>
              <div className="mb-6">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-slate-400"> / forever</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-slate-300">
                <li className="flex items-center gap-3"><FiCheck className="text-emerald-400" /> Standard MNC Templates</li>
                <li className="flex items-center gap-3"><FiCheck className="text-emerald-400" /> Unlimited Cloud Storage</li>
                <li className="flex items-center gap-3"><FiCheck className="text-emerald-400" /> Professional PDF Exports</li>
                <li className="flex items-center gap-3 text-slate-500"><FiCheck /> Advanced AI suggestions</li>
              </ul>
              <button 
                onClick={() => navigate(user ? "/dashboard" : "/signup")}
                className="w-full py-4 rounded-2xl border border-white/20 bg-white/5 text-white font-bold hover:bg-white/10 transition-all active:scale-95"
              >
                {user ? "Enter Command Center" : "Get Started Free"}
              </button>
            </div>

            {/* Pro Tier (Glowing) */}
            <div className="rounded-[2.5rem] border border-purple-500/50 bg-slate-900/80 p-8 sm:p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(147,51,234,0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-pink-500 text-[10px] font-black px-4 py-1.5 text-white rounded-bl-2xl uppercase tracking-widest">
                Recommended
              </div>
              
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 relative z-10">Neural Architect</h3>
              <p className="text-sm text-slate-400 mb-6 relative z-10">Built for seniors targeting Tier-1 roles.</p>
              <div className="mb-6 relative z-10">
                <span className="text-5xl font-black text-white">$9</span>
                <span className="text-slate-400"> / month</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-slate-300 relative z-10">
                <li className="flex items-center gap-3"><FiCheck className="text-purple-400" /> FAANG Optimized Blueprints</li>
                <li className="flex items-center gap-3"><FiCheck className="text-purple-400" /> Deep AI Job Analysis</li>
                <li className="flex items-center gap-3"><FiCheck className="text-purple-400" /> Custom Neural Summaries</li>
                <li className="flex items-center gap-3"><FiCheck className="text-purple-400" /> 1-Click Portfolio Sync</li>
              </ul>
              <button 
                onClick={() => alert("Premium Tier currently in Open Access for Demo. All features unlocked!")}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-black shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_35px_rgba(147,51,234,0.6)] transition-all relative z-10 active:scale-95"
              >
                Upgrade to Neural
              </button>
            </div>
          </div>
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer className="mt-24 border-t border-white/10 pt-16 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 sm:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-lg">
                        <span className="text-sm font-black text-white">R+</span>
                    </div>
                    <span className="font-display font-bold text-white text-xl tracking-tight">ResumePro+</span>
                </div>
                <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                    Elevating professional identities through AI-driven architecture and precision ATS tailoring.
                </p>
              </div>
              <div>
                  <h4 className="text-slate-100 font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
                  <ul className="text-sm text-slate-500 space-y-3">
                      <li className="hover:text-purple-400 cursor-pointer transition-colors">FAANG Lab</li>
                      <li className="hover:text-purple-400 cursor-pointer transition-colors">Neural Builder</li>
                      <li className="hover:text-purple-400 cursor-pointer transition-colors">Pricing Hub</li>
                  </ul>
              </div>
              <div>
                  <h4 className="text-slate-100 font-bold mb-6 text-sm uppercase tracking-widest">Connect</h4>
                  <ul className="text-sm text-slate-500 space-y-3">
                      <li className="hover:text-blue-400 cursor-pointer transition-colors">LinkedIn</li>
                      <li className="hover:text-blue-400 cursor-pointer transition-colors">GitHub</li>
                      <li className="hover:text-blue-400 cursor-pointer transition-colors">System v2.6</li>
                  </ul>
              </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
                &copy; 2026 ResumePro+ Architecture • Developed by Milan Kumar Dandapat
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}