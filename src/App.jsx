import React from "react";
import AppRouter from "./router/AppRouter";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ResumePro+ Root Component
 * Provides the global layout, background atmosphere, and high-fidelity 
 * typography settings that persist across all route transitions.
 */
function App() {
  return (
    <div className="min-h-screen w-full bg-slate-950 font-sans text-slate-50 antialiased selection:bg-blue-500/30">
      
      {/* ==================== GLOBAL ATMOSPHERE (Layer -10) ==================== */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Dynamic Radial Glows - Provides depth without interfering with page-specific neons */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,_rgba(59,130,246,0.1),transparent_50%),_radial-gradient(circle_at_50%_110%,_rgba(168,85,247,0.1),transparent_50%)]" />
        
        {/* Subtle Architectural Grid - Reduced opacity for premium feel */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,_#ffffff_1px,transparent_1px),linear-gradient(to_bottom,_#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Grainy Texture Overlay - Adds "High-End Tech" film grain effect */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-soft-light" />
      </div>

      {/* ==================== CONTENT GATEWAY ==================== */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10"
      >
        {/* AppRouter handles the rendering of Dashboard, SkillAnalytics, JobMatcher, and Settings */}
        <AppRouter />
      </motion.main>

      {/* Global Screen Reader Alert Container 
          (Required for professional accessibility)
      */}
      <div id="announcer" className="sr-only" aria-live="polite" />
    </div>
  );
}

export default App;