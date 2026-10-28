import type { Metadata } from "next";
import { Header, Footer } from "@/components/site";
import { getStoreSettings } from "@/lib/server/content";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Meridian Logistics | Beyond Borders", template: "%s | Meridian Logistics" },
  description: "Freight forwarding and integrated logistics services connecting businesses to global markets.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Meridian Logistics",
    title: "Meridian Logistics | Beyond Borders",
    description: "Connecting businesses to global markets through freight forwarding and logistics coordination.",
    url: siteUrl,
  },
  alternates: { canonical: "/" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getStoreSettings();

  return (
    <html lang="en" className="overflow-x-hidden max-w-full">
      <body className="overflow-x-hidden max-w-full relative">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header settings={settings} />
        <main id="main" className="overflow-x-hidden w-full max-w-full">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
