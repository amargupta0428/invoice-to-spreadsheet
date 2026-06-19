import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/config";

// Real input → output screenshots from the running tool (the two README pairs).
// Assets live in /public so they render on the deployed site, not just GitHub.
const PROOF = [
  {
    title: "A clean vendor invoice",
    blurb: "The everyday case — read into a structured table in seconds.",
    input: { src: "/proof/input-invoice.png", w: 1081, h: 820, alt: "A vendor's invoice PDF" },
    output: { src: "/proof/result.png", w: 729, h: 941, alt: "The invoice extracted into a structured table" },
  },
  {
    title: "A photographed receipt",
    blurb: "A skewed, shadowed phone photo — every legible field still read correctly.",
    input: { src: "/samples/receipt-photo.jpg", w: 866, h: 860, alt: "A phone photo of a paper receipt" },
    output: { src: "/proof/receipt-result.png", w: 729, h: 904, alt: "The receipt extracted into a structured table" },
  },
];

function ScreenshotProof() {
  return (
    <div className="space-y-12">
      {PROOF.map((p) => (
        <div key={p.title}>
          <h3 className="text-lg font-medium">{p.title}</h3>
          <p className="mb-4 text-sm text-zinc-500">{p.blurb}</p>
          <div className="grid items-start gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <figure className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <Image src={p.input.src} width={p.input.w} height={p.input.h} alt={p.input.alt} className="w-full" style={{ height: "auto" }} />
            </figure>
            <div className="hidden self-center text-2xl text-zinc-300 sm:block">→</div>
            <figure className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <Image src={p.output.src} width={p.output.w} height={p.output.h} alt={p.output.alt} className="w-full" style={{ height: "auto" }} />
            </figure>
          </div>
        </div>
      ))}
    </div>
  );
}

function BeforeAfter() {
  return (
    <div className="grid items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr]">
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Before</p>
        <div className="space-y-1.5 font-mono text-[11px] leading-relaxed text-zinc-400">
          <p>NORTHWIND SUPPLY CO.    INVOICE</p>
          <p>418 Commerce Ave #200   INV-20418</p>
          <p>Chicago, IL 60607       Date 05/12/26</p>
          <p>&nbsp;</p>
          <p>Nitrile gloves x6 ...........252.00</p>
          <p>Disinfectant wipes x12 .....102.00</p>
          <p>Autoclave pouches x4 .........69.00</p>
          <p>Saliva ejectors x10 .........34.00</p>
          <p>&nbsp;</p>
          <p>Subtotal 457.00  Tax 37.70</p>
          <p>Ship 14.95   TOTAL  $509.65</p>
        </div>
        <p className="mt-3 text-xs text-zinc-400">Unstructured PDF — useless to a spreadsheet.</p>
      </div>

      <div className="flex items-center justify-center text-2xl text-zinc-300">→</div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">After</p>
        <table className="w-full text-[11px]">
          <tbody className="divide-y divide-zinc-100">
            <tr><td className="py-1 text-zinc-500">Vendor</td><td className="py-1 text-right text-zinc-900">Northwind Supply Co.</td></tr>
            <tr><td className="py-1 text-zinc-500">Invoice #</td><td className="py-1 text-right text-zinc-900">INV-20418</td></tr>
            <tr><td className="py-1 text-zinc-500">Date</td><td className="py-1 text-right text-zinc-900">2026-05-12</td></tr>
            <tr><td className="py-1 text-zinc-500">Line items</td><td className="py-1 text-right text-zinc-900">4</td></tr>
            <tr><td className="py-1 text-zinc-500">Tax</td><td className="py-1 text-right text-zinc-900">$37.70</td></tr>
            <tr><td className="py-1 font-medium text-zinc-700">Total</td><td className="py-1 text-right font-medium text-zinc-900">$509.65</td></tr>
          </tbody>
        </table>
        <p className="mt-3 text-xs text-emerald-600">Clean rows → CSV / Excel in one click.</p>
      </div>
    </div>
  );
}

const STEPS = [
  { n: "1", t: "Drop in the invoice", d: "PDF, scan, or phone photo — any vendor, any layout. No templates to configure." },
  { n: "2", t: "AI reads every field", d: "Vendor, dates, line items, tax, totals — pulled into structured data, with a best-effort flag on anything it's unsure about." },
  { n: "3", t: "Export clean data", d: "Download a tidy CSV or Excel file, or send it straight into your sheet, accounting tool, or CRM." },
];

const TRUST = [
  { t: "Handles layouts it's never seen", d: "Built on a vision model, not brittle templates — so a new vendor's format just works instead of breaking the pipeline." },
  { t: "Honest about uncertainty", d: "On a rough scan it does its best to flag fields it's unsure about, so you know where to double-check. A soft assist — always worth a quick spot-check of the numbers." },
  { t: "Reads scans & photos", d: "Not just clean digital PDFs — photographed and scanned receipts work too." },
  { t: "Built for your workflow", d: "The demo runs one invoice at a time. For your business I add batch processing across your full invoice volume, tune it to your vendor formats, and wire it into your accounting tools." },
];

export default function Home() {
  return (
    <main className="bg-white text-zinc-900">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-5 pb-12 pt-20 text-center">
        <p className="mb-4 inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
          Business automation · document data entry
        </p>
        <h1 className="mx-auto max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {site.tagline}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-600">
          Stop retyping invoices by hand. This tool reads any invoice — any vendor, any layout, even
          scans — and turns it into clean, exportable spreadsheet data automatically.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/demo" className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700">
            Open the live tool →
          </Link>
        </div>
      </section>

      {/* Before / After */}
      <section className="mx-auto max-w-4xl px-5 py-10">
        <BeforeAfter />
      </section>

      {/* Screenshot proof */}
      <section className="mx-auto max-w-4xl px-5 py-12">
        <h2 className="mb-1 text-center text-2xl font-semibold">See it work</h2>
        <p className="mb-10 text-center text-sm text-zinc-500">
          Real output from the tool — messy input in, clean data out.
        </p>
        <ScreenshotProof />
      </section>

      {/* How it works */}
      <section className="border-y border-zinc-100 bg-zinc-50/60">
        <div className="mx-auto max-w-4xl px-5 py-14">
          <h2 className="mb-10 text-center text-2xl font-semibold">How it works</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 font-medium">{s.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it's reliable */}
      <section className="mx-auto max-w-4xl px-5 py-14">
        <h2 className="mb-10 text-center text-2xl font-semibold">Why it&apos;s reliable enough to trust</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {TRUST.map((f) => (
            <div key={f.t} className="rounded-xl border border-zinc-200 p-5">
              <h3 className="font-medium">{f.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-4xl px-5 py-8 text-center text-xs text-zinc-400">
        Built by {site.freelancerName} · {site.productName} · Demo project
      </footer>
    </main>
  );
}
