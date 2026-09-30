import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers";
import { NavigationProgress } from "@/components/shared/navigation-progress";

const inter = Inter({ subsets: ["latin"] });
// Brand serif for the "NyayVakil" wordmark
const brandSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-brand" });

export const metadata: Metadata = {
  title: "NyayVakil – Legal Practice Manager",
  description:
    "Modern legal practice management for Indian advocates and law firms. Manage cases, hearings, fees, clients, documents, and tasks — all in one place.",
  keywords: ["legal", "advocate", "law firm", "case management", "India", "court diary"],
  authors: [{ name: "NyayVakil" }],
};

// Tints the mobile browser bar with the brand navy
export const viewport: Viewport = { themeColor: "#14213D" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${brandSerif.variable} antialiased`} suppressHydrationWarning>
        <NavigationProgress />
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
