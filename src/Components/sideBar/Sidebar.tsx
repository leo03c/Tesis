'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SidebarModal from './SidebarModal';
import SidebarItem from './SidebarItem';

const mas = "/icons/mas.svg";
const notf = "/icons/notf.svg";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* ===== Desktop sidebar ===== */}
            <div className="hidden md:block w-64 bg-gray-800 text-white p-4 h-[calc(100vh-1rem)] rounded-md my-2">
                {/* Logo */}
                <div className="mb-8 p-4">
                    <Image 
                        width={205} 
                        height={51} 
                        alt='logo' 
                        src='/logo.svg' 
                        className="text-2xl font-bold"
                        priority
                    />
                </div>

                {/* Navegación */}
                <nav className="space-y-2">
                    <SidebarItem title="TIENDA DE JUEGOS" icon='/game.svg' />
                    <SidebarItem title="CATEGORÍAS" icon='/category.svg' />
                    <SidebarItem title="MI CATALOGO" icon='/code-circle.svg' />
                    <SidebarItem title="ME GUSTAN" icon='/heart.svg' />
                    <SidebarItem title="MI LIBRERIA" icon='/gameboy.svg' />
                    <SidebarItem title="SIGUIENDO" icon='/user-octagon.svg' />
                </nav>

                <div className="mt-6 border-t border-gray-600 pt-4 space-y-2">
                    <SidebarItem title="CONFIGURACIÓN" icon='/setting.svg' />
                    <SidebarItem title="AYUDA" icon='/message-question.svg' />
                </div>
            </div>

            {/* ===== Mobile header con botón ===== */}
            <div className="md:hidden flex items-center justify-between p-6 bg-deep rounded-3xl">
                {/* Menu Icon */}
                <button
                    className=" bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open sidebar"
                >
                    <Image width={44} height={44} alt="Abrir menú" src={mas} />
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 text-white font-bold text-lg">
                    <Image width={160} height={40} alt="Logo" src="/logo.svg" />
                </Link>

                {/* Notificación */}
                <button className=" bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <Image width={44} height={44} alt="Notificación" src={notf} />
                </button>
            </div>

            {/* Modal del sidebar solo en mobile */}
            {isOpen && <SidebarModal onClose={() => setIsOpen(false)} />}
        </>
    );
};

export default Sidebar;
