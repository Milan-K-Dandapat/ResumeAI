import React from "react";

export default function ModernTech1({ data, templateId }) {
  const {
    fullName,
    headline,
    contactEmail,
    contactPhone,
    contactLocation,
    github,
    linkedin,
    portfolio,
    summary,
    education,
    experience,
    projects,
    achievements, // 🔥 added
    skillWeb,
    skillDb,
    skillProgramming,
    skillTools,
    skillOther,
  } = data;

  // 🔥 TEMPLATE TYPE DETECTION
  const isFAANG = templateId?.includes("faang");
  const isATS = templateId?.includes("ats");
  const isService = templateId?.includes("service");
  const isTwoColumn = templateId === "two-column";

  // 🔹 FORMAT LIST
const formatList = (text, type = "") => {
  if (!text) return null;

  const lines = text.split("\n");

  return lines.map((line, i) => {
    const clean = line.replace(/^[-•]\s*/, "").trim();
    if (!clean) return null;

    // 🔥 HEADING ONLY FOR PROJECTS & EXPERIENCE
   const isHeading =
  (type === "project" || type === "experience") &&
  i === 0;

    if (isHeading) {
      return (
        <div key={i} className="font-semibold text-black mt-2 mb-1">
          {clean}
        </div>
      );
    }

    return (
      <div key={i} className="flex gap-2 mb-0.5">
        <span className="text-gray-400">•</span>
        <span>{clean}</span>
      </div>
    );
  });
};

  // 🔹 SKILLS
  const renderSkills = () => {
    const rows = [];
    if (skillWeb) rows.push(skillWeb);
    if (skillDb) rows.push(skillDb);
    if (skillProgramming) rows.push(skillProgramming);
    if (skillTools) rows.push(skillTools);
    if (skillOther) rows.push(skillOther);
    return rows;
  };

  // 🔹 SECTION COMPONENT
  const Section = ({ title, children }) => (
  <section className="mb-4 break-inside-avoid">
      <h2 className="text-[13px] font-semibold mb-1 border-b border-gray-300 pb-1 uppercase tracking-wide">
        {title}
      </h2>
      <div className="text-[12px] text-gray-700 leading-relaxed">
        {children}
      </div>
    </section>
  );

  return (
    <div
  className={`w-full leading-relaxed ${
        isATS
          ? "bg-white text-black p-6 font-serif"
          : isFAANG
          ? "bg-white text-slate-900 p-8 font-sans"
          : isService
          ? "bg-white text-black p-8"
          : "bg-white text-black p-6"
      }`}
    >
      {/* 🔥 HEADER */}
      <div className="flex justify-between items-start border-b pb-4 mb-5 gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-[20px] font-bold leading-tight">
  {fullName}
</h1>
          <p className="text-blue-600 text-sm mt-1">{headline}</p>
        </div>
        <div className="text-right text-[11px] leading-tight space-y-0.5 flex-shrink-0">
  <p className="break-words">{contactEmail}</p>
  <p>{contactPhone}</p>
  <p className="text-gray-600">{contactLocation}</p>
</div>
      </div>

      {/* 🔥 SOCIAL */}
 {(linkedin || github || portfolio) && (
  <div className="flex flex-wrap gap-3 mt-3">

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

      {/* 🔥 TWO COLUMN LAYOUT */}
      {isTwoColumn ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* LEFT */}
          <div className="col-span-1 bg-gray-100 p-3">
            <h2 className="font-bold mb-2">Skills</h2>
            {renderSkills().map((s, i) => (
              <p key={i}>{s}</p>
            ))}
          </div>

          {/* RIGHT */}
          <div className="col-span-2">

            {summary && (
              <Section title="Summary">
                <p dangerouslySetInnerHTML={{ __html: summary }} />
              </Section>
            )}

            {education && (
              <Section title="Education">
                {education.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </Section>
            )}

            {!!renderSkills().length && (
              <Section title="Skills">
                {renderSkills().map((s, i) => (
                  <p key={i}>{s}</p>
                ))}
              </Section>
            )}

{projects && (
  <Section title="Projects">
    {formatList(projects, "project")}
  </Section>
)}

{experience && (
  <Section title="Experience">
    {formatList(experience, "experience")}
  </Section>
)}

{achievements && (
  <Section title="Achievements">
    {formatList(achievements, "achievement")}
  </Section>
)}
          </div>
        </div>
      ) : (
        <>
          {/* 🔥 STANDARD LAYOUT */}

          {summary && (
            <Section title="Summary">
              <p dangerouslySetInnerHTML={{ __html: summary }} />
            </Section>
          )}

          {education && (
            <Section title="Education">
              {education.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </Section>
          )}

          {!!renderSkills().length && (
            <Section title="Skills">
              {renderSkills().map((s, i) => (
                <p key={i}>{s}</p>
              ))}
            </Section>
          )}
{projects && (
  <Section title="Projects">
    {formatList(projects, "project")}
  </Section>
)}

{experience && (
  <Section title="Experience">
    {formatList(experience, "experience")}
  </Section>
)}

          {achievements && (
            <Section title="Achievements">
              {formatList(achievements)}
            </Section>
          )}
        </>
      )}
    </div>
  );
}