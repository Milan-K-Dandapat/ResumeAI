import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateWithAI(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    let text = response.text();

    if (!text || text.length < 20) return null;

    return text.trim();

  } catch (error) {
    console.warn("⚠️ AI OFF / FAILED → using fallback");
    return null; // 🔥 NEVER BREAK APP
  }
}