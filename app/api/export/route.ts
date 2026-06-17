import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { invoiceSchema } from "@/lib/schema";
import { SUMMARY_FIELDS } from "@/lib/fields";

// Builds a formatted .xlsx from an extracted invoice: a summary sheet of
// header fields plus a line-items table. CSV export is handled client-side.
export async function POST(req: NextRequest) {
  let invoice;
  try {
    const body = await req.json();
    invoice = invoiceSchema.parse(body.invoice);
  } catch {
    return NextResponse.json({ error: "Invalid invoice payload." }, { status: 400 });
  }

  const wb = new ExcelJS.Workbook();
  wb.creator = "Invoice → Spreadsheet";

  // Sheet 1: summary
  const summary = wb.addWorksheet("Invoice");
  summary.columns = [
    { header: "Field", key: "field", width: 22 },
    { header: "Value", key: "value", width: 48 },
  ];
  summary.getRow(1).font = { bold: true };
  for (const f of SUMMARY_FIELDS) {
    const raw = invoice[f.key] as unknown;
    summary.addRow({ field: f.label, value: raw ?? "" });
  }

  // Sheet 2: line items
  const items = wb.addWorksheet("Line Items");
  items.columns = [
    { header: "Description", key: "description", width: 44 },
    { header: "Qty", key: "quantity", width: 10 },
    { header: "Unit Price", key: "unitPrice", width: 14 },
    { header: "Amount", key: "amount", width: 14 },
  ];
  items.getRow(1).font = { bold: true };
  for (const li of invoice.lineItems) {
    items.addRow(li);
  }
  ["unitPrice", "amount"].forEach((k) => {
    items.getColumn(k).numFmt = "#,##0.00";
  });

  const buffer = await wb.xlsx.writeBuffer();
  const name = (invoice.invoiceNumber || "invoice").replace(/[^a-z0-9-_]/gi, "_");

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${name}.xlsx"`,
    },
  });
}
