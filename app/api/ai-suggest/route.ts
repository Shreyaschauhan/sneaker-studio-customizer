import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

type Suggestion = {
  upperColor: string;
  soleColor: string;
  lacesColor: string;
  material: "leather" | "canvas";
};

const FALLBACK_SUGGESTION: Suggestion = {
  upperColor: "#111827",
  soleColor: "#f3f4f6",
  lacesColor: "#e5e7eb",
  material: "leather",
};

const HEX = /^#(?:[0-9a-fA-F]{6})$/;
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";

export async function POST(req: Request) {
  let promptInput: string;

  try {
    const body = await req.json();
    promptInput = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!promptInput) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(FALLBACK_SUGGESTION);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: buildPrompt(promptInput) }],
        },
      ],
      generationConfig: { temperature: 0.7 },
    });

    const raw = response.response.text();
    const suggestion = parseSuggestion(raw);

    if (suggestion) {
      return NextResponse.json(suggestion);
    }
  } catch {
    // Swallow errors and fall back to default suggestion
  }

  return NextResponse.json(FALLBACK_SUGGESTION);
}

function buildPrompt(userPrompt: string) {
  return [
    "You are a sneaker design assistant.",
    "Return ONLY valid JSON in this exact format with double quotes and nothing else:",
    "{",
    '  "upperColor": "#hex",',
    '  "soleColor": "#hex",',
    '  "lacesColor": "#hex",',
    '  "material": "leather" | "canvas"',
    "}",
    "Use six-digit hex codes for all colors.",
    `User prompt: "${userPrompt}".`,
    "No explanations, no markdown, no code fences.",
  ].join("\n");
}

function parseSuggestion(rawText: string): Suggestion | null {
  const cleaned = rawText.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (isValidSuggestion(parsed)) {
      return parsed;
    }
  } catch {
    // ignore parse errors and fall through to fallback
  }

  return null;
}

function isValidSuggestion(value: unknown): value is Suggestion {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<Suggestion>;
  const { upperColor, soleColor, lacesColor, material } = candidate;

  return (
    typeof upperColor === "string" &&
    typeof soleColor === "string" &&
    typeof lacesColor === "string" &&
    HEX.test(upperColor) &&
    HEX.test(soleColor) &&
    HEX.test(lacesColor) &&
    (material === "leather" || material === "canvas")
  );
}

