import type { Invoice } from "./schema";

// Human-friendly labels for the scalar (non-line-item) fields, in display order.
export const SUMMARY_FIELDS: { key: keyof Invoice; label: string; money?: boolean }[] = [
  { key: "vendorName", label: "Vendor" },
  { key: "vendorAddress", label: "Vendor address" },
  { key: "vendorContact", label: "Vendor contact" },
  { key: "billToName", label: "Bill to" },
  { key: "billToAddress", label: "Bill-to address" },
  { key: "invoiceNumber", label: "Invoice #" },
  { key: "invoiceDate", label: "Invoice date" },
  { key: "dueDate", label: "Due date" },
  { key: "paymentTerms", label: "Payment terms" },
  { key: "currency", label: "Currency" },
  { key: "subtotal", label: "Subtotal", money: true },
  { key: "discount", label: "Discount", money: true },
  { key: "taxRate", label: "Tax rate (%)" },
  { key: "taxAmount", label: "Tax", money: true },
  { key: "shipping", label: "Shipping", money: true },
  { key: "total", label: "Total", money: true },
  { key: "notes", label: "Notes" },
];

export function formatMoney(value: number | null, currency: string | null): string {
  if (value === null || value === undefined) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      currencyDisplay: "narrowSymbol",
    }).format(value);
  } catch {
    return value.toLocaleString("en-US", { minimumFractionDigits: 2 });
  }
}

export function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}
