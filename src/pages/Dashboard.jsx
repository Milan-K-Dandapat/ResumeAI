import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// Import Firestore functions and your db instance
import { db } from "../services/firebase"; // ⚠️ Update this path to where your firebase config is exported
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { 
  FiPlus, FiLogOut, FiTrash2, FiActivity, FiTarget, 
  FiZap, FiUser, FiHome, FiFileText, FiBarChart2, 
  FiBriefcase, FiSettings, FiMenu, FiX 
} from "react-icons/fi";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Real Firebase Auth Context

  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state

  // 💾 1. AUTH PROTECTION & DATA FETCHING FROM FIREBASE
  useEffect(() => {
    // If session is empty and we aren't already navigating away, kick to login
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchResumes = async () => {
      try {
        // Query the "resumes" collection where the userId matches the logged-in user
        const resumesRef = collection(db, "resumes");
        const q = query(resumesRef, where("userId", "==", user.uid));
        
        const querySnapshot = await getDocs(q);
        const list = [];
        
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        // Sort locally by timestamp (newest first)
        list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        
        setResumes(list);
      } catch (err) {
        console.error("Error loading resumes from Firebase:", err);
      } finally {
        setTimeout(() => setLoadingResumes(false), 600);
      }
    };

    fetchResumes();
  }, [user, navigate]);

  if (!user) return null;

  // 🚪 2. FIXED LOGOUT HANDLER
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out and return to the main page?")) {
      try {
        navigate("/", { replace: true }); 
        await logout(); 
      } catch (err) {
        console.error("Logout Error:", err);
        navigate("/login");
      }
    }
  };

  const handleNewResume = () => {
    navigate("/templates/new");
  };

  // 🗑️ 3. DELETE FROM FIREBASE
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Permanently delete this resume architecture?")) {
      try {
        // Delete the document from Firestore
        await deleteDoc(doc(db, "resumes", id));
        // Update local state to remove the deleted resume from UI
        setResumes((prev) => prev.filter((res) => res.id !== id));
      } catch (err) {
        console.error("Error deleting resume from Firebase:", err);
        alert("Failed to delete resume. Please try again.");
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Draft";
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // Sidebar Menu Items
  const menuItems = [
    { icon: <FiHome />, label: "Dashboard", active: true },
    { icon: <FiFileText />, label: "My Resumes", active: false },
    { icon: <FiBarChart2 />, label: "Skill Analytics", active: false },
    { icon: <FiBriefcase />, label: "Job Matcher", active: false },
    { icon: <FiSettings />, label: "Account Settings", active: false },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50 overflow-hidden selection:bg-purple-500/30">
      
      {/* ==================== SIDEBAR (DESKTOP) ==================== */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:block`}>
        <div className="flex flex-col h-full p-6">
          {/* Logo Area */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <FiZap className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">RESUME<span className="text-purple-500">AI</span></span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${item.active ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-purple-400 border border-purple-500/20" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
              >
                <span className={`${item.active ? "text-purple-400" : "group-hover:scale-110 transition-transform"}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile Summary */}
          <div className="mt-auto p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
               <div className="h-8 w-8 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-xs font-bold uppercase">
                 {user.displayName?.charAt(0) || user.email?.charAt(0)}
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-xs font-bold truncate text-white">{user.displayName || "Explorer"}</p>
                 <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
               </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 text-[11px] font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors">
              <FiLogOut size={12} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative">
        {/* Background Dynamics */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="px-4 py-6 sm:px-8 sm:py-8 max-w-6xl mx-auto relative z-10">
          
          {/* Header & Mobile Toggle */}
          <header className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 bg-white/5 rounded-xl border border-white/10 text-white">
                {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Command Center</h1>
                <p className="text-xs sm:text-sm text-slate-400">Manage your high-performance resumes</p>
              </div>
            </div>

            <button
              onClick={handleNewResume}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-4 py-2 sm:px-6 sm:py-3 text-xs font-bold text-white shadow-xl shadow-purple-500/20 active:scale-95 transition-all"
            >
              <FiPlus size={18} />
              <span className="hidden sm:inline">Create New</span>
              <span className="sm:hidden">New</span>
            </button>
          </header>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Col: Resumes Grid */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                  <FiTarget className="text-blue-400" /> Active Blueprints
                </h2>
                <span className="hidden sm:block bg-blue-500/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">
                  Protected Cloud Auth
                </span>
              </div>

              {loadingResumes ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-44 rounded-[2rem] bg-white/5 border border-white/5 animate-pulse" />
                  ))}
                </div>
              ) : resumes.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-white/10 bg-white/[0.01] py-24 text-center">
                  <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <FiZap size={40} className="text-slate-600" />
                  </div>
                  <p className="text-xl font-semibold text-slate-300">Your workspace is empty</p>
                  <p className="text-sm text-slate-500 mt-2 max-w-xs px-4">Ready to architect your professional future? Select a template to begin.</p>
                  <button onClick={handleNewResume} className="mt-8 px-8 py-3 bg-white text-slate-950 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95">
                    Start Building
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {resumes.map((res) => (
                    <div
                      key={res.id}
                      onClick={() => navigate(`/editor/${res.id}`)}
                      className="group relative flex cursor-pointer flex-col items-start rounded-[2rem] border border-white/10 bg-slate-900/40 p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-purple-500/40 hover:-translate-y-1 shadow-lg"
                    >
                      <button 
                        onClick={(e) => handleDelete(e, res.id)}
                        className="absolute right-6 top-6 p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      
                      <div className="p-3 bg-blue-500/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                        <FiFileText className="text-blue-400" size={20} />
                      </div>

                      <p className="mb-1 text-lg font-bold text-white line-clamp-1 pr-10">
                        {res.fullName || res.title || "Untitled Blueprint"}
                      </p>
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
                        {res.template?.replace('-', ' ') || 'AI Modern'}
                      </p>

                      <div className="mt-8 flex w-full items-center justify-between border-t border-white/5 pt-4">
                        <span className="text-[10px] font-medium text-slate-500">
                          Updated {formatDate(res.updatedAt)}
                        </span>
                        <span className="text-[11px] font-bold text-white group-hover:text-purple-400 flex items-center gap-1 transition-colors">
                          Resume Lab <FiActivity size={12} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Col: Dashboard Widgets */}
            <div className="space-y-6">
              {/* Profile Health Widget */}
              <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-purple-600/20 transition-all duration-700" />
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-yellow-400/10 rounded-lg">
                    <FiZap className="text-yellow-400" size={16} />
                  </div>
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.25em]">Profile Power</h3>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-black/40 rounded-3xl p-6 border border-white/5 text-center">
                    <div className="relative inline-flex items-center justify-center mb-4">
                       <span className="text-5xl font-black text-emerald-400 tracking-tighter">84<span className="text-xl">%</span></span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Current ATS Score</p>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-[84%] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                    </div>
                  </div>

                  <div className="space-y-4 px-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Keywords</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md font-bold">Strong</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Readability</span>
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md font-bold">Optimal</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Sections</span>
                        <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-md font-bold">Complete</span>
                      </div>
                  </div>
                </div>
              </div>

              {/* Tips Widget */}
              <div className="rounded-[2rem] border border-blue-500/20 bg-blue-500/5 p-6 hover:bg-blue-500/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-blue-500/20 rounded-xl">
                    <FiActivity className="text-blue-400" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-300 mb-1">Career Strategy</p>
                    <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                      Always use <span className="text-white font-bold">quantified metrics</span> (e.g. "Reduced latency by 40%") to pass advanced enterprise recruitment filters.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ==================== MOBILE OVERLAY ==================== */}
      {isSidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </div>
  );
}