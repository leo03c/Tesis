'use client';

import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import SidebarItem from './SidebarItem';
import Image from 'next/image';
import Link from 'next/link';

const SidebarModal = ({ onClose }: { onClose: () => void }) => {
    // Evitar scroll del body cuando el modal está abierto
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Cerrar al teclear escape (accesibilidad)
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <>
            {/* Backdrop con Blur y Click To Close */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Principal */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Menú de navegación principal"
                className="fixed top-0 left-0 bottom-0 z-[101] w-[80%] max-w-[300px] bg-dark border-r border-white/5 shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-left duration-300"
            >
                {/* Cabecera del Menu Lateral */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <Link href="/" onClick={onClose} className="flex items-center hover:opacity-80 transition-opacity">
                        <Image width={150} height={38} alt="Logo CosmoX" src="/logo.svg" priority />
                    </Link>
                    <button
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary"
                        onClick={onClose}
                        aria-label="Cerrar menú"
                    >
                        <FiX size={22} />
                    </button>
                </div>

                {/* Navegacion Principal */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
                    
                    <div className="px-4 pb-2 pt-2">
                        <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest">Descubrir</p>
                    </div>
                    <nav className="space-y-1" aria-label="Navegación primaria">
                        <SidebarItem title="TIENDA DE JUEGOS" icon='/game.svg' onClick={onClose} />
                        <SidebarItem title="CATEGORÍAS" icon='/category.svg' onClick={onClose} />
                        <SidebarItem title="MI CATALOGO" icon='/code-circle.svg' onClick={onClose} />
                    </nav>

                    <div className="px-4 pb-2 pt-6">
                        <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest">Tu Actividad</p>
                    </div>
                    <nav className="space-y-1" aria-label="Navegación secundaria">
                        <SidebarItem title="ME GUSTAN" icon='/heart.svg' onClick={onClose} />
                        <SidebarItem title="LISTA DE DESEOS" icon='/heart.svg' onClick={onClose} />
                        <SidebarItem title="MI LIBRERIA" icon='/gameboy.svg' onClick={onClose} />
                        <SidebarItem title="SIGUIENDO" icon='/user-octagon.svg' onClick={onClose} />
                        <SidebarItem title="CONFIGURACIÓN" icon='/setting.svg' onClick={onClose} />
                        <SidebarItem title="AYUDA" icon='/message-question.svg' onClick={onClose} />
                    </nav>

                </div>
            </div>
        </>
    );
};

export default SidebarModal;
