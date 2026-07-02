/**
 * Normalize auth env vars at runtime (Vercel preview URLs, AUTH_* aliases).
 * Call ensureAuthEnvFromRequest() on every server request when possible.
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

/**
 * Bind NEXTAUTH_URL to the incoming request host.
 * Fixes Vercel production/preview/custom-domain mismatches that break
 * session cookies and getServerSession() after login.
 */
export function ensureAuthEnvFromRequest(
  host?: string | null,
  proto?: string | null
): void {
  ensureAuthEnv();

  if (!host) return;

  const protocol = proto?.split(",")[0]?.trim() || "https";
  const requestUrl = `${protocol}://${host}`;

  // Always prefer the URL the browser actually used for this request.
  process.env.NEXTAUTH_URL = requestUrl;
}

export function getAuthSecretFromEnv(): string | undefined {
  return process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
}

export function usesSecureCookies(): boolean {
  const url = process.env.NEXTAUTH_URL ?? "";
  return url.startsWith("https://") || process.env.NODE_ENV === "production";
}
