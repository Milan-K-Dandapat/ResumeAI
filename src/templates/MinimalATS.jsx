import React from "react";

export default function MinimalATS({ data }) {
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

  // 🔹 SECTION (ATS CLEAN)
  const Section = ({ title, children }) => (
    <div className="mb-4">
      <h2 className="text-[11px] font-bold uppercase border-b border-black pb-1 mb-2">
        {title}
      </h2>
      <div className="text-[10px] leading-relaxed text-black">
        {children}
      </div>
    </div>
  );

  // 🔹 BULLETS (ATS SAFE)
  const formatList = (text) => {
    if (!text) return null;

    return text.split("\n").map((line, i) => {
      const clean = line.replace(/^[-•]\s*/, "").trim();
      if (!clean) return null;

      return (
        <p key={i} className="mb-1">
          • {clean}
        </p>
      );
    });
  };

  // 🔹 SKILLS (INLINE ATS FORMAT)
  const skills = [
    skillProgramming,
    skillWeb,
    skillDb,
    skillTools,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="w-full min-h-[297mm] bg-white text-black p-8 font-serif">

      {/* 🔥 HEADER */}
      <div className="mb-4">
        <h1 className="text-[18px] font-bold tracking-wide">
          {fullName || "YOUR NAME"}
        </h1>

        <p className="text-[11px] mt-1">
          {headline || "Professional Title"}
        </p>

        <p className="text-[10px] mt-1">
          {contactEmail} | {contactPhone} | {contactLocation}
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
        <Section title="Professional Summary">
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
      {skills && (
        <Section title="Skills">
          <p>{skills}</p>
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