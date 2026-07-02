import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { isAuthDebug } from "@/lib/env";
import { ensureAuthEnv } from "@/lib/set-auth-env";
import type { Role, Status } from "@/types";

ensureAuthEnv();

const isProduction = process.env.NODE_ENV === "production";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          if (isAuthDebug()) console.warn("[auth] authorize: missing credentials");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.trim().toLowerCase() },
          });

          if (!user) {
            if (isAuthDebug()) console.warn("[auth] authorize: user not found");
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            if (isAuthDebug()) console.warn("[auth] authorize: invalid password");
            return null;
          }

          if (isAuthDebug()) {
            console.info("[auth] authorize: success", user.email, user.role);
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as Role,
            status: user.status as Status,
          };
        } catch (error) {
          console.error("[auth] authorize: database error", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) return url;
      } catch {
        return baseUrl;
      }
      return baseUrl;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.name = user.name;
        token.email = user.email;
        if (isAuthDebug()) console.info("[auth] jwt: user attached", user.email);
      }

      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });
        if (dbUser) {
          token.role = dbUser.role as Role;
          token.status = dbUser.status as Status;
          token.name = dbUser.name;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.status = token.status as Status;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  useSecureCookies: isProduction,
  cookies: {
    sessionToken: {
      name: isProduction
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
  },
  debug: isAuthDebug(),
};
