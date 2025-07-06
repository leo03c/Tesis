import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/Components/navBar/Navbar";
import Sidebar from "@/Components/sideBar/Sidebar";
import "@/app/globals.css";
import Footer from "@/Components/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'COSMOX - Tienda de Juegos',
  description: 'La mejor tienda de juegos digitales',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0D171F]`}>
        {/* Contenedor principal flex */}
        <div className="flex flex-col min-h-screen">
          {/* Fila superior con Sidebar y Navbar */}
          <div className="flex flex-row">
            {/* Sidebar que llega al top */}
            <div className="sticky top-0 h-screen">
              <Sidebar />
            </div>
            
            {/* Contenedor del contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Navbar al lado del Sidebar */}
              <div className="sticky top-0 z-10">
                <Navbar />
              </div>
              
              {/* Contenido principal */}
              <main className="flex-1">
                {children}
              </main>
              
              {/* Footer */}
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}