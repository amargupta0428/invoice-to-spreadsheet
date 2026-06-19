"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import type { Invoice } from "@/lib/schema";
import { SAMPLES } from "@/lib/samples";
import { InvoiceResult } from "@/components/InvoiceResult";

type Status = "idle" | "loading" | "done" | "error";

export function DemoClient() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [activeSample, setActiveSample] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadSample = (id: string) => {
    const sample = SAMPLES.find((s) => s.id === id);
    if (!sample) return;
    setActiveSample(id);
    setStatus("loading");
    setMessage("");
    // Tiny delay so it reads as "processing" in the demo video, not a static swap.
    setTimeout(() => {
      setInvoice(sample.result);
      setStatus("done");
    }, 450);
  };

  const upload = useCallback(async (file: File) => {
    setActiveSample(null);
    setStatus("loading");
    setMessage("");
    setInvoice(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }
      setInvoice(data.invoice);
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("Network error — please try again.");
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-8 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
        <strong>Demo mode.</strong> Try a sample below for the full experience, or upload your own
        invoice. Generic samples are intentionally the floor — a build tuned to your formats and
        connected to your tools goes much further.
      </div>

      <h1 className="text-2xl font-semibold text-zinc-900">Invoice → Spreadsheet</h1>
      <p className="mt-1 text-zinc-600">Drop in an invoice PDF and get a clean, structured table you can export.</p>

      <div className="mt-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Try a sample</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {SAMPLES.map((s) => (
            <button
              key={s.id}
              onClick={() => loadSample(s.id)}
              className={`rounded-xl border p-3 text-left transition ${
                activeSample === s.id
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-400"
              }`}
            >
              <span className="block text-sm font-medium text-zinc-900">{s.label}</span>
              <span className="mt-1 block text-xs leading-snug text-zinc-500">{s.blurb}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Wrapper used to frame README screenshots on just the input→output area. */}
      <div id="tool-frame">
      <div className="mt-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Or upload your own</p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${
            dragging ? "border-zinc-900 bg-zinc-50" : "border-zinc-300 hover:border-zinc-400"
          }`}
        >
          <p className="text-sm font-medium text-zinc-700">Drop a PDF, PNG, or JPG here</p>
          <p className="mt-1 text-xs text-zinc-400">or click to browse · up to 8 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
        </div>
      </div>

      <div className="mt-8">
        {status === "loading" && (
          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-6 text-sm text-zinc-600">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
            Reading the invoice…
          </div>
        )}
        {status === "error" && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
            {message}
          </div>
        )}
        {status === "done" && invoice && <InvoiceResult invoice={invoice} />}
      </div>
      </div>

      <div className="mt-12 rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm text-zinc-600">
        Want this wired into your accounting workflow, tuned to your vendors, and running on your
        real volume?{" "}
        <Link href="/" className="font-medium text-zinc-900 underline">
          See how it works →
        </Link>
      </div>
    </div>
  );
}
