"use client";

import { Users, Film } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

const navItems = [
  { href: "/admin", label: "Users", icon: Users },
  { href: "/admin/videos", label: "Videos", icon: Film },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell navItems={navItems} subtitle="Admin Panel">
      {children}
    </AppShell>
  );
}
