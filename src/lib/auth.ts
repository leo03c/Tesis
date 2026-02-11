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
            avatar: data.user.avatar,
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
    async jwt({ token, user, account, trigger, session: updateData }) {
      // Handle session update (e.g., avatar change)
      if (trigger === 'update' && updateData) {
        console.log('🔄 JWT update trigger:', updateData);
        if (updateData.image) {
          token.avatar = updateData.image;
        }
        return token;
      }

      if (user) {
        console.log('🔑 JWT callback - user login:', { provider: account?.provider, email: user.email });

        // Si es login por credenciales
        if (account?.provider === 'credentials') {
          console.log('🔐 Credentials login - storing tokens');
          token.accessToken = (user as any).accessToken;
          token.refreshToken = (user as any).refreshToken;
          token.id = user.id;
          if ((user as any).avatar) {
            token.avatar = (user as any).avatar;
          }
        }
        // Si es login por Google
        else if (account?.provider === 'google' && user.email) {
          try {
            console.log('🔍 Fetching Google tokens from backend');
            // Consultar el backend para obtener los tokens y datos del usuario
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-auth/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                googleId: account?.providerAccountId,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              console.log('📥 Google auth response:', data);

              token.id = data.user?.id?.toString();
              token.accessToken = data.access;
              token.refreshToken = data.refresh;

              if (!token.accessToken) {
                console.warn('⚠️ No access token received from backend for Google user');
              }
            } else {
              const errorText = await res.text();
              console.error('❌ Failed to fetch Google tokens:', res.status, errorText);
            }
          } catch (e) {
            console.error('❌ Error obteniendo tokens de usuario Google:', e);
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
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '');
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
        // Preserve image from token (Google) or from backend avatar
        if (token.picture) {
          session.user.image = token.picture as string;
        }
        if (token.avatar) {
          const avatar = token.avatar as string;
          session.user.image = avatar.startsWith('http') ? avatar : `${apiBase}${avatar}`;
        }
      }
      
      console.log('✅ Session created:', {
        userId: (session.user as any)?.id,
        hasAccessToken: !!(session as any).accessToken,
        hasImage: !!session.user?.image
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