import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, 
  Search, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Zap,
  ChevronRight
} from "lucide-react";

const SKILL_DB = [
  "html", "css", "javascript", "typescript",
  "react", "next.js", "node.js", "express",
  "mongodb", "postgresql", "firebase",
  "aws", "docker", "kubernetes",
  "tailwind", "bootstrap",
  "rest api", "graphql",
  "git", "ci/cd"
];

const userSkills = [
  "html", "css", "javascript",
  "react", "tailwind",
  "firebase", "node.js",
  "express", "mongodb"
];
const JobMatcher = () => {
  const [jd, setJd] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

const handleMatch = () => {
  if (!jd.trim()) return alert("Please paste a job description first!");

  setIsAnalyzing(true);

  setTimeout(() => {
    const text = jd.toLowerCase();

    // 🔍 Extract skills from JD
    const foundSkills = SKILL_DB.filter(skill =>
      text.includes(skill)
    );

    const uniqueSkills = [...new Set(foundSkills)];

    // ✅ Matching
    const matchingSkills = uniqueSkills.filter(skill =>
      userSkills.includes(skill)
    );

    // ❌ Missing
    const missingSkills = uniqueSkills.filter(skill =>
      !userSkills.includes(skill)
    );

    // 📊 Score
    const score = uniqueSkills.length === 0
      ? 0
      : Math.round((matchingSkills.length / uniqueSkills.length) * 100);

    // 🎯 Verdict
    let verdict = "Low Match";
    if (score >= 75) verdict = "Strong Match";
    else if (score >= 50) verdict = "Moderate Match";

    // 💡 Suggestions (SMART PART)
    const suggestions = missingSkills.map(skill => {
      if (skill === "aws") return "Learn AWS basics (EC2, S3)";
      if (skill === "docker") return "Understand Docker for deployment";
      if (skill === "typescript") return "Start using TypeScript with React";
      if (skill === "ci/cd") return "Learn CI/CD pipelines (GitHub Actions)";
      if (skill === "postgresql") return "Practice SQL & PostgreSQL queries";
      return `Learn ${skill}`;
    });

    // 🚀 Apply decision
    let decision = "Improve Before Applying";
    if (score >= 75) decision = "Apply Now 🚀";
    else if (score >= 60) decision = "You Can Try 👍";

    setResult({
      score,
      matchingSkills,
      missingSkills,
      suggestions,
      verdict,
      decision
    });

    setIsAnalyzing(false);
  }, 1000);
};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 lg:pl-64 flex justify-center">
      <div className="w-full max-w-5xl p-6 md:p-12">
        
        <header className="mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-black tracking-tighter">
              Job <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Matcher</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Compare your blueprint against industry requirements.</p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Left: Input Area */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="relative bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                  <Target size={24} />
                </div>
                <h2 className="text-xl font-bold">Paste Job Description</h2>
              </div>

              <textarea 
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job requirements, responsibilities, and skills here..."
                className="w-full h-80 bg-slate-950/50 border border-white/10 rounded-2xl p-6 text-slate-300 focus:border-emerald-500/50 outline-none transition-all resize-none custom-scrollbar"
              />

              <button 
                onClick={handleMatch}
                disabled={isAnalyzing}
                className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Cpu className="animate-spin" size={20} /> Analyzing Architecture...
                  </>
                ) : (
                  <>
                    <Zap size={20} /> Run Match Engine
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Right: Results Area */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-[2.5rem]"
                >
                  <Search size={48} className="text-slate-800 mb-4" />
                  <p className="text-slate-500 font-medium max-w-xs">Enter a job description to initiate the AI comparison engine.</p>
                </motion.div>
              )}

              {isAnalyzing && (
                <motion.div 
                  key="analyzing"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center bg-slate-900/20 rounded-[2.5rem] border border-white/5 relative overflow-hidden"
                >
                  {/* Scanning Line Animation */}
                  <motion.div 
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-emerald-500/50 shadow-[0_0_20px_#10b981] z-10"
                  />
                  <Cpu size={64} className="text-emerald-500/20 mb-6 animate-pulse" />
                  <p className="text-emerald-400 font-black tracking-widest uppercase text-xs">Cross-referencing skills...</p>
                </motion.div>
              )}

              {result && !isAnalyzing && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Match Score Card */}
                  <div className="bg-slate-900/40 border border-emerald-500/20 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6">
                      <div className="px-4 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                        {result.verdict}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center py-6">
                      <div className="text-7xl font-black text-white mb-2">{result.score}<span className="text-2xl text-emerald-500">%</span></div>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Match Compatibility</p>
                      <div className="text-sm font-bold text-blue-400 mt-2">
  {result.decision}
</div>
                      
                      <div className="w-full max-w-xs h-2 bg-slate-800 rounded-full mt-8 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.score}%` }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills Breakdown */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400" /> Key Keyword Matches
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.matchingSkills.map(skill => (
                          <span key={skill} className="px-3 py-1.5 bg-white/5 rounded-xl text-xs font-bold text-slate-300 border border-white/5">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <AlertCircle size={14} className="text-amber-400" /> Missing Optimization
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.missingSkills.map(skill => (
                          <span key={skill} className="px-3 py-1.5 bg-amber-500/10 rounded-xl text-xs font-bold text-amber-200/70 border border-amber-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {result?.suggestions && (
  <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6">
    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
      💡 Improvement Suggestions
    </h4>
    <ul className="space-y-2 text-sm text-slate-300">
      {result.suggestions.map((s, i) => (
        <li key={i}>• {s}</li>
      ))}
    </ul>
  </div>
)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatcher;