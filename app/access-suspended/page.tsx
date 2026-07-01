"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { Logo } from "@/components/Logo";
import { ShieldOff, ArrowLeft } from "lucide-react";

export default function AccessSuspendedPage() {
  return (
    <div className="ait-app min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 border border-red-200">
            <ShieldOff className="h-10 w-10 text-[var(--danger)]" />
          </div>
        </div>

        <Logo className="justify-center mb-8" showTagline />

        <h1 className="font-display text-3xl font-semibold text-[var(--ink)] mb-4">
          Access Suspended
        </h1>
        <p className="text-[var(--muted)] leading-relaxed mb-8">
          Your access has been suspended. Please contact your administrator at
          +91 72000 08953 for assistance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <LogoutButton />
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--coral-deep)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
