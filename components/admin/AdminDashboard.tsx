"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Search, Plus, Eye, EyeOff } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { CountUp } from "@/components/ui/CountUp";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Select } from "@/components/ui/Input";
import { StatCardSkeleton, UserRowSkeleton } from "@/components/ui/Skeleton";
import { formatDate, generatePassword } from "@/lib/utils";
import { UserListItem, UserStats } from "@/types";

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, disabled: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "LEARNER",
    autoGenerate: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data.users);
      setStats(data.stats);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = async (user: UserListItem) => {
    const newStatus = user.status === "ENABLED" ? "DISABLED" : "ENABLED";
    const prev = [...users];

    setUsers((us) =>
      us.map((u) =>
        u.id === user.id ? { ...u, status: newStatus } : u
      )
    );
    setStats((s) => ({
      ...s,
      active: s.active + (newStatus === "ENABLED" ? 1 : -1),
      disabled: s.disabled + (newStatus === "DISABLED" ? 1 : -1),
    }));

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(
        `${user.name} ${newStatus === "ENABLED" ? "enabled" : "disabled"}`
      );
    } catch {
      setUsers(prev);
      setStats((s) => ({
        total: s.total,
        active: users.filter((u) => u.status === "ENABLED").length,
        disabled: users.filter((u) => u.status === "DISABLED").length,
      }));
      toast.error("Failed to update status");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.autoGenerate && form.password.length < 6)
      errors.password = "Password must be at least 6 characters";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setCreating(true);
    const password = form.autoGenerate ? generatePassword() : form.password;

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password,
          role: form.role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(data.details).forEach(([k, v]) => {
            if (Array.isArray(v) && v[0]) fieldErrors[k] = v[0];
          });
          setFormErrors(fieldErrors);
        } else {
          toast.error(data.error || "Failed to create user");
        }
        return;
      }

      setUsers((us) => [data, ...us]);
      setStats((s) => ({
        total: s.total + 1,
        active: s.active + 1,
        disabled: s.disabled,
      }));
      setModalOpen(false);
      setForm({ name: "", email: "", password: "", role: "LEARNER", autoGenerate: false });
      toast.success(
        form.autoGenerate
          ? `User created. Password: ${password}`
          : "User created successfully"
      );
    } catch {
      toast.error("Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const statCards = [
    { label: "Total Users", value: stats.total, icon: Users, color: "text-accent" },
    { label: "Active Users", value: stats.active, icon: UserCheck, color: "text-success" },
    { label: "Disabled Users", value: stats.disabled, icon: UserX, color: "text-danger" },
  ];

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold mb-1">Dashboard</h1>
        <p className="text-muted">Manage users and monitor platform activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-surface border border-border p-6 hover:shadow-card transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted">{card.label}</span>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <CountUp value={card.value} />
              </motion.div>
            ))}
      </div>

      <div className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <h2 className="font-display text-xl font-semibold">Users</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-background border border-border text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <UserRowSkeleton key={i} />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-muted">
            {search ? "No users match your search" : "No users yet"}
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-sm text-muted">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors"
                      style={{
                        borderLeft: `3px solid ${user.status === "ENABLED" ? "#34D399" : "#EF4444"}`,
                      }}
                    >
                      <td className="px-6 py-4 font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-muted">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Toggle
                          checked={user.status === "ENABLED"}
                          onChange={() => handleToggle(user)}
                          label={`Toggle ${user.name} status`}
                        />
                      </td>
                      <td className="px-6 py-4 text-muted text-sm">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden p-4 space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-2xl bg-background border border-border p-4"
                  style={{
                    borderLeft: `3px solid ${user.status === "ENABLED" ? "#34D399" : "#EF4444"}`,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted">{user.email}</p>
                    </div>
                    <Toggle
                      checked={user.status === "ENABLED"}
                      onChange={() => handleToggle(user)}
                      label={`Toggle ${user.name} status`}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                      {user.role}
                    </span>
                    <span className="text-muted">{formatDate(user.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Dialog open={modalOpen} onClose={() => { setModalOpen(false); setShowPassword(false); }} title="Add User">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={formErrors.name}
            placeholder="John Doe"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={formErrors.email}
            placeholder="john@example.com"
          />
          {!form.autoGenerate && (
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={formErrors.password}
                placeholder="Min. 6 characters"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[38px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}
          <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={form.autoGenerate}
              onChange={(e) =>
                setForm({ ...form, autoGenerate: e.target.checked, password: "" })
              }
              className="rounded accent-accent"
            />
            Auto-generate password
          </label>
          <Select
            label="Role"
            value="LEARNER"
            disabled
            options={[{ value: "LEARNER", label: "Learner (Student)" }]}
          />
          <p className="text-xs text-[var(--muted)] -mt-2">
            Admin account is pre-configured. New accounts are learners only.
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={creating}>
              Create User
            </Button>
          </div>
        </form>
      </Dialog>
    </PageTransition>
  );
}
