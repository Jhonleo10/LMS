"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-[var(--coral)] text-white hover:bg-[var(--coral-deep)] border-[var(--coral)] hover:shadow-[0_14px_30px_-10px_rgba(255,107,71,0.55)]",
    secondary:
      "bg-white text-[var(--ink)] border border-[var(--line)] hover:border-[var(--coral)] hover:text-[var(--coral-deep)]",
    ghost:
      "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-dim)] border-transparent",
    danger:
      "bg-red-50 text-[var(--danger)] border border-red-200 hover:bg-red-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold border transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-[var(--coral)] focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        "hover:-translate-y-0.5",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
