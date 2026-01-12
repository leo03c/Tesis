"use client";

import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { register } from "@/services/authService";

//Variables de imágenes
const COSMOX_LOGO = "/logo-cosmox.svg";
const COLISEUM_BG = "/coliseum-bg.jpg";
const userIcon = "/icons/user.svg";
const lockIcon = "/icons/security-safe.svg";
const googleIcon = "/icons/google.svg";
const frameIcon = "/icons/Frame.svg";

// Constante para el tiempo de espera antes de redirigir al login
const REDIRECT_DELAY_MS = 1500;

// Definir tipo para los datos del formulario
interface RegisterFormData {
  name: string;
  email: string;
  username: string;
  password: string;
  password2: string;
  privacyAccepted: boolean;
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    username: "",
    password: "",
    password2: "",
    privacyAccepted: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validaciones
    if (!form.privacyAccepted) {
      setError("Debes aceptar los términos de la política de privacidad");
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setLoading(false);
      return;
    }

    // Validación de contraseñas coincidentes
    if (form.password !== form.password2) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Por favor ingresa un email válido");
      setLoading(false);
      return;
    }

    // Validación de username
    if (/\s/.test(form.username)) {
      setError("El nombre de usuario no debe contener espacios");
      setLoading(false);
      return;
    }

    try {
      // Preparar datos para enviar a Django (alineado con RegisterSerializer)
      const registerData = {
        username: form.username.trim().toLowerCase(),
        email: form.email,
        name: form.name, // El serializer lo dividirá en first_name y last_name
        // El endpoint espera password1 y password2; incluir también el consentimiento de privacidad
        password1: form.password,
        password2: form.password2,
        privacyAccepted: form.privacyAccepted,
      };

      await register(registerData);

      // Registro exitoso, iniciar sesión automáticamente
      const res = await signIn("credentials", {
        redirect: false,
        username: form.username,
        password: form.password,
      });

      if (res?.error) {
        // Si falla el inicio de sesión automático, redirigir al login manual
        setError("Registro exitoso. Redirigiendo al login...");
        setTimeout(() => router.push("/login"), REDIRECT_DELAY_MS);
      } else if (res?.ok) {
        router.push("/");
      } else {
        // Caso inesperado, informar al usuario y redirigir al login
        setError("Registro exitoso. Redirigiendo al login...");
        setTimeout(() => router.push("/login"), REDIRECT_DELAY_MS);
      }
    } catch (err: unknown) {
      // Manejo de errores específicos de Django REST
      if (err && typeof err === 'object' && 'response' in err) {
        const errorResponse = err as { response?: { data?: unknown } };
        const data = errorResponse.response?.data;

        if (data !== undefined) {
          // Si la respuesta es una cadena simple
          if (typeof data === 'string') {
            setError(data);
          } else if (typeof data === 'object' && data !== null) {
            const d = data as Record<string, unknown>;

            // Helper para extraer mensajes de campos que pueden ser string o array
            const extractMsg = (field: unknown) => {
              if (Array.isArray(field) && field.length > 0) return String(field[0]);
              if (typeof field === 'string') return field;
              return undefined;
            };

            const usernameMsg = extractMsg(d['username']);
            const emailMsg = extractMsg(d['email']);
            const passwordMsg = extractMsg(d['password']) ?? extractMsg(d['password1']);
            const nonFieldMsg = extractMsg(d['non_field_errors']);
            const detailMsg = typeof d['detail'] === 'string' ? d['detail'] as string : undefined;

            if (usernameMsg) {
              setError(`Usuario: ${usernameMsg}`);
            } else if (emailMsg) {
              setError(`Email: ${emailMsg}`);
            } else if (passwordMsg) {
              setError(`Contraseña: ${passwordMsg}`);
            } else if (nonFieldMsg) {
              setError(nonFieldMsg);
            } else if (detailMsg) {
              setError(detailMsg);
            } else {
              setError("Error en el registro. Por favor verifica tus datos.");
            }
          } else {
            setError("Error en el registro. Por favor verifica tus datos.");
          }
        } else {
          setError("Error de conexión con el servidor");
        }
      } else if (err instanceof Error) {
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

  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
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
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-deep text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength={2}
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
                  onChange={(e) => handleInputChange("email", e.target.value)}
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
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-deep text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength={3}
                  pattern="[A-Za-z0-9_]+"
                  title="Solo letras, números y guiones bajos (sin espacios)"
                />
              </div>
  
              <div className="relative">
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <Image src={lockIcon} alt="Lock icon" width={20} height={20} />
                </div>
                <input
                  type="password"
                  placeholder="Contraseña (mínimo 8 caracteres)"
                  value={form.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-deep text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength={8}
                />
              </div>

              <div className="relative">
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <Image src={lockIcon} alt="Lock icon" width={20} height={20} />
                </div>
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={form.password2}
                  onChange={(e) => handleInputChange("password2", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-deep text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength={8}
                />
              </div>
  
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={form.privacyAccepted}
                  onChange={(e) => handleInputChange("privacyAccepted", e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border border-gray-600 bg-transparent checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary appearance-none"
                  required
                />
                <label htmlFor="privacy">
                  Acepta los términos de la política de privacidad
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-900/20 border border-red-700 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-primary tracking-wide text-center transition-colors duration-300 ${
                  loading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-primary hover:bg-subprimary text-white'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Registrando...
                  </span>
                ) : "REGISTRAR"}
              </button>
            </form>
  
            {/* Google + crear cuenta */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-700"></div>
                <span className="mx-4 text-sm text-gray-500">O regístrate con</span>
                <div className="flex-1 border-t border-gray-700"></div>
              </div>
              
              <button
                type="button"
                onClick={handleGoogleRegister}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-deep hover:bg-subdeep transition border border-gray-700"
              >
                <Image src={googleIcon} alt="Google icon" width={20} height={20} />
                <span>Google</span>
              </button>
            </div>
  
            <div className="text-center">
              <p className="text-sm text-gray-400">
                ¿Ya tienes una cuenta?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="text-primary hover:text-subprimary font-medium transition-colors"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
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