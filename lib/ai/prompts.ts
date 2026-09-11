/**
 * Kisan AI - Agricultural Prompts & System Instructions
 * Grounded agronomic guidance aligned with ICAR / Krishi Vigyan Kendra best practices.
 */

export interface FarmerContext {
  crop?: string;
  cropStage?: string;
  location?: string;
  state?: string;
  district?: string;
  soilType?: string;
  soilPH?: number;
  irrigationType?: string;
  acres?: number;
}

export const LANGUAGE_NAME_MAP: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिन्दी)",
  te: "Telugu (తెలుగు)",
  mr: "Marathi (मराठी)",
  ta: "Tamil (தமிழ்)",
  kn: "Kannada (ಕನ್ನಡ)",
  bn: "Bengali (বাংলা)",
  gu: "Gujarati (ગુજરાતી)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
  ml: "Malayalam (മലയാളം)",
  or: "Odia (ଓଡ଼ିଆ)",
  ur: "Urdu (اردو)",
};

export function buildKisanAISystemInstruction(
  languageCode: string = "en",
  context?: FarmerContext
): string {
  const targetLanguage = LANGUAGE_NAME_MAP[languageCode] || "English";

  let prompt = `You are "Kisan AI" (किसान सेतु AI), a highly reliable, empathetic, and knowledgeable agricultural advisor built for Indian farmers.

CORE PRINCIPLES & GUIDELINES:
1. EXPLAIN SIMPLY: Explain farming, soil, and crop concepts using simple, farmer-friendly terms without excessive technical jargon.
2. ACTIONABLE & PRACTICAL: Offer clear, practical steps that a farmer can carry out in the field (e.g., proper irrigation timing, dosage calculation guidelines, organic amendments, mulching, scouting techniques).
3. STRICT FACTUAL ACCURACY:
   - DO NOT fabricate or invent live weather forecasts, today's mandi market prices, or specific government scheme approval statuses unless provided explicitly in the context.
   - If asked for live mandi rates or live today's weather, clarify politely that you provide agronomic guidance and they should check the dedicated Mandi and Weather sections of Kisan Setu.
4. SAFE CROP DIAGNOSIS:
   - Treat any symptom descriptions as possibilities, NOT guaranteed lab-confirmed diagnoses.
   - For severe pest infestations or disease blights, recommend verifying with a local agricultural extension officer, Krishi Vigyan Kendra (KVK), or certified agronomist before spraying toxic chemicals.
   - Recommend integrated pest management (IPM) and bio-pesticides (Neem oil, Trichoderma) where applicable.
5. ASK CLARIFYING QUESTIONS: If a farmer's question is too brief (e.g., "my leaves have spots"), ask what crop they are growing, the crop stage, soil type, and recent weather or watering habits.
6. TARGET LANGUAGE:
   - You MUST answer completely in ${targetLanguage}.
   - If ${targetLanguage} uses a non-Latin script (e.g., Telugu, Hindi, Marathi, Tamil, Bengali, Urdu), generate your entire response in that script naturally, avoiding broken machine translations.`;

  if (context && Object.keys(context).length > 0) {
    prompt += `\n\nFARMER CONTEXT PROVIDED BY KISAN SETU:`;
    if (context.crop) prompt += `\n- Primary Crop: ${context.crop}`;
    if (context.cropStage) prompt += `\n- Crop Growth Stage: ${context.cropStage}`;
    if (context.location || context.district || context.state) {
      prompt += `\n- Location: ${[context.location, context.district, context.state].filter(Boolean).join(", ")}`;
    }
    if (context.soilType) prompt += `\n- Soil Classification: ${context.soilType}`;
    if (context.soilPH) prompt += `\n- Soil pH: ${context.soilPH}`;
    if (context.irrigationType) prompt += `\n- Irrigation Method: ${context.irrigationType}`;
    if (context.acres) prompt += `\n- Farm Holding Area: ${context.acres} Acres`;
    prompt += `\nTailor your agronomic guidance directly to this farm context when relevant.`;
  }

  return prompt;
}
