import type { Metadata } from "next";
import "./globals.css";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Jondhale Folio — SSJCOE",
    template: "%s | Jondhale Folio",
  },
  description:
    "A record of excellence from SSJCOE. Placements, research, patents, events and achievements — all in one place.",
  keywords: [
    "SSJCOE",
    "placements",
    "research",
    "engineering college",
    "Jondhale",
  ],
  openGraph: {
    title: "Jondhale Folio",
    description: "A record of excellence. A proof of potential.",
    siteName: "Jondhale Folio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ScrollProgress />
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "'Outfit', sans-serif",
            fontSize: "13px",
          },
        }}
      />
      </body>
    </html>
  );
}
