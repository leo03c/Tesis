"use client";

import React, { useState } from "react";

const faqs = [
  {
    question: "¿Cómo puedo crear una cuenta en CosmoX?",
    answer: "Para crear una cuenta, haz clic en el botón 'Registrarse' en la página principal. Completa el formulario con tu email, nombre de usuario y contraseña. Recibirás un email de confirmación para activar tu cuenta."
  },
  {
    question: "¿Cómo descargo un juego?",
    answer: "Una vez que hayas comprado un juego, ve a 'Mi Librería', busca el juego y haz clic en el botón 'Instalar'. El juego se descargará automáticamente en tu dispositivo."
  },
  {
    question: "¿Cómo puedo solicitar un reembolso?",
    answer: "Puedes solicitar un reembolso dentro de los 14 días posteriores a la compra si has jugado menos de 2 horas. Ve a tu historial de compras, selecciona el juego y haz clic en 'Solicitar reembolso'."
  },
  {
    question: "¿Cómo publico mi propio juego en CosmoX?",
    answer: "Ve a 'Mi Catálogo' y haz clic en 'Nuevo Proyecto'. Sigue las instrucciones para subir tu juego, agregar imágenes, descripción y configurar el precio. Nuestro equipo revisará tu juego antes de publicarlo."
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos tarjetas de crédito/débito (Visa, MasterCard, American Express), PayPal, y en algunos países transferencias bancarias y pagos locales."
  },
];

const contactOptions = [
  { icon: "💬", title: "Chat en vivo", desc: "Habla con nuestro equipo en tiempo real", action: "Iniciar chat" },
  { icon: "📧", title: "Email", desc: "soporte@cosmox.com", action: "Enviar email" },
  { icon: "📱", title: "Redes sociales", desc: "@CosmoXGames en todas las plataformas", action: "Seguir" },
];

const AyudaApp = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Centro de Ayuda</h1>
        <p className="text-texInactivo">¿En qué podemos ayudarte hoy?</p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar en el centro de ayuda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-deep border border-categorico rounded-xl px-5 py-4 pl-12 text-white placeholder-texInactivo focus:border-primary focus:outline-none"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-texInactivo"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: "🎮", label: "Juegos", link: "#" },
          { icon: "💳", label: "Pagos", link: "#" },
          { icon: "👤", label: "Cuenta", link: "#" },
          { icon: "🛠️", label: "Técnico", link: "#" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-deep hover:bg-subdeep rounded-2xl p-6 text-center cursor-pointer transition"
          >
            <span className="text-4xl mb-3 block">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div className="rounded-3xl bg-deep py-10 px-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <p className="text-texInactivo text-center py-8">
              No se encontraron resultados para tu búsqueda
            </p>
          ) : (
            filteredFaqs.map((faq, i) => (
              <div key={i} className="bg-subdeep rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-categorico transition"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-texInactivo flex-shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-texInactivo">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-3xl bg-deep py-10 px-6">
        <h2 className="text-xl font-semibold mb-6">¿Necesitas más ayuda?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactOptions.map((option, i) => (
            <div key={i} className="bg-subdeep rounded-xl p-6 text-center">
              <span className="text-4xl mb-4 block">{option.icon}</span>
              <h3 className="font-semibold mb-2">{option.title}</h3>
              <p className="text-texInactivo text-sm mb-4">{option.desc}</p>
              <button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-subprimary transition">
                {option.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="mt-8 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-4">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        <div>
          <p className="font-medium text-green-400">Todos los sistemas operativos</p>
          <p className="text-texInactivo text-sm">Última actualización: hace 5 minutos</p>
        </div>
      </div>
    </div>
  );
};

export default AyudaApp;
