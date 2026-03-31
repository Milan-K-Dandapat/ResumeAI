// src/pages/TemplateSelector.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiArrowLeft, FiCheck, FiImage, FiBriefcase, FiCode, FiCpu } from "react-icons/fi";
import { db } from "../services/firebase";   // adjust path if needed
import { doc, setDoc } from "firebase/firestore";
import { getTemplateComponent } from "../core/templateRegistry";

// ==========================================
// 📄 A4 TEMPLATE PREVIEW COMPONENT
// ==========================================
const TemplatePreview = ({ templateId, resume, showPhoto }) => {
  const name = resume.fullName || "Milan K. Dandapat";
  const role = resume.headline || "Full Stack MERN Developer";
  const email = resume.contactEmail || "milan@example.com";
  const phone = resume.contactPhone || "+91 6370381040";
  const location = resume.contactLocation || "Odisha, India";

  const summaryText = resume.summary || "A Full Stack Developer dedicated to building scalable and user-centric web applications. Eager to contribute to high-impact projects.";
  const skillsText = resume.skillWeb || "React.js, Node.js, MongoDB, Express, Tailwind CSS, TypeScript";
  const educationText = resume.education || "MCA - IGIT (2024 - Present)\nB.Sc. Computer Sc. - SRB University (8.5 CGPA)";
  const experienceText = resume.experience || "- Developed real-time platform in React.js\n- Optimized database handling, reducing errors by 30%";
  const projectsText = resume.projects || "Melo - AI Chat Platform\nStyleMate - AI Shopping Assistant";

  const Section = ({ title, content, customColor, borderColor }) => (
    <div className="mb-3">
      <p className={`font-bold uppercase text-[10px] mb-1 pb-0.5 border-b ${customColor ? customColor : 'text-slate-900'} ${borderColor ? borderColor : 'border-slate-300'}`}>
        {title}
      </p>
      <p className="whitespace-pre-line text-[9px] leading-relaxed text-slate-700">{content}</p>
    </div>
  );

  const ProfilePhoto = () => (
  showPhoto && (
    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
      {resume.image ? (
        <img 
          src={resume.image} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-200">
          <FiImage className="text-slate-400" size={20} />
        </div>
      )}
    </div>
  )
);

 

const TemplateComponent = getTemplateComponent(templateId);

return (
  <div className="bg-white w-full rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.3)] p-3">

    <TemplateComponent
      templateId={templateId}
      data={{
        fullName: name,
        headline: role,
        contactEmail: email,
        contactPhone: phone,
        contactLocation: location,
        summary: summaryText,
        experience: experienceText,
        projects: projectsText,
        education: educationText,
        skillWeb: skillsText,
        image: resume.image,
      }}
    />

  </div>
);
};

// ==========================================
// 🎛️ MAIN TEMPLATE SELECTOR PAGE
// ==========================================
export default function TemplateSelector() {
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const { user } = useAuth(); // REAL AUTH BACK IN

  const [id, setId] = useState(resumeId);
  const [activePreview, setActivePreview] = useState("faang-google");
  const [showPhoto, setShowPhoto] = useState(false);
  const [resume, setResume] = useState({});
  const [image, setImage] = useState(null);
  const [showATSPreview, setShowATSPreview] = useState(false);

  const templateCategories = [
    {
  category: "ATS Optimized",
  icon: <FiCpu className="text-cyan-400" />,
  items: [
    { id: "ats-classic", name: "ATS Classic (98% Pass)" },
    { id: "ats-modern", name: "Modern ATS Pro" },
  ]
},
{
  category: "Premium Layouts",
  items: [
    { id: "modern-tech1", name: "Modern Tech 1" },
    { id: "modern-pro", name: "Modern Pro" }, // ✅ ADD THIS
    { id: "two-column", name: "Two Column Elite" },
    { id: "creative-gradient", name: "Creative Gradient" }, // ✅ ADD THIS (optional if you want separate)
  ]
},
    {
      category: "FAANG / Product",
      icon: <FiCode className="text-blue-400" />,
      items: [
        { id: "faang-google", name: "Google Optimized" },
        { id: "faang-amazon", name: "Amazon STAR Style" },
        { id: "faang-meta", name: "Meta Fast-Track" },
      ]
    },
    {
      category: "Service IT (MNCs)",
      icon: <FiBriefcase className="text-emerald-400" />,
      items: [
        { id: "service-tcs", name: "TCS Next Pattern" },
        { id: "service-infosys", name: "Infosys Benchmark" },
        { id: "service-deloitte", name: "Deloitte Professional" },
        { id: "service-ibm", name: "IBM Blue" },
      ]
    }
  ];

  useEffect(() => {
    if (!user) {
        navigate("/login");
        return;
    }

    let currentId = resumeId;
    if (resumeId === "new") {
      currentId = "res_" + Math.random().toString(36).substr(2, 9);
      setId(currentId);
      localStorage.setItem(currentId, JSON.stringify({ template: "faang-google", showPhoto: false }));
      navigate(`/templates/${currentId}`, { replace: true });
      return;
    }

    const savedData = localStorage.getItem(currentId);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setResume(parsedData);
      if (parsedData.template) setActivePreview(parsedData.template);
      if (parsedData.showPhoto !== undefined) setShowPhoto(parsedData.showPhoto);
      if (parsedData.image) setImage(parsedData.image);
    }
  }, [resumeId, user, navigate]);

  useEffect(() => {
  if (showATSPreview) {
    document.body.style.overflow = "hidden"; // ❌ stop background scroll
  } else {
    document.body.style.overflow = "auto"; // ✅ restore
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showATSPreview]);

 const applyTemplate = async () => {
  const currentId = id;

  // 🔴 VERY IMPORTANT CHECK
  if (!currentId || currentId === "new") {
    alert("Resume ID not ready yet. Please wait...");
    return;
  }

  try {
    const updatedData = {
  ...resume, // 🔥 KEEP ALL RESUME DATA
  template: activePreview,
  showPhoto,
  image,
  updatedAt: Date.now()
};

    console.log("Saving template for:", currentId);

    await setDoc(doc(db, "resumes", currentId), updatedData, { merge: true });

    localStorage.setItem(
  currentId,
  JSON.stringify({
    ...resume,   // 🔥 keep old data
    ...updatedData
  })
);

    console.log("Navigating to editor...");

    navigate(`/editor/${currentId}`);

  } catch (err) {
    console.error("Template save error:", err);

    // 🔥 FORCE NAVIGATION EVEN IF ERROR
    navigate(`/editor/${currentId}`);
  }
};

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
      {/* Background Neon Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/dashboard`)} className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/20 transition-all">
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
              Architecture Lab
            </h1>
            <p className="text-xs text-slate-400">Choose the blueprint for your dream company.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/50 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-xl shadow-lg">
          <FiImage className={showPhoto ? "text-purple-400" : "text-slate-500"} />
          <span className="text-xs font-medium">Include Photo</span>
          <button 
            onClick={() => setShowPhoto(!showPhoto)}
            className={`w-10 h-5 rounded-full relative transition-all ${showPhoto ? 'bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-700'}`}
          >
            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${showPhoto ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
        {showPhoto && (
  <div className="mt-3">
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }}
      className="text-xs"
    />
  </div>
)}

      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        
        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-4">
            <div className="bg-white/5 rounded-3xl p-5 border border-white/10 backdrop-blur-xl">
                {templateCategories.map((cat, idx) => (
                    <div key={idx} className="mb-6 last:mb-0">
                    <div className="flex items-center gap-2 mb-3 px-1">
                        {cat.icon}
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.category}</p>
                    </div>
                    <div className="space-y-2">
                        {cat.items.map((tpl) => (
                        <div
                            key={tpl.id}
                           onClick={() => {
  setActivePreview(tpl.id);
  setShowATSPreview(true); // 🔥 ALWAYS OPEN POPUP
}}
                            className={`relative cursor-pointer rounded-xl border p-3 transition-all duration-300 ${
                            activePreview === tpl.id
                                ? "border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(147,51,234,0.2)]"
                                : "border-white/5 bg-black/20 hover:border-white/20"
                            }`}
                        >
                            <p className={`text-sm font-semibold ${activePreview === tpl.id ? 'text-white' : 'text-slate-400'}`}>
                            {tpl.name}
                            </p>
                        </div>
                        ))}
                    </div>
                    </div>
                ))}
            </div>
            
            {/* AI Suggestion Box */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-4 border border-indigo-500/20">
                <p className="text-[10px] font-bold text-indigo-300 uppercase mb-2 flex items-center gap-2">
                    <FiCpu /> AI Analysis
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                    Targeting <b>{activePreview.split('-')[1]?.toUpperCase() || "Global"}</b> standards. We've optimized the layout hierarchy to pass their specific ATS filters.
                </p>
            </div>
        </div>

        {/* PREVIEW */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full max-w-md relative group">
            <TemplatePreview 
  templateId={activePreview} 
  resume={{ ...resume, image }} 
  showPhoto={showPhoto} 
/>
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl opacity-50" />
          </div>

          <button
  onClick={applyTemplate}
  disabled={!id || id === "new"}
            className="mt-8 group relative flex items-center gap-2 px-10 py-4 rounded-full bg-white text-slate-950 font-bold transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-md opacity-40 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2">
                <FiCheck size={20} /> Deploy Architecture
            </span>
          </button>
        </div>
      </div>
      {showATSPreview && (
  <div
  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center"
  onClick={() => setShowATSPreview(false)} // 🔥 click outside close
>

    {/* SMALL MODAL BOX */}
    <div
  className="relative bg-white rounded-lg w-[90vw] max-w-[900px] max-h-[90vh] shadow-xl flex flex-col"
  style={{ animation: "fadeIn 0.25s ease-out" }}
  onClick={(e) => e.stopPropagation()}
>

      {/* ❌ CLOSE BUTTON */}
      <button
        onClick={(e) => {
  e.stopPropagation();
  setShowATSPreview(false);
}}
        className="absolute top-1 right-2 text-black text-sm font-bold"
      >
        ✕
      </button>

      {/* PREVIEW */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3">
  <TemplatePreview
    templateId={activePreview}
    resume={{ ...resume, image }}
    showPhoto={showPhoto}
  />
</div>
<div className="p-4 border-t flex justify-end">
  <button
    onClick={(e) => {
      e.stopPropagation();
      applyTemplate();
    }}
    className="px-6 py-2 rounded-lg bg-black text-white text-sm font-semibold hover:scale-105 transition"
  >
    Deploy & Edit
  </button>
</div>

    </div>
  </div>
)}
    </div>
  );
}