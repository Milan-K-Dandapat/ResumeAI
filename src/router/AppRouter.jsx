import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ResumeForFreshers from "../pages/ResumeForFreshers";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import ResumeEditor from "../pages/ResumeEditor";
import TemplateSelector from "../components/TemplateSelector"; 
import ATSResumeBuilder from "../pages/ATSResumeBuilder";
import ResumeForStudents from "../pages/ResumeForStudents";
import AIResumeBuilder from "../pages/AIResumeBuilder";
// Import New Sidebar Components
import SkillAnalytics from "../pages/SkillAnalytics";
import JobMatcher from "../pages/JobMatcher";
import AccountSettings from "../pages/AccountSettings";

/**
 * 🔥 NEXT LEVEL UX: ScrollToTop
 * Ensures that every time the route changes, the window scrolls to (0,0)
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      {/* Utility to reset scroll position on navigation */}
      <ScrollToTop />
      
      <Routes>
        {/* ==================== PUBLIC PORTALS ==================== */}
        <Route path="/" element={<Landing />} />
        <Route path="/ats-resume-builder" element={<ATSResumeBuilder />} />
<Route path="/resume-builder-for-students" element={<ResumeForStudents />} />
<Route path="/ai-resume-builder" element={<AIResumeBuilder />} />
        <Route path="/resume-builder-for-freshers" element={<ResumeForFreshers />} />
        {/* Unified Google Auth Entry Points */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ==================== WORKSPACE (PROTECTED) ==================== */}
        {/* Note: The components themselves check for 'user' via useAuth */}
        
        {/* The Hub for all saved resumes */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* New Sidebar Navigation Routes */}
        <Route path="/analytics" element={<SkillAnalytics />} />
        <Route path="/job-matcher" element={<JobMatcher />} />
        <Route path="/settings" element={<AccountSettings />} />

        {/* The Architecture Selection Lab */}
        <Route path="/templates/:resumeId" element={<TemplateSelector />} />

        {/* The Professional Content Editor */}
        <Route path="/editor/:resumeId" element={<ResumeEditor />} />

        {/* Catch-all Redirect to Landing (Optional) */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}