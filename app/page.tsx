import Link from "next/link";
import { site } from "@/lib/config";

function VideoEmbed() {
  const url = site.demoVideoUrl;
  if (!url) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 text-center text-sm text-zinc-400">
        <div>
          <p className="font-medium text-zinc-500">Walkthrough video goes here</p>
          <p className="mt-1">Record a 60–90s screen capture, then set <code>demoVideoUrl</code> in <code>lib/config.ts</code>.</p>
        </div>
      </div>
    );
  }
  if (url.endsWith(".mp4")) {
    return <video controls className="aspect-video w-full rounded-xl border border-zinc-200" src={url} />;
  }
  return (
    <iframe
      className="aspect-video w-full rounded-xl border border-zinc-200"
      src={url}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
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
  { n: "2", t: "AI reads every field", d: "Vendor, dates, line items, tax, totals — pulled into structured data, with anything uncertain flagged for review." },
  { n: "3", t: "Export clean data", d: "Download a tidy CSV or Excel file, or send it straight into your sheet, accounting tool, or CRM." },
];

const TRUST = [
  { t: "Handles layouts it's never seen", d: "Built on a vision model, not brittle templates — so a new vendor's format just works instead of breaking the pipeline." },
  { t: "Honest about uncertainty", d: "On a blurry scan it flags the fields it inferred for a human to verify, rather than silently guessing. Accuracy you can trust." },
  { t: "Reads scans & photos", d: "Not just clean digital PDFs — photographed and scanned receipts work too." },
  { t: "Built for your workflow", d: "The demo is generic on purpose. For your business I tune it to your vendors, your volume, and your tools." },
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
          <a href="#video" className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700">
            Watch the 90-second demo
          </a>
          <Link href="/demo" className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            Open the live tool →
          </Link>
        </div>
      </section>

      {/* Before / After */}
      <section className="mx-auto max-w-4xl px-5 py-10">
        <BeforeAfter />
      </section>

      {/* Video */}
      <section id="video" className="mx-auto max-w-3xl scroll-mt-8 px-5 py-12">
        <h2 className="mb-1 text-center text-2xl font-semibold">See it work</h2>
        <p className="mb-6 text-center text-sm text-zinc-500">A real invoice, start to finish.</p>
        <VideoEmbed />
        <p className="mt-4 text-center text-sm text-zinc-500">
          Want to see it on <em>your</em> invoices?{" "}
          <a href={site.upworkProfileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-900 underline">
            Book a quick call
          </a>{" "}
          and I&apos;ll run a few through it live.
        </p>
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

      {/* Contact CTA */}
      <section id="contact" className="scroll-mt-8 border-t border-zinc-100 bg-zinc-900 text-white">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <h2 className="text-3xl font-semibold">Have invoices piling up?</h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-300">
            I build automations that take the tedious data entry off your plate — tuned to your
            documents, connected to your tools, and reliable on real volume. Tell me what&apos;s eating
            your time and I&apos;ll show you exactly how this would work for you.
          </p>
          <a
            href={site.upworkProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
          >
            Let&apos;s talk on Upwork →
          </a>
          <p className="mt-4 text-xs text-zinc-500">
            I&apos;ll walk you through it live and run a couple of your own invoices on the call.
          </p>
        </div>
      </section>

      <footer className="mx-auto max-w-4xl px-5 py-8 text-center text-xs text-zinc-400">
        Built by {site.freelancerName} · {site.productName} · Demo project
      </footer>
    </main>
  );
}
