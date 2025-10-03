"use client";

import React from "react";
import { Search, Rocket } from "lucide-react"; // ← Importamos iconos

const NavBar404: React.FC = () => {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-dark absolute top-0 z-50">
      
      {/* Logo + Icono */}
      <div className="flex items-center space-x-2">
        <Rocket className="text-white w-6 h-6" /> {/* ← Icono al lado de COSMOX */}
        <div className="text-white font-bold text-xl">COSMOX</div>
      </div>

      {/* Barra de búsqueda centrada */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none text-center"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Espaciador derecho para balancear */}
      <div className="w-20"></div>

    </nav>
  );
};

export default NavBar404;
