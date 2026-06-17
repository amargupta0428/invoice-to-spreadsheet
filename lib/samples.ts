import type { Invoice } from "./schema";

export type Sample = {
  id: string;
  label: string; // button text
  blurb: string; // short description of why this one is interesting
  sourceFile: string; // /public path to the matching PDF (for "view original")
  result: Invoice;
};

// Precomputed extraction results. The demo's sample buttons render these
// instantly — no API call, no chance of an edge case looking broken.
// The matching source PDFs live in /public/samples (run `npm run samples`).
export const SAMPLES: Sample[] = [
  {
    id: "northwind",
    label: "Standard invoice",
    blurb: "A clean, typical vendor invoice — the everyday case.",
    sourceFile: "/samples/northwind-invoice.pdf",
    result: {
      isInvoice: true,
      documentType: "invoice",
      vendorName: "Northwind Supply Co.",
      vendorAddress: "418 Commerce Ave, Suite 200, Chicago, IL 60607",
      vendorContact: "billing@northwindsupply.com · (312) 555-0142",
      billToName: "Riverside Dental Group",
      billToAddress: "77 Lakeshore Dr, Evanston, IL 60201",
      invoiceNumber: "INV-20418",
      invoiceDate: "2026-05-12",
      dueDate: "2026-06-11",
      currency: "USD",
      lineItems: [
        { description: "Nitrile exam gloves (case of 1000)", quantity: 6, unitPrice: 42.0, amount: 252.0 },
        { description: "Surface disinfectant wipes (tub)", quantity: 12, unitPrice: 8.5, amount: 102.0 },
        { description: "Autoclave pouches 3.5\" x 9\" (box)", quantity: 4, unitPrice: 17.25, amount: 69.0 },
        { description: "Saliva ejectors (bag of 100)", quantity: 10, unitPrice: 3.4, amount: 34.0 },
      ],
      subtotal: 457.0,
      taxRate: 8.25,
      taxAmount: 37.7,
      shipping: 14.95,
      discount: null,
      total: 509.65,
      paymentTerms: "Net 30",
      notes: null,
      lowConfidenceFields: [],
    },
  },
  {
    id: "lumen",
    label: "Different layout + discount",
    blurb: "A totally different design with a discount line and EUR currency.",
    sourceFile: "/samples/lumen-invoice.pdf",
    result: {
      isInvoice: true,
      documentType: "invoice",
      vendorName: "Lumen Creative Studio",
      vendorAddress: "Prinsengracht 263, 1016 GV Amsterdam, Netherlands",
      vendorContact: "hello@lumencreative.nl",
      billToName: "Bright Path Coaching",
      billToAddress: "14 Hillcrest Rd, London W1U 8EW, UK",
      invoiceNumber: "2026-0337",
      invoiceDate: "2026-04-28",
      dueDate: "2026-05-12",
      currency: "EUR",
      lineItems: [
        { description: "Brand identity package", quantity: 1, unitPrice: 2400.0, amount: 2400.0 },
        { description: "Website design (5 pages)", quantity: 1, unitPrice: 1800.0, amount: 1800.0 },
        { description: "Stock photography license", quantity: 1, unitPrice: 150.0, amount: 150.0 },
      ],
      subtotal: 4350.0,
      taxRate: 21.0,
      taxAmount: 866.25,
      shipping: null,
      discount: 225.0,
      total: 4991.25,
      paymentTerms: "Due within 14 days",
      notes: "Loyalty discount applied (5% on design services).",
      lowConfidenceFields: [],
    },
  },
  {
    id: "scanned",
    label: "Scanned / photographed",
    blurb: "A photo of a printed receipt — shows graceful 'please verify' flags.",
    sourceFile: "/samples/handwritten-receipt.pdf",
    result: {
      isInvoice: true,
      documentType: "receipt",
      vendorName: "Corner Hardware",
      vendorAddress: "South Main St, Brooklyn, NY",
      vendorContact: null,
      billToName: null,
      billToAddress: null,
      invoiceNumber: "0098471",
      invoiceDate: "2026-06-03",
      dueDate: null,
      currency: "USD",
      lineItems: [
        { description: "2x4 lumber stud", quantity: 8, unitPrice: 4.18, amount: 33.44 },
        { description: "Wood screws #8 (1 lb box)", quantity: 2, unitPrice: 9.99, amount: 19.98 },
        { description: "Construction adhesive", quantity: 1, unitPrice: 6.49, amount: 6.49 },
      ],
      subtotal: 59.91,
      taxRate: null,
      taxAmount: 5.32,
      shipping: null,
      discount: null,
      total: 65.23,
      paymentTerms: "Paid - cash",
      notes: null,
      // Scanned source → the model honestly flags what it inferred.
      lowConfidenceFields: ["taxAmount", "invoiceNumber"],
    },
  },
];

export function getSample(id: string): Sample | undefined {
  return SAMPLES.find((s) => s.id === id);
}
