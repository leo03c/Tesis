'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';
import Image from 'next/image';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile toggle button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Sidebar */}
            <div
                className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:translate-x-0 fixed h-[95%] w-64 rounded-md bg-gray-800 text-white p-4 
                    left-5 top-5 transition-transform duration-300 z-40 flex flex-col  `}
            >
                {/* Top content */}
                <div>
                    <div className="mb-8 p-4">
                        <Image width={205} height={51} alt='logo' src={'logo.svg'} className="text-2xl font-bold" />
                    </div>

                    <nav className="space-y-2">
                        <SidebarItemImage title="TIENDA DE JUEGOS" onClick={() => setIsOpen(false)} icon='game.svg' />
                        <SidebarItemImage title="CATEGORÍAS" onClick={() => setIsOpen(false)} icon='category.svg' />
                        <SidebarItemImage title="MI CATALOGO" onClick={() => setIsOpen(false)} icon='code-circle.svg' />
                        <SidebarItemImage title="ME GUSTAN" onClick={() => setIsOpen(false)} icon='heart.svg' />
                        <SidebarItemImage title="MI LIBRERIA" onClick={() => setIsOpen(false)} icon='gameboy.svg' />
                        <SidebarItemImage title="SIGUIENDO" onClick={() => setIsOpen(false)} icon='user-octagon.svg' />

                    </nav>
                </div>

                {/* Bottom content */}
                <div className="mt-auto mb-4">
                    <nav className="space-y-2">
                        <SidebarItemImage title="CONFIGURACIÓN" onClick={() => setIsOpen(false)} icon='setting.svg' />
                        <SidebarItemImage title="AYUDA" onClick={() => setIsOpen(false)} icon='message-question.svg' />
                    </nav>
                </div>
            </div>
        </>
    );
};

const SidebarItemImage = ({ title, onClick, icon }: { title: string; onClick?: () => void; icon: string }) => {
    return (
        <Link href={`/${title.toLowerCase()}`} passHref>
            <div
                className="p-3 hover:bg-gray-700 rounded cursor-pointer transition-colors inline-flex justify-between items-center gap-2"
                onClick={onClick}
            >
                <Image width={20} height={20} alt='icon' src={icon} />
                {title}
            </div>
        </Link>
    );
};

export default Sidebar;