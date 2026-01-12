import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { Session, User, Account } from "next-auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log('Attempting login with:', credentials?.username);
          
          const res = await fetch(`${API_BASE_URL}/api/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          });

          const responseText = await res.text();
          console.log('Login response:', responseText);

          if (!res.ok) {
            let errorDetail = "Error en el login";
            try {
              const errorData = JSON.parse(responseText);
              errorDetail = errorData.detail || errorDetail;
            } catch (e) {
              errorDetail = responseText || errorDetail;
            }
            throw new Error(errorDetail);
          }

          const data = JSON.parse(responseText);
          console.log('Parsed login data:', data);
          
          // Backend returns JWT format: { access, refresh, user }
          // Store tokens in localStorage for API requests
          if (typeof window !== 'undefined') {
            if (data.access) localStorage.setItem('access_token', data.access);
            if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
          }
          
          return {
            id: data.user?.id?.toString() || '1',
            name: data.user?.username || data.user?.name || credentials?.username,
            email: data.user?.email || `${credentials?.username}@example.com`,
            token: data.access, // Use access token
            refreshToken: data.refresh,
          };
        } catch (error: any) {
          console.error('Authorize error:', error.message);
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      console.log('SignIn callback - User:', user);
      console.log('SignIn callback - Account:', account);
      
      if (account?.provider === "google" && account.id_token) {
        try {
          console.log('Processing Google sign in...');
          
          // Note: Backend endpoint for Google OAuth might be different
          // Check API documentation for the correct endpoint
          const res = await fetch(`${API_BASE_URL}/api/auth/login/google/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              googleToken: account.id_token,
            }),
          });

          const responseText = await res.text();
          console.log('Google auth response:', responseText);

          if (!res.ok) {
            console.error("Google auth backend error:", responseText);
            return false;
          }

          const data = JSON.parse(responseText);
          console.log('Google auth data:', data);
          
          // Backend returns JWT format: { access, refresh, user }
          if (typeof window !== 'undefined') {
            if (data.access) localStorage.setItem('access_token', data.access);
            if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
          }
          
          user.id = data.user?.id?.toString() || user.id;
          user.name = data.user?.username || data.user?.name || user.name;
          user.email = data.user?.email || user.email;
          user.token = data.access;
          (user as any).refreshToken = data.refresh;
          
          console.log('Updated user for Google:', user);
          return true;
        } catch (error) {
          console.error("Error during Google authentication:", error);
          return false;
        }
      }
      return true;
    },
    
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }) {
      console.log('JWT callback - User:', user);
      console.log('JWT callback - Token:', token);
      
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = user.token;
        token.refreshToken = (user as any).refreshToken;
        console.log('JWT - Setting user data:', token);
      }
      
      // Store the provider for reference
      if (account?.provider) {
        token.provider = account.provider;
      }
      
      return token;
    },
    
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('Session callback - Token:', token);
      console.log('Session callback - Session before:', session);
      
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.accessToken = token.accessToken as string;
        session.provider = token.provider as string;
      }
      
      console.log('Session callback - Session after:', session);
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  debug: process.env.NODE_ENV === 'development',
};