import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export { SchemaType };

const API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const TIMEOUT_MS = 8000; // must stay well under Vercel's 10s hobby limit

function getModel(responseSchema: object) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  return genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      // @ts-expect-error - SDK types lag behind the responseSchema option
      responseSchema,
      temperature: 0.2, // low = decisive, consistent plans
    },
  });
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Gemini timeout")), ms);
    p.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); }
    );
  });
}

/**
 * Ask Gemini for STRICT JSON. Throws on: no API key, timeout, API error,
 * or unparseable output. Callers catch and use deterministic fallbacks,
 * so a failed AI call degrades the demo instead of killing it.
 */
export async function generateJson<T>(
  systemPrompt: string,
  userPrompt: string,
  responseSchema: object
): Promise<T> {
  if (!API_KEY) throw new Error("GEMINI_API_KEY not set");

  const model = getModel(responseSchema);
  const result = await withTimeout(
    model.generateContent(`${systemPrompt}\n\n${userPrompt}`),
    TIMEOUT_MS
  );
  const text = result.response.text().trim();
  return JSON.parse(text) as T;
}

export function geminiAvailable(): boolean {
  return API_KEY.length > 0;
}
