import React from "react";

export default function AISuggestions({
  atsScore,
  jobMatchScore,
  missingSkills = [],
  experienceList = [],
  projectList = []
}) {

  const suggestions = [];

  // 🔥 Skill Suggestions
  if (missingSkills.length > 0) {
    suggestions.push({
      text: `Add ${Math.min(3, missingSkills.length)} missing skills`,
      impact: "+5%",
      type: "warning"
    });
  } else {
    suggestions.push({
      text: "Strong skill coverage",
      impact: "✓",
      type: "good"
    });
  }

  // 🔥 Job Match Suggestions
  if (jobMatchScore < 60) {
    suggestions.push({
      text: "Improve keyword matching with job description",
      impact: "+10%",
      type: "warning"
    });
  }

  // 🔥 Metrics Suggestions
  const text = `
    ${experienceList.map(e => e.details).join(" ")}
    ${projectList.map(p => p.details).join(" ")}
  `;

  const hasMetrics = /\d+%|\d+x|\d+ users|\d+ ms/i.test(text);

  if (!hasMetrics) {
    suggestions.push({
      text: "Add measurable results (%, users, performance)",
      impact: "+8%",
      type: "warning"
    });
  } else {
    suggestions.push({
      text: "Good use of metrics",
      impact: "✓",
      type: "good"
    });
  }

  // 🔥 ATS Score Hint
  if (atsScore < 85) {
    suggestions.push({
      text: "Optimize resume content for ATS",
      impact: "+10%",
      type: "warning"
    });
  }

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 shadow-lg">
      <h3 className="text-sm font-bold text-white mb-3">
        🚀 AI Suggestions
      </h3>

      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className={`flex justify-between text-xs px-2 py-2 rounded-lg ${
              s.type === "good"
                ? "bg-green-500/10 text-green-400"
                : "bg-yellow-500/10 text-yellow-300"
            }`}
          >
            <span>{s.text}</span>
            <span className="font-bold">{s.impact}</span>
          </div>
        ))}
      </div>
    </div>
  );
}