import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Ensure this path is correct for your folder structure!

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Check if a real user is logged in
  
  // Array of target companies for the rotating text effect
  const companies = ["Google", "TCS", "Amazon", "Infosys", "Deloitte"];
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState(0);

  // Rotate companies every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCompanyIndex((prev) => (prev + 1) % companies.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="builder" className="flex flex-1 flex-col items-center gap-10 pt-4 md:flex-row md:items-stretch md:gap-12">
      {/* LEFT SIDE */}
      <div className="flex-1">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 backdrop-blur-xl"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          <span className="font-medium">
            {/* Changed from 'Frontend Mode' */}
            Cloud Sync Active • 100+ Company Templates
          </span>
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-3xl font-semibold leading-tight tracking-tight text-slate-50 sm:text-4xl lg:text-5xl"
        >
          Design a resume tailored for
          <br className="hidden sm:block" />
          <span className="relative inline-flex h-[1.2em] w-full items-center overflow-hidden sm:w-auto">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={currentCompanyIndex}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                className="mx-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold"
              >
                {companies[currentCompanyIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          <br className="hidden sm:block" />
          powered by real-time AI.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
        >
          ResumePro+ combines a pixel-perfect editor with an intelligent career coach.
          Select your dream company, generate a tailored layout, and download your ATS-friendly PDF in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-6 flex flex-wrap items-center gap-3"
        >
          {/* 🔥 SMART CTA BUTTON */}
          <button
            onClick={() => navigate(user ? "/dashboard" : "/signup")}
            className="rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(147,51,234,0.6)] hover:shadow-[0_0_40px_rgba(147,51,234,0.8)] transition-all hover:opacity-95 active:scale-95"
          >
            {user ? "Go to Workspace" : "Start Building Free"}
          </button>

          <button 
            onClick={() => {
              const section = document.getElementById("templates");
              if (section) section.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-100 backdrop-blur-xl hover:bg-white/10 active:scale-95 transition-all"
          >
            View Templates
          </button>
        </motion.div>
      </div>

      {/* RIGHT SIDE – editor + AI bubbles */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative mt-2 flex flex-1 items-center justify-center md:mt-0"
      >
        {/* Floating Badge */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute -right-4 -top-6 z-20 rounded-xl border border-blue-400/20 bg-slate-900/90 px-3 py-2 text-[10px] font-semibold text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-md"
        >
          ✨ FAANG & Service IT Ready
        </motion.div>

        {/* Main glass editor card with float animation */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.8)] backdrop-blur-2xl"
        >
          {/* Top bar */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="rounded-full bg-slate-900/60 px-3 py-1 text-[10px] text-slate-200">
              Live Preview • <span className="text-emerald-400 animate-pulse">Synced</span>
            </div>
          </div>

          <div className="flex gap-3">
            {/* Sidebar controls */}
            <div className="w-24 rounded-2xl bg-slate-950/70 p-2 text-[9px] text-slate-200">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Company
              </p>
              <div className="mb-2 space-y-1">
                <button className="flex w-full items-center justify-between rounded-lg bg-blue-500/20 border border-blue-500/30 px-2 py-1 text-blue-200">
                  <span>TCS</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                </button>
                <button className="flex w-full items-center justify-between rounded-lg px-2 py-1 hover:bg-white/5 transition-colors">
                  <span>Google</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                </button>
              </div>
              <p className="mb-1 mt-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Sections
              </p>
              <div className="space-y-1">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-2.5 w-2.5 rounded border-slate-600 bg-slate-900 accent-purple-500" />
                  <span>Education</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-2.5 w-2.5 rounded border-slate-600 bg-slate-900 accent-purple-500" />
                  <span>Skills</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-2.5 w-2.5 rounded border-slate-600 bg-slate-900 accent-purple-500" />
                  <span>Projects</span>
                </label>
              </div>
            </div>

            {/* Resume preview */}
            <div className="flex-1 rounded-2xl bg-slate-950/60 p-3 text-[10px] text-slate-200">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-50">
                    Milan K. Dandapat
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Full Stack Developer • MERN
                  </p>
                </div>
                <div className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] text-emerald-300 border border-emerald-500/20">
                  Match: 92%
                </div>
              </div>

              <div className="mb-2 h-[1px] w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-3 space-y-1.5">
                  <div>
                    <p className="text-[9px] font-semibold text-blue-300">
                      Top Project
                    </p>
                    <p className="line-clamp-2 text-[9px] text-slate-400">
                      Melo Chat: Real-time application with AI content filtering and custom group channels.
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold text-blue-300">
                      Experience
                    </p>
                    <p className="line-clamp-3 text-[9px] text-slate-400">
                      • Developed real-time platform in React.js
                      <br/>• Optimized backend with Node & Firebase
                      <br/>• Reduced handling errors by 30%
                    </p>
                  </div>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <div>
                    <p className="text-[9px] font-semibold text-purple-300">
                      Core Skills
                    </p>
                    <ul className="space-y-0.5 text-[9px] text-slate-400">
                      <li>React, Next.js</li>
                      <li>Node, Express</li>
                      <li>MongoDB</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[9px] text-slate-400">
                <span>1 page • ATS-optimized</span>
                <span className="text-blue-400">Custom Domain Ready</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Assistant bubble */}
        <motion.div
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: -10, x: 40 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="absolute -bottom-6 -left-4 w-52 rounded-2xl border border-purple-400/30 bg-slate-900/95 p-3 text-[10px] text-slate-100 shadow-[0_12px_40px_rgba(147,51,234,0.4)] backdrop-blur-2xl"
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 p-[1px]">
              <div className="absolute inset-0 m-[1px] rounded-full bg-slate-900" />
              <div className="absolute inset-0 flex items-center justify-center text-[12px]">
                ✨
              </div>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-purple-300">
                Template AI
              </p>
              <p className="text-[8px] text-slate-400">
                Company Target: <span className="text-white">Google</span>
              </p>
            </div>
          </div>
          <p className="text-[9px] text-slate-200">
            I restructured your projects to highlight impact metrics, boosting ATS compatibility by <span className="font-semibold text-emerald-400">+18%</span>.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}