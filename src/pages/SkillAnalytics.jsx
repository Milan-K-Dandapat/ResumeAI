import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, FiActivity, FiZap, FiCheck,
  FiCode, FiServer, FiDatabase, FiLayout, FiLoader, FiBarChart2, FiCpu 
} from "react-icons/fi";

const SkillAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [view, setView] = useState("form");

  // Detailed Skill Tree State
  const [skills, setSkills] = useState({
    frontend: {
      label: "Frontend Development",
      icon: <FiLayout className="text-blue-400" />,
      items: { HTML: 80, CSS: 75, JavaScript: 90, React: 85, Tailwind: 70 }
    },
    backend: {
      label: "Backend Engineering",
      icon: <FiServer className="text-purple-400" />,
      items: { "Node.js": 60, Express: 65, Python: 50, Auth: 55 }
    },
    database: {
      label: "Database Management",
      icon: <FiDatabase className="text-emerald-400" />,
      items: { MongoDB: 70, PostgreSQL: 40, Firebase: 85, Redis: 30 }
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem("melo_detailed_skills");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

// ✅ Re-add icons manually
setSkills({
  frontend: {
    label: parsed.frontend.label,
    icon: <FiLayout className="text-blue-400" />,
    items: parsed.frontend.items
  },
  backend: {
    label: parsed.backend.label,
    icon: <FiServer className="text-purple-400" />,
    items: parsed.backend.items
  },
  database: {
    label: parsed.database.label,
    icon: <FiDatabase className="text-emerald-400" />,
    items: parsed.database.items
  }
});
      } catch (e) {
        console.error("Parse error", e);
      }
    }
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const updateSkill = (category, item, value) => {
    setSkills(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        items: { ...prev[category].items, [item]: parseInt(value) }
      }
    }));
  };

const handleGenerateReport = () => {
  setIsProcessing(true);

  // ✅ Create clean data (remove icons)
  const cleanSkills = Object.fromEntries(
    Object.entries(skills).map(([key, val]) => [
      key,
      {
        label: val.label,
        items: val.items
      }
    ])
  );

  // ✅ Save clean data
  localStorage.setItem("melo_detailed_skills", JSON.stringify(cleanSkills));

  // ✅ Switch view immediately
  setView("analytics");

  setTimeout(() => {
    setIsProcessing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 800);
};

  const getAverage = (items) => {
    const vals = Object.values(items);
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const calculateMastery = () => {
    const allVals = Object.values(skills).flatMap(cat => Object.values(cat.items));
    if (allVals.length === 0) return 0;
    const avg = allVals.reduce((a, b) => a + b, 0) / allVals.length;
    return Math.round(avg * 10);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Initializing Analytics Node...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 lg:pl-64 flex flex-col items-center relative overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl p-6 md:p-12 z-10">
        
        {/* Nav Header */}
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-all">
            <FiArrowLeft /> Back to Profile
          </button>
          <div className="flex bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-white/5">
            <button onClick={() => setView("form")} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${view === 'form' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500'}`}>EDITOR</button>
            <button onClick={() => setView("analytics")} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${view === 'analytics' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-500'}`}>REPORT</button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === "form" ? (
            <motion.div 
              key="form-container" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Technical Profiler</h1>
                <p className="text-slate-500 text-sm">Input your competence levels to generate your architect score.</p>
              </div>

              {Object.entries(skills).map(([key, category]) => (
                <div key={key} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-white/5 rounded-2xl">{category.icon}</div>
                    <h2 className="text-xl font-bold tracking-tight uppercase">{category.label}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {Object.entries(category.items).map(([item, value]) => (
                      <div key={item} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400">{item}</span>
                          <span className="text-blue-400 font-mono font-bold">{value}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" value={value}
                          onChange={(e) => updateSkill(key, item, e.target.value)}
                          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button 
                onClick={handleGenerateReport}
                disabled={isProcessing}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <><FiCpu className="animate-spin" /> Analyzing Technical Matrix...</>
                ) : (
                  <><FiBarChart2 /> Generate Analytical Report</>
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="report-container" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 pb-20"
            >
              {/* Report Header Card */}
              <div className="bg-slate-900/80 border border-blue-500/20 rounded-[3rem] p-10 md:p-14 relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-4">Architect Report v1.0</p>
                  <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-none">
                    ENGINEERING <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">CAPABILITY</span>
                  </h2>
                  
                  <div className="flex flex-wrap gap-10">
                    <div className="text-center md:text-left">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Mastery Index</p>
                      <p className="text-5xl font-black text-white">{calculateMastery()}<span className="text-sm text-slate-600 ml-1">/1000</span></p>
                    </div>
                    <div className="w-[1px] h-16 bg-white/10 hidden md:block" />
                    <div className="text-center md:text-left">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Primary Class</p>
                      <p className="text-2xl font-black text-emerald-400 uppercase tracking-widest">Full-Stack Elite</p>
                    </div>
                  </div>
                </div>
                <FiZap className="absolute top-10 right-10 text-white/5 size-40 group-hover:text-blue-500/10 transition-colors" />
              </div>

              {/* Detailed Visuals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(skills).map(([key, cat]) => (
                  <div key={key} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                         <span className="p-2 bg-white/5 rounded-xl">{cat.icon}</span>
                         <span className="text-xl font-black text-white">{getAverage(cat.items)}%</span>
                      </div>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">{cat.label}</h3>
                      
                      <div className="space-y-5">
                        {Object.entries(cat.items).map(([item, val]) => (
                          <div key={item} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                              <span className="text-slate-400">{item}</span>
                              <span className="text-slate-500">{val}%</span>
                            </div>
                            <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${val}%` }}
                                transition={{ duration: 1, ease: "circOut" }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500" 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* System Recommendation */}
              <div className="bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
                 <div className="p-5 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-500/40">
                    <FiActivity size={32} />
                 </div>
                 <div className="space-y-2 text-center md:text-left">
                    <h4 className="text-lg font-black uppercase tracking-tight text-white">Technical Health Check</h4>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                      Your skill distribution shows a strong preference for <strong>{getAverage(skills.frontend.items) > getAverage(skills.backend.items) ? "Frontend Architecture" : "System Engineering"}</strong>. To reach a Master score of 900+, consider optimizing your database nodes and improving asynchronous processing logic.
                    </p>
                 </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SkillAnalytics;