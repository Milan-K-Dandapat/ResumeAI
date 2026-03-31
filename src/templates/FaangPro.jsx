import React from "react";

export default function FAANGPro({ data }) {
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
    achievements, // 🔥 added
  } = data;

  // 🔹 SECTION
  const Section = ({ title, children }) => (
    <div className="mb-5">
      <h2 className="text-[11px] font-semibold text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1 mb-2">
        {title}
      </h2>
      <div className="text-[11px] text-slate-800 leading-relaxed">
        {children}
      </div>
    </div>
  );

  // 🔹 BULLET FORMATTER (CLEAN FAANG STYLE)
  const formatList = (text) => {
    if (!text) return null;

    return text.split("\n").map((line, i) => {
      const clean = line.replace(/^[-•]\s*/, "").trim();
      if (!clean) return null;

      return (
        <div key={i} className="flex gap-2 mb-1">
          <span className="text-slate-400">•</span>
          <span>{clean}</span>
        </div>
      );
    });
  };

  // 🔹 SKILLS (BETTER STRUCTURE)
  const skills = [
    skillProgramming && `Languages: ${skillProgramming}`,
    skillWeb && `Web: ${skillWeb}`,
    skillDb && `Backend: ${skillDb}`,
    skillTools && `Tools: ${skillTools}`,
  ].filter(Boolean);

  return (
    <div className="w-full min-h-[297mm] bg-white text-slate-900 p-10 font-sans">

      {/* 🔥 HEADER */}
      <div className="mb-5">
        <h1 className="text-[22px] font-bold tracking-tight">
          {fullName || "Your Name"}
        </h1>

        <p className="text-[12px] text-slate-600 mt-1">
          {headline || "Software Engineer"}
        </p>

        <p className="text-[10px] text-slate-500 mt-2">
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
          <div className="grid grid-cols-2 gap-y-1">
            {skills.map((s, i) => (
              <p key={i}>{s}</p>
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