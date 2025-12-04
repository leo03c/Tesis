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
        const res = await fetch(`${API_BASE_URL}/api/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });

        const user = await res.json();

        if (!res.ok) throw new Error(user.detail || "Error en el login");

        return { id: user.id, name: user.username, token: user.token };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      // For Google OAuth, register/login with the Django backend
      if (account?.provider === "google" && account.id_token) {
        try {
          // Try to login/register with the Django backend using Google token
          const res = await fetch(`${API_BASE_URL}/api/google-auth/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: account.id_token,
            }),
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Google auth backend error:", errorData);
            return false;
          }

          const data = await res.json();
          // Store the backend token in the user object for the jwt callback
          user.token = data.token;
          user.id = data.id?.toString() || data.user?.id?.toString();
          return true;
        } catch (error) {
          console.error("Error during Google authentication with backend:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }) {
      // For credentials login, use the token from authorize
      if (user?.token) {
        token.accessToken = user.token;
      }
      // Store the provider for reference
      if (account?.provider) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
