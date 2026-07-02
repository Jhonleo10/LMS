import { ensureAuthEnvFromRequest } from "@/lib/set-auth-env";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

type RouteContext = { params: { nextauth: string[] } };

async function authHandler(req: NextRequest, context: RouteContext) {
  ensureAuthEnvFromRequest(
    req.headers.get("host"),
    req.headers.get("x-forwarded-proto")
  );
  return handler(req, context);
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = authHandler;
export const POST = authHandler;
