import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { 
  FiUser, FiShield, FiMapPin, FiArrowLeft, 
  FiAward, FiZap, FiCheckCircle,
  FiEdit3, FiCheck, FiX, FiTrendingUp, FiCloud, FiInfo 
} from "react-icons/fi";

// Define some consistent glow colors based on your theme
const GLOW_COLORS = {
  primary: "rgba(168, 85, 247, 0.4)", // Purple
  secondary: "rgba(59, 130, 246, 0.4)", // Blue
};

const AccountSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blueprintCount, setBlueprintCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // 🖼️ YOUR IMAGE FROM THE PUBLIC FOLDER
  const USER_BANNER_IMAGE = "/banner.jpeg";

  useEffect(() => {
    if (!user) return;
    const getRealStats = async () => {
      try {
        const q = query(collection(db, "resumes"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        setBlueprintCount(querySnapshot.size);
      } catch (err) {
        console.error("Stats Error:", err);
      } finally {
        setLoading(false);
      }
    };
    getRealStats();
  }, [user]);

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user.displayName) {
      setIsEditing(false);
      return;
    }
    setIsUpdating(true);
    try {
      await updateProfile(user, { displayName: newName });
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const developerStats = [
    { label: "Total Blueprints", value: blueprintCount, icon: <FiZap size={16} className="text-yellow-400" /> },
    { label: "ATS High Score", value: "84%", icon: <FiAward size={16} className="text-purple-400" /> },
    { label: "Account Rank", value: "Pro", icon: <FiCheckCircle size={16} className="text-emerald-400" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 lg:pl-64 flex flex-col items-center relative overflow-hidden">
      
      {/* BACKGROUND GLOBAL BLUR (Subtle) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-5xl px-6 pt-8 z-10">
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-sm group"
        >
          <FiArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Command Center
        </button>
      </div>

      <div className="w-full max-w-5xl p-6 md:p-12 z-10">
        
        {/* ==================== HEADER WITH HIGH-GLOW BANNER ==================== */}
        <section className="relative mb-16">
          
          {/* Dynamic Background Pulsing Glow */}
          <motion.div
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-10 bg-gradient-to-tr from-purple-800/10 via-transparent to-blue-800/10 rounded-[3.5rem] blur-[60px] pointer-events-none"
          />

          <div className="h-40 md:h-52 w-full rounded-[3rem] border border-white/10 relative overflow-hidden shadow-[0_0_60px_-15px_rgba(168,85,247,0.3)] group">
            
            {/* The Actual Banner Image (Increased base opacity + blending) */}
            <img 
              src={USER_BANNER_IMAGE} 
              alt="System Banner" 
              className="w-full h-full object-cover opacity-80 mix-blend-screen transition-transform duration-1000 group-hover:scale-105" 
            />

            {/* Gradient Overlays (Vibrant Purple/Blue) */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-transparent to-slate-950" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-blue-900/30" />

            {/* SubtlParticle nodes overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div animate={{y: [-10, 10, -10]}} transition={{duration: 5, repeat: Infinity}} className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full blur-[2px] opacity-80 shadow-[0_0_10px_3px_rgba(168,85,247,0.8)]"/>
                <motion.div animate={{y: [10, -10, 10]}} transition={{duration: 7, repeat: Infinity}} className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-blue-400 rounded-full blur-[2px] opacity-60 shadow-[0_0_8px_2px_rgba(59,130,246,0.6)]"/>
                <motion.div animate={{x: [-15, 15, -15]}} transition={{duration: 9, repeat: Infinity}} className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white rounded-full opacity-40 blur-[1px]"/>
            </div>

          </div>

          <div className="px-4 md:px-10 -mt-20 flex flex-col md:flex-row items-end gap-6 relative z-10">
            {/* GLOWING ANIMATED IMAGE CONTAINER */}
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative group"
            >
              {/* Outer Glow Ring (Purple/Blue gradient) */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-[2.6rem] blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              
              {/* The image container itself */}
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-[2.5rem] bg-slate-900 border-[6px] border-slate-950 overflow-hidden shadow-2xl">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="DP" className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                    <FiUser size={60} />
                  </div>
                )}
              </div>
            </motion.div>

            <div className="flex-1 pb-4">
              <div className="flex items-center gap-4">
                <AnimatePresence mode="wait">
                  {!isEditing ? (
                    <motion.h1 
                      key="name-display" 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="text-4xl font-black tracking-tighter text-white"
                    >
                      {user?.displayName || "Melo User"}
                    </motion.h1>
                  ) : (
                    <input 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-slate-900 border border-purple-500/50 rounded-xl px-4 py-1 text-2xl font-black tracking-tighter text-white outline-none"
                      autoFocus
                    />
                  )}
                </AnimatePresence>

                <button onClick={() => isEditing ? handleUpdateName() : setIsEditing(true)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                  {isEditing ? <FiCheck className="text-emerald-400" /> : <FiEdit3 className="text-slate-400" />}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-400 text-sm font-bold">
                <span className="flex items-center gap-1.5 text-blue-400"><FiShield size={14}/> Verified Architect</span>
                <span className="flex items-center gap-1.5"><FiMapPin size={14}/> India</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CONTENT GRID (UNCHANGED but with hover glow) ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {developerStats.map((stat, i) => (
                <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl hover:border-purple-500/30 transition-colors duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    {stat.icon}
                    <FiTrendingUp size={14} className="text-slate-700 group-hover:text-purple-400" />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-2xl font-black text-white">{loading ? "..." : stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-3xl shadow-2xl text-white">
              <h2 className="text-xl font-bold mb-8">System Credentials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Display Identity</p>
                  <p className="text-lg font-bold">{user?.displayName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Email Node</p>
                  <p className="text-lg font-bold">{user?.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Authentication</p>
                  <p className="text-emerald-400 font-bold flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Secure Firebase Auth
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">User UUID</p>
                  <p className="text-[10px] font-mono text-slate-500">{user?.uid}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FiCloud className="text-blue-500" /> Cloud Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors duration-300">
                  <span className="text-sm font-bold text-slate-300">Syncing</span>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online</span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-600 uppercase mb-2">Instance</p>
                  <p className="text-xs font-bold text-blue-400">Developer Workspace v1.0</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-[2.5rem] relative overflow-hidden group">
              <FiInfo className="text-blue-400 mb-3" size={20} />
              <p className="text-xs font-bold text-blue-400 mb-2 tracking-tight">Architect Intelligence</p>
              <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                Your professional profile is synchronized across the Melo Cloud Network. Changes to your primary identity are propagated in real-time.
              </p>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all duration-700" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountSettings;