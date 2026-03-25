"use client";

import React, { useState } from "react";
import { FaSearch, FaGamepad, FaCreditCard, FaUserCog, FaWrench, FaChevronDown, FaHeadset, FaEnvelope, FaDiscord, FaServer, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const faqs = [
  {
    category: "Cuenta",
    question: "¿Cómo puedo crear una cuenta en CosmoX?",
    answer: "Para crear una cuenta, haz clic en el botón 'Registrarse' en la barra de navegación superior. Completa el formulario con tu email, nombre de usuario y contraseña segura. Recibirás un email de confirmación para activar tu cuenta."
  },
  {
    category: "Juegos",
    question: "¿Cómo descargo un juego tras comprarlo?",
    answer: "Una vez completada tu compra, navega hasta la sección 'Mi Librería'. Ahí verás todos tus juegos adquiridos; simplemente haz clic en el botón 'Instalar' y el cliente descargará los archivos."
  },
  {
    category: "Pagos",
    question: "¿Cómo puedo solicitar un reembolso?",
    answer: "Permitimos solicitar reembolsos dentro de los 14 días posteriores a la compra, siempre y cuando el tiempo de juego registrado sea menor a 2 horas. Accede a tu historial de compras y haz clic en 'Solicitar reembolso'."
  },
  {
    category: "Juegos",
    question: "¿Cómo publico mi propio juego en CosmoX?",
    answer: "Si eres desarrollador, ve a 'Mi Catálogo' y selecciona 'Nuevo Proyecto'. La plataforma te guiará para subir los binarios, metadatos y enviar a revisión."
  },
  {
    category: "Pagos",
    question: "¿Qué métodos de pago son aceptados?",
    answer: "Aceptamos tarjetas de crédito/débito internacionales, PayPal y métodos locales dependiendo de tu región operativa."
  },
  {
    category: "Técnico",
    question: "El juego se cierra inesperadamente, ¿qué hago?",
    answer: "Comprueba las actualizaciones de drivers. Verifica la integridad de los archivos del juego desde 'Mi Librería' > 'Opciones' > 'Verificar'. Si el problema persiste, contacta al desarrollador."
  }
];

const categories = [
  { id: "Todas", icon: <FaSearch className="text-xl" />, label: "Todas" },
  { id: "Juegos", icon: <FaGamepad className="text-xl" />, label: "Juegos" },
  { id: "Pagos", icon: <FaCreditCard className="text-xl" />, label: "Pagos" },
  { id: "Cuenta", icon: <FaUserCog className="text-xl" />, label: "Cuenta" },
  { id: "Técnico", icon: <FaWrench className="text-xl" />, label: "Técnico" },
];

const contactOptions = [
  { icon: <FaHeadset />, title: "Chat en Vivo", desc: "Soporte en tiempo real (Lun-Vie)", action: "Iniciar chat", color: "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:shadow-[0_0_15px_#3b82f640]" },
  { icon: <FaEnvelope />, title: "Soporte por Email", desc: "Respuesta garantizada en 24h.", action: "Enviar ticket", color: "bg-primary/10 text-primary border-primary/30 hover:shadow-[0_0_15px_#ff336640]" },
  { icon: <FaDiscord />, title: "Comunidad Discord", desc: "Únete y habla con jugadores.", action: "Unirse ahora", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:shadow-[0_0_15px_#6366f140]" },
];

const AyudaApp = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");

  const filteredFaqs = faqs.filter(
    (faq) => {
      const matchSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === "Todas" || faq.category === activeCategory;
      return matchSearch && matchCategory;
    }
  );

  return (
    <div className="min-h-screen text-white pb-20">
      {/* Dynamic Hero Layout */}
      <div className="relative bg-subdeep/80 border-b border-gray-800/80 pt-20 pb-24 px-6 mb-12 overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-deep to-subdeep -z-10"></div>
        <div className="absolute inset-0 bg-[url('/icons/grid-pattern.svg')] opacity-10 -z-10"></div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-center tracking-tight">
          Centro de <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-500">Ayuda</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl text-center mb-10">
          Estamos aquí para apoyarte. Encuentra soluciones rápidas, manuales y contáctanos.
        </p>
        
        <div className="w-full max-w-2xl relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
            <FaSearch className="text-2xl" />
          </div>
          <input
            type="text"
            placeholder="¿En qué te podemos ayudar? (Ej. reembolsos, descargar...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-deep/80 backdrop-blur-md border border-gray-700 rounded-full py-5 pl-16 pr-8 text-lg text-white placeholder-gray-500 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setOpenFaq(null); }}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold transition-all border shadow-lg ${
                activeCategory === cat.id 
                ? "bg-primary text-white border-primary shadow-primary/30 scale-[1.03]" 
                : "bg-subdeep text-gray-400 border-gray-800 hover:bg-gray-800/80 hover:text-white"
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <FaCheckCircle className="text-3xl text-primary" />
              <h2 className="text-3xl font-bold">Preguntas Frecuentes</h2>
            </div>

            <div className="space-y-4 min-h-[400px]">
              {filteredFaqs.length === 0 ? (
                <div className="bg-subdeep/50 border border-gray-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center h-64">
                  <FaExclamationTriangle className="text-5xl text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-300">No encontramos resultados</h3>
                  <p className="text-gray-500 mt-2">Intenta usar otros términos de búsqueda u otra categoría.</p>
                </div>
              ) : (
                filteredFaqs.map((faq, i) => (
                  <div 
                    key={i} 
                    className={`bg-subdeep border transition-all duration-300 rounded-2xl overflow-hidden ${openFaq === i ? 'border-primary/50 shadow-[0_0_15px_rgba(255,51,102,0.15)]' : 'border-gray-800/60 hover:border-gray-700'}`}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                      <div className="flex flex-col pr-6">
                         <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1">{faq.category}</span>
                         <span className={`text-lg font-medium transition-colors ${openFaq === i ? 'text-white' : 'text-gray-300'}`}>
                           {faq.question}
                         </span>
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-deep border transition-all shrink-0 ${openFaq === i ? 'border-primary fill-primary text-primary rotate-180' : 'border-gray-700 text-gray-400'}`}>
                        <FaChevronDown />
                      </div>
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-gray-800/60 mt-2">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-subdeep border border-gray-800/60 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <FaHeadset className="text-primary text-2xl" /> ¿Necesitas más ayuda?
              </h3>
              <div className="space-y-4">
                {contactOptions.map((opt, i) => (
                  <div key={i} className={`p-5 rounded-2xl border flex flex-col gap-3 transition-transform hover:-translate-y-1 cursor-pointer ${opt.color}`}>
                    <div className="text-3xl">{opt.icon}</div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{opt.title}</h4>
                      <p className="text-sm mt-1 opacity-80">{opt.desc}</p>
                    </div>
                    <button className="mt-2 text-sm font-bold uppercase tracking-wider self-start flex items-center gap-2 hover:underline">
                      {opt.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-subdeep border border-gray-800/60 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <FaServer className="text-gray-400 text-2xl" /> Estado del Sistema
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-deep rounded-xl border border-green-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                    <span className="font-medium text-gray-300">Servidores Compras</span>
                  </div>
                  <span className="text-green-400 text-sm font-bold">Óptimo</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-deep rounded-xl border border-green-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />
                    <span className="font-medium text-gray-300">Descargas / Servidor</span>
                  </div>
                  <span className="text-green-400 text-sm font-bold">Sin carga</span>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-6">Sistema monitorizado en tiempo real</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AyudaApp;