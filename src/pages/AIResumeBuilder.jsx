import React from "react";

export default function AIResumeBuilder() {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          AI Resume Builder Online (Smart Resume Generator)
        </h1>
        <p className="text-slate-400">
          Build professional resumes instantly using artificial intelligence.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-10 text-slate-400">
        <section>
          <h2 className="text-white font-bold text-xl mb-2">
            What is an AI Resume Builder?
          </h2>
          <p>
            AI resume builders automatically generate summaries, improve bullet points,
            and optimize resumes for job applications.
          </p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-2">
            Benefits of Using AI
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Faster resume creation</li>
            <li>Better wording and grammar</li>
            <li>ATS optimization</li>
            <li>Improved chances of selection</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-2">
            Why Choose Melo AI
          </h2>
          <p>
            Melo provides smart resume suggestions, repetition fixing, and
            job-based optimization for better results.
          </p>
        </section>
      </div>

      <div className="text-center mt-16">
        <a href="/" className="px-6 py-3 bg-pink-600 rounded-xl font-bold">
          Try AI Resume Builder →
        </a>
      </div>
    </div>
  );
}