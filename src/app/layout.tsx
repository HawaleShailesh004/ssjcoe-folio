import type { Metadata } from "next";
import "./globals.css";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "SSJCOE Folio — A verified record of excellence",
    template: "%s · SSJCOE Folio",
  },
  description:
    "Placements, research, patents, events and achievements from Shivajirao S. Jondhale College of Engineering, Dombivli.",
  keywords: [
    "SSJCOE",
    "placements",
    "research",
    "engineering college",
    "Jondhale",
    "Dombivli",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "SSJCOE Folio",
    description: "A verified record of excellence.",
    siteName: "SSJCOE Folio",
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
        <main className="pt-14">{children}</main>
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
