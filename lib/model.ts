import { gateway } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

// Picks the extraction model. If an OpenAI key is present we call OpenAI
// directly (handy for local testing with your own key). Otherwise we route
// through the Vercel AI Gateway (the zero-config path in production on Vercel).
export function extractionModel(): LanguageModel {
  if (process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return openai(process.env.EXTRACTION_MODEL || "gpt-4o");
  }
  return gateway(process.env.EXTRACTION_MODEL || "anthropic/claude-haiku-4.5");
}

// True when we have *some* way to reach a model.
export function modelConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY || process.env.AI_GATEWAY_API_KEY || process.env.VERCEL === "1");
}
