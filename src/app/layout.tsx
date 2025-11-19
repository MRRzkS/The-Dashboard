import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";

// The workhorse font for data
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// The headline font for the Mafia aesthetic
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

export const metadata: Metadata = {
  title: "Consigliere Dashboard",
  description: "Operations and Focus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        inter.variable, 
        cinzel.variable, 
        "bg-mafia-base text-gray-200 antialiased"
      )}>
        {children}
      </body>
    </html>
  );
}