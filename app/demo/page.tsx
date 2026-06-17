import type { Metadata } from "next";
import { DemoClient } from "./DemoClient";

// Unlisted: keep this out of search results. It's for recording the walkthrough
// and screen-sharing live on calls — not a public self-serve tool.
export const metadata: Metadata = {
  title: "Demo · Invoice → Spreadsheet",
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-white">
      <DemoClient />
    </main>
  );
}
