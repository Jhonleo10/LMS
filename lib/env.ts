import { ensureAuthEnv } from "@/lib/set-auth-env";

ensureAuthEnv();

export function getAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "NEXTAUTH_SECRET is not set. Add it in Vercel → Settings → Environment Variables."
    );
  }
  return secret;
}

export function getAuthUrl(): string {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function isAuthDebug(): boolean {
  return process.env.AUTH_DEBUG === "true";
}
