import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/config";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: `${site.productName} — ${site.tagline}`,
  description:
    "An automation that extracts data from invoice PDFs into a clean spreadsheet — any vendor, any layout, including scans. Built by " +
    site.freelancerName + ".",
  openGraph: {
    title: `${site.productName} — automated invoice data entry`,
    description: site.tagline,
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-white text-zinc-900">{children}</body>
    </html>
  );
}
