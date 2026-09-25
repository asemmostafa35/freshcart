import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "myLogin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const response = await fetch(`${process.env.API}/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const payload = await response.json();

        if (!response.ok || !payload.token) {
          return null;
        }

        const userData: { id: string } = jwtDecode(payload.token);

        return {
          id: userData.id || payload.user?._id,
          name: payload.user?.name,
          email: payload.user?.email,
          token: payload.token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.token = (user as typeof user & { token?: string }).token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user ??= {};
        const sessionUser = session.user as typeof session.user & {
          id: string;
          token: string;
        };
        sessionUser.id = token.id as string;
        sessionUser.name = token.name as string;
        sessionUser.email = token.email as string;
        sessionUser.token = token.token as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
