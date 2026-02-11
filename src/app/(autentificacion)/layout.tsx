import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/app/globals.css";
import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: 'COSMOX - Autenticación',
  description: 'Inicia sesión o regístrate en COSMOX',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <Providers>
        <main>
          {children}
        </main>
      </Providers>
    </div>
  );
}

