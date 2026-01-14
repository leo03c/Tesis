import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log('❌ Credenciales vacías');
          return null;
        }

        try {
          console.log('🔄 Intentando login con:', credentials.username);
          
          const response = await fetch("http://localhost:8000/api/auth/login/", {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          const data = await response.json();
          console.log('📥 Respuesta del backend:', { status: response.status, data });

          if (!response.ok) {
            console.error('❌ Error del backend:', data);
            return null;
          }

          console.log('✅ Login exitoso');

          return {
            id: data.user.id.toString(),
            email: data.user.email,
            name: data.user.username,
            accessToken: data.access,
            refreshToken: data.refresh,
          };
        } catch (error) {
          console.error('❌ Error en authorize:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Solo guardar en backend si es login con Google
      if (account?.provider === 'google' && user?.email) {
        try {
          // Solo enviamos los campos estrictamente necesarios
          const res = await fetch('http://localhost:8000/api/auth/google-auth/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: profile?.sub,
            }),
          });
          // Si el usuario ya existe, el backend debe devolver un error controlado (por ejemplo, 409),
          // pero permitimos el login igualmente
          if (!res.ok && res.status !== 409) {
            // Si es otro error, lo mostramos y bloqueamos el login
            console.error('Error guardando usuario Google en backend:', await res.text());
            return false;
          }
        } catch (e) {
          // Si el error es de red, permitimos el login pero lo registramos
          console.error('Error guardando usuario Google en backend:', e);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Si es login por credenciales
        if (account?.provider === 'credentials') {
          token.accessToken = (user as any).accessToken;
          token.refreshToken = (user as any).refreshToken;
          token.id = user.id;
        }
        // Si es login por Google
        else if (account?.provider === 'google' && user.email) {
          try {
            // Consultar el backend para obtener el id del usuario por email y tokens
            const res = await fetch(`http://localhost:8000/api/auth/user-by-email/?email=${encodeURIComponent(user.email)}`);
            if (res.ok) {
              const data = await res.json();
              token.id = data.id?.toString();
              token.accessToken = data.access || account.access_token;
              token.refreshToken = data.refresh || account.refresh_token;
            }
          } catch (e) {
            console.error('Error obteniendo id de usuario Google:', e);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session as any).accessToken = token.accessToken as string;
        (session as any).refreshToken = token.refreshToken as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};