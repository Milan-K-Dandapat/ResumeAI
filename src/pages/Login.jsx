// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiCpu, FiShield, FiArrowRight, FiLock, FiActivity } from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Real-time fluctuating data for social proof
  const [liveUsers, setLiveUsers] = useState(1402);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => {
        const change = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return prev + change;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Authorization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8">
      {/* --- BACKGROUND DYNAMICS (Blue/Cyan Focus for Login) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[15%] -right-[10%] h-[300px] w-[300px] sm:h-[600px] sm:w-[600px] rounded-full bg-cyan-600/10 blur-[80px] sm:blur-[130px] animate-pulse" />
        <div className="absolute bottom-[5%] left-[5%] h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-blue-600/10 blur-[80px] sm:blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      {/* --- MAIN GATEWAY CARD --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-md rounded-[2.5rem] sm:rounded-[3rem] border border-white/10 bg-white/[0.02] p-8 sm:p-14 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.7)] text-center"
      >
        {/* LOGO AREA */}
        <div className="relative mb-8 sm:mb-10 flex flex-col items-center">
          <div className="absolute h-16 w-16 animate-ping rounded-full bg-blue-500/10 duration-[3000ms]" />
          <motion.div
            whileHover={{ rotate: -5, scale: 1.05 }}
            className="relative z-10 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-[2rem] bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-[0_0_40px_rgba(37,99,235,0.4)]"
          >
            <span className="text-3xl sm:text-4xl font-black text-white">R+</span>
          </motion.div>
          
          <motion.h1 
            className="mt-6 sm:mt-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-2xl sm:text-4xl font-black tracking-tighter text-transparent leading-tight"
          >
            Welcome Back
          </motion.h1>
          <p className="mt-2 text-[10px] sm:text-xs font-bold tracking-[0.15em] text-slate-500 uppercase">
            Resume Architecture Portal
          </p>
        </div>

        {/* ERROR DISPLAY */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 overflow-hidden rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-2 text-[10px] font-bold text-rose-400 uppercase"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* UNIFIED GOOGLE BUTTON */}
        <div className="space-y-6 sm:space-y-8">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl sm:rounded-[1.5rem] bg-white px-5 py-3.5 sm:py-5 text-slate-950 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
            ) : (
              <>
                <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-sm sm:text-base font-black tracking-tight uppercase">Login with Google</span>
                <FiLock className="hidden sm:block ml-1 text-slate-400 group-hover:text-blue-600 transition-all" />
              </>
            )}
          </button>

          {/* COMPACT TRUST SIGNALS */}
          <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-6 sm:pt-8">
            <div className="flex flex-col items-center gap-1.5">
              <FiCheckCircle className="text-emerald-500 text-base" />
              <span className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-tighter">Instant Sync</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <FiShield className="text-blue-500 text-base" />
              <span className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-tighter">Encrypted</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <FiCpu className="text-purple-500 text-base" />
              <span className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-tighter">AI Ready</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 sm:mt-14 space-y-4">
          <p className="text-xs sm:text-sm text-slate-400">
            Need an account? 
            <button 
              onClick={() => navigate("/signup")}
              className="ml-2 font-bold text-white hover:text-blue-400 underline underline-offset-4 transition-colors"
            >
              Sign Up
            </button>
          </p>
          <div className="flex justify-center gap-3 text-[8px] sm:text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            <span className="hover:text-slate-400 cursor-pointer">Support</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">v2.6</span>
          </div>
        </div>
      </motion.div>

      {/* --- MOBILE-RESPONSIVE LIVE STATUS --- */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 z-20 flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 backdrop-blur-md shadow-2xl"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap flex items-center gap-2">
          <FiActivity className="text-cyan-400" />
          Live: {liveUsers.toLocaleString()} architects active
        </span>
      </motion.div>
    </div>
  );
}