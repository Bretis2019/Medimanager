import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import { Libre_Franklin } from 'next/font/google'
import { Chivo } from 'next/font/google'
import "./globals.css";
import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const libre_franklin = Libre_Franklin({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-libre-franklin',
})

const chivo = Chivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-chivo',
})

export const metadata: Metadata = {
  title: "MediManage",
  description: "Medical office management service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <link rel="icon" href="/favicon.ico" sizes="any" />
    </head>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          libre_franklin.variable,
          chivo.variable
      )}>{children}</body>
    </html>
  );
}
