import React, { useState } from "react";
import { FiBriefcase, FiSearch, FiZap, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function JobMatcher() {
  const navigate = useNavigate();
  const [jobText, setJobText] = useState("");
  const [matching, setMatching] = useState(false);

  const handleMatch = () => {
    setMatching(true);
    setTimeout(() => setMatching(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
        <FiArrowLeft /> Back
      </button>

      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex p-4 bg-blue-600/20 rounded-3xl border border-blue-500/20 text-blue-400 mb-6">
          <FiBriefcase size={32} />
        </div>
        <h1 className="text-4xl font-bold mb-4">AI Job Matcher</h1>
        <p className="text-slate-400 mb-10">Paste a job description to analyze your compatibility score.</p>

        <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste Job Description here..."
            className="w-full h-64 bg-slate-950 border border-white/5 rounded-2xl p-6 text-slate-300 focus:border-blue-500 outline-none transition-all resize-none mb-6"
          />
          <button
            onClick={handleMatch}
            disabled={!jobText || matching}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {matching ? <FiZap className="animate-spin" /> : <FiSearch />}
            {matching ? "Analyzing Resonance..." : "Check Match Compatibility"}
          </button>
        </div>
      </div>
    </div>
  );
}