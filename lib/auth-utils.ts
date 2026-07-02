/**
 * Shared auth redirect helpers (safe for server and client).
 */

export function getSafeCallbackUrl(
  callbackUrl: string | null,
  origin?: string
): string | null {
  if (!callbackUrl) return null;

  if (callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
    return callbackUrl;
  }

  try {
    const url = new URL(callbackUrl);
    if (origin && url.origin === origin) {
      return url.pathname + url.search;
    }
  } catch {
    return null;
  }

  return null;
}

export function getRoleBasedDestination(
  role?: string,
  callbackUrl?: string | null,
  origin?: string
): string {
  const safe = callbackUrl ? getSafeCallbackUrl(callbackUrl, origin) : null;
  if (safe) {
    if (safe.startsWith("/admin") && role !== "ADMIN") {
      return "/dashboard";
    }
    return safe;
  }
  return role === "ADMIN" ? "/admin" : "/dashboard";
}
