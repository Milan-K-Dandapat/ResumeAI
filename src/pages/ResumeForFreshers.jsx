import React from "react";

export default function ResumeForFreshers() {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">
      
      {/* 🔥 MAIN HEADING */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Best Free AI Resume Builder for Freshers in India (ATS Optimized)
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Create professional, ATS-friendly resumes using AI. Perfect for students,
          freshers, and software engineers looking to get hired in top companies like
          TCS, Infosys, and startups.
        </p>
      </div>

      {/* 🔥 SECTION 1 */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Why Freshers Need an ATS-Friendly Resume
        </h2>
        <p className="text-slate-400 leading-relaxed text-sm md:text-base">
          Most companies today use Applicant Tracking Systems (ATS) to filter resumes.
          If your resume is not optimized, it may never reach a recruiter. A strong ATS
          resume ensures your skills, projects, and education are properly recognized
          by hiring systems.
        </p>
      </div>

      {/* 🔥 SECTION 2 */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Features of Our AI Resume Builder
        </h2>

        <ul className="text-slate-400 space-y-4 text-sm md:text-base">
          <li>✅ AI-powered content generation for summaries and experience</li>
          <li>✅ Automatic repetition removal and grammar correction</li>
          <li>✅ ATS-friendly resume templates for freshers</li>
          <li>✅ Job description matching for better selection chances</li>
          <li>✅ Clean and professional resume design</li>
        </ul>
      </div>

      {/* 🔥 SECTION 3 */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-4">
          How to Create a Resume for Freshers
        </h2>

        <ol className="text-slate-400 space-y-4 text-sm md:text-base list-decimal pl-5">
          <li>Enter your personal details and education</li>
          <li>Add your projects, internships, and skills</li>
          <li>Use AI to improve your summary and bullet points</li>
          <li>Optimize your resume for ATS keywords</li>
          <li>Download your professional resume instantly</li>
        </ol>
      </div>

      {/* 🔥 SECTION 4 */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Resume Builder for Software Engineers & Students
        </h2>
        <p className="text-slate-400 leading-relaxed text-sm md:text-base">
          Whether you are a computer science student or a fresher applying for your
          first job, our AI resume builder helps you highlight your technical skills,
          projects, and achievements effectively. It ensures your resume stands out
          in competitive job markets.
        </p>
      </div>

      {/* 🔥 CTA SECTION */}
      <div className="max-w-4xl mx-auto text-center mt-16">
        <h2 className="text-2xl font-bold mb-4">
          Start Building Your Resume Now
        </h2>
        <p className="text-slate-400 mb-6">
          Create your ATS-friendly resume in minutes with Melo AI Resume Builder.
        </p>

        <a
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:opacity-90 transition"
        >
          Build Resume Free →
        </a>
      </div>

    </div>
  );
}