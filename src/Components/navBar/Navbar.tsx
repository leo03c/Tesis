'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiUser, FiMenu, FiX } from 'react-icons/fi';
import Image from 'next/image';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className={mobileMenuOpen ? "bg-transparent shadow-sm" : "fixed  z-50 w-[83%] bg-transparent ml-64 p-5"}>
            <div className="container mx-auto px-4 sm:px-6 ">
                {/* Desktop Navbar */}
                <div className="hidden md:flex items-center justify-between py-3">
                    <div className='flex'>
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

                        {/* Navigation Sections */}
                        <nav className="flex space-x-8">
                            <Link href="/descubrir" className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white">
                                Descubrir
                            </Link>
                            <Link href="/noticias" className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white">
                                Noticias
                            </Link>
                        </nav>
                    </div>
                    {/* Login Button */}
                    <div className="flex ml-4 justify-between items-center gap-14">
                        <div className='flex justify-between items-center gap-10'>
                            <div className="w-14 h-14 flex border border-gray-400 rounded-lg items-center justify-center bg-gray-800">
                                <Image width={15} height={15} alt='bag' src={'bag.svg'} />
                            </div>
                            <div className="w-14 h-14 flex border border-gray-400 rounded-lg items-center justify-center bg-gray-800">
                                <Image width={15} height={15} alt='translate' src={'translate.svg'} />
                            </div>
                        </div>

                        <Link
                            href="/login"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-3xl shadow-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <FiUser className="mr-2" />
                            <div className="flex flex-col items-start gap-1 ">
                                <div className="text-sm text-gray-400">
                                    INVITADO
                                </div>
                                <button className="text-white font-medium font-montserrat hover:text-blue-600 transition-colors">
                                    Log in
                                </button>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Mobile Navbar */}
                <div className="md:hidden flex items-center justify-between py-3 ml-64">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-md text-white hover:bg-gray-400"
                    >
                        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                    {/* Login Button (Mobile) */}
                    <Link
                        href="/login"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900"
                    >
                        <FiUser className="mr-1" />
                        Login
                    </Link>
                </div>

                {/* Mobile Menu Content */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-3">
                        <div className="pt-2 pb-3 space-y-1">
                            <Link
                                href="/descubrir"
                                className="block px-3 py-2 text-base font-medium text-gray-400 hover:text-white hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Descubrir
                            </Link>
                            <Link
                                href="/noticias"
                                className="block px-3 py-2 text-base font-medium text-gray-400 hover:text-white hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Noticias
                            </Link>
                        </div>
                        <div className="mt-2">
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
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;