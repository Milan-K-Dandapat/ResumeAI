import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// 🟢 FIREBASE IMPORTS
import { db } from "../../src/services/firebase"; // ⚠️ Update this path if needed
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { FiArrowLeft, FiZap, FiDownload, FiCheckCircle, FiLayout, FiSearch, FiCpu, FiPlus, FiTrash2 } from "react-icons/fi";
import JobMatchModal from "../components/JobMatchModal";
import { detectDomain } from "../utils/domainDetector";
import { DOMAIN_CONFIG } from "../utils/atsEngine";
import { getTemplateComponent } from "../core/templateRegistry";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";
import {
  TextRun,
  AlignmentType,
} from "docx";

export default function ResumeEditor() {
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const { user } = useAuth();
  const resumeRef = useRef(null);

  const [id, setId] = useState(resumeId);
  const [title, setTitle] = useState("Untitled Resume");
  const [isLoaded, setIsLoaded] = useState(false); // Safety flag to prevent auto-saving empty data on load

  // currently selected template
  const [template, setTemplate] = useState("modern-tech1");

  // Top identity
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");

  // Contact & links
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactLocation, setContactLocation] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");

  // Main content
  const [summary, setSummary] = useState("");

  // 🟢 DYNAMIC ARRAY STATES (Replaced static fields)
  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [achievementList, setAchievementList] = useState([]);

  // Skills (grouped)
  const [skillWeb, setSkillWeb] = useState("");
  const [skillDb, setSkillDb] = useState("");
  const [skillProgramming, setSkillProgramming] = useState("");
  const [skillTools, setSkillTools] = useState("");
  const [skillOther, setSkillOther] = useState("");
  const [image, setImage] = useState(null);
  const [fontFamily, setFontFamily] = useState("Arial");
const [fontSize, setFontSize] = useState(11);
const [isATSMode, setIsATSMode] = useState(true);

  // New UI States
  const [saveStatus, setSaveStatus] = useState("Saved ✓");
  const [showJobMatch, setShowJobMatch] = useState(false);
  const [atsScore, setAtsScore] = useState(74);
  const [isScanning, setIsScanning] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
const [jobMatchScore, setJobMatchScore] = useState(0);
const [scanStep, setScanStep] = useState("");
const [scanProgress, setScanProgress] = useState(0);
const [detectedDomain, setDetectedDomain] = useState("general");
const [missingSkills, setMissingSkills] = useState([]);
const [previewScan, setPreviewScan] = useState(false);

  const skillsList = (val) =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // 🔗 LINK FORMAT + VALIDATION
const formatLink = (url, type) => {
  if (!url) return "";

  let clean = url.trim();

  if (!clean.startsWith("http")) {
    if (type === "linkedin") {
      clean = `https://linkedin.com/in/${clean.replace("@", "")}`;
    } else if (type === "github") {
      clean = `https://github.com/${clean.replace("@", "")}`;
    } else {
      clean = `https://${clean}`;
    }
  }

  return clean;
};

const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 🔥 NEW: KEYWORD EXTRACTOR (ADD HERE)
const extractKeywords = (text) => {
  if (!text) return [];

  // ✅ normalize
  const cleanText = text.toLowerCase();

  // ✅ IMPORTANT: include tech + multi-word keywords
  const phrases = [
    "machine learning",
    "data science",
    "full stack",
    "web development",
    "frontend developer",
    "backend developer",
    "software engineer",
    "rest api",
    "microservices",
    "cloud computing"
  ];

  let found = [];

  phrases.forEach(p => {
    if (cleanText.includes(p)) {
      found.push(p);
    }
  });

  // ✅ single words extraction
  const words = cleanText.match(/\b[a-zA-Z+#.]{2,}\b/g) || [];

  const stopWords = [
    "the","and","for","with","you","are","this","that","from",
    "have","has","will","your","our","their","job","role",
    "work","team","good","looking","required","skills",
    "experience","knowledge"
  ];

  const filtered = words.filter(w => !stopWords.includes(w));

  // ✅ merge both
  const allKeywords = [...new Set([...found, ...filtered])];

  // ✅ PRIORITIZE TECH WORDS (VERY IMPORTANT)
  const priority = [
    "react","node","mongodb","express","java","python","c++",
    "javascript","typescript","sql","aws","docker","kubernetes",
    "spring","html","css","firebase","nextjs"
  ];

  const sorted = allKeywords.sort((a, b) => {
    const aScore = priority.includes(a) ? 1 : 0;
    const bScore = priority.includes(b) ? 1 : 0;
    return bScore - aScore;
  });

  return sorted.slice(0, 25);
};

  // Redirect if logged out
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // 💾 1. INITIALIZE FIRESTORE DOCUMENT ID
  useEffect(() => {
    if (!user) return;

    const init = async () => {
      if (resumeId === "new") {
        try {
          // Generate a new unique ID from Firestore
          const newDocRef = doc(collection(db, "resumes"));
          const newId = newDocRef.id;
          setId(newId);
          
          // Initialize empty record in Firestore tied to this user
          await setDoc(newDocRef, { 
            template: "modern-tech1",
            userId: user.uid,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
          
          navigate(`/editor/${newId}`, { replace: true });
        } catch (error) {
          console.error("Error creating new resume:", error);
        }
      } else {
        setId(resumeId);
      }
    };

    init();
  }, [resumeId, user, navigate]);

  // 💾 2. LOAD DATA FROM FIRESTORE
  useEffect(() => {
    if (!id || id === "new" || !user) return;

    const fetchResumeData = async () => {
      try {
        const docRef = doc(db, "resumes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.image) setImage(data.image);
          if (data.fontFamily) setFontFamily(data.fontFamily);
if (data.fontSize) setFontSize(data.fontSize);
          setTitle(data.title || "Untitled Resume");
          setTemplate(data.template || "modern-tech1");

          setFullName(data.fullName || user.displayName || "");
          setHeadline(data.headline || "Full Stack / MERN Developer");

          setContactEmail(data.contactEmail || user.email || "");
          setContactPhone(data.contactPhone || "");
          setContactLocation(data.contactLocation || "");
          setGithub(data.github || "");
          setLinkedin(data.linkedin || "");
          setPortfolio(data.portfolio || "");

          setSummary(data.summary || "");

          // 🟢 Load arrays or migrate old static data automatically
          if (data.educationList) setEducationList(data.educationList);
          else if (data.eduName || data.education) {
            setEducationList([{ id: generateId(), type: data.eduType || "College", name: data.eduName || "", degree: data.eduDegree || "", year: data.eduYear || "", score: data.eduScore || "", extra: data.education || "" }]);
          }

          if (data.experienceList) setExperienceList(data.experienceList);
          else if (data.expHeader || data.experience) {
            setExperienceList([{ id: generateId(), header: data.expHeader || "", details: data.experience || "" }]);
          }

          if (data.projectList) setProjectList(data.projectList);
          else if (data.projHeader || data.projects) {
            setProjectList([{ id: generateId(), header: data.projHeader || "", details: data.projects || "" }]);
          }

          if (data.achievementList) setAchievementList(data.achievementList);
          else if (data.achievements) {
            setAchievementList([{ id: generateId(), text: data.achievements }]);
          }

          setSkillWeb(data.skillWeb || "");
          setSkillDb(data.skillDb || "");
          setSkillProgramming(data.skillProgramming || "");
          setSkillTools(data.skillTools || "");
          setSkillOther(data.skillOther || "");
          
          // Mock ATS Score based on content length
        } else {
          // first draft defaults if doc is empty
          setTemplate("modern-tech1");
          setFullName(user.displayName || "");
          setHeadline("Full Stack / MERN Developer");
          setContactEmail(user.email || "");
        }
      } catch (err) {
        console.error("Error loading resume from Firestore:", err);
      } finally {
        setIsLoaded(true); // Allow auto-save to start running
      }
    };

    fetchResumeData();
  }, [id, user]);

  // 💾 3. FIRESTORE AUTO-SAVE LOGIC
  useEffect(() => {
    if (!id || id === "new" || isScanning || !isLoaded) return;
    
    setSaveStatus("Saving...");
    const payload = {
      title, template, fullName, headline, contactEmail, contactPhone, contactLocation,
      github, linkedin, portfolio, summary, 
      educationList, experienceList, projectList, achievementList,
      skillWeb, skillDb, skillProgramming, skillTools, image,fontFamily,
fontSize, skillOther,
      userId: user.uid, // Tie this explicitly to the user for Dashboard querying
      updatedAt: Date.now()
    };

    const delayDebounceFn = setTimeout(async () => {
      try {
        await setDoc(doc(db, "resumes", id), payload, { merge: true });
        setSaveStatus("Saved ✓");
      } catch (error) {
        console.error("Error auto-saving to Firestore:", error);
        setSaveStatus("Error ⚠️");
      }
    }, 1000); // 1 second debounce for optimal cloud writes

    return () => clearTimeout(delayDebounceFn);
  }, [
    id, title, template, fullName, headline, contactEmail, contactPhone, contactLocation,
    github, linkedin, portfolio, summary, educationList, experienceList, projectList, achievementList,
    skillWeb, skillDb, skillProgramming, skillTools, skillOther, isScanning, isLoaded, user
  ]);

  // 🟢 REAL-TIME ATS CALCULATION (STEP 4)
useEffect(() => {
  if (!isLoaded) return;

  const newScore = calculateATS();
  setAtsScore(newScore);

}, [
  fullName,
  contactEmail,
  contactPhone,
  headline,
  summary,
  experienceList,
  projectList,
  skillWeb,
  skillDb,
  skillProgramming,
  skillTools,
  educationList,
  isLoaded
]);

// 🟢 REAL-TIME JOB MATCH CALCULATION
useEffect(() => {
  const score = calculateJobMatch();
  setJobMatchScore(score);
}, [
  jobDescription,
  headline,
  summary,
  skillWeb,
  skillDb,
  skillProgramming,
  skillTools,
  experienceList,
  projectList
]);

// 🟢 DOMAIN DETECTION (NEW)
useEffect(() => {
  const text = `
    ${headline}
    ${summary}
    ${skillWeb}
    ${skillDb}
    ${skillProgramming}
    ${skillTools}
    ${experienceList.map(e => e.details).join(" ")}
    ${projectList.map(p => p.details).join(" ")}
  `;

  const domain = detectDomain(text);
  setDetectedDomain(domain);

}, [
  headline,
  summary,
  skillWeb,
  skillDb,
  skillProgramming,
  skillTools,
  experienceList,
  projectList
]);

  // 🟢 DYNAMIC ARRAY HANDLERS
  const addEducation = () => setEducationList([...educationList, { id: generateId(), type: "College", name: "", degree: "", year: "", score: "", extra: "" }]);
  const updateEducation = (id, field, value) => setEducationList(educationList.map(item => item.id === id ? { ...item, [field]: value } : item));
  const removeEducation = (id) => setEducationList(educationList.filter(item => item.id !== id));

  const addExperience = () => setExperienceList([...experienceList, { id: generateId(), header: "", details: "" }]);
  const updateExperience = (id, field, value) => setExperienceList(experienceList.map(item => item.id === id ? { ...item, [field]: value } : item));
  const removeExperience = (id) => setExperienceList(experienceList.filter(item => item.id !== id));

  const addProject = () => setProjectList([...projectList, { id: generateId(), header: "", details: "" }]);
  const updateProject = (id, field, value) => setProjectList(projectList.map(item => item.id === id ? { ...item, [field]: value } : item));
  const removeProject = (id) => setProjectList(projectList.filter(item => item.id !== id));

  const addAchievement = () => setAchievementList([...achievementList, { id: generateId(), text: "" }]);
  const updateAchievement = (id, value) => setAchievementList(achievementList.map(item => item.id === id ? { ...item, text: value } : item));
  const removeAchievement = (id) => setAchievementList(achievementList.filter(item => item.id !== id));


  // Go to template selector screen
  const handleChangeTemplate = () => {
    navigate(`/templates/${id}`);
  };

const handlePrint = () => {
  if (!resumeRef.current) return;

  const printContent = resumeRef.current.outerHTML;

  const newWindow = window.open("", "_blank");

  newWindow.document.write(`
    <html>
      <head>
        <title>${fullName || "Resume"}</title>

        <!-- ✅ Tailwind CDN -->
        <script src="https://cdn.tailwindcss.com"></script>

        <link href="https://fonts.googleapis.com/css2?family=Inter&family=Poppins&display=swap" rel="stylesheet">

        <style>
          body {
  margin: 0;
  padding: 0;
  background: white;
  font-family: ${fontFamily}, Arial, sans-serif;
  font-size: ${fontSize}px;
}
/* 🔥 FIX PAGE BREAK ISSUE (IMPORTANT) */
section {
  page-break-inside: avoid;
  break-inside: avoid;
}

section h2 {
  page-break-after: avoid;
}

section div {
  page-break-inside: avoid;
}
          @keyframes scanLine {
  0% { top: 0%; }
  100% { top: 100%; }
}

.animate-scanLine {
  animation: scanLine 1.5s linear infinite;
}

          .print-area {
            width: 210mm;
            min-height: 297mm;
            padding: 12mm;
            margin: auto;
          }

          * {
            -webkit-print-color-adjust: exact;
          }
        </style>
      </head>

      <body>
        ${printContent}
      </body>
    </html>
  `);

  newWindow.document.close();

  setTimeout(() => {
    newWindow.focus();
    newWindow.print();
  }, 500);
};

const handleDownloadDOCX = async () => {

  const createSectionHeading = (text) =>
    new Paragraph({
      children: [
        new TextRun({
          text: text.toUpperCase(),
          bold: true,
          size: 22,
        }),
      ],
      spacing: { before: 300, after: 120 },
    });

  const createBulletList = (text) => {
    if (!text) return [];
    return text.split("\n").map(line =>
      new Paragraph({
        text: line.replace(/^[-•]\s*/, ""),
        bullet: { level: 0 },
      })
    );
  };

  const doc = new Document({
    sections: [
      {
        children: [

          // 🔥 HEADER (LEFT + RIGHT SIMULATION)
          new Paragraph({
            children: [
              new TextRun({
                text: fullName || "YOUR NAME",
                bold: true,
                size: 40,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: headline,
                color: "2563EB",
                bold: true,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun(`Email: ${contactEmail} | `),
              new TextRun(`Phone: ${contactPhone} | `),
              new TextRun(`Location: ${contactLocation}`),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
          }),

          // 🔥 LINKS
          (github || linkedin || portfolio) &&
            new Paragraph({
              children: [
                new TextRun(`GH/ ${github || ""}   `),
                new TextRun(`IN/ ${linkedin || ""}   `),
                new TextRun(`WEB/ ${portfolio || ""}`),
              ],
              spacing: { after: 200 },
            }),

          // 🔥 SUMMARY
          summary && createSectionHeading("Professional Summary"),
          summary &&
            new Paragraph({
              children: [new TextRun(summary)],
            }),

          // 🔥 SKILLS
          (skillWeb || skillDb || skillProgramming || skillTools) &&
            createSectionHeading("Technical Arsenal"),

          skillProgramming &&
            new Paragraph(`Programming: ${skillProgramming}`),
          skillWeb && new Paragraph(`Web: ${skillWeb}`),
          skillDb && new Paragraph(`Backend: ${skillDb}`),
          skillTools && new Paragraph(`Tools: ${skillTools}`),

          // 🔥 PROJECTS
          projectList.length > 0 &&
            createSectionHeading("Key Projects"),

          ...projectList.flatMap((proj) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: proj.header,
                  bold: true,
                }),
              ],
            }),
            ...createBulletList(
              proj.details.replace(/\s*ATS_OPTIMIZED/g, "")
            ),
          ]),

          // 🔥 EXPERIENCE
          experienceList.length > 0 &&
            createSectionHeading("Experience"),

          ...experienceList.flatMap((exp) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.header,
                  bold: true,
                }),
              ],
            }),
            ...createBulletList(
              exp.details.replace(/\s*ATS_OPTIMIZED/g, "")
            ),
          ]),

          // 🔥 EDUCATION
          educationList.length > 0 &&
            createSectionHeading("Education"),

          ...educationList.flatMap((edu) => [
            new Paragraph(
              `${edu.degree} - ${edu.name}`
            ),
            new Paragraph(`${edu.year}`),
            edu.score ? new Paragraph(`Score: ${edu.score}`) : new Paragraph(""),
          ]),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${fullName || "Resume"}.docx`);
};

  // Download PDF logic with naming feature
// 🔥 FIND MISSING KEYWORDS (NEW)
const findMissingKeywords = (jdText, resumeText) => {
  const jdKeywords = extractKeywords(jdText);
  const resumeWords = resumeText.toLowerCase();

  return jdKeywords.filter(k => !resumeWords.includes(k));
};

// 🔥 SMOOTH PROGRESS ANIMATION (ADD HERE)
const animateProgress = async (target) => {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= target) {
          clearInterval(interval);
          resolve();
          return target;
        }
        return prev + 1;
      });
    }, 20);
  });
};
  // AI Auto-Scan/ATS Handler with High-Impact Word Replacement
  // --- NEW AUTHENTIC AI SCAN LOGIC ---
const handleAIScan = async () => {
  setIsScanning(true);
  setPreviewScan(true);
  setScanProgress(0);

  const resumeText = `
    ${headline}
    ${summary}
    ${skillWeb}
    ${skillDb}
    ${skillProgramming}
    ${skillTools}
    ${experienceList.map(e => e.details).join(" ")}
    ${projectList.map(p => p.details).join(" ")}
  `.toLowerCase();

  // 🔥 STEP 1: KEYWORDS
  setScanStep("Extracting job keywords...");
  const jdKeywords = extractKeywords(jobDescription);
  
  const missing = findMissingKeywords(jobDescription, resumeText);
setMissingSkills(missing);

await animateProgress(20);

  await new Promise(r => setTimeout(r, 500));
  setScanStep("Analyzing resume content...");
await animateProgress(40);
await new Promise(r => setTimeout(r, 400));

 // 🔥 STEP 4: FIX EXPERIENCE + GLOBAL REPETITION
setScanStep("Optimizing content & removing repetition...");

// 🔥 ADVANCED SYNONYM MAP
const synonymMap = {
  "developed": ["engineered", "built", "created"],
  "implemented": ["executed", "applied", "deployed"],
  "optimized": ["improved", "enhanced", "streamlined"],
  "designed": ["crafted", "structured", "architected"],
  "built": ["developed", "engineered"],
  "created": ["built", "engineered"],
  "improved": ["enhanced", "boosted"],
  "led": ["managed", "guided"],
  "worked": ["collaborated", "contributed"]
};

// 🔥 GLOBAL REPLACER
const fixRepetitionGlobally = (text) => {
  if (!text) return text;

  let globalFreq = {};
  let words = text.split(/\b/);

  return words.map(w => {
    const lower = w.toLowerCase();

    if (synonymMap[lower]) {
      globalFreq[lower] = (globalFreq[lower] || 0) + 1;

      if (globalFreq[lower] > 1) {
        const options = synonymMap[lower];
        return options[Math.floor(Math.random() * options.length)];
      }
    }

    return w;
  }).join("");
};

// ✅ FIX SUMMARY
setSummary(prev => fixRepetitionGlobally(prev));

// ✅ FIX EXPERIENCE
setExperienceList(prev =>
  prev.map(item => ({
    ...item,
    details: fixRepetitionGlobally(item.details)
  }))
);

// ✅ FIX PROJECTS
setProjectList(prev =>
  prev.map(item => ({
    ...item,
    details: fixRepetitionGlobally(item.details)
  }))
);

  await animateProgress(80);
  await new Promise(r => setTimeout(r, 500));

  // 🔥 STEP 5: ADD SKILLS (REAL ATS BOOST)
  setScanStep("Adding missing skills...");

  if (missing.length > 0) {
    const newSkills = missing.slice(0, 5).join(", ");
    setSkillWeb(prev => prev ? prev + ", " + newSkills : newSkills);
  }

  // 🔥 STEP 6: FINAL SCORE
  setScanStep("Final ATS scoring...");
  setTimeout(() => {
  setAtsScore(calculateATS());
  setJobMatchScore(calculateJobMatch());
}, 300);

  await animateProgress(100);
  await new Promise(r => setTimeout(r, 400));

  setPreviewScan(false);
  setIsScanning(false);

  // 🔥 FULL AI REWRITE (FINAL STEP)
setScanStep("Rewriting entire resume...");

const newSummary = `Results-driven ${headline || "professional"} with expertise in ${jdKeywords.slice(0,5).join(", ")}.
Proven ability to deliver scalable, high-performance solutions and improve system performance effectively.`;

setSummary(fixRepetitionGlobally(newSummary));

// 🔥 BOOST EXPERIENCE
setExperienceList(prev =>
  prev.map(item => {
    if (!item.details.includes("Delivered measurable impact")) {
      return {
        ...item,
        details: item.details + "\n• Delivered measurable impact in real-world scenarios"
      };
    }
    return item;
  })
);

  setSaveStatus("ATS Optimized ✓");
};
  // AI Job Match Handler
  const handleAIAnalyze = ({ title: jobTitle, description: jobText }) => {
    setShowJobMatch(false);
    const aiIntro = `Results-driven ${jobTitle || headline || 'Professional'} with a proven track record of delivering high-impact solutions. `;
    setSummary(prev => aiIntro + (prev || "Skilled in modern web technologies and agile methodologies, eager to drive growth and innovation."));
    const realScore = calculateATS();
setAtsScore(realScore);
    alert(`✨ AI Optimized your profile for: ${jobTitle}\nCheck your Summary section!`);
  };

 const calculateATS = () => {
  let score = 0;

  const text = `
    ${headline}
    ${summary}
    ${skillWeb}
    ${skillDb}
    ${skillProgramming}
    ${skillTools}
    ${experienceList.map(e => e.details).join(" ")}
    ${projectList.map(p => p.details).join(" ")}
  `.toLowerCase();

  // ✅ BASIC INFO (10%)
  if (contactEmail) score += 3;
  if (contactPhone) score += 3;
  if (linkedin) score += 2;
  if (fullName) score += 2;

  // ✅ KEYWORD MATCH (REAL ATS) → 40%
  const jdKeywords = extractKeywords(jobDescription);
  let matchCount = 0;

  jdKeywords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(text)) matchCount++;
  });

  if (jdKeywords.length > 0) {
    score += (matchCount / jdKeywords.length) * 40;
  } else {
    // ⚠️ IF NO JD → DON'T PENALIZE
    score += 25;
  }

  // ✅ SKILLS STRENGTH (15%)
  const totalSkills = `${skillWeb} ${skillDb} ${skillProgramming} ${skillTools}`.split(",").length;
  if (totalSkills >= 8) score += 15;
  else if (totalSkills >= 4) score += 10;
  else if (totalSkills >= 2) score += 5;

  // ✅ ACTION VERBS (10%)
  const verbs = ["engineered","developed","optimized","implemented","designed","built","led"];
  const verbMatches = verbs.filter(v => text.includes(v)).length;
  score += Math.min(10, verbMatches * 2);

  // ✅ METRICS (15%)
  const metrics = text.match(/\d+%|\d+x|\d+ users|\d+ ms/g) || [];
  if (metrics.length >= 2) score += 15;
  else if (metrics.length === 1) score += 8;

  // ✅ STRUCTURE (10%) — NO PENALTY IF MISSING EXPERIENCE
  let structure = 0;
  if (summary) structure += 3;
  if (educationList.length) structure += 3;
  if (skillWeb || skillDb || skillProgramming) structure += 2;
  if (experienceList.length || projectList.length) structure += 2;

  score += structure;

  // ✅ REPETITION PENALTY (SMART)
  const words = text.split(/\s+/);
  const freq = {};
  let penalty = 0;

  words.forEach(w => {
    if (w.length < 4) return;
    freq[w] = (freq[w] || 0) + 1;
    if (freq[w] > 3) penalty += 0.3;
if (freq[w] > 6) penalty += 0.7;
  });

  score -= Math.min(12, penalty);

  return Math.max(35, Math.min(100, Math.round(score)));
};
// 🟢 JOB MATCHING FUNCTION
const calculateJobMatch = () => {
  if (!jobDescription || jobDescription.length < 20) return 0;

  const resumeText = `
    ${headline}
    ${summary}
    ${skillWeb}
    ${skillDb}
    ${skillProgramming}
    ${skillTools}
    ${experienceList.map(e => e.details).join(" ")}
    ${projectList.map(p => p.details).join(" ")}
  `.toLowerCase();

  const jdKeywords = extractKeywords(jobDescription);

  if (!jdKeywords.length) return 0;

  let matchCount = 0;

  jdKeywords.forEach(word => {
    if (resumeText.includes(word)) {
      matchCount++;
    }
  });

  const score = (matchCount / jdKeywords.length) * 100;

  return Math.min(100, Math.round(score));
};
// 🔗 PREPARED LINKS
const linkedinURL = formatLink(linkedin, "linkedin");
const githubURL = formatLink(github, "github");
const portfolioURL = formatLink(portfolio, "portfolio");

const linkedinValid = isValidURL(linkedinURL);
const githubValid = isValidURL(githubURL);
const portfolioValid = isValidURL(portfolioURL);
// 🔥 KEYWORD HIGHLIGHT FUNCTION (ADD HERE)
const highlightText = (text) => {
  if (!text) return text;

  const keywords = extractKeywords(jobDescription);

  let result = text;

  keywords.slice(0, 15).forEach(k => {
    const regex = new RegExp(`(${k})`, "gi");
    result = result.replace(
      regex,
      `<span class="bg-green-200 text-black px-1 rounded">$1</span>`
    );
  });

  return result;
};
  if (!id || !user) return <div>Loading...</div>;
  const TemplateComponent = getTemplateComponent(template);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-6 sm:px-6 lg:px-8 print:bg-white print:p-0">
      
      {/* 🔴 HIDE ALL UI EXCEPT PREVIEW DURING PRINTING */}
      <style>{`
@keyframes previewScan {
  0% { top: -20px; }
  100% { top: calc(100% + 20px); }
}

.preview-scan-line {
will-change: top;
  position: absolute;
  top: -20px;
  left: 0;
  width: 100%;
  height: 8px; /* slightly bigger for mobile visibility */
  background: linear-gradient(to bottom, transparent, #3b82f6, transparent);
  box-shadow: 0 0 25px #3b82f6, 0 0 50px #3b82f6;
  animation: previewScan 2s linear infinite;
  z-index: 999;
  pointer-events: none;
}
      @keyframes scanMove {
  0% { top: 0%; }
  100% { top: 100%; }
}
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;

  background: linear-gradient(
    to bottom,
    transparent,
    #22d3ee,
    transparent
  );

  box-shadow: 0 0 20px #22d3ee, 0 0 40px #22d3ee;

  animation: scanMove 2s linear infinite;

  z-index: 999; /* 🔥 IMPORTANT */
  pointer-events: none;
}

       @media print {
  body {
    background: white !important;
    margin: 0;
    padding: 0;
  }

  section {
  page-break-inside: avoid;
}

section h2 {
  page-break-after: avoid;
}

section div {
  page-break-inside: avoid;
}
  .no-print {
    display: none !important;
  }

  .print-area {
    width: 210mm !important;
    min-height: 297mm !important;
    padding: 12mm !important;
    margin: 0 auto !important;
    box-shadow: none !important;
  }

  body {
  font-family: inherit !important;
  color: black !important;
}

  /* PREVENT BREAK */
  h1, h2, h3 {
    page-break-after: avoid;
  }

 p, ul, li {
  page-break-inside: avoid;
}

  a {
    color: black !important;
    text-decoration: none !important;
  }
}
      `}</style>

      <div className="mx-auto max-w-6xl no-print">
        {/* Top Bar */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between overflow-x-auto">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10 active:scale-95 transition"
            >
              <FiArrowLeft size={13} />
              Back
            </button>

            <input
              className="border-none bg-transparent text-lg font-semibold text-white focus:outline-none w-full sm:w-auto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={40}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-end max-w-full overflow-x-auto">
            
            <div className="flex items-center gap-4 bg-black/30 border border-white/5 px-3 py-1.5 rounded-full shrink-0">

  {/* ATS SCORE */}
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-slate-400 font-bold">ATS</span>
    <span className="text-xs font-bold text-emerald-400">{atsScore}%</span>
  </div>

{/* DOMAIN */}
<div className="flex items-center gap-2">
  <span className="text-[10px] text-slate-400 font-bold">DOMAIN</span>
  <span className="text-xs font-bold text-cyan-400 uppercase">
    {detectedDomain}
  </span>
</div>

  {/* JOB MATCH */}
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-slate-400 font-bold">MATCH</span>
    <span className={`text-xs font-bold ${
      jobMatchScore > 80 ? "text-emerald-400" :
      jobMatchScore > 60 ? "text-yellow-400" :
      "text-red-400"
    }`}>
      {jobMatchScore}%
    </span>
  </div>

</div>

            {/* Template pill */}
            <button
              type="button"
              onClick={handleChangeTemplate}
              className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-white/10 active:scale-95 flex items-center gap-1.5"
            >
              <FiLayout size={12}/>
              Template:
              <span className="font-semibold ml-1">
                {template || "modern-tech1"}
              </span>
            </button>

            {/* AI Scan Option */}
            <button
              onClick={handleAIScan}
              disabled={isScanning}
              className="flex items-center gap-2 rounded-full bg-slate-800 border border-purple-500/50 px-4 py-1.5 text-[11px] font-bold text-purple-300 hover:bg-slate-700 transition-all active:scale-95"
            >
              {isScanning ? <FiCpu className="animate-spin" /> : <FiSearch />}
              AI ATS Scan
            </button>

            {/* Status pill */}
            <div
              className={`rounded-full px-3 py-1 text-[11px] font-medium flex items-center gap-1 border ${
                saveStatus === "Saving..." || isScanning
                  ? "bg-amber-400/10 text-amber-300 border-amber-400/20"
                  : "bg-emerald-400/10 text-emerald-300 border-emerald-400/20"
              }`}
            >
              {saveStatus === "Saving..." || isScanning ? (
                <span className="animate-pulse">{isScanning ? "Optimizing..." : "Saving..."}</span>
              ) : (
                <><FiCheckCircle size={10} /> Saved ✓</>
              )}
            </div>

            {/* Download PDF Button */}
            <button
  type="button"
  onClick={() => {
    console.log("🟢 PDF CLICKED");
    console.log("REF:", resumeRef.current);
    handlePrint();
  }}
  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-4 py-1.5 text-xs font-bold text-white"
>
  PDF
</button>

<button
  onClick={handleDownloadDOCX}
  className="flex items-center gap-2 rounded-full bg-slate-800 border border-white/20 px-4 py-1.5 text-xs font-bold text-white"
>
  DOCX
</button>
          </div>
        </div>

        {/* Job Match Modal */}
        <JobMatchModal
          visible={showJobMatch}
          onClose={() => setShowJobMatch(false)}
          onAnalyze={handleAIAnalyze}
        />

        {/* Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* LEFT: Form */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Resume Content
              </p>
              <button
                onClick={() => setShowJobMatch(true)}
                className="text-[10px] text-purple-400 hover:text-white flex items-center gap-1 font-bold"
              >
                <FiZap/> Auto-write
              </button>
            </div>

            <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar pb-10">
              {/* 🎨 FONT SETTINGS */}
<section>
  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-yellow-400">
    Font Settings
  </p>

  <div className="grid grid-cols-2 gap-3">
    
    {/* Font Family */}
    <div>
      <label className="text-xs text-slate-300">Font</label>
      <select
        value={fontFamily}
        onChange={(e) => setFontFamily(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-2 py-2 text-xs text-white"
      >
        <option value="Inter">Inter (Recommended)</option>
        <option value="Arial">Arial (ATS Safe)</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Calibri">Calibri</option>
        <option value="Poppins">Poppins</option>
      </select>
    </div>

    {/* Font Size */}
    <div>
      <label className="text-xs text-slate-300">Font Size</label>
      <select
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-2 py-2 text-xs text-white"
      >
        <option value={10}>Small (10)</option>
        <option value={11}>Normal (11)</option>
        <option value={12}>Large (12)</option>
        <option value={13}>Extra Large (13)</option>
      </select>
    </div>

  </div>
</section>
              {/* Identity */}
              <section>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-purple-400">
                  Identity
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-slate-300">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-purple-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-300">Headline / Role</label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-purple-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
  <label className="mb-1 block text-xs text-slate-300">Profile Image</label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }}
    className="w-full text-xs text-slate-400"
  />

  {/* Preview small image */}
  {image && (
    <img
  src={image}
  alt="Profile"
  crossOrigin="anonymous"
  className="w-16 h-16 rounded-full object-cover border"
/>
  )}
</div>
                </div>
              </section>

              {/* Contact & Links */}
              <section>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-blue-400">
                  Contact & Links
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-slate-300">Email</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-300">Phone</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-300">Location</label>
                    <input
                      type="text"
                      value={contactLocation}
                      onChange={(e) => setContactLocation(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                      placeholder="Odisha, India"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-300">GitHub</label>
                    <input
  value={github}
  onChange={(e) => setGithub(e.target.value)}
  className={`w-full rounded-xl border px-3 py-2 text-sm text-white outline-none ${
    github && !githubValid
      ? "border-red-500 bg-red-500/10"
      : "border-white/10 bg-slate-950/60"
  }`}
/>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-300">LinkedIn</label>
                    <input
  type="text"
  value={linkedin}
  onChange={(e) => setLinkedin(e.target.value)}
  className={`w-full rounded-xl border px-3 py-2 text-sm text-white outline-none ${
    linkedin && !linkedinValid
      ? "border-red-500 bg-red-500/10"
      : "border-white/10 bg-slate-950/60"
  }`}
  placeholder="linkedin.com/in/username"
/>

{linkedin && !linkedinValid && (
  <p className="text-[10px] text-red-400 mt-1">Invalid LinkedIn URL</p>
)}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-300">Portfolio</label>
                    <input
  value={portfolio}
  onChange={(e) => setPortfolio(e.target.value)}
  className={`w-full rounded-xl border px-3 py-2 text-sm text-white outline-none ${
    portfolio && !portfolioValid
      ? "border-red-500 bg-red-500/10"
      : "border-white/10 bg-slate-950/60"
  }`}
/>
                  </div>
                </div>
              </section>

              {/* Summary */}
              <section>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-pink-400">
                  Summary
                </p>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-pink-500 outline-none transition-colors"
                  placeholder="Short paragraph about your profile & strengths."
                />
              </section>

              {/* 🟢 JOB DESCRIPTION INPUT */}
<section>
  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-400">
    Job Description (ATS Match)
  </p>

  <textarea
    rows={4}
    value={jobDescription}
    onChange={(e) => setJobDescription(e.target.value)}
    className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
    placeholder="Paste job description here..."
  />
</section>

{missingSkills.length > 0 && (
  <div className="mt-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
    <p className="text-xs text-red-400 font-bold mb-1">
      Missing Skills (ATS)
    </p>

    <div className="flex flex-wrap gap-2">
      {missingSkills.slice(0, 8).map((skill, i) => (
        <span
          key={i}
          className="text-[10px] px-2 py-1 bg-red-500/20 text-red-300 rounded"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
)}

{/* 🔥 ADD THIS EXACTLY HERE (STEP 3) */}

{(() => {
  const text = `${summary} ${experienceList.map(e => e.details).join(" ")}`.toLowerCase();
  const words = text.split(/\s+/);
  const freq = {};
  let repeated = [];

  words.forEach(w => {
    if (w.length < 4) return;
    freq[w] = (freq[w] || 0) + 1;
    if (freq[w] === 4) repeated.push(w);
  });

  if (repeated.length === 0) return null;

  return (
    <div className="mt-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
      <p className="text-xs text-yellow-400 font-bold mb-1">
        Repetition Issues
      </p>

      <div className="flex flex-wrap gap-2">
        {repeated.slice(0,5).map((w, i) => (
          <span
            key={i}
            className="text-[10px] px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded"
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
})()}

              {/* 🟢 DYNAMIC EDUCATION */}
              <section>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-400">
                    Education
                  </p>
                </div>
                {educationList.map((edu) => (
                  <div key={edu.id} className="p-4 mb-3 rounded-xl border border-white/10 bg-slate-900/50 relative group">
                    <button onClick={() => removeEducation(edu.id)} className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiTrash2 size={16} />
                    </button>
                    <div className="space-y-3 pr-6">
                      <select
                        value={edu.type}
                        onChange={(e) => updateEducation(edu.id, 'type', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none"
                      >
                        <option value="College">College / University</option>
                        <option value="School">School / High School</option>
                      </select>
                      <input
                        placeholder={`${edu.type} Name`}
                        value={edu.name}
                        onChange={(e) => updateEducation(edu.id, 'name', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-rose-500 outline-none"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          placeholder="Degree / Class"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-rose-500 outline-none"
                        />
                        <input
                          placeholder="Passout Year / Present"
                          value={edu.year}
                          onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-rose-500 outline-none"
                        />
                      </div>
                      <input
                        placeholder="CGPA or Percentage"
                        value={edu.score}
                        onChange={(e) => updateEducation(edu.id, 'score', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-rose-500 outline-none"
                      />
                      <textarea
                        rows={2}
                        value={edu.extra}
                        onChange={(e) => updateEducation(edu.id, 'extra', e.target.value)}
                        className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-rose-500 outline-none transition-colors"
                        placeholder="Extra education info"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addEducation}
                  className="mt-1 flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-semibold py-1 px-2 rounded-lg hover:bg-rose-400/10 transition-colors"
                >
                  <FiPlus /> Add Education
                </button>
              </section>

              {/* 🟢 DYNAMIC EXPERIENCE */}
              <section>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400">
                    EXPERIENCE
                  </p>
                </div>
                {experienceList.map((exp) => (
                  <div key={exp.id} className="p-4 mb-3 rounded-xl border border-white/10 bg-slate-900/50 relative group">
                    <button onClick={() => removeExperience(exp.id)} className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiTrash2 size={16} />
                    </button>
                    <div className="space-y-3 pr-6">
                      <input
                        placeholder="Heading (e.g. Frontend Intern at Meta)"
                        value={exp.header}
                        onChange={(e) => updateExperience(exp.id, 'header', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                      />
                      <textarea
                        rows={4}
                        value={exp.details}
                        onChange={(e) => updateExperience(exp.id, 'details', e.target.value)}
                        className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                        placeholder={`- Built ...\n- Improved ...`}
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addExperience}
                  className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold py-1 px-2 rounded-lg hover:bg-emerald-400/10 transition-colors"
                >
                  <FiPlus /> Add Experience
                </button>
              </section>

              {/* 🟢 DYNAMIC PROJECTS */}
              <section>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-400">
                    Projects
                  </p>
                </div>
                {projectList.map((proj) => (
                  <div key={proj.id} className="p-4 mb-3 rounded-xl border border-white/10 bg-slate-900/50 relative group">
                    <button onClick={() => removeProject(proj.id)} className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiTrash2 size={16} />
                    </button>
                    <div className="space-y-3 pr-6">
                      <input
                        placeholder="Heading (e.g. Melo Chat App - MERN)"
                        value={proj.header}
                        onChange={(e) => updateProject(proj.id, 'header', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                      />
                      <textarea
                        rows={4}
                        value={proj.details}
                        onChange={(e) => updateProject(proj.id, 'details', e.target.value)}
                        className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-amber-500 outline-none transition-colors"
                        placeholder="Project description and tech stack..."
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addProject}
                  className="mt-1 flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold py-1 px-2 rounded-lg hover:bg-amber-400/10 transition-colors"
                >
                  <FiPlus /> Add Project
                </button>
              </section>

              {/* Skills grouped */}
              <section>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-indigo-400">
                  Skills (grouped)
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-slate-300">Web Development</label>
                    <input
                      value={skillWeb}
                      onChange={(e) => setSkillWeb(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                      placeholder="React, Next.js, Tailwind"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-300">Database & Backend</label>
                    <input
                      value={skillDb}
                      onChange={(e) => setSkillDb(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                      placeholder="MongoDB, Firebase, Node.js"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-300">Languages</label>
                    <input
                      value={skillProgramming}
                      onChange={(e) => setSkillProgramming(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                      placeholder="C++, Java, Python"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-300">Tools</label>
                    <input
                      value={skillTools}
                      onChange={(e) => setSkillTools(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                      placeholder="Git, Docker, Postman"
                    />
                  </div>
                </div>
              </section>

              {/* 🟢 DYNAMIC ACHIEVEMENTS */}
              <section>
                <div className="flex justify-between items-center mb-2">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-400">
                    Achievements
                  </p>
                </div>
                <div className="space-y-2">
                  {achievementList.map((ach) => (
                    <div key={ach.id} className="flex gap-2 items-start relative group">
                      <textarea
                        rows={2}
                        value={ach.text}
                        onChange={(e) => updateAchievement(ach.id, e.target.value)}
                        className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                        placeholder="- Won Smart India Hackathon 2024..."
                      />
                      <button onClick={() => removeAchievement(ach.id)} className="mt-2 text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addAchievement}
                  className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold py-1 px-2 rounded-lg hover:bg-emerald-400/10 transition-colors"
                >
                  <FiPlus /> Add Achievement
                </button>
              </section>

              {/* AI Button */}
              <button
                type="button"
                onClick={handleAIScan}
                className="mt-3 w-full rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 py-3 text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]"
              >
                <FiZap size={16} />
                Optimize with AI (ATS friendly)
              </button>
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW */}
          <div className="relative flex justify-center items-start overflow-y-auto max-h-[75vh] pb-10 custom-scrollbar bg-black/20 rounded-3xl p-2 sm:p-4">
            
            {/* Visual AI Scan Animation */}
            {isScanning && (
<div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">

  <div className="relative w-[400px] h-[500px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30">

    {/* ✅ GRID OVERLAY */}
    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#22d3ee_1px,transparent_1px),linear-gradient(to_bottom,#22d3ee_1px,transparent_1px)] bg-[size:40px_40px]" />
 
 {/* ✅ SCAN LINE */}
    <div className="scan-line" />

    {/* ✅ FAKE TEXT LINES (ADD THIS) */}
    <div className="absolute inset-0 flex flex-col gap-2 p-4 opacity-20">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="h-2 bg-cyan-400/30 rounded w-full" />
      ))}
    </div>

    {/* ✅ CONTENT (ADD z-10 IMPORTANT) */}
    <div className="p-6 text-center relative z-10">
      <h2 className="text-lg font-bold text-white mb-2">
        {scanStep} ({scanProgress}%)
      </h2>

      <p className="text-xs text-slate-400 mb-4">
        AI is scanning your resume like ATS...
      </p>

      {/* ✅ PREMIUM PROGRESS BAR */}
      <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-500 shadow-[0_0_10px_#22d3ee]"
          style={{ width: `${scanProgress}%` }}
        />
      </div>
    </div>

  </div>
</div>
)}

<div
  ref={resumeRef}
  className="print-area bg-white"
  style={{
    width: "210mm",
    padding: "12mm",
    boxSizing: "border-box",
    fontFamily: fontFamily,
    fontSize: `${fontSize}px`,
  }}
>
  <TemplateComponent
  templateId={template}
    data={{
      fullName,
      headline,
      contactEmail,
      contactPhone,
      contactLocation,
      github,
      linkedin,
      portfolio,
      summary: summary,

      // 🔥 IMPORTANT: convert arrays → string (TEMP FIX)
      education: educationList.map((e) => {
  let scoreText = "";

  if (e.score) {
    const num = parseFloat(e.score);

    // 🔥 LOGIC
    if (num > 10) {
      scoreText = `Percentage: ${num}%`;
    } else {
      scoreText = `CGPA: ${num}`;
    }
  }

  return `${e.degree} - ${e.name} (${e.year})${scoreText ? ` | ${scoreText}` : ""}`;
}).join("\n"),

      experience: experienceList.map(
  (e) =>
    `${e.header}\n${e.details || ""}`
).join("\n\n"),

projects: projectList.map(
  (p) =>
    `${p.header}\n${p.details
      .split("\n")
      .map(line => line.trim() ? line.replace(/^[-•]\s*/, "") : "")
      .join("\n")}`
).join("\n\n"),

      achievements: achievementList.map(a => a.text).join("\n"),
      
      skillWeb,
      skillDb,
      skillProgramming,
      skillTools,
      skillOther,
    }}
  />
</div>

            {/* Neon Glow Background */}
            <div className="absolute -bottom-10 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl no-print -z-10" />
          </div>
        </div>
      </div>
    </div>
  );
} 