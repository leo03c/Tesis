'use client';

import React from 'react';
import { FiX } from 'react-icons/fi';
import SidebarItem from './SidebarItem';

const SidebarModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed top-2 left-2 z-50 w-64 h-[calc(100vh-1rem)] bg-deep rounded-md p-4 shadow-lg overflow-y-auto">
            {/* Botón de cierre */}
            <button
                className="absolute top-4  lethf-4 p-2 bg-gray-700 rounded hover:bg-gray-600 transition"
                onClick={onClose}
            >
                <FiX size={24} />
            </button>

            {/* Logo */}
            <div className="mb-8 p-4">
                
            </div>

            {/* Navegación */}
            <nav className="space-y-2">
                <SidebarItem title="TIENDA DE JUEGOS" icon='/game.svg'/>
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
    );
};

export default SidebarModal;
