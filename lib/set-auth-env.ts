/**
 * Normalize auth env vars at runtime (Vercel preview URLs, AUTH_* aliases).
 * Must run before NextAuth / getServerSession / getToken.
 */
export function ensureAuthEnv(): void {
  if (!process.env.NEXTAUTH_SECRET && process.env.AUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = process.env.AUTH_SECRET;
  }

  if (!process.env.NEXTAUTH_URL && process.env.AUTH_URL) {
    process.env.NEXTAUTH_URL = process.env.AUTH_URL;
  }

  if (!process.env.NEXTAUTH_URL) {
    if (process.env.VERCEL_URL) {
      process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.NODE_ENV === "development") {
      process.env.NEXTAUTH_URL = "http://localhost:3000";
    }
  }
}
