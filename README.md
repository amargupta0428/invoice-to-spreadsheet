# Invoice → Spreadsheet

Turn messy invoice PDFs (and scans/photos) into clean, structured spreadsheet data — any
vendor, any layout — using a vision LLM. Upload an invoice, get an editable table, export
to CSV or Excel.

## The problem it solves

Small businesses and bookkeepers hand-key invoices into spreadsheets every day: read the
PDF, retype the vendor, dates, every line item, the tax, the total. It's slow, dull, and
error-prone, and it doesn't scale past a handful a day. Template-based "PDF parsers" break
the moment a new vendor uses a different layout.

This tool reads invoices the way a person does — so a layout it has never seen still works
— and produces structured data a spreadsheet or accounting tool can actually use.

## Input → output

**1. A clean vendor invoice — the baseline**

| Input: vendor invoice PDF | Output: structured, exportable data |
| --- | --- |
| ![Clean vendor invoice input](docs/screenshots/input-invoice.png) | ![Extracted result](docs/screenshots/result.png) |

**2. A photographed receipt — a genuinely messy input**

The harder, real-world case: a hurried phone photo — skewed, shadowed, with the receipt
number and tax amount visibly smudged. The model still reads every field correctly, and
leaves anything it genuinely can't make out blank rather than guessing.

| Input: photographed receipt | Output: every field extracted correctly |
| --- | --- |
| ![Photographed receipt input](public/samples/receipt-photo.jpg) | ![Correct extraction of the photographed receipt](docs/screenshots/receipt-result.png) |

It will also flag fields it's unsure about for review, but that's a best-effort signal from
the model, not a guarantee — so the rule of thumb stays: spot-check the numbers before they
hit accounting.

*Real output from the running tool — upload a file, get the extracted table, download CSV/Excel.*

## How it works

1. **Upload** a PDF, PNG, or JPG (drag-and-drop). PDFs go straight to the model — no
   fragile OCR/template step.
2. **Extract** — the file is sent to a vision-capable LLM with a strict instruction set.
3. **Validate** — the model's response is forced into a [Zod schema](lib/schema.ts)
   (vendor, bill-to, dates, currency, line items, subtotal/tax/total, terms). Output that
   doesn't fit the schema is rejected and retried, so the shape is always predictable.
4. **Review** — the model flags fields it's unsure about for a human to verify (a
   best-effort, model-dependent signal), and leaves anything it genuinely can't read blank
   rather than guessing.
5. **Export** — one click to CSV or a formatted `.xlsx`.

## Reliability choices

The hard part of a tool people actually trust is the unhappy path. This one:

- **Constrains output to a schema** (`generateObject` + Zod) so downstream code always gets
  the same shape, with numbers as numbers and dates normalized.
- **Surfaces uncertainty (best-effort)** — the model can populate a `lowConfidenceFields`
  list, shown in amber with a "verify" tag, to point a reviewer at anything it wasn't sure
  about. It's a model-dependent signal, not a guarantee — and unreadable fields are left
  blank rather than guessed.
- **Handles non-invoices** — upload a resume or a letter and it says so (`isInvoice: false`)
  instead of returning garbage.
- **Guards the endpoint** — per-IP rate limiting, an 8 MB size cap, and a PDF/PNG/JPG
  allow-list on `/api/extract`.
- **Avoids a known-vulnerable dependency** — uses [`exceljs`](https://github.com/exceljs/exceljs)
  for export instead of the npm `xlsx` build, which has an unfixable high-severity advisory.

## Run it locally

```bash
npm install
cp .env.example .env.local      # add OPENAI_API_KEY (or AI_GATEWAY_API_KEY)
npm run samples                 # generate the sample invoice PDFs into /public/samples
npm run dev                     # http://localhost:3000
```

- Public landing/case-study page: `/`
- The working tool: `/demo`

The tool defaults to OpenAI `gpt-4o` when `OPENAI_API_KEY` is set; otherwise it routes
through the Vercel AI Gateway (zero-config on Vercel). Override with `EXTRACTION_MODEL`.

## Limitations (honest version)

- It's a **demo** focused on extraction quality for one document at a time. Cost is ~a cent
  or two per invoice on `gpt-4o`.
- Accuracy is high on clean documents; very low-quality scans can still misread a field —
  which is exactly why low-confidence flagging exists. **Numbers should be spot-checked**
  before they hit accounting.
- No persistence, auth, or accounting-system integration in the demo. A real client build
  adds **batch processing across your full invoice volume**, tuning to your vendor formats,
  and wiring into your accounting tools.

## Stack

Next.js (App Router) · TypeScript · Tailwind · [AI SDK](https://sdk.vercel.ai) v6
(OpenAI / Vercel AI Gateway) · Zod · exceljs.

## License

MIT — see [LICENSE](LICENSE).
