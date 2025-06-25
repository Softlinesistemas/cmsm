import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "./client-providers"; // <-- Aqui você vai importar o novo componente
import SessionWrapper from "@/components/SessionWrapper";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CMSM",
  description: "COLÉGIO MILITAR SANTA MARIA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionWrapper>
          <ClientProviders>
              {children}
          </ClientProviders>
        </SessionWrapper>
      </body>
    </html>
  );
}
