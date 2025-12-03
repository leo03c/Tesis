"use client";

import React from "react";
import Image from "next/image";

const NoticiasPage: React.FC = () => {

const not1 ="/noticia1.jpg"
const not2 ="/noticia2.jpg"
const pic1 ="/pic1.jpg"
const pic2 ="/pic2.jpg"
const pic3 ="/pic3.jpg"

const noticias = [
  {
    id: 1,
    imagen: "/pic1.jpg",
    titulo: "Guía de iniciación de Fatal Fury: City of the Wolves",
    descripcion:
      "Si no sois entendidos, quizá no alcancéis a entender la magnitud de Fatal Fury: City of the Wolves ni por qué hay tanta expectación ante el inminente regreso de esta saga de SNK.",
    boton: "LEER MÁS",
  },
  {
    id: 2,
    imagen: "/pic2.jpg",
    titulo: "Terror japonés",
    descripcion:
      "El último capítulo de la historia original del universo de Dead by Daylight, Doomed Course, recuerda más a las historias de piratas (en parte por su isla, la Adiestradora Canina)...",
    boton: "LEER MÁS",
  },
  {
    id: 3,
    imagen: "/pic3.jpg",
    titulo: "Guía de Assassin's Creed Shadows",
    descripcion:
      "Assassin’s Creed Shadows lleva a los jugadores a un viaje inolvidable por un Japón en guerra durante el período Sengoku. Os enfrentaréis a una enorme cantidad de enemigos...",
    boton: "LEER MÁS",
  },
  {
    id: 4,
    imagen: "/pic1.jpg",
    titulo: "Guía de iniciación de Fatal Fury: City of the Wolves",
    descripcion:
      "Si no sois entendidos, quizá no alcancéis a entender la magnitud de Fatal Fury: City of the Wolves ni por qué hay tanta expectación ante el inminente regreso de esta saga de SNK.",
    boton: "LEER MÁS",
  },
  {
    id: 5,
    imagen: "/pic2.jpg",
    titulo: "Terror japonés",
    descripcion:
      "El último capítulo de la historia original del universo de Dead by Daylight, Doomed Course, recuerda más a las historias de piratas (en parte por su isla, la Adiestradora Canina)...",
    boton: "LEER MÁS",
  },
  {
    id: 6,
    imagen: "/pic3.jpg",
    titulo: "Guía de Assassin's Creed Shadows",
    descripcion:
      "Assassin’s Creed Shadows lleva a los jugadores a un viaje inolvidable por un Japón en guerra durante el período Sengoku. Os enfrentaréis a una enorme cantidad de enemigos...",
    boton: "LEER MÁS",
  },
  {
    id: 7,
    imagen: "/pic1.jpg",
    titulo: "Guía de iniciación de Fatal Fury: City of the Wolves",
    descripcion:
      "Si no sois entendidos, quizá no alcancéis a entender la magnitud de Fatal Fury: City of the Wolves ni por qué hay tanta expectación ante el inminente regreso de esta saga de SNK.",
    boton: "LEER MÁS",
  },
  {
    id: 8,
    imagen: "/pic2.jpg",
    titulo: "Terror japonés",
    descripcion:
      "El último capítulo de la historia original del universo de Dead by Daylight, Doomed Course, recuerda más a las historias de piratas (en parte por su isla, la Adiestradora Canina)...",
    boton: "LEER MÁS",
  },
  {
    id: 9,
    imagen: "/pic3.jpg",
    titulo: "Guía de Assassin's Creed Shadows",
    descripcion:
      "Assassin’s Creed Shadows lleva a los jugadores a un viaje inolvidable por un Japón en guerra durante el período Sengoku. Os enfrentaréis a una enorme cantidad de enemigos...",
    boton: "LEER MÁS",
  },
];

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      {/* Hero de noticias */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="relative w-full h-60 md:h-72 rounded-xl overflow-hidden">
          <Image
            src={not1}
            alt="Noticia principal 1"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute bottom-0 left-0 w-full  p-4">
            <h2 className="text-lg font-bold text-text">
              Hazte con gangas, juegos gratis y mucho más...
            </h2>
            <button className="mt-2 px-4 py-2 bg-subdeep text-white rounded-md text-sm hover:bg-deep">
              Leer más
            </button>
          </div>
        </div>

        <div className="relative w-full h-60 md:h-72 rounded-xl overflow-hidden">
          <Image
            src={not2}
            alt="Noticia principal 2"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute bottom-0 left-0 w-full  p-4">
            <h2 className="text-lg font-bold text-text">
              PLAYERUNKNOWN revela cómo Prologue...
            </h2>
            <button className="mt-2 px-4 py-2 bg-subdeep text-white rounded-md text-sm hover:bg-deep">
              Leer más
            </button>
          </div>
        </div>
      </section>

      {/* Grid de noticias */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {noticias.map((noticia) => (
          <div
            key={noticia.id}
            className="bg-transparent rounded-xl overflow-hidden flex flex-col"
          >
            <div className="relative w-full h-40">
              <Image
                src={noticia.imagen}
                alt={noticia.titulo}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold font-primary text-text mb-2">{noticia.titulo}</h3>
              <p className="text-sm text-gray-300 flex-grow font-primary">
                {noticia.descripcion}
              </p>
              <button className="mt-4 px-6 py-3 bg-subdeep font-primary text-white rounded-2xl text-xs hover:deep self-start">
                {noticia.boton}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Paginación */}
      <section className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className="px-4 py-2 bg-subdeep text-white rounded-md hover:bg-blue-600"
          >
            {page}
          </button>
        ))}
      </section>
    </main>
  );
};

export default NoticiasPage;
