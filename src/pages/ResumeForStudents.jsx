import React from "react";

export default function ResumeForStudents() {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Resume Builder for Students (Free AI Tool)
        </h1>
        <p className="text-slate-400">
          Create your first professional resume as a student using AI.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-10 text-slate-400">
        <section>
          <h2 className="text-white font-bold text-xl mb-2">
            Why Students Need a Resume
          </h2>
          <p>
            A resume helps students showcase their skills, projects, and achievements
            when applying for internships or jobs.
          </p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-2">
            What to Include
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Education details</li>
            <li>Projects and internships</li>
            <li>Technical and soft skills</li>
            <li>Achievements and certifications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-2">
            How Our AI Helps
          </h2>
          <p>
            Our AI suggests better wording, removes repetition, and creates
            professional summaries automatically.
          </p>
        </section>
      </div>

      <div className="text-center mt-16">
        <a href="/" className="px-6 py-3 bg-blue-600 rounded-xl font-bold">
          Create Resume →
        </a>
      </div>
    </div>
  );
}