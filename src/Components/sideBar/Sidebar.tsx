'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';
import Image from 'next/image';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile toggle button - ahora relativo */}
            <button
                className="md:hidden p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle sidebar"
            >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Sidebar - ahora con posición sticky */}
            <aside
                className={`${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
                    sticky top-0 h-[calc(100vh-1rem)] w-64 rounded-md bg-gray-800 text-white p-4 
                    transition-transform duration-300 flex flex-col z-40 my-2`}
            >
                {/* Top content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="mb-8 p-4">
                        <Image 
                            width={205} 
                            height={51} 
                            alt='logo' 
                            src={'logo.svg'} 
                            className="text-2xl font-bold"
                            priority
                        />
                    </div>

                    <nav className="space-y-2">
                        <SidebarItem title="TIENDA DE JUEGOS" icon='game.svg' />
                        <SidebarItem title="CATEGORÍAS" icon='category.svg' />
                        <SidebarItem title="MI CATALOGO" icon='code-circle.svg' />
                        <SidebarItem title="ME GUSTAN" icon='heart.svg' />
                        <SidebarItem title="MI LIBRERIA" icon='gameboy.svg' />
                        <SidebarItem title="SIGUIENDO" icon='user-octagon.svg' />
                    </nav>
                </div>

                {/* Bottom content */}
                <div className="mt-auto">
                    <nav className="space-y-2">
                        <SidebarItem title="CONFIGURACIÓN" icon='setting.svg' />
                        <SidebarItem title="AYUDA" icon='message-question.svg' />
                    </nav>
                </div>
            </aside>
        </>
    );
};

const SidebarItem = ({ title, icon }: { title: string; icon: string }) => {
    const path = `/${title.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
        <Link 
            href={path}
            className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors"
        >
            <Image 
                width={20} 
                height={20} 
                alt={title} 
                src={icon} 
                className="flex-shrink-0"
            />
            <span className="whitespace-nowrap">{title}</span>
        </Link>
    );
};

export default Sidebar;