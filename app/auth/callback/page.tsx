import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ensureAuthEnvFromRequest } from "@/lib/set-auth-env";
import { resolveServerSession } from "@/lib/auth-server";
import { getRoleBasedDestination } from "@/lib/auth-utils";
import { isAuthDebug } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const headerStore = headers();
  ensureAuthEnvFromRequest(
    headerStore.get("host"),
    headerStore.get("x-forwarded-proto")
  );

  const session = await resolveServerSession();

  if (!session?.user) {
    if (isAuthDebug()) {
      console.warn("[auth] callback: no session — back to login");
    }
    const params = new URLSearchParams();
    if (searchParams.callbackUrl) {
      params.set("callbackUrl", searchParams.callbackUrl);
    }
    redirect(`/login${params.toString() ? `?${params.toString()}` : ""}`);
  }

  const host = headerStore.get("host") ?? "";
  const protocol = headerStore.get("x-forwarded-proto") ?? "https";
  const origin = `${protocol.split(",")[0].trim()}://${host}`;

  const role = session.user.role;
  const destination = getRoleBasedDestination(
    role,
    searchParams.callbackUrl ?? null,
    origin
  );

  if (isAuthDebug()) {
    console.info("[auth] callback: redirecting to", destination, "role:", role);
  }

  redirect(destination);
}
