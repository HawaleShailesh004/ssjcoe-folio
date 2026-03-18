import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SSJCOE Folio - A verified record of excellence",
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
    <html
      lang="en"
      className={`${outfit.variable} ${cormorant.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ScrollProgress />
        <LayoutShell>{children}</LayoutShell>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-outfit), system-ui, sans-serif",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
