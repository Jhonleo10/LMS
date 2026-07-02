/**
 * Build the post-login server callback URL (relative path only).
 */
export function buildAuthCallbackUrl(callbackUrl: string | null): string {
  const params = new URLSearchParams();
  if (callbackUrl) {
    params.set("callbackUrl", callbackUrl);
  }
  const query = params.toString();
  return query ? `/auth/callback?${query}` : "/auth/callback";
}

/**
 * After credentials sign-in (redirect:false), hard-navigate so middleware
 * reads the session cookie on the next request.
 */
export function navigateAfterSignIn(callbackUrl: string | null): void {
  window.location.assign(buildAuthCallbackUrl(callbackUrl));
}
