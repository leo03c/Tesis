"use client";
import React, { useRef } from "react";
import Image from "next/image";

const der = "/icons/derecha.svg";
const izq = "/icons/izquierda.svg";
const principal = "/principal.png";
const title = "/title.png";
const carr1 = "/carr1.png";
const carr2 = "/carr2.png";
const carr3 = "/carr3.png";
const carr4 = "/carr4.png";
const carr5 = "/carr5.png";
const apple = "/apple.svg";
const win = "/windows.svg";
const laT = "/laT.svg";
const star = "/icons/Star 5.svg";
const yt = "/yt.svg";

const Juego = () => {
  const carrImages = [carr1, carr2, carr3, carr4, carr5, carr1];
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
  if (scrollRef.current) {
    const scrollAmount = 140; // Asegura que un ítem completo se desplace
    scrollRef.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }  
};
const youtube = () => {
  window.open("https://www.youtube.com", "_blank");
};


  return (
    <div className="bg-dark text-white mb-4 rounded-3xl max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Imagen principal y galería */}
      <div className="md:col-span-2">
        {/* Encabezado */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">LEAGUE OF LEGENDS</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Image key={i} src={star} alt="Estrella" width={16} height={16} />
            ))}
            <span className="text-sm font-medium ml-1">5.0</span>
          </div>
        </div>

        {/* Imagen principal con botón */}
        <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-4">
          <Image
            src={principal}
            alt="Imagen principal del juego"
            fill
            className="object-cover"
          />
          <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-md text-sm flex items-center "
          onClick={()=> youtube()}>
            <Image src={yt} alt="youtube" width={16} height={16} className="me-2" />
            REPRODUCIR
          </button>
        </div>

        {/* Carrusel */}
        <div className="flex items-center gap-2">
          <button onClick={() => scroll("left")}>
            <Image src={izq} alt="izquierda" width={44} height={44} />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scroll-smooth no-scrollbar"
          >
            {carrImages.map((src, i) => (
              <div
                key={i}
                className="relative w-28 h-20 rounded-xl overflow-hidden border border-deep flex-shrink-0"
              >
                <Image src={src} alt={`Galería ${i}`} fill sizes="112px" className="object-cover" />
              </div>
            ))}
          </div>
          <button onClick={() => scroll("right")}>
            <Image src={der} alt="derecha" width={44} height={44} />
          </button>
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-300 mt-4">
          Conviértete en una leyenda. Encuentra a tu campeón, domina sus habilidades y supera
          a tus oponentes en una épica batalla de 5 contra 5 para destruir la base enemiga.
        </p>
      </div>

      {/* Información lateral */}
      <div className="space-y-4">
        <Image src={title} alt="League of Legends" width={180} height={60} />

        {/* Clasificación ESRB */}
        <div className="bg-transparent border border-deep rounded-xl p-4 text-sm">
          <div className="flex items-start gap-3">
            <Image src={laT} alt="Clasificación ESRB" width={40} height={40} />
            <p className="text-gray-300">
              Adolescente<br />
              Sangre, Violencia fantástica, Temas insinuantes leves, Consumo de alcohol y tabaco.
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Interacciones en línea no calificadas por la ESRB
          </p>
        </div>

        {/* Precio y botones */}
        <div className="text-sm">
          <p className="inline-block text-xs text-gray-400 mb-1 bg-subdeep px-2 py-0.5 rounded-md">JUEGO BASE</p>
          <p className="text-white font-semibold">GRATIS</p>
          <p className="text-xs text-gray-500 mb-4">
            Puede incluir compras dentro de la aplicación
          </p>

          <div className="space-y-2">
            <button className="w-full  bg-primary text-white py-3 rounded-lg font-bold text-sm shadow-md">
              DESCARGAR
            </button>
            <button className="w-full  bg-deep text-white  py-3 rounded-lg font-semibold text-sm">
              AÑADIR AL CARRO
            </button>
            <button className="w-full  bg-deep text-white  py-3 rounded-lg font-semibold text-sm">
              AÑADIR A LA LISTA DE DESEOS
            </button>
          </div>
        </div>

        {/* Detalles */}
        <div className="text-xs text-gray-400 space-y-1 pt-2">
          <p className="border-b border-deep py-1">
            <span className="text-white">DESARROLLADOR:</span> Riot Games
          </p>
          <p className="border-b border-deep py-1">
            <span className="text-white">EDITOR:</span> Riot Games
          </p>
          <p className="border-b border-deep py-1">
            <span className="text-white">FECHA DE ESTRENO:</span> 11/04/2021
          </p>
          <p className="flex items-center gap-2 border-b border-deep py-1">
            <span className="text-white">PLATAFORMA:</span>
            <Image src={win} alt="Windows" width={14} height={14} />
            <Image src={apple} alt="Apple" width={14} height={14} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Juego;
