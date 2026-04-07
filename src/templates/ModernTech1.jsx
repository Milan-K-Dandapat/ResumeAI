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

  const lines = text
  .replace(/•/g, "\n•")   // 🔥 force new line before every bullet
  .replace(/\.\s+(?=[A-Z])/g, ".\n") // 🔥 split sentences into new lines
  .split("\n")
  .map(l => l.trim())
  .filter(Boolean);

  let verbIndex = 0;
  const verbs = ["Built", "Designed", "Implemented", "Created", "Developed"];

  return lines.map((line, i) => {
    let clean = line
  .replace(/^[-•]\s*/, "")
  .replace(/•/g, "") // 🔥 remove inline bullets
  .trim();

    // remove bad words
    clean = clean.replace(/undefined/gi, "");

    // fix repetition
    clean = clean.replace(/developed/gi, () => {
      const word = verbs[verbIndex % verbs.length];
      verbIndex++;
      return word;
    });

    if (!clean) return null;

    const isHeading =
      (type === "project" || type === "experience") && i === 0;

    if (isHeading) {
      return (
        <div key={i} className="font-semibold text-black mt-2 mb-1">
          {clean}
        </div>
      );
    }

    return (
      <div key={i} className="flex gap-2 mb-0.5 leading-tight">
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
  <section className="mb-4">
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
          <h1 className="text-[20px] font-bold break-words">
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
<div className="text-[11px] mt-1 space-y-0.5">
  {linkedin && <p>LinkedIn: {linkedin}</p>}
  {github && <p>GitHub: {github}</p>}
  {portfolio && <p>Portfolio: {portfolio}</p>}
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
                <p>{summary}</p>
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

{Array.isArray(projects) && projects.length > 0 && (
  <Section title="Projects">
    {projects.map((proj, i) => (
      <div key={i}>
        {formatList(
          typeof proj === "string"
            ? proj
            : `${proj.header}\n${proj.details}`,
          "project"
        )}
      </div>
    ))}
  </Section>
)}

{Array.isArray(experience) && experience.length > 0 && (
  <Section title="Experience">
    {experience.map((exp, i) => (
      <div key={i}>
        {formatList(
          typeof exp === "string"
            ? exp
            : `${exp.header}\n${exp.details}`,
          "experience"
        )}
      </div>
    ))}
  </Section>
)}

{Array.isArray(achievements) && achievements.length > 0 && (
  <Section title="Achievements">
    {achievements.map((ach, i) => (
      <div key={i}>
        {formatList(
          typeof ach === "string" ? ach : ach.text,
          "achievement"
        )}
      </div>
    ))}
  </Section>
)}
          </div>
        </div>
      ) : (
        <>
          {/* 🔥 STANDARD LAYOUT */}

          {summary && (
            <Section title="Summary">
              <p>{summary}</p>
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
{Array.isArray(projects) && projects.length > 0 && (
  <Section title="Projects">
    {projects.map((proj, i) => (
      <div key={i}>
        {formatList(
          typeof proj === "string"
            ? proj
            : `${proj.header}\n${proj.details}`,
          "project"
        )}
      </div>
    ))}
  </Section>
)}

{Array.isArray(experience) && experience.length > 0 && (
  <Section title="Experience">
    {experience.map((exp, i) => (
      <div key={i}>
        {formatList(
          typeof exp === "string"
            ? exp
            : `${exp.header}\n${exp.details}`,
          "experience"
        )}
      </div>
    ))}
  </Section>
)}

{Array.isArray(achievements) && achievements.length > 0 && (
  <Section title="Achievements">
    {achievements.map((ach, i) => (
      <div key={i}>
        {formatList(
          typeof ach === "string" ? ach : ach.text,
          "achievement"
        )}
      </div>
    ))}
  </Section>
)}
        </>
      )}
    </div>
  );
}