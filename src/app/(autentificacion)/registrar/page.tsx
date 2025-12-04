"use client";

import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

//Variables de imágenes
const COSMOX_LOGO = "/logo-cosmox.svg";
const COLISEUM_BG = "/coliseum-bg.jpg";
const userIcon = "/icons/user.svg";
const lockIcon = "/icons/security-safe.svg";
const googleIcon = "/icons/google.svg";
const frameIcon = "/icons/Frame.svg";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    privacyAccepted: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          username: form.username,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Error en el registro");
      }

      // Registro exitoso, redirigir a login
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <main className="flex flex-col min-h-screen bg-dark text-white font-primary">
      <div className="flex flex-1">
        {/* PANEL IZQUIERDO */}
        <section className="hidden lg:flex w-1/2 items-center justify-center p-6">
          <div className="relative w-full h-[90%] max-w-[90%] rounded-[30px] overflow-hidden shadow-lg">
            <Image
              src={COLISEUM_BG}
              alt="Coliseum"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-black/50 z-10 flex flex-col justify-between p-6">
              <div className="z-20 space-y-6">
                <div>
                  <h2 className="text-2xl font-primary leading-snug">Plataforma cubana para Videojuegos</h2>
                  <p className="text-sm text-gray-200 mt-2 max-w-sm text-justify font-stretch-75% ">
                    Nos apasiona el mundo de los videojuegos y estamos dedicados a ofrecerte lo mejor del entretenimiento digital desde una perspectiva cubana. Nuestra plataforma es el lugar ideal para descubrir, jugar y compartir experiencias con una comunidad vibrante y apasionada por los videojuegos.
                  </p>
                </div>
                <div className="bg-white rounded-3xl pe-1 ps-4 py-1 flex items-center gap-3 text-black w-fit shadow-md">
                  <div className="">
                    <div className="text-gray-600 text-sm">Nuestros Servicios</div>
                    <div className="font-primary">Múltiples servicios y amenidades</div>
                  </div>
                  <div className="bg-primary text-white px-6 py-4  rounded-3xl">
                    <Image src={frameIcon} alt="Lock icon" width={40} height={40} />
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
              <Image src={COSMOX_LOGO} alt="COSMOX" width={150} height={150} className="mx-auto mb-4" />
              <h1 className="text-3xl font-primary text-left">
                ¿<span className="text-primary ">Desea ser</span> MIEMBRO?
              </h1>
              <p className="text-sm text-gray-400 mt-1 text-left">Muy bien, ingrese sus datos y rellene los campos </p>
            </div>
  
            {/* Formulario */}
            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="relative">
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <Image src={userIcon} alt="User icon" width={20} height={20} />
                </div>
                <input
                  type="text"
                  placeholder="Nombre y apellidos"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-deep text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <Image src={userIcon} alt="User icon" width={20} height={20} />
                </div>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-deep text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <Image src={userIcon} alt="User icon" width={20} height={20} />
                </div>
                <input
                  type="text"
                  placeholder="Usuario"
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

              <div className="relative">
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <Image src={lockIcon} alt="Lock icon" width={20} height={20} />
                </div>
                <input
                  type="password"
                  placeholder="Confirmación de contraseña"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-deep text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
  
              <div className="flex items-start gap-2 text-sm text-gray-400">
              <input
                  type="checkbox"
                  id="privacy"
                  checked={form.privacyAccepted}
                  onChange={(e) => setForm({ ...form, privacyAccepted: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border border-gray-600 bg-transparent checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary appearance-none"
                  required
              />
                  <label htmlFor="privacy">
                      Acepta los términos de la política de privacidad
                  </label>
              </div>

              {error && <div className="text-sm text-red-500">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-white font-primary tracking-wide text-center hover:bg-subprimary transition-colors duration-300"
              >
                {loading ? "Registrando..." : "REGISTRAR"}
              </button>
            </form>
  
            {/* Google + crear cuenta */}
            <hr className="border-t border-gray-700" />
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full flex pl-12 pr-4 py-3 rounded-xl items-center justify-center gap-3 bg-deep hover:bg-subdeep transition"
            >
              <Image src={googleIcon} alt="Google icon" width={20} height={20} />
              REGISTRARSE CON GOOGLE
            </button>
  
            
          </div>
        </section>
      </div>
  
      {/* Footer al fondo centrado */}
      <footer className="text-xs text-text text-center mt-auto py-4 px-2">
        2025. Centro de Tecnologías Interactivas. Todos los derechos reservados
      </footer>
    </main>
  );
}
