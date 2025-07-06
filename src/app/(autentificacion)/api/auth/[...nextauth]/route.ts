import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Asegúrate de que este import esté correcto

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
