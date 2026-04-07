import React from "react";

export default function ATSResumeBuilder() {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Free ATS Resume Builder Online (AI Optimized)
        </h1>
        <p className="text-slate-400">
          Create resumes that pass Applicant Tracking Systems used by top companies.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-10 text-slate-400">
        <section>
          <h2 className="text-xl font-bold text-white mb-2">
            What is an ATS Resume?
          </h2>
          <p>
            An ATS resume is designed to pass automated hiring systems. These systems
            scan your resume for keywords, formatting, and relevance before recruiters
            see it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-2">
            Why ATS Optimization is Important
          </h2>
          <p>
            Without ATS optimization, your resume can be rejected automatically.
            Our AI ensures your resume matches job descriptions and improves selection chances.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-2">
            Key Features
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>AI keyword optimization</li>
            <li>Clean ATS-friendly formatting</li>
            <li>Resume score improvement</li>
            <li>Job description matching</li>
          </ul>
        </section>
      </div>

      <div className="text-center mt-16">
        <a href="/" className="px-6 py-3 bg-purple-600 rounded-xl font-bold">
          Build ATS Resume →
        </a>
      </div>
    </div>
  );
}