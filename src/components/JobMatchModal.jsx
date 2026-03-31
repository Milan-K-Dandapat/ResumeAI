import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCpu, FiX, FiBriefcase, FiAlignLeft, FiClipboard, FiTrash2 } from "react-icons/fi";

export default function JobMatchModal({ visible, onClose, onAnalyze }) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobText, setJobText] = useState("");
  
  // AI Animation States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState("Initializing AI Engine...");

  // Mock AI Scanning Process
  useEffect(() => {
    if (isAnalyzing) {
      const statuses = [
        "Extracting core competencies...",
        "Identifying ATS keywords...",
        "Analyzing technical requirements...",
        "Mapping skills to your profile...",
        "Finalizing optimization matrix..."
      ];
      
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 5; // Jump by 5-20%
        
        if (currentProgress > 100) {
          currentProgress = 100;
          clearInterval(interval);
          
          // Small delay at 100% before closing and passing data
          setTimeout(() => {
            setIsAnalyzing(false);
            setProgress(0);
            // Pass both title and text back to the parent component
            onAnalyze({ title: jobTitle, description: jobText });
            setJobTitle("");
            setJobText("");
          }, 800);
        }
        
        setProgress(currentProgress);
        
        // Update text based on progress
        const statusIndex = Math.min(
          Math.floor((currentProgress / 100) * statuses.length), 
          statuses.length - 1
        );
        setScanStatus(statuses[statusIndex]);
        
      }, 400); // Update every 400ms

      return () => clearInterval(interval);
    }
  }, [isAnalyzing, jobTitle, jobText, onAnalyze]);

  // ✨ TWEAK: Added fallback error message for strict browsers
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobText(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      alert("Your browser blocked clipboard access. Please paste manually using Ctrl+V or Cmd+V.");
    }
  };

  const handleClear = () => {
    setJobText("");
    setJobTitle("");
  };

  const startAnalysis = () => {
    if (!jobText.trim()) return;
    setIsAnalyzing(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
            className="w-full max-w-xl relative overflow-hidden rounded-3xl bg-slate-900 shadow-[0_0_50px_rgba(147,51,234,0.15)] border border-white/10"
          >
            {/* Top glowing accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            {/* IF AI IS ANALYZING -> SHOW SCANNING SCREEN */}
            {isAnalyzing ? (
              <div className="p-10 flex flex-col items-center justify-center text-center h-[400px]">
                <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-r-2 border-blue-400 animate-[spin_2s_linear_reverse]" />
                  <div className="absolute inset-4 rounded-full border-b-2 border-pink-400 animate-spin" />
                  <FiCpu className="text-purple-400 animate-pulse" size={32} />
                </div>
                
                <h2 className="text-xl font-bold text-white mb-2">ResumePro AI</h2>
                <p className="text-sm text-purple-300 font-medium mb-8 h-5">
                  {scanStatus}
                </p>

                {/* Progress Bar */}
                <div className="w-full max-w-sm bg-slate-800 rounded-full h-2 mb-2 overflow-hidden border border-white/5">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-400">{progress}%</span>
              </div>
            ) : (
              /* ELSE -> SHOW INPUT FORM */
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="flex items-center gap-2 font-bold text-white text-xl">
                      <FiCpu className="text-purple-400" />
                      Target Job Match
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Paste the job description to tailor your resume for ATS systems.
                    </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                  {/* Job Title */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      <FiBriefcase size={12} className="text-blue-400" /> Target Role
                    </label>
                    <input
                      type="text"
                      autoFocus // ✨ TWEAK: Automatically focuses this input when modal opens
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600"
                      placeholder="e.g. Senior Frontend Developer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>

                  {/* Job Description */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        <FiAlignLeft size={12} className="text-pink-400" /> Job Description
                      </label>
                      <div className="flex gap-2">
                        <button onClick={handlePaste} className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors">
                          <FiClipboard /> Paste
                        </button>
                        <button onClick={handleClear} className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors">
                          <FiTrash2 /> Clear
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows="6"
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600 resize-none"
                      placeholder="Paste the full job requirements, responsibilities, and qualifications here..."
                      value={jobText}
                      onChange={(e) => setJobText(e.target.value)}
                    />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    className="px-5 py-2.5 rounded-full border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                    onClick={onClose}
                  >
                    Cancel
                  </button>

                  <button
                    className="relative group px-6 py-2.5 rounded-full text-sm font-bold text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={startAnalysis}
                    disabled={!jobText.trim() || !jobTitle.trim()}
                  >
                    {/* Glowing button background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 transition-all group-hover:scale-105" />
                    <span className="relative flex items-center gap-2">
                      Optimize Resume ✨
                    </span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}