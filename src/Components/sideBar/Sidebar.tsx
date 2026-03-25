'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SidebarModal from './SidebarModal';
import SidebarItem from './SidebarItem';
import { useUser } from '@/contexts/UserContext';
import settingsService from '@/services/settingsService';

const mas = "/icons/mas.svg";
const notf = "/icons/notf.svg";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);

    React.useEffect(() => {
        const loadRole = async () => {
            if (!isAuthenticated) {
                setIsAdmin(false);
                return;
            }

            try {
                const profile = await settingsService.getSettings();
                const role = String(profile?.profile?.rol ?? '').toUpperCase();
                const hasAdminRole = role === 'ADMIN' || role === 'ADMINISTRADOR';
                const hasAdminFlags = Boolean(
                    profile?.profile?.es_administrador || profile?.is_staff || profile?.is_superuser
                );
                setIsAdmin(hasAdminRole || hasAdminFlags);
            } catch {
                setIsAdmin(false);
            }
        };

        loadRole();
    }, [isAuthenticated]);

    return (
        <>
            {/* ===== Desktop sidebar ===== */}
            <div className="hidden md:flex md:flex-col w-64 bg-gray-800 text-white p-4 h-[calc(100vh-1rem)] rounded-md my-2 overflow-hidden">
                {/* Logo */}
                <Link href="/" className="mb-4 px-2 pt-2 pb-3 shrink-0">
                    <Image 
                        width={205} 
                        height={51} 
                        alt='logo' 
                        src='/logo.svg' 
                        className="text-2xl font-bold"
                        priority
                    />
                </Link>

                {/* Navegación */}
                <nav className={`${isAdmin ? 'space-y-4' : 'space-y-2'} flex-1 overflow-y-auto pr-1 custom-scrollbar`}>
                    <SidebarItem title="TIENDA DE JUEGOS" icon='/game.svg' compact={isAdmin} />
                    <SidebarItem title="CATEGORÍAS" icon='/category.svg' compact={isAdmin} />
                    <SidebarItem title="MI CATALOGO" icon='/code-circle.svg' compact={isAdmin} />
                    <SidebarItem title="ME GUSTAN" icon='/heart.svg' compact={isAdmin} />
                    <SidebarItem title="MI LIBRERIA" icon='/gameboy.svg' compact={isAdmin} />
                    <SidebarItem title="SIGUIENDO" icon='/user-octagon.svg' compact={isAdmin} />
                    {isAdmin && <SidebarItem title="PANEL ADMIN" icon='/setting.svg' compact={isAdmin} />}
                     <SidebarItem title="CONFIGURACIÓN" icon='/setting.svg' compact={isAdmin} />
                    <SidebarItem title="AYUDA" icon='/message-question.svg' compact={isAdmin} />
                </nav>

                
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
