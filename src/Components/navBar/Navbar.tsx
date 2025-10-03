'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiUser} from 'react-icons/fi';
import Image from 'next/image';

const Navbar = () => {
    const [mobileMenuOpen] = useState(false);

    return (
        <header className={`bg-[#0D171F] shadow-sm ${mobileMenuOpen ? 'relative' : 'sticky top-0 z-40'}`}>
            <div className="container mx-auto px-4 sm:px-6">
                {/* Desktop Navbar */}
                <div className="hidden md:flex items-center justify-between py-3">
                    <div className='flex items-center'>
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md mr-4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Image width={15} height={15} alt='setting' src={'setting-2.svg'} />
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex space-x-8 ml-6">
                            <Link href="/descubrir" className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                Descubrir
                            </Link>
                            <Link href="/noticia" className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                Noticias
                            </Link>
                        </nav>
                    </div>
                    
                    {/* User Actions */}
                    <div className="flex items-center gap-6">
                        <div className='flex gap-4'>
                            <button className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                                <Image width={15} height={15} alt='bag' src={'bag.svg'} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                                <Image width={15} height={15} alt='translate' src={'translate.svg'} />
                            </button>
                        </div>

                        <Link
                            href="/login"
                            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-3xl shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            <FiUser className="mr-2" />
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-gray-400">INVITADO</span>
                                <span className="text-white font-medium hover:text-blue-400 transition-colors">
                                    Log in
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Mobile Navbar */}
                <div className="md:hidden flex items-center justify-between py-6 px-6 bg-deep rounded-3xl">
                {/* Barra de búsqueda y configuración */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" size={30} />
                    </div>
                    <input
                    type="text"
                    placeholder="  Buscar..."
                    className="block w-full pl-10 pr-14 py-2 border border-gray-300 rounded-md leading-5 bg-deep placeholder-gray-500 focus:outline-none  sm:text-sm border-none"
                    />
                    <button
                    onClick={() => console.log('Abrir configuración')}
                    className="absolute inset-y-0 right-0  flex items-center"
                    >
                    <Image width={  80} height={70} alt="setting" src="setting-2.svg" />
                    </button>
                </div>
                </div>

            </div>
        </header>
    );
};

export default Navbar;
