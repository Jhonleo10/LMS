import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";
import { authOptions } from "@/lib/auth";
import { isAuthDebug } from "@/lib/env";
import {
  ensureAuthEnvFromRequest,
  getAuthSecretFromEnv,
  usesSecureCookies,
} from "@/lib/set-auth-env";
import type { Role, Status } from "@/types";

export type ResolvedSession = {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: Status;
  };
};

function syncAuthEnvFromHeaders(): void {
  const headerStore = headers();
  ensureAuthEnvFromRequest(
    headerStore.get("host"),
    headerStore.get("x-forwarded-proto")
  );
}

/**
 * Resolve session from NextAuth (preferred) or JWT cookie directly.
 * JWT fallback uses the correct secure cookie name on HTTPS/Vercel.
 */
export async function resolveServerSession(): Promise<ResolvedSession | null> {
  syncAuthEnvFromHeaders();

  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    if (isAuthDebug()) {
      console.info("[auth] resolveServerSession: getServerSession OK", session.user.email);
    }
    return session as ResolvedSession;
  }

  const secret = getAuthSecretFromEnv();
  if (!secret) {
    if (isAuthDebug()) {
      console.error("[auth] resolveServerSession: NEXTAUTH_SECRET missing");
    }
    return null;
  }

  const cookieStore = cookies();
  const cookieRecord = Object.fromEntries(
    cookieStore.getAll().map((c) => [c.name, c.value])
  );

  const token = await getToken({
    req: { cookies: cookieRecord } as Parameters<typeof getToken>[0]["req"],
    secret,
    secureCookie: usesSecureCookies(),
  });

  if (!token?.email) {
    if (isAuthDebug()) {
      console.warn("[auth] resolveServerSession: no session token in cookies", {
        cookieNames: Object.keys(cookieRecord).filter((n) => n.includes("session")),
        secureCookie: usesSecureCookies(),
        nextAuthUrl: process.env.NEXTAUTH_URL,
      });
    }
    return null;
  }

  if (isAuthDebug()) {
    console.info("[auth] resolveServerSession: getToken OK", token.email);
  }

  return {
    user: {
      id: token.id as string,
      name: (token.name as string) ?? "",
      email: token.email as string,
      role: token.role as Role,
      status: token.status as Status,
    },
  };
}
