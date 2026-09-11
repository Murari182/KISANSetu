import { NextRequest, NextResponse } from "next/server";
import { generateKisanAIResponse } from "@/lib/ai/gemini";
import { FarmerContext } from "@/lib/ai/prompts";

export const dynamic = "force-dynamic";

interface AIRequestBody {
  message?: string;
  language?: string;
  context?: FarmerContext;
  conversationHistory?: Array<{ role: "user" | "model"; parts: string }>;
}

export async function POST(request: NextRequest) {
  try {
    let body: AIRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload. Expected JSON format.",
        },
        { status: 400 }
      );
    }

    const { message, language = "en", context, conversationHistory } = body;

    // 1. Validation
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid farming or crop question.",
        },
        { status: 400 }
      );
    }

    if (message.length > 3000) {
      return NextResponse.json(
        {
          success: false,
          error: "Your question is too long. Please keep it under 3,000 characters.",
        },
        { status: 400 }
      );
    }

    // 2. Call server-side Gemini service
    const result = await generateKisanAIResponse({
      message: message.trim(),
      language: typeof language === "string" ? language.trim().toLowerCase() : "en",
      context: typeof context === "object" && context !== null ? context : undefined,
      conversationHistory: Array.isArray(conversationHistory) ? conversationHistory : undefined,
    });

    // 3. Handle response
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "We couldn't get a response right now. Please try again in a moment.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reply: result.reply,
      language: result.languageUsed || language,
    });
  } catch (error: any) {
    // Keep raw error details in server logs only - NEVER expose to client
    console.error("[POST /api/ai Unhandled Error]:", error?.message || error);

    return NextResponse.json(
      {
        success: false,
        error: "We couldn't get a response right now. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
