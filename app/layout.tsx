'use client'

import type { Metadata } from "next";
import localFont from "next/font/local";
import { usePathname } from 'next/navigation'
import "./globals.css";
import Navigation from "@/src/modules/layout/components/Navigation";
import Menu from "@/src/modules/layout/components/Menu";
import { WalletProvider } from "@/src/modules/auth/context/WalletContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const metadata: Metadata = {
  title: "DentLine",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  return ( 
    <html lang="en">
      <body className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center my-16">
        <WalletProvider>
          <Navigation/>
            {children}
          <Menu/>
        </WalletProvider>
      </body>
    </html>
  );
} 
