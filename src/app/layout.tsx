import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import ClientLayout from "@/components/ClientLayout";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PowerXWorld",
  description: "Next.js + NextAuth authentication example",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProviderWrapper>
          <AppProvider>
            <ClientLayout>{children}</ClientLayout>
          </AppProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
