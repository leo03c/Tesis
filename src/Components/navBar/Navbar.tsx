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
        <header className={`bg-[#0D171F]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300 ${mobileMenuOpen ? 'relative' : 'sticky top-0 z-40'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop Navbar */}
                <div className="hidden md:flex items-center justify-between w-full py-4">
                    <div className='flex items-center flex-1 min-w-0'>
                        {/* Search Bar */}
                        <div className="relative w-full max-w-lg group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Buscar juegos, categorías..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onFocus={() => { if (search.trim() && (gameResults.length > 0 || tagResults.length > 0)) setShowModal(true); }}
                                className="block w-full pl-11 pr-4 py-2.5 border border-white/10 rounded-2xl leading-5 bg-subdeep/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-subdeep transition-all duration-300 sm:text-sm"
                                autoComplete="off"
                            />

                            {/* Modal de resultados de búsqueda */}
                            {showModal && (
                                <div className="absolute left-0 right-0 mt-3 bg-subdeep/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-y-auto custom-scrollbar ring-1 ring-black/5 flex flex-col transform transition-all animate-in fade-in slide-in-from-top-2">
                                    {loadingResults ? (
                                        <div className="p-8 text-white/50 text-center flex flex-col items-center justify-center space-y-3">
                                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-sm font-medium tracking-wide">Buscando...</p>
                                        </div>
                                    ) : (
                                        <>
                                            {gameResults.length === 0 && tagResults.length === 0 ? (
                                                <div className="p-8 text-white/40 text-center flex flex-col items-center justify-center space-y-2">
                                                    <FiSearch size={24} className="opacity-50" />
                                                    <p className="text-sm">No encontramos nada para tu búsqueda</p>
                                                </div>
                                            ) : (
                                                <div className="p-2 space-y-1">
                                                    {gameResults.length > 0 && (
                                                        <div className="mb-2">
                                                            <div className="px-3 pt-2 pb-1.5 flex items-center gap-2">
                                                                <span className="text-[10px] text-primary/80 font-extrabold tracking-wider uppercase">Juegos</span>
                                                                <div className="h-px flex-1 bg-white/5"></div>
                                                            </div>
                                                            <ul className="space-y-0.5">
                                                                {gameResults.map(game => (
                                                                    <li key={game.id}>
                                                                        <Link
                                                                            href={`/juego/${game.slug}`}
                                                                            className="flex items-center px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group"
                                                                            onClick={() => { setShowModal(false); setSearch(""); }}
                                                                        >
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary mr-3 transition-colors"></span>
                                                                            {game.title}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {tagResults.length > 0 && (
                                                        <div>
                                                            <div className="px-3 pt-2 pb-1.5 flex items-center gap-2">
                                                                <span className="text-[10px] text-primary/80 font-extrabold tracking-wider uppercase">Categorías</span>
                                                                <div className="h-px flex-1 bg-white/5"></div>
                                                            </div>
                                                            <ul className="flex flex-wrap gap-2 px-3 py-1">
                                                                {tagResults.map(tag => (
                                                                    <li key={tag.id}>
                                                                        <Link
                                                                            href={`/categoria/${tag.slug}`}
                                                                            className="block px-3 py-1.5 text-xs text-gray-300 bg-white/5 hover:bg-primary hover:text-white border border-white/5 hover:border-primary/50 rounded-lg transition-all duration-200"
                                                                            onClick={() => { setShowModal(false); setSearch(""); }}
                                                                        >
                                                                            {tag.name}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex space-x-8 ml-8">
                            <Link href="/descubrir" className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                Descubrir
                            </Link>
                            <Link href="/noticias" className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                Noticias
                            </Link>
                        </nav>
                    </div>
                    
                    {/* User Actions */}
                    <div className="ml-8 flex items-center gap-6 group/nav shrink-0">
                        <div className='flex gap-4'>
                            {/* carrito */}
                            <Link
                                href="/mi-carrito"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-subdeep/40 hover:bg-subdeep shadow-sm border border-white/5 hover:border-primary/50 text-white/70 hover:text-primary transition-all duration-300 group relative"
                                aria-label="Carrito"
                            >
                                <FiShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                            </Link>
                            {/* lista de deseos */}
                            <Link
                                href="/lista-de-deseos"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-subdeep/40 hover:bg-subdeep shadow-sm border border-white/5 hover:border-primary/50 text-white/70 hover:text-primary transition-all duration-300 group relative"
                                aria-label="Lista de deseos"
                            >
                                <FiBookmark size={18} className="group-hover:scale-110 transition-transform" />
                            </Link>
                        </div>

                        {/* CONTROLES DE SESIÓN */}
                        <div className="flex items-center pl-2 pr-4 py-1.5 border border-white/10 rounded-full shadow-sm bg-subdeep/40 hover:bg-subdeep hover:border-white/20 hover:shadow-md cursor-pointer transition-all duration-300 group/session">
                            {session?.user?.image ? (
                                <div className="w-9 h-9 rounded-full overflow-hidden mr-3 relative shadow-inner border-[1.5px] border-white/20 group-hover/session:border-primary/60 transition-colors">
                                    <Image
                                        src={session.user.image}
                                        alt="Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-9 h-9 border-[1.5px] border-white/20 rounded-full flex items-center justify-center mr-3 text-gray-400 group-hover/session:border-primary/60 transition-colors bg-deep/50">
                                    <FiUser size={18} />
                                </div>
                            )}
                            <div className="flex flex-col items-start min-w-[70px]">
                                <span className="text-[11px] font-extrabold tracking-wider text-texInactivo uppercase truncate max-w-[80px]">
                                    {getDisplayName()}
                                </span>
                                <button
                                    onClick={() => isAuthenticated ? signOut({ callbackUrl: '/' }) : signIn()}
                                    className="text-[13px] font-semibold text-white group-hover/session:text-primary transition-colors focus:outline-none"
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? 'Cargando...' : (isAuthenticated ? 'Cerrar sesión' : 'Iniciar sesión')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navbar - mantén igual */}
                <div className="md:hidden flex items-center justify-between py-4 px-5 bg-subdeep/50 backdrop-blur-md rounded-2xl border border-white/5 mt-4">
                    {/* Barra de búsqueda y configuración */}
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                            <FiSearch className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="block w-full pl-10 pr-14 py-2.5 border border-white/10 rounded-xl leading-5 bg-deep/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm"
                        />
                        <Link
                            href="/configuracion"
                            className="absolute inset-y-0 right-0 flex items-center pr-2 hover:scale-110 transition-transform"
                        >
                            <Image width={32} height={32} alt="setting" src="/setting-2.svg" className="opacity-80 hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;