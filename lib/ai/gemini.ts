import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildKisanAISystemInstruction, FarmerContext } from "./prompts";

export interface GenerateAIRequestOptions {
  message: string;
  language?: string;
  context?: FarmerContext;
  conversationHistory?: Array<{ role: "user" | "model"; parts: string }>;
}

export interface GenerateAIResponseResult {
  success: boolean;
  reply?: string;
  error?: string;
  languageUsed?: string;
}

/**
 * Server-side service to generate agronomic guidance from Google Gemini.
 * Never executes on the client. GEMINI_API_KEY is read strictly from process.env.
 */
export async function generateKisanAIResponse(
  options: GenerateAIRequestOptions
): Promise<GenerateAIResponseResult> {
  const { message, language = "en", context, conversationHistory } = options;

  const apiKey = process.env.GEMINI_API_KEY;

  // Safe check for missing or placeholder API key
  if (!apiKey || apiKey === "your_gemini_api_key" || apiKey.trim() === "") {
    console.warn(
      "[Kisan AI] GEMINI_API_KEY is not configured in .env.local. Please provide a valid key from Google AI Studio."
    );
    return {
      success: false,
      error:
        "The Kisan AI service is not yet configured with a Google Gemini API key. Please add your GEMINI_API_KEY in the server environment (.env.local) to enable real-time agricultural advisories.",
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const systemInstruction = buildKisanAISystemInstruction(language, context);

    const candidateModels = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.6-flash"];
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: {
            role: "system",
            parts: [{ text: systemInstruction }],
          },
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
          },
        });

        let result;
        if (conversationHistory && conversationHistory.length > 0) {
          const chat = model.startChat({
            history: conversationHistory.map((item) => ({
              role: item.role,
              parts: [{ text: item.parts }],
            })),
          });
          result = await chat.sendMessage(message);
        } else {
          result = await model.generateContent(message);
        }

        const response = await result.response;
        const text = response.text();

        if (text && text.trim().length > 0) {
          return {
            success: true,
            reply: text.trim(),
            languageUsed: language,
          };
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Kisan AI] Model ${modelName} encountered an error: ${err.message}. Trying next candidate...`);
        // If it's an invalid key, no need to retry other models
        if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("API key not valid")) {
          break;
        }
      }
    }

    throw lastError || new Error("Unable to retrieve response from AI models.");
  } catch (error: any) {
    // Log detailed error on the server ONLY for debugging
    console.error("[Kisan AI Server Error]", error?.message || error);

    const errorMessage = String(error?.message || "");

    if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key not valid")) {
      return {
        success: false,
        error: "The configured Google Gemini API key appears to be invalid. Please verify your API key in .env.local.",
      };
    }

    if (errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("quota")) {
      return {
        success: false,
        error: "The AI service is experiencing high traffic. Please wait a moment and try again.",
      };
    }

    if (errorMessage.includes("SAFETY")) {
      return {
        success: false,
        error: "The query could not be answered due to safety parameters. Please ask a farming-related question.",
      };
    }

    // Default safe user-facing message
    return {
      success: false,
      error: "We couldn't get a response right now. Please try again in a moment.",
    };
  }
}
