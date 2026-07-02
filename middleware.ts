import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ensureAuthEnv } from "@/lib/set-auth-env";

ensureAuthEnv();

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (process.env.AUTH_DEBUG === "true") {
      console.info("[auth] middleware", path, {
        hasToken: !!token,
        role: token?.role,
        status: token?.status,
      });
    }

    if (token?.status === "DISABLED" && path !== "/access-suspended") {
      return NextResponse.redirect(new URL("/access-suspended", req.url));
    }

    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if ((path === "/login" || path === "/register") && token) {
      const destination = token.role === "ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(destination, req.url));
    }
  },
  {
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const publicPaths = [
          "/",
          "/login",
          "/register",
          "/access-suspended",
          "/auth/callback",
        ];
        if (publicPaths.includes(path)) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/dashboard/:path*",
    "/videos/:path*",
    "/access-suspended",
    "/auth/callback",
    "/login",
    "/register",
  ],
};
