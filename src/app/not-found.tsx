"use client";

import React from "react";
import NavBar404 from "../Components/navBar404/navBar404"
import Footer404 from "../Components/footer404/footer404"



const NotFoundPage: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen bg-black text-white flex flex-col">
      <NavBar404/>

      {/* Contenido principal */}
      <div 
        className="flex-grow flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('/404.jpg')` }} // <- ruta relativa a /public
      >
        <h1 className="text-4xl md:text-3xl font-bold text-center drop-shadow-lg mt-40">
          NO SE ENCONTRO VIDA INTELIGENTE
        </h1>
      </div>

      <Footer404/>
    </div>
  );
};

export default NotFoundPage;
