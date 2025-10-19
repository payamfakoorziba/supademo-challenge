import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import MobileMenu from "@/components/layout/mobile-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Supademo Challenge",
  description: "Submission by Payam Fakoorziba",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overscroll-none">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-dvh sm:h-screen relative bg-neutral-100">
          <Sidebar />
          <MobileMenu className="absolute top-4 left-4" />
          <main className="flex-1 h-full md:p-3 md:pl-0">
            <div className="bg-white rounded-xl h-full">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
