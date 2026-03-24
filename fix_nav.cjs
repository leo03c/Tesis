import fs from 'fs';

const path = 'd:/Tesis/src/Components/navBar/Navbar.tsx';
let content = fs.readFileSync(path, 'utf8');

const startStr = "{/* CONTROLES DE SESIÓN */}";
const endStr = "{/* Mobile Navbar - mantén igual */}";

const start = content.indexOf(startStr);
const end = content.indexOf(endStr);

if (start !== -1 && end !== -1) {
    const oldStr = content.substring(start, end);
    const newStr = `{/* CONTROLES DE SESIÓN */}
                        <div className="flex items-center pl-2 pr-4 py-1.5 border border-white/10 rounded-full shadow-sm bg-subdeep/40 hover:bg-subdeep hover:border-white/20 hover:shadow-md cursor-pointer transition-all duration-300 group">
                            {session?.user?.image ? (
                                <div className="w-9 h-9 rounded-full overflow-hidden mr-3 relative shadow-sm border-[1.5px] border-white/20 group-hover:border-primary/60 transition-colors">
                                    <Image src={session.user.image} alt="Avatar" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-9 h-9 border-[1.5px] border-white/20 rounded-full flex items-center justify-center mr-3 text-gray-400 group-hover:border-primary/60 transition-colors">
                                    <FiUser size={18} />
                                </div>
                            )}
                            <div className="flex flex-col items-start min-w-[70px]">
                                <span className="text-[11px] font-extrabold tracking-wider text-texInactivo uppercase truncate max-w-[80px]">
                                    {getDisplayName()}
                                </span>
                                <button
                                    onClick={() => isAuthenticated ? signOut({ callbackUrl: '/' }) : signIn()}
                                    disabled={status === 'loading'}
                                    className="text-[13px] font-semibold text-white group-hover:text-primary transition-colors focus:outline-none"
                                >
                                    {status === 'loading' ? 'Cargando...' : isAuthenticated ? 'Cerrar sesión' : 'Iniciar sesión'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                `;
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Done');
} else {
    console.log('Not found:', start, end);
}
