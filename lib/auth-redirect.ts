import { getRoleBasedDestination } from "@/lib/auth-utils";

type SessionLike = { user?: { role?: string } } | null;

/**
 * After credentials sign-in, navigate via the server callback route so
 * middleware sees the session cookie on Vercel (avoids client race).
 */
export async function completeAuthRedirect(
  callbackUrl: string | null
): Promise<void> {
  const params = new URLSearchParams();
  if (callbackUrl) {
    params.set("callbackUrl", callbackUrl);
  }
  const query = params.toString();
  window.location.assign(query ? `/auth/callback?${query}` : "/auth/callback");
}

/** @deprecated Use completeAuthRedirect(callbackUrl) after signIn */
export async function completeAuthRedirectLegacy(
  getSession: () => Promise<SessionLike>,
  callbackUrl: string | null
): Promise<void> {
  let session: SessionLike = null;
  const origin = window.location.origin;

  for (let attempt = 0; attempt < 5; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, 200 * attempt));
    }
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      if (res.ok) {
        session = await res.json();
      }
    } catch {
      session = await getSession();
    }
    if (session?.user) break;
  }

  if (!session?.user) {
    throw new Error("Session not established");
  }

  const role = session.user.role;
  const destination = getRoleBasedDestination(role, callbackUrl, origin);
  window.location.assign(destination);
}
