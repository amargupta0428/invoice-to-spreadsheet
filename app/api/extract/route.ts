import { NextRequest, NextResponse } from "next/server";
import { generateObject, NoObjectGeneratedError } from "ai";
import { invoiceSchema } from "@/lib/schema";
import { extractionModel, modelConfigured } from "@/lib/model";

export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ACCEPTED = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp"]);

// Tiny in-memory rate limiter (per serverless instance). Good enough to stop
// casual abuse of a private demo endpoint; not a distributed guarantee.
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

const PROMPT = `You are an expert accounts-payable clerk. Extract the structured data from this invoice or receipt.

Rules:
- Only fill a field if it is actually present. If something is missing or unreadable, return null — never guess a plausible value.
- Normalize dates to YYYY-MM-DD when you can read them confidently.
- Numbers must be plain numbers (no currency symbols or thousands separators).
- Infer the currency from symbols or context when no ISO code is printed ($ → USD, € → EUR, £ → GBP).
- If the document is clearly NOT an invoice/receipt/bill, set isInvoice=false and fill documentType with what it actually is.
- Put the schema key of any field you are unsure about (blurry scan, ambiguous label, value you had to infer) into lowConfidenceFields so a human can verify it.`;

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  if (!modelConfigured()) {
    return NextResponse.json(
      { error: "Server not configured: set OPENAI_API_KEY or AI_GATEWAY_API_KEY." },
      { status: 503 },
    );
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "Rate limit reached for this demo. Try again later or book a live walkthrough." },
      { status: 429 },
    );
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
  } catch {
    return NextResponse.json({ error: "Could not read the uploaded file." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File is larger than 8 MB. This demo handles short invoices; large batches are a paid build." },
      { status: 413 },
    );
  }
  const mediaType = file.type || "application/pdf";
  if (!ACCEPTED.has(mediaType)) {
    return NextResponse.json(
      { error: "Unsupported file type. Upload a PDF, PNG, or JPG invoice." },
      { status: 415 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  try {
    const { object, usage } = await generateObject({
      model: extractionModel(),
      schema: invoiceSchema,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            { type: "file", data: bytes, mediaType },
          ],
        },
      ],
    });

    return NextResponse.json({ invoice: object, usage });
  } catch (err) {
    if (NoObjectGeneratedError.isInstance(err)) {
      return NextResponse.json(
        { error: "Couldn't read a clean invoice from that file. Try a sample, or a clearer scan." },
        { status: 422 },
      );
    }
    console.error("extract error:", err);
    return NextResponse.json(
      { error: "Extraction failed. Please try again or use one of the samples." },
      { status: 500 },
    );
  }
}
