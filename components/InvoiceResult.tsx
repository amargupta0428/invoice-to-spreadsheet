"use client";

import { useState } from "react";
import type { Invoice } from "@/lib/schema";
import { SUMMARY_FIELDS, formatMoney, displayValue } from "@/lib/fields";

function toCsv(invoice: Invoice): string {
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines: string[] = [];
  lines.push("Field,Value");
  for (const f of SUMMARY_FIELDS) lines.push(`${esc(f.label)},${esc(invoice[f.key])}`);
  lines.push("");
  lines.push("Description,Qty,Unit Price,Amount");
  for (const li of invoice.lineItems) {
    lines.push([li.description, li.quantity, li.unitPrice, li.amount].map(esc).join(","));
  }
  return lines.join("\n");
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function InvoiceResult({ invoice }: { invoice: Invoice }) {
  const [exporting, setExporting] = useState(false);
  const flagged = new Set(invoice.lowConfidenceFields);
  const fileBase = (invoice.invoiceNumber || "invoice").replace(/[^a-z0-9-_]/gi, "_");

  if (!invoice.isInvoice) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">That doesn&apos;t look like an invoice.</p>
        <p className="mt-1 text-sm">
          It looks more like {invoice.documentType ? `a ${invoice.documentType}` : "a different kind of document"}.
          This tool is tuned specifically for invoices and receipts — try one of the samples above.
        </p>
      </div>
    );
  }

  const exportExcel = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice }),
      });
      if (!res.ok) throw new Error("export failed");
      download(await res.blob(), `${fileBase}.xlsx`);
    } catch {
      alert("Excel export failed — the CSV download still works.");
    } finally {
      setExporting(false);
    }
  };

  const exportCsv = () => download(new Blob([toCsv(invoice)], { type: "text/csv" }), `${fileBase}.csv`);

  return (
    <div id="extraction-result" className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-emerald-700">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          Extracted {invoice.lineItems.length} line item{invoice.lineItems.length === 1 ? "" : "s"}
          {flagged.size > 0 && (
            <span className="text-amber-700">· {flagged.size} field{flagged.size === 1 ? "" : "s"} to verify</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCsv}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Download CSV
          </button>
          <button
            onClick={exportExcel}
            disabled={exporting}
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {exporting ? "Building…" : "Download Excel"}
          </button>
        </div>
      </div>

      {flagged.size > 0 && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Amber fields were inferred from a low-quality source — please verify them before use.
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-zinc-100">
            {SUMMARY_FIELDS.map((f) => {
              const raw = invoice[f.key];
              const value = f.money
                ? formatMoney(raw as number | null, invoice.currency)
                : displayValue(raw);
              const isFlagged = flagged.has(f.key as string);
              return (
                <tr key={f.key as string} className={isFlagged ? "bg-amber-50" : ""}>
                  <td className="w-44 px-4 py-2 align-top font-medium text-zinc-500">{f.label}</td>
                  <td className="px-4 py-2 text-zinc-900">
                    {value}
                    {isFlagged && <span className="ml-2 text-xs font-medium text-amber-600">verify</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {invoice.lineItems.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-2 font-medium">Description</th>
                <th className="px-4 py-2 text-right font-medium">Qty</th>
                <th className="px-4 py-2 text-right font-medium">Unit price</th>
                <th className="px-4 py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {invoice.lineItems.map((li, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 text-zinc-900">{li.description}</td>
                  <td className="px-4 py-2 text-right text-zinc-700">{li.quantity ?? "—"}</td>
                  <td className="px-4 py-2 text-right text-zinc-700">{formatMoney(li.unitPrice, invoice.currency)}</td>
                  <td className="px-4 py-2 text-right text-zinc-900">{formatMoney(li.amount, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
