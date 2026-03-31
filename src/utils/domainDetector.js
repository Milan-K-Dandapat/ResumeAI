// src/utils/domainDetector.js

import { DOMAIN_CONFIG } from "./atsEngine";

export const detectDomain = (text = "") => {
  const input = text.toLowerCase();

  let bestDomain = "general";
  let highestScore = 0;

 Object.entries(DOMAIN_CONFIG).forEach(([domain, config]) => {
  let score = 0;

  config.keywords.forEach(k => {
    if (input.includes(k)) score += 2;
  });

  config.tools?.forEach(t => {
    if (input.includes(t)) score += 1;
  });

  // 🔥 FULLSTACK BOOST (IMPORTANT)
  if (
    domain === "fullstack" &&
    input.includes("react") &&
    (input.includes("node") || input.includes("express"))
  ) {
    score += 10;
  }

  if (score > highestScore) {
    highestScore = score;
    bestDomain = domain;
  }
});

  return bestDomain;
};