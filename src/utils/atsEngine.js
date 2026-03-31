// src/utils/atsEngine.js

// 🔥 DOMAIN CONFIG (CORE ENGINE)
export const DOMAIN_CONFIG = {

    fullstack: {
  keywords: [
    "react","node","express","mongodb","sql","javascript",
    "full stack","mern","rest api","api","frontend","backend"
  ],
  tools: ["git","docker","postman","firebase"],
  verbs: ["Developed","Engineered","Built","Optimized","Designed"],
},

  // 🌐 FRONTEND
  frontend: {
    keywords: ["react","javascript","html","css","nextjs","redux","tailwind","typescript"],
    tools: ["figma","webpack","vite"],
    verbs: ["Developed","Designed","Implemented","Optimized"],
  },

  // 🔧 BACKEND
  backend: {
    keywords: ["node","express","api","mongodb","sql","microservices","rest api"],
    tools: ["postman","docker"],
    verbs: ["Engineered","Built","Optimized","Architected"],
  },

  // ☕ JAVA
  java: {
    keywords: ["java","spring","hibernate","microservices","rest api","spring boot"],
    tools: ["maven","gradle"],
    verbs: ["Developed","Implemented","Architected"],
  },

  // 🐍 PYTHON
  python: {
    keywords: ["python","django","flask","fastapi","pandas","numpy"],
    tools: ["jupyter","pip"],
    verbs: ["Developed","Automated","Optimized"],
  },

  // 🤖 AI / ML
  ml: {
    keywords: ["machine learning","deep learning","tensorflow","pytorch","nlp","computer vision"],
    tools: ["jupyter","colab"],
    verbs: ["Trained","Analyzed","Predicted","Optimized"],
  },

  // 📊 DATA SCIENCE
  data: {
    keywords: ["data analysis","pandas","numpy","sql","data visualization","power bi","tableau"],
    tools: ["excel","tableau","power bi"],
    verbs: ["Analyzed","Visualized","Processed"],
  },

  // ⚙️ DEVOPS
  devops: {
    keywords: ["aws","docker","kubernetes","ci/cd","terraform","cloud","jenkins"],
    tools: ["github actions","jenkins"],
    verbs: ["Deployed","Automated","Managed"],
  },

  // 🔐 CYBERSECURITY
  security: {
    keywords: ["cybersecurity","penetration testing","ethical hacking","network security","encryption"],
    tools: ["wireshark","metasploit"],
    verbs: ["Secured","Tested","Analyzed"],
  },

  // 📱 MOBILE DEV
  mobile: {
    keywords: ["android","kotlin","flutter","react native","ios","swift"],
    tools: ["android studio","xcode"],
    verbs: ["Developed","Built","Deployed"],
  },

  // 🎮 GAME DEV
  gamedev: {
    keywords: ["unity","unreal engine","c#","game physics","3d rendering"],
    tools: ["unity","blender"],
    verbs: ["Designed","Developed","Created"],
  },

  // 🎨 UI/UX DESIGN
  design: {
    keywords: ["ui design","ux design","wireframing","prototyping","user research"],
    tools: ["figma","adobe xd"],
    verbs: ["Designed","Researched","Improved"],
  },

  // 📈 PRODUCT / MANAGEMENT
  product: {
    keywords: ["product management","roadmap","stakeholders","agile","scrum"],
    tools: ["jira","notion"],
    verbs: ["Led","Managed","Planned"],
  },

  // 💼 BUSINESS / ANALYST
  business: {
    keywords: ["business analysis","requirements","stakeholders","data insights"],
    tools: ["excel","powerpoint"],
    verbs: ["Analyzed","Documented","Improved"],
  },

  // 🧪 QA / TESTING
  qa: {
    keywords: ["testing","selenium","automation testing","manual testing","bug tracking"],
    tools: ["selenium","jira"],
    verbs: ["Tested","Validated","Automated"],
  },

  // 🔗 BLOCKCHAIN
  blockchain: {
    keywords: ["blockchain","ethereum","smart contracts","solidity","web3"],
    tools: ["hardhat","truffle"],
    verbs: ["Developed","Deployed","Built"],
  },

  // 🛒 SALES / MARKETING
  marketing: {
    keywords: ["digital marketing","seo","social media","campaigns","analytics"],
    tools: ["google analytics","ads"],
    verbs: ["Managed","Optimized","Executed"],
  },

  // 🧾 ACCOUNTING / FINANCE
  finance: {
    keywords: ["accounting","financial analysis","tax","audit","budget"],
    tools: ["tally","excel"],
    verbs: ["Analyzed","Managed","Prepared"],
  },

  // 🏥 HEALTHCARE
  healthcare: {
    keywords: ["clinical","patient care","medical","healthcare systems"],
    tools: ["ehr"],
    verbs: ["Assisted","Managed","Monitored"],
  }

};

// 🔥 NORMALIZE TEXT
export const normalizeText = (text = "") =>
  text.toLowerCase().replace(/[^\w\s]/g, " ");

// 🔥 EXTRACT KEYWORDS (IMPROVED)
export const extractKeywords = (text = "") => {
  const clean = normalizeText(text);

  const words = clean.match(/\b[a-zA-Z+#.]{2,}\b/g) || [];

  const stopWords = [
    "the","and","for","with","you","are","this","that","from",
    "have","has","will","your","our","their","job","role",
    "work","team","good","looking","required","skills",
    "experience","knowledge"
  ];

  return [...new Set(words.filter(w => !stopWords.includes(w)))];
};

// 🔥 FIND MISSING KEYWORDS
export const findMissingKeywords = (resumeText, jobDescription) => {
  const resume = normalizeText(resumeText);
  const jdKeywords = extractKeywords(jobDescription);

  return jdKeywords.filter(k => !resume.includes(k));
};

// 🔥 ATS SCORE CALCULATION (REAL LOGIC)
export const calculateATSScore = (resumeText, jobDescription, domain) => {
  let score = 0;

  const text = normalizeText(resumeText);
  const jdText = normalizeText(jobDescription);
  const config = DOMAIN_CONFIG[domain] || {};

  // ✅ 1. JD KEYWORD MATCH (REAL ATS) → 40%
  const jdKeywords = extractKeywords(jobDescription);
  let jdMatch = 0;

  jdKeywords.forEach(k => {
    if (text.includes(k)) jdMatch++;
  });

  if (jdKeywords.length > 0) {
    score += (jdMatch / jdKeywords.length) * 40;
  }

  // ✅ 2. DOMAIN KEYWORDS → 20%
  let keywordMatch = 0;
  config.keywords?.forEach(k => {
    if (text.includes(k)) keywordMatch++;
  });

  if (config.keywords?.length) {
    score += (keywordMatch / config.keywords.length) * 20;
  }

  // ✅ 3. TOOLS → 10%
  let toolMatch = 0;
  config.tools?.forEach(t => {
    if (text.includes(t)) toolMatch++;
  });

  if (config.tools?.length) {
    score += (toolMatch / config.tools.length) * 10;
  }

  // ✅ 4. ACTION VERBS → 10%
  let verbMatch = 0;
  config.verbs?.forEach(v => {
    if (text.includes(v.toLowerCase())) verbMatch++;
  });

  score += Math.min(10, verbMatch * 2);

  // ✅ 5. METRICS (STRICT CHECK) → 10%
  const metricsMatches = text.match(/\d+%|\d+x|\d+\+? users|\d+ ms|\d+ sec/g) || [];
  if (metricsMatches.length >= 2) score += 10;
  else if (metricsMatches.length === 1) score += 5;

  // ✅ 6. STRUCTURE → 10%
  let structureScore = 0;
  if (text.includes("summary")) structureScore += 3;
  if (text.includes("experience")) structureScore += 3;
  if (text.includes("skills")) structureScore += 2;
  if (text.includes("projects")) structureScore += 2;

  score += structureScore;

  return Math.min(100, Math.round(score));
};

// 🔥 AUTO IMPROVE RESUME (MAIN AI FUNCTION)
export const improveResumeContent = (list = [], domain, missingKeywords = []) => {
  const config = DOMAIN_CONFIG[domain] || {};

  return list.map(item => {
    if (!item.details) return item;

    const lines = item.details.split("\n");

    const improved = lines.map(line => {
  if (!line.trim()) return "";

  let newLine = line;

  // 🔥 Strong verb replacement
  if (config.verbs?.length) {
    const verb = config.verbs[Math.floor(Math.random() * config.verbs.length)];
    newLine = newLine.replace(/built|made|created|worked on|developed/gi, verb);
  }

  // 🔥 Add 1–2 missing keywords naturally
  if (missingKeywords.length > 0) {
    const randomKeywords = missingKeywords
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    randomKeywords.forEach(keyword => {
      if (!newLine.includes(keyword)) {
        newLine += ` using ${keyword}`;
      }
    });
  }

  // 🔥 Add realistic metrics
  if (!/\d+%|\d+x|\d+ users/i.test(newLine)) {
    const metrics = [
      "increasing performance by 30%",
      "reducing load time by 25%",
      "handling 1000+ users",
      "improving efficiency by 40%"
    ];
    newLine += `, ${metrics[Math.floor(Math.random() * metrics.length)]}`;
  }

  return "• " + newLine;
});

    return {
      ...item,
      details: improved.join("\n")
    };
  });
};