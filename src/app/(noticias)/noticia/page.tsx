"use client";

import Image from "next/image";
import React from "react";

export default function NoticiasPage() {
  const banner = "/noti1.jpg";
  const banner2 = "/noti2.jpg";

  return (
    <main className="w-full min-h-screen px-6 py-10 font-[Nunito_Sans] bg-[var(--color-dark)] text-[var(--color-text)]">
      
      {/* HERO - Banner principal */}
      <div className="relative w-full h-96 md:h-[550px] rounded-2xl overflow-hidden">
        <Image 
          src={banner}
          alt="Imagen del Banner"
          fill
          className="object-cover block"
        />
      </div>

      {/* CONTENIDO */}
      <section className="mt-12   space-y-10">

        {/* Introducción */}
        <p className="text-2xl leading-relaxed font-bold text-text font-primary">
          Hazte con gangas, juegos gratis y mucho más: la guía del comprador de MEGA Sale de Epic Games Store
        </p>
        <p className="font-primary text-m text-texInactivo">¡Bienvenidos a la MEGA Venta Épica 2025! ¡Sigue leyendo para descubrir fantásticos ahorros de hasta el 75%, juegos gratis semanales, emocionantes obsequios destacados y recompensas épicas aumentadas al 20%!

        </p>
        {/* Sección 1 */}
        <div className="space-y-4">
          <h2 className="text-xl  font-primary font-bold text-text">¿Qué es la MEGA Oferta de Epic Games Store?</h2>
          <p className="font-primary text-m text-texInactivo">
            La MEGA Oferta de Epic Games Store ofrece fantásticos ahorros en una variedad de juegos geniales. Es la época del año en la que profundizamos en la amplia y expansiva biblioteca de Epic Game Store para ofrecer descuentos sustanciales en todo, desde oscuras gemas independientes hasta los éxitos triple A que conoces tan bien. ¡Desplázate hacia afuera! ¡Te esperan ahorros de hasta el 75%!
          </p>
        </div>

        {/* Sección 2 */}
        <div className="space-y-4">
          <h2 className="text-xl  font-primary font-bold text-text">¿Cuándo es la MEGA Venta de Epic Games Store 2025?</h2>
          <p className="font-primary text-texInactivo text-m">
            Este año, MEGA Sale se extiende desde hoy, 15 de mayo a las 11 a. m. ET / 4 p. m. BST / 5 p. m. CEST hasta el 12 de junio a las 11 a. m. ET / 4 p. m. BST / 5 p. m. CEST.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl  font-primary font-bold text-text">¿Se potenciarán las recompensas épicas durante las mega rebajas de 2025?</h2>
          <p className="font-primary text-texInactivo text-m">
            ¡Sí! Las recompensas de Epic aumentan al 20% al finalizar la compra utilizando el sistema de pago de Epic en cada compra durante este período promocional que finaliza el 31 de agosto de 2025. Además, obtén permanentemente un 20% de reembolso en compras en Fortnite, Rocket League y Fall Guys cuando uses el sistema de pago de Epic. Se aplican los términos y condiciones de Epic Rewards.
          </p>
        </div>

        {/* Imagen intermedia */}
        <div className="relative w-full h-96 md:h-[150px]  overflow-hidden">
        <Image 
          src={banner2}
          alt="Imagen del Banner"
          fill
          className="object-cover block"
        />
      </div>

        {/* Sección 3 */}
        <div className="space-y-4">
          <h2 className="text-xl  font-primary font-bold text-text">¿Qué se incluye en la MEGA oferta de Epic Games 2025?</h2>
          <p className="font-primary text-texInactivo text-m">
            La MEGA Venta 2025 incluye descuentos en una variedad de títulos excelentes, así como contenido de expansión digital y cosméticos. Hemos seleccionado algunas ofertas fantásticas de la venta para que las considere.
          </p>
        </div>
      </section>
    </main>
  );
}
