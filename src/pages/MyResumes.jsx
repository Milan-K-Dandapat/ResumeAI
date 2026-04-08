import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import { 
  collection, query, where, getDocs, 
  deleteDoc, doc, addDoc, serverTimestamp 
} from "firebase/firestore";
import { 
  FileText, Edit3, Trash2, Plus, Calendar, 
  Search, Download, Copy, Loader2 
} from "lucide-react";

const MyResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchResumes = async () => {
      try {
        const q = query(collection(db, "resumes"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        setResumes(list);
        setFilteredResumes(list);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchResumes();
  }, [user]);

  useEffect(() => {
    const filtered = resumes.filter(res => 
      (res.fullName || res.name || "Untitled").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResumes(filtered);
  }, [searchTerm, resumes]);

  // ✨ FEATURE: DUPLICATE RESUME
  const duplicateResume = async (e, resume) => {
    e.stopPropagation();
    try {
      const { id, ...rest } = resume;
      const newResume = {
        ...rest,
        fullName: `${resume.fullName || "Untitled"} (Copy)`,
        updatedAt: Date.now(),
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, "resumes"), newResume);
      setResumes([{ id: docRef.id, ...newResume }, ...resumes]);
      alert("Blueprint duplicated successfully!");
    } catch (err) { console.error("Duplication failed:", err); }
  };

  // ✨ FEATURE: DOWNLOAD LOGIC (Triggers Editor Print/PDF)
  const handleDownload = (e, id) => {
    e.stopPropagation();
    // Redirects to editor with a download flag or opens print view
    navigate(`/editor/${id}?action=download`);
  };

  const deleteResume = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this architecture permanently?")) {
      await deleteDoc(doc(db, "resumes", id));
      setResumes(prev => prev.filter(r => r.id !== id));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 lg:ml-64">
      <Loader2 className="text-blue-500 animate-spin" size={40} />
    </div>
  );

  return (
    // Fixed: Center alignment and max-width management
    <div className="min-h-screen bg-slate-950 text-slate-50 lg:pl-64 flex justify-center">
      <div className="w-full max-w-7xl p-6 md:p-12">
        
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-black tracking-tighter">
              My <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Blueprints</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Precision engineered career architectures.</p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" placeholder="Search blueprints..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:border-blue-500/50 outline-none w-full md:w-80 backdrop-blur-md transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate("/templates/new")}
              className="bg-blue-600 hover:bg-blue-500 px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20"
            >
              <Plus size={20} /> Create New
            </motion.button>
          </div>
        </header>

        <AnimatePresence mode="popLayout">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-center"
          >
            {filteredResumes.map((resume) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -12 }}
                className="group relative bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-7 backdrop-blur-3xl hover:border-blue-500/40 transition-all shadow-2xl"
              >
                {/* Status and Action Menu */}
                <div className="flex justify-between items-center mb-8">
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    {resume.template?.replace('-', ' ') || 'MODERN'}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={(e) => duplicateResume(e, resume)}
                      className="p-2.5 bg-white/5 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-xl transition-all"
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      onClick={(e) => deleteResume(e, resume.id)}
                      className="p-2.5 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-10 flex items-center gap-5">
                  <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-all">
                    <FileText className="text-slate-600 group-hover:text-blue-500" size={30} />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-xl font-bold truncate pr-2">{resume.fullName || "Untitled"}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <Calendar size={12} />
                      <span>{new Date(resume.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate(`/editor/${resume.id}`)}
                    className="flex-1 bg-white/5 hover:bg-blue-600 py-3.5 rounded-xl text-xs font-bold border border-white/10 hover:border-blue-400 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 size={14} /> Edit Blueprint
                  </button>
                  <button 
                    onClick={(e) => handleDownload(e, resume.id)}
                    className="px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyResumes;