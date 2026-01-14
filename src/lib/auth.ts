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
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
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
      console.log('🔐 SignIn callback:', { provider: account?.provider, email: user?.email });
      
      // Solo guardar en backend si es login con Google
      if (account?.provider === 'google' && user?.email) {
        try {
          console.log('📤 Enviando datos a backend google-auth');
          // Solo enviamos los campos estrictamente necesarios
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-auth/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: profile?.sub,
            }),
          });
          
          console.log('📥 Respuesta google-auth:', res.status);
          
          // Aceptar 200-299 (res.ok) o 409 (usuario existente)
          if (!res.ok && res.status !== 409) {
            const errorText = await res.text();
            console.error('❌ Error guardando usuario Google en backend:', errorText);
            return false;
          }
          
          console.log('✅ Usuario Google procesado correctamente');
        } catch (e) {
          // Si el error es de red, permitimos el login pero lo registramos
          console.error('❌ Error de red guardando usuario Google:', e);
          // Permitir login aunque falle el backend
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        console.log('🔑 JWT callback - user login:', { provider: account?.provider, email: user.email });
        
        // Si es login por credenciales
        if (account?.provider === 'credentials') {
          console.log('🔐 Credentials login - storing tokens');
          token.accessToken = (user as any).accessToken;
          token.refreshToken = (user as any).refreshToken;
          token.id = user.id;
        }
        // Si es login por Google
        else if (account?.provider === 'google' && user.email) {
          try {
            console.log('🔍 Fetching user data from backend for Google user');
            // Consultar el backend para obtener el id del usuario por email y tokens
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user-by-email/?email=${encodeURIComponent(user.email)}`);
            
            if (res.ok) {
              const data = await res.json();
              console.log('📥 User data received:', { id: data.id, hasAccess: !!data.access });
              
              token.id = data.id?.toString();
              // El backend debe devolver tokens JWT para este usuario
              token.accessToken = data.access;
              token.refreshToken = data.refresh;
              
              if (!token.accessToken) {
                console.warn('⚠️ No access token received from backend for Google user');
              }
            } else {
              console.error('❌ Failed to fetch user data:', res.status);
            }
          } catch (e) {
            console.error('❌ Error obteniendo datos de usuario Google:', e);
          }
        }
      }
      
      console.log('🎫 JWT token state:', { 
        hasId: !!token.id, 
        hasAccessToken: !!token.accessToken,
        hasRefreshToken: !!token.refreshToken 
      });
      
      return token;
    },
    async session({ session, token }) {
      console.log('📋 Session callback:', { 
        hasToken: !!token,
        hasUser: !!session.user,
        tokenId: token?.id,
        hasAccessToken: !!token?.accessToken
      });
      
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session as any).accessToken = token.accessToken as string;
        (session as any).refreshToken = token.refreshToken as string;
      }
      
      console.log('✅ Session created:', {
        userId: (session.user as any)?.id,
        hasAccessToken: !!(session as any).accessToken
      });
      
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