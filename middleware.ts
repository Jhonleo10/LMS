import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (token?.status === "DISABLED" && path !== "/access-suspended") {
      return NextResponse.redirect(new URL("/access-suspended", req.url));
    }

    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if ((path === "/login" || path === "/register") && token) {
      const redirect =
        token.role === "ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(redirect, req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const publicPaths = ["/", "/login", "/register", "/access-suspended"];
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
    "/login",
    "/register",
  ],
};
