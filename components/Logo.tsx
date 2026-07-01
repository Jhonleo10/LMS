import Link from "next/link";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: "default" | "compact";
}

export function Logo({ className, showTagline = false, variant = "default" }: LogoProps) {
  if (variant === "compact") {
    return (
      <Link href="/" className={`flex items-center gap-2.5 group ${className ?? ""}`}>
        <span className="font-display font-bold text-xl bg-[var(--ink)] text-[var(--paper)] w-9 h-9 rounded-lg flex items-center justify-center -rotate-3 group-hover:rotate-2 transition-transform">
          A
        </span>
        <span className="font-display font-semibold text-base hidden sm:inline">
          AIT Academy
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className={`flex items-center gap-3 group ${className ?? ""}`}>
      <span className="font-display font-bold text-2xl bg-[var(--ink)] text-[var(--paper)] w-10 h-10 rounded-[10px] flex items-center justify-center -rotate-[4deg] group-hover:rotate-[2deg] group-hover:scale-105 transition-all">
        A
      </span>
      <span className="leading-tight">
        <span className="font-display text-lg font-semibold block text-[var(--ink)]">
          AIT Language Academy
        </span>
        {showTagline && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--coral-deep)]">
            Languages · AI · Data
          </span>
        )}
      </span>
    </Link>
  );
}
