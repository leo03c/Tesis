import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

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
        const res = await fetch("http://localhost:8000/api/login/", {
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
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user && user.token) token.accessToken = user.token;
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
