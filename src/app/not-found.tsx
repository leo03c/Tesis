"use client";

import React from "react";
import NavBar404 from "../Components/navBar404/navBar404";
import Footer404 from "../Components/footer404/footer404";
import { useRouter } from "next/navigation";

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Header fijo */}
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar404 />
      </div>

      {/* Contenido principal */}
      <div
        className="flex flex-col items-center justify-center bg-center bg-cover h-screen px-4"
        style={{ backgroundImage: `url('/404.jpg')` }}
      >
        <h1 className="text-4xl md:text-3xl font-bold text-center drop-shadow-lg mt-62">
          NO SE ENCONTRÓ VIDA INTELIGENTE
        </h1>

        <button
          onClick={handleGoHome}
          className="mt-8 px-44  py-3 bg-primary text-text font-primary text-lg rounded-xl hover:bg-subprimary transition"
        >
          Volver al inicio
        </button>
      </div>

      {/* Footer fijo */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <Footer404 />
      </div>
    </div>
  );
};

export default NotFoundPage;
