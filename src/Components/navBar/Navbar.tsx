'use client';

import { useState, useEffect, useRef } from 'react';
import { getGames, getTags } from '@/services/gamesService';
import type { Game, Tag } from '@/services/gamesService';
import Link from 'next/link';
import { FiBookmark, FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';

const Navbar = () => {
    const [mobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();

    // Debug
    useEffect(() => {
        console.log('Navbar Session:', session);
        console.log('Navbar Status:', status);
        console.log('Navbar User:', session?.user);
    }, [session, status]);

    // Estado para búsqueda y resultados
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loadingResults, setLoadingResults] = useState(false);
    const [gameResults, setGameResults] = useState<Game[]>([]);
    const [tagResults, setTagResults] = useState<Tag[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Búsqueda asíncrona debounced
    useEffect(() => {
        if (!search.trim()) {
            setGameResults([]);
            setTagResults([]);
            setShowModal(false);
            return;
        }
        setLoadingResults(true);
        const handler = setTimeout(async () => {
            try {
                const [gamesRes, tagsRes] = await Promise.all([
                    getGames({ search, page_size: 5 }),
                    getTags()
                ]);
                setGameResults(gamesRes?.results || []);
                setTagResults((tagsRes?.results || []).filter(tag => tag.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5));
                setShowModal(true);
            } catch {
                setGameResults([]);
                setTagResults([]);
                setShowModal(false);
            } finally {
                setLoadingResults(false);
            }
        }, 350);
        return () => clearTimeout(handler);
    }, [search]);
    const getDisplayName = () => {
        if (status === 'loading') return 'Cargando...';
        if (!session?.user) return 'INVITADO';
        
        const user = session.user;
        
        // Debug de los datos del usuario
        console.log('User data for display:', {
            name: user.name,
            email: user.email,
            id: user.id,
            allData: user
        });
        
        // Prioridad: 1. Nombre, 2. Email, 3. 'USUARIO'
        return user.name || user.email || 'USUARIO';
    };

    // Determinar si hay sesión activa
    const isAuthenticated = !!session?.user;

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
                                ref={inputRef}
                                type="text"
                                placeholder="Buscar juegos, categorías..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onFocus={() => { if (search.trim() && (gameResults.length > 0 || tagResults.length > 0)) setShowModal(true); }}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                autoComplete="off"
                            />

                            {/* Modal de resultados de búsqueda */}
                            {showModal && (
                                <div className="absolute left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                    {loadingResults ? (
                                        <div className="p-4 text-gray-300 text-center">Buscando...</div>
                                    ) : (
                                        <>
                                            {gameResults.length === 0 && tagResults.length === 0 ? (
                                                <div className="p-4 text-gray-400 text-center">Sin resultados</div>
                                            ) : (
                                                <>
                                                    {gameResults.length > 0 && (
                                                        <div>
                                                            <div className="px-4 pt-3 pb-1 text-xs text-primary font-bold uppercase">Juegos</div>
                                                            <ul>
                                                                {gameResults.map(game => (
                                                                    <li key={game.id}>
                                                                        <Link
                                                                            href={`/juego/${game.slug}`}
                                                                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-primary hover:text-white rounded-lg transition-colors"
                                                                            onClick={() => { setShowModal(false); setSearch(""); }}
                                                                        >
                                                                            {game.title}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {tagResults.length > 0 && (
                                                        <div>
                                                            <div className="px-4 pt-3 pb-1 text-xs text-primary font-bold uppercase">Categorías</div>
                                                            <ul>
                                                                {tagResults.map(tag => (
                                                                    <li key={tag.id}>
                                                                        <Link
                                                                            href={`/categoria/${tag.slug}`}
                                                                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-primary hover:text-white rounded-lg transition-colors"
                                                                            onClick={() => { setShowModal(false); setSearch(""); }}
                                                                        >
                                                                            {tag.name}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex space-x-8 ml-6">
                            <Link href="/descubrir" className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                Descubrir
                            </Link>
                            <Link href="/noticias" className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                Noticias
                            </Link>
                        </nav>
                    </div>
                    
                    {/* User Actions */}
                    <div className="flex items-center gap-6">
                        <div className='flex gap-4'>
                            {/* carrito */}
                            <Link
                                href="/mi-carrito"
                                className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                                aria-label="Carrito"
                            >
                                <FiShoppingCart className="text-gray-200" size={18} />
                            </Link>
                            {/* lista de deseos */}
                            <Link
                                href="/lista-de-deseos"
                                className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                                aria-label="Lista de deseos"
                            >
                                <FiBookmark className="text-gray-200" size={18} />
                            </Link>
                        </div>

                        {/* CONTROLES DE SESIÓN */}
                        <div className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-3xl shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                            {session?.user?.image ? (
                                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 relative">
                                    <Image
                                        src={session.user.image}
                                        alt="Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <FiUser className="mr-2" />
                            )}
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-gray-400">
                                    {getDisplayName()}
                                </span>
                                <button
                                    onClick={() => isAuthenticated ? signOut({ callbackUrl: '/' }) : signIn()}
                                    className="text-white font-medium hover:text-blue-400 transition-colors"
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? '...' : (isAuthenticated ? 'Cerrar sesión' : 'Log in')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navbar - mantén igual */}
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
                        <Link
                            href="/configuracion"
                            className="absolute inset-y-0 right-0 flex items-center"
                        >
                            <Image width={80} height={70} alt="setting" src="/setting-2.svg" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;