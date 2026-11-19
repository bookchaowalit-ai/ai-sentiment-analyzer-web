import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// The font variable sits on <html>: the App shell tokens live on :root and read it from there.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const description = "Read the tone of a sentence with a transparent word list that runs in your browser. Every counted word is shown; it is a heuristic, not a trained model.";

export const metadata: Metadata = {
  title: "Tone Lab | Bookchaowalit",
  description,
  keywords: ["sentiment analyzer", "lexicon", "bookchaowalit"],
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "Bookchaowalit",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", url: "/", title: "Tone Lab | Bookchaowalit", description, siteName: "Bookchaowalit" },
  twitter: { card: "summary", title: "Tone Lab | Bookchaowalit", description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
