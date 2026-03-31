// src/core/templateRegistry.js

import ModernTech1 from "../templates/ModernTech1";
import MinimalATS from "../templates/MinimalATS";
import FAANGPro from "../templates/FaangPro";
import TwoColumnPro from "../templates/TwoColumnPro";
import CreativeGradient from "../templates/CreativeGradient";

// 🔥 TEMP: using same component for multiple templates
// Later you can replace each with real components

export const TEMPLATE_REGISTRY = {
  // ✅ PREMIUM
  "modern-tech1": {
    component: ModernTech1,
    name: "Modern Tech 1",
    category: "Premium",
  },
  "modern-pro": {
    component: CreativeGradient, // 🔥 upgrade
    name: "Modern Pro",
    category: "Premium",
  },
  "creative-gradient": {
  component: CreativeGradient,
  name: "Creative Gradient",
  category: "Premium",
},

  "two-column": {
    component: TwoColumnPro, // 🔥 FIXED
    name: "Two Column",
    category: "Premium",
  },

  // ✅ ATS
  "ats-classic": {
    component: MinimalATS, // 🔥 FIXED
    name: "ATS Classic",
    category: "ATS",
  },
  "ats-modern": {
    component: MinimalATS, // 🔥 FIXED
    name: "ATS Modern",
    category: "ATS",
  },

  // ✅ FAANG
  "faang-google": {
    component: FAANGPro, // 🔥 FIXED
    name: "Google Style",
    category: "FAANG",
  },
  "faang-amazon": {
    component: FAANGPro,
    name: "Amazon Style",
    category: "FAANG",
  },
  "faang-meta": {
    component: FAANGPro,
    name: "Meta Style",
    category: "FAANG",
  },

  // ✅ SERVICE (keep simple or upgrade later)
  "service-tcs": {
    component: MinimalATS,
    name: "TCS Style",
    category: "Service",
  },
  "service-infosys": {
    component: MinimalATS,
    name: "Infosys Style",
    category: "Service",
  },
  "service-deloitte": {
    component: MinimalATS,
    name: "Deloitte Style",
    category: "Service",
  },
  "service-ibm": {
    component: MinimalATS,
    name: "IBM Style",
    category: "Service",
  },
};

// 🎯 SAFE GETTER
export const getTemplateComponent = (templateId) => {
  if (!templateId) return TEMPLATE_REGISTRY["modern-tech1"].component;

  const template = TEMPLATE_REGISTRY[templateId];

  if (!template) {
    console.warn("Template not found:", templateId);
    return TEMPLATE_REGISTRY["modern-tech1"].component;
  }

  return template.component;
};