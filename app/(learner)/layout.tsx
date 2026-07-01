"use client";

import { BookOpen } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

const navItems = [
  { href: "/dashboard", label: "Library", icon: BookOpen },
];

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell navItems={navItems} subtitle="Student Portal">
      {children}
    </AppShell>
  );
}
