import React from "react";

export default function TwoColumnPro({ data }) {
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
    achievements, // 🔥 added
    skillWeb,
    skillProgramming,
    skillTools,
    skillDb,
    skillOther,
  } = data;

  // 🔹 BULLET FORMAT
  const formatList = (text) => {
    if (!text) return null;

    return text.split("\n").map((line, i) => {
      const clean = line.replace(/^[-•]\s*/, "").trim();
      if (!clean) return null;

      return (
        <div key={i} className="flex gap-2 mb-1">
          <span className="text-slate-400">•</span>
          <span className="flex-1 break-words">{clean}</span>
        </div>
      );
    });
  };

  // 🔹 SKILLS
  const skills = [
    skillProgramming,
    skillWeb,
    skillDb,
    skillTools,
    skillOther,
  ].filter(Boolean);

  // 🔹 SECTION
  const Section = ({ title, children }) => (
    <section className="mb-6">
      <h2 className="text-[12px] font-semibold border-b border-slate-300 pb-1 mb-2">
        {title}
      </h2>
      <div className="text-[11px] text-slate-800 leading-[1.6] max-w-full break-words whitespace-normal">
        {children}
      </div>
    </section>
  );

  return (
    <div className="w-full min-h-[297mm] bg-white text-slate-900 font-sans break-words">

      <div className="flex">

        {/* 🔵 LEFT SIDEBAR */}
        <div className="bg-slate-900 text-white p-4 flex flex-col w-[120px] flex-shrink-0">

          {/* NAME */}
          <h1 className="text-[16px] font-bold leading-tight break-words">
            {fullName || "Your Name"}
          </h1>

          <p className="text-[11px] text-slate-300 mt-1">
            {headline}
          </p>

          {/* CONTACT */}
          <div className="mt-5 text-[10px] space-y-1 text-slate-300 break-words">
            <p className="break-all">{contactEmail}</p>
            <p>{contactPhone}</p>
            <p>{contactLocation}</p>
          </div>

          {/* LINKS */}
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

          {/* SKILLS */}
          {skills.length > 0 && (
            <div className="mt-6">
              <h2 className="text-[11px] font-semibold mb-2 border-b border-white/20 pb-1">
                Skills
              </h2>

              <div className="text-[10px] space-y-1 text-slate-300">
                {skills.map((s, i) => (
                  <p key={i}>{s}</p>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ⚪ RIGHT CONTENT */}
        <div className="flex-1 p-4 min-w-0 max-w-full">

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

          {/* 🔥 3. PROJECTS */}
          {projects && (
            <Section title="Projects">
              {formatList(projects)}
            </Section>
          )}

          {/* 🔥 4. EXPERIENCE */}
          {experience && (
            <Section title="Experience">
              {formatList(experience)}
            </Section>
          )}

          {/* 🔥 5. ACHIEVEMENTS */}
          {achievements && (
            <Section title="Achievements">
              {formatList(achievements)}
            </Section>
          )}

        </div>

      </div>
    </div>
  );
}