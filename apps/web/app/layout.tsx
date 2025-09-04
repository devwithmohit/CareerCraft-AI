// 'use client'
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
// import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import React from "react";
// const pathname = usePathname()
//  const hideFooter = pathname === "/(career)/resume-analysis";
// Configure fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
export const metadata: Metadata = {
  title: "CareerCraft AI - Intelligent Resume & Career Platform",
  description:
    "AI-powered resume optimization, job matching, and career intelligence platform",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className={inter.className}>
        <ThemeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

// 🧱 4. Root Layout Component
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {

// This is the main layout function.

// All app pages are rendered inside this children prop.

// Next.js automatically uses this file to wrap all routes.
