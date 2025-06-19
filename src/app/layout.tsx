import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import Navbar from "@/Components/navBar/Navbar";
// import Sidebar from "@/Components/sideBar/Sidebar";
import "./globals.css";
// import Footer from "@/Components/footer/Footer";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0D171F]`}
      >
        {/* <Navbar /> */}
        {/* <Sidebar /> */}
        <main
          // className="pt-[130px] md:ml-72 p-5 transition-all duration-300"
        >
          {children}
          {/* <Footer /> */}
        </main>
      </body>
    </html>
  );
}

