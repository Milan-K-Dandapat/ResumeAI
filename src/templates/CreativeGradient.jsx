import React from "react";

export default function CreativeGradient({ data }) {
  const {
    fullName,
    headline,
    contactEmail,
    contactPhone,
    contactLocation,
    linkedin,
    github,
    portfolio,
    summary,
    experience,
    projects,
    education,
    skillWeb,
    skillProgramming,
    skillTools,
    skillDb,
    skillOther,
    achievements, // 🔥 added
  } = data;

  // 🔥 FORMAT LIST
  const formatList = (text) => {
    if (!text) return null;

    return text.split("\n").map((line, i) => {
      const clean = line.replace(/^[-•]\s*/, "");
      if (!clean.trim()) return null;

      return (
        <div key={i} className="flex gap-2 mb-1">
          <span className="text-purple-500">•</span>
          <span>{clean}</span>
        </div>
      );
    });
  };

  // 🔥 SKILLS ARRAY
  const skills = [
    skillProgramming,
    skillWeb,
    skillDb,
    skillTools,
    skillOther,
  ].filter(Boolean);

  // 🔥 SECTION COMPONENT (IMPROVED)
  const Section = ({ title, children }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 shadow-sm">
      <h2 className="text-[11px] font-bold uppercase tracking-wide text-purple-600 mb-2">
        {title}
      </h2>
      <div className="text-[11px] text-slate-700 leading-relaxed">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-[297mm] bg-slate-100 font-sans p-6">

      {/* 🔥 HEADER */}
      <div className="rounded-2xl p-6 text-white mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 shadow-lg">

        <h1 className="text-[22px] font-bold">
          {fullName || "Your Name"}
        </h1>

        <p className="text-[12px] mt-1 opacity-90">
          {headline || "Frontend Developer"}
        </p>

        <p className="text-[10px] mt-3 opacity-80">
          {contactEmail} • {contactPhone} • {contactLocation}
        </p>

{(linkedin || github || portfolio) && (
  <div className="flex flex-wrap gap-3 mt-3 text-[10px]">

    {linkedin && (
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition"
      >
        <span>LinkedIn:</span>
        <span>{linkedin.replace("https://", "")}</span>
      </a>
    )}

    {github && (
      <a
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition"
      >
        <span>GitHub:</span>
        <span>{github.replace("https://", "")}</span>
      </a>
    )}

    {portfolio && (
      <a
        href={portfolio}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition"
      >
        <span>Portfolio:</span>
        <span>{portfolio.replace("https://", "")}</span>
      </a>
    )}

  </div>
)}
      </div>

      {/* 🔥 1. SUMMARY */}
      {summary && (
        <Section title="Summary">
          <p>{summary}</p>
        </Section>
      )}

      {/* 🔥 2. EDUCATION */}
      {education && (
        <Section title="Education">
          {education.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </Section>
      )}

      {/* 🔥 3. SKILLS */}
      {skills.length > 0 && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span
                key={i}
                className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-[10px] font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* 🔥 4. PROJECTS */}
      {projects && (
        <Section title="Projects">
          {formatList(projects)}
        </Section>
      )}

      {/* 🔥 5. EXPERIENCE */}
      {experience && (
        <Section title="Experience">
          {formatList(experience)}
        </Section>
      )}

      {/* 🔥 6. ACHIEVEMENTS */}
      {achievements && (
        <Section title="Achievements">
          {formatList(achievements)}
        </Section>
      )}

    </div>
  );
}