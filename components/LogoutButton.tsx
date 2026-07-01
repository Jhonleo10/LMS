"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--coral-deep)] px-3 py-1.5 rounded-full hover:bg-white border border-transparent hover:border-[var(--line)] transition-all ${className ?? ""}`}
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Log out</span>
    </button>
  );
}
