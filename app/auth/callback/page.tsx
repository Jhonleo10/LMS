import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getRoleBasedDestination } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    const params = new URLSearchParams();
    if (searchParams.callbackUrl) {
      params.set("callbackUrl", searchParams.callbackUrl);
    }
    redirect(`/login${params.toString() ? `?${params.toString()}` : ""}`);
  }

  const host = headers().get("host") ?? "";
  const protocol = headers().get("x-forwarded-proto") ?? "https";
  const origin = `${protocol}://${host}`;

  const role = (session.user as { role?: string }).role;
  const destination = getRoleBasedDestination(
    role,
    searchParams.callbackUrl ?? null,
    origin
  );

  redirect(destination);
}
