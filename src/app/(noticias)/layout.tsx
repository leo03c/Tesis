import type { Metadata } from "next";
import Navbar from "@/Components/navBar/Navbar";
import Sidebar from "@/Components/sideBar/Sidebar";
import "@/app/globals.css";
import Footer from "@/Components/footer/Footer";

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
    

  <div className="min-h-screen flex flex-col md:flex-row bg-dark">
  {/* ====== Sidebar Escritorio (sticky) ====== */}
  <div className="hidden md:block w-64 sticky top-0 h-screen">
    <Sidebar />
  </div>

  {/* ====== Contenido principal ====== */}
  <div className="flex-1 flex flex-col">
    {/* ====== Mobile Sidebar + Navbar ====== */}
    <div className="md:hidden">
      <div className="p-6">
        <Sidebar />
      </div>
      <div className="p-2 mb-3">
        <Navbar />
      </div>
    </div>

    {/* ====== Desktop Navbar (sticky) ====== */}
    <div className="hidden md:block sticky top-0 z-40 bg-dark">
      <Navbar />
    </div>

    {/* ====== Contenido principal ====== */}
    <main className="flex-1 p-2">
      {children}
    </main>

    {/* ====== Footer ====== */}
    <div className="p-2">
      <Footer />
    </div>
  </div>
</div>

  );
}
