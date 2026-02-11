'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import Image from "next/image";
import Link from "next/link";

// Imágenes
const COSMOX_LOGO = "/logo-cosmox.svg";
const COLISEUM_BG = "/coliseum-bg.jpg";
const userIcon = "/icons/user.svg";
const lockIcon = "/icons/security-safe.svg";
const googleIcon = "/icons/google.svg";
const frameIcon = "/icons/Frame.svg";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshSession } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: form.username,
        password: form.password,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        // Esperar un poco para que la sesión se actualice
        setTimeout(async () => {
          await refreshSession();
          router.push("/");
          router.refresh(); // Forzar refresco de la página
        }, 1000);
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      const message = error instanceof Error ? error.message : "Error durante el inicio de sesión";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <main className="flex flex-col min-h-screen bg-dark text-white font-primary">
      <div className="flex flex-1">
        {/* PANEL IZQUIERDO */}
        <section className="hidden lg:flex w-1/2 items-center justify-center p-6">
          <div className="relative w-full h-[90%] max-w-[90%] rounded-[30px] overflow-hidden shadow-lg">
            <Image src={COLISEUM_BG} alt="Coliseum" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
            <div className="absolute inset-0 bg-black/50 z-10 flex flex-col justify-between p-6">
              <div className="z-20 space-y-6">
                <div>
                  <h2 className="text-2xl font-primary leading-snug">Plataforma cubana para Videojuegos</h2>
                  <p className="text-sm text-gray-200 mt-2 max-w-sm text-justify font-extralight">
                    Nos apasiona el mundo de los videojuegos y estamos dedicados a ofrecerte lo mejor del entretenimiento digital desde una perspectiva cubana.
                  </p>
                </div>
                <div className="bg-white rounded-3xl pe-1 ps-4 py-1 flex items-center gap-3 text-black w-fit shadow-md">
                  <div>
                    <div className="text-gray-600 text-sm">Nuestros Servicios</div>
                    <div className="font-primary">Múltiples servicios y amenidades</div>
                  </div>
                  <div className="bg-primary text-white px-6 py-4 rounded-3xl">
                    <Image src={frameIcon} alt="Icon" width={40} height={40} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PANEL DERECHO */}
        <section className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Image src={COSMOX_LOGO} alt="COSMOX" width={150} height={150} className="mx-auto h-auto w-40 mb-4" />
              <h1 className="text-3xl font-primary text-left">
                ¿<span className="text-primary">Es usted</span> MIEMBRO?
              </h1>
              <p className="text-sm text-gray-400 mt-1 text-left">Muy bien, ingrese sus credenciales</p>
            </div>

            {/* Formulario */}
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="relative">
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <Image src={userIcon} alt="User icon" width={20} height={20} />
                </div>
                <input
                  type="text"
                  placeholder="Usuario o Correo electrónico"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-deep text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <Image src={lockIcon} alt="Lock icon" width={20} height={20} />
                </div>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-deep text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {error && <div className="text-sm text-red-500">{error}</div>}

              <div className="text-left text-sm">
                <a href="#" className="text-primary hover:underline">¿Olvidó su usuario o su contraseña?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-white font-primary tracking-wide hover:bg-subprimary transition duration-300"
              >
                {loading ? "Entrando..." : "ENTRAR"}
              </button>
            </form>

            <hr className="border-t border-gray-700" />

            {/* Login con Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex pl-12 pr-4 py-3 rounded-xl items-center justify-center gap-3 bg-deep hover:bg-subdeep transition"
            >
              <Image src={googleIcon} alt="Google icon" width={0} height={0} className="w-5 h-auto" />
              INICIAR SESIÓN CON GOOGLE
            </button>

            <p className="text-center text-sm text-gray-400">
              ¿No tiene una cuenta?{" "}
              <Link href="/registrar" className="text-primary hover:underline">Crear cuenta</Link>
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-xs text-text text-center mt-auto py-4 px-2">
        2025. Centro de Tecnologías Interactivas. Todos los derechos reservados
      </footer>
    </main>
  );
}