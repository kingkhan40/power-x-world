import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

import { BalanceProvider } from "@/context/BalanceContext";


// ✅ Google Font
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
});

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "PowerXWorld",
  description: "Next.js + NextAuth authentication example",
};

// ✅ Root Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProviderWrapper>
          <BalanceProvider>
            <ClientLayout>{children}</ClientLayout>
          </BalanceProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}