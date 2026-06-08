import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  type TranslatableDetailContent,
  LOCALE_NAMES,
} from "@/lib/detail-translate";
import { requireStaff } from "@/lib/auth/server-auth";

const TARGET_LOCALES = ["en", "zh", "ja"] as const;

const DEVELOPER_INSTRUCTIONS = `You are a professional medical beauty clinic copywriter for GW Beauty (premium Korean aesthetic clinic).
Translate Korean service detail page content into the target language.

Rules:
- Preserve JSON structure exactly (same keys, same array lengths).
- Keep step numbers (01, 02, 03) unchanged in detailCards.step.
- Tone: premium, trustworthy, warm, concise — suitable for clinic marketing.
- Use natural native phrasing, not literal word-for-word translation.
- Keep brand name "GW Beauty" unchanged.
- Empty strings stay empty strings.
- Return ONLY valid JSON matching the input schema.`;

export async function POST(request: NextRequest) {
  const { error } = await requireStaff(request);
  if (error) return error;

  try {
    const apiKey = process.env.OPEN_API_SECRET_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPEN_API_SECRET_KEY is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const targetLocale = body.targetLocale as string;
    const content = body.content as TranslatableDetailContent;

    if (!TARGET_LOCALES.includes(targetLocale as (typeof TARGET_LOCALES)[number])) {
      return NextResponse.json({ error: "Invalid target locale" }, { status: 400 });
    }
    if (!content || typeof content !== "object") {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    const lang = LOCALE_NAMES[targetLocale] ?? targetLocale;
    const openai = new OpenAI({ apiKey });

    const userInput = JSON.stringify(content, null, 2);

    // gpt_text_gen.md: Responses API + instructions + output_text
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      instructions: DEVELOPER_INSTRUCTIONS,
      input: `Translate the following Korean clinic detail page JSON into ${lang}.\n\n${userInput}`,
      text: {
        format: {
          type: "json_schema",
          name: "translated_detail",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              heroTitle: { type: "string" },
              heroSubtitle: { type: "string" },
              surgeryTime: { type: "string" },
              anesthesiaMethod: { type: "string" },
              visitCount: { type: "string" },
              aftercareStart: { type: "string" },
              recoveryPeriod: { type: "string" },
              recommendedFor: { type: "array", items: { type: "string" } },
              detailSectionEyebrow: { type: "string" },
              detailSectionTitle: { type: "string" },
              detailSectionSubtitle: { type: "string" },
              detailCards: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    step: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    bullets: { type: "array", items: { type: "string" } },
                    footer: { type: "string" },
                  },
                  required: ["step", "title", "description", "bullets", "footer"],
                },
              },
              beforeAfterLabels: { type: "array", items: { type: "string" } },
              ctaTitle: { type: "string" },
              ctaSubtitle: { type: "string" },
            },
            required: [
              "heroTitle",
              "heroSubtitle",
              "surgeryTime",
              "anesthesiaMethod",
              "visitCount",
              "aftercareStart",
              "recoveryPeriod",
              "recommendedFor",
              "detailSectionEyebrow",
              "detailSectionTitle",
              "detailSectionSubtitle",
              "detailCards",
              "beforeAfterLabels",
              "ctaTitle",
              "ctaSubtitle",
            ],
          },
          strict: true,
        },
      },
    });

    const raw = response.output_text?.trim();
    if (!raw) {
      return NextResponse.json({ error: "Empty model response" }, { status: 502 });
    }

    const translated = JSON.parse(raw) as TranslatableDetailContent;
    return NextResponse.json(translated);
  } catch (error) {
    console.error("[POST /api/translate]", error);
    const message = error instanceof Error ? error.message : "Translation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
