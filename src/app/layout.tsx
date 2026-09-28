import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers";
import { NavigationProgress } from "@/components/shared/navigation-progress";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NyayVakil – Legal Practice Manager",
  description:
    "Modern legal practice management for Indian advocates and law firms. Manage cases, hearings, fees, clients, documents, and tasks — all in one place.",
  keywords: ["legal", "advocate", "law firm", "case management", "India", "court diary"],
  authors: [{ name: "NyayVakil" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <NavigationProgress />
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
