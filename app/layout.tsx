import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Space_Grotesk,
  Roboto_Mono
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "DSS UMKM Salatiga | Rekomendasi Lokasi Usaha",
  description:
    "Sistem pendukung keputusan berbasis K-Means, AHP, dan TOPSIS untuk membantu UMKM Kota Salatiga menentukan kelurahan paling prospektif untuk distribusi produk."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full",
        "antialiased",
        plusJakartaSans.variable,
        spaceGrotesk.variable,
        robotoMono.variable,
        "font-sans"
      )}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-[#EEF0E8] text-[#23262B]"
        suppressHydrationWarning
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
