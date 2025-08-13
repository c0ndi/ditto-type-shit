/**
 * Updated on: Added dark theme as default and improved tech aesthetic layout - 12/09/2025
 */
import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "@/trpc/react";
import { TopNavigation } from "@/components/views/navigation/top-navigation";

export const metadata: Metadata = {
  title: "Ditto - Daily Photo Challenge",
  description: "Mine rewards through creative content. Daily photo challenges with AI validation and community engagement.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <body className="bg-background text-foreground antialiased">
        <SessionProvider>
          <TRPCReactProvider>
            <TopNavigation />
            <main className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
              {children}
            </main>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
