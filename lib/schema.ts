import { z } from "zod";

// One row of an invoice's itemized table.
export const lineItemSchema = z.object({
  description: z.string().describe("Item or service description"),
  quantity: z.number().nullable().describe("Quantity, or null if not shown"),
  unitPrice: z.number().nullable().describe("Price per unit, or null"),
  amount: z.number().nullable().describe("Line total, or null"),
});

// The structured shape we extract from any invoice.
// Every field is nullable so the model can honestly say "not present"
// instead of hallucinating a value.
export const invoiceSchema = z.object({
  isInvoice: z
    .boolean()
    .describe(
      "True only if the document is genuinely an invoice/bill/receipt. False for resumes, letters, random PDFs, etc.",
    ),
  documentType: z
    .string()
    .nullable()
    .describe("What the document actually is, e.g. 'invoice', 'receipt', 'resume'"),

  vendorName: z.string().nullable().describe("Company that issued the invoice"),
  vendorAddress: z.string().nullable(),
  vendorContact: z
    .string()
    .nullable()
    .describe("Vendor email and/or phone, combined into one string"),

  billToName: z.string().nullable().describe("Customer being billed"),
  billToAddress: z.string().nullable(),

  invoiceNumber: z.string().nullable(),
  invoiceDate: z
    .string()
    .nullable()
    .describe("Invoice date normalized to YYYY-MM-DD when possible"),
  dueDate: z
    .string()
    .nullable()
    .describe("Due date normalized to YYYY-MM-DD when possible"),

  currency: z
    .string()
    .nullable()
    .describe("ISO 4217 code when determinable, e.g. USD, EUR, GBP"),

  lineItems: z.array(lineItemSchema).describe("Itemized rows; empty array if none"),

  subtotal: z.number().nullable(),
  taxRate: z.number().nullable().describe("Tax rate as a percentage, e.g. 8.25"),
  taxAmount: z.number().nullable(),
  shipping: z.number().nullable(),
  discount: z.number().nullable(),
  total: z.number().nullable().describe("Grand total / amount due"),

  paymentTerms: z.string().nullable().describe("e.g. 'Net 30', 'Due on receipt'"),
  notes: z.string().nullable().describe("Any other relevant note on the invoice"),

  lowConfidenceFields: z
    .array(z.string())
    .describe(
      "List of field keys (from this schema) you are NOT confident about — because the source was blurry, ambiguous, or you inferred them. The UI flags these for human review.",
    ),
});

export type LineItem = z.infer<typeof lineItemSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
