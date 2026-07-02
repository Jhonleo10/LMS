/**
 * Safe post-login redirect helpers.
 * Uses hard navigation so the session cookie is visible to edge middleware on Vercel.
 */

export function getSafeCallbackUrl(callbackUrl: string | null): string | null {
  if (!callbackUrl) return null;
  if (callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
    return callbackUrl;
  }
  return null;
}

export function getRoleBasedDestination(
  role?: string,
  callbackUrl?: string | null
): string {
  const safe = callbackUrl ? getSafeCallbackUrl(callbackUrl) : null;
  if (safe) return safe;
  return role === "ADMIN" ? "/admin" : "/dashboard";
}

type SessionLike = { user?: { role?: string } } | null;

export async function completeAuthRedirect(
  getSession: () => Promise<SessionLike>,
  callbackUrl: string | null
): Promise<void> {
  let session: SessionLike = null;

  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, 150 * attempt));
    }
    session = await getSession();
    if (session?.user) break;
  }

  const role = session?.user?.role;
  const destination = getRoleBasedDestination(role, callbackUrl);
  window.location.assign(destination);
}
