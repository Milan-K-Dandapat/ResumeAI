import React from "react";
import { FiBarChart2, FiCpu, FiGlobe, FiDatabase, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function SkillAnalytics() {
  const navigate = useNavigate();

  const skillGroups = [
    { name: "Frontend", level: 90, icon: <FiGlobe />, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "Backend", level: 75, icon: <FiCpu />, color: "text-purple-400", bg: "bg-purple-400/10" },
    { name: "Database", level: 85, icon: <FiDatabase />, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
        <FiArrowLeft /> Back to Dashboard
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-purple-600/20 rounded-2xl border border-purple-500/20 text-purple-400">
            <FiBarChart2 size={24} />
          </div>
          <h1 className="text-3xl font-bold">Skill Analytics</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {skillGroups.map((skill, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-white/10 p-6 rounded-[2rem] hover:border-purple-500/30 transition-all group">
              <div className={`w-12 h-12 rounded-xl ${skill.bg} ${skill.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {skill.icon}
              </div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">{skill.name}</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black">{skill.level}%</span>
                <span className="text-xs text-slate-500 mb-2 font-bold uppercase">Expertise</span>
              </div>
              <div className="mt-6 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-1000`} style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}