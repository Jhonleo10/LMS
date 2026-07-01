"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, LucideIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "@/components/LogoutButton";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface AppShellProps {
  children: React.ReactNode;
  navItems?: NavItem[];
  subtitle?: string;
}

export function AppShell({ children, navItems = [], subtitle }: AppShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="ait-app">
      <header className="sticky top-0 z-40 ait-app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0 shrink">
              <Logo variant="compact" />
              {subtitle && (
                <span className="hidden md:inline text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[rgba(255,107,71,0.12)] text-[var(--coral-deep)] border border-[rgba(255,107,71,0.2)] whitespace-nowrap">
                  {subtitle}
                </span>
              )}
            </div>

            {navItems.length > 0 && (
              <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white border border-[var(--line)]">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      pathname === href
                        ? "bg-[var(--coral)] text-white shadow-md"
                        : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-dim)]"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/"
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted)] hover:text-[var(--coral)] hover:bg-white border border-transparent hover:border-[var(--line)] transition-colors"
                title="Back to website"
              >
                <Home className="h-4 w-4" />
              </Link>
              {session?.user && (
                <span className="hidden lg:inline text-xs text-[var(--muted)] max-w-[100px] truncate">
                  {session.user.name}
                </span>
              )}
              <LogoutButton />
            </div>
          </div>

          {navItems.length > 0 && (
            <nav className="md:hidden flex gap-2 pb-3 overflow-x-auto scrollbar-none">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0",
                    pathname === href
                      ? "bg-[var(--coral)] text-white"
                      : "bg-white text-[var(--muted)] border border-[var(--line)]"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
