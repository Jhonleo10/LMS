import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import { getAuthSecret, isAuthDebug } from "@/lib/env";
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

/**
 * Resolve session from NextAuth (preferred) or JWT cookie directly.
 * The JWT fallback fixes App Router timing issues on Vercel after sign-in.
 */
export async function resolveServerSession(): Promise<ResolvedSession | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    if (isAuthDebug()) {
      console.info("[auth] resolveServerSession: getServerSession OK", session.user.email);
    }
    return session as ResolvedSession;
  }

  const cookieStore = cookies();
  const cookieRecord = Object.fromEntries(
    cookieStore.getAll().map((c) => [c.name, c.value])
  );

  const token = await getToken({
    req: { cookies: cookieRecord } as Parameters<typeof getToken>[0]["req"],
    secret: getAuthSecret(),
  });

  if (!token?.email) {
    if (isAuthDebug()) {
      console.warn("[auth] resolveServerSession: no session token in cookies");
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
