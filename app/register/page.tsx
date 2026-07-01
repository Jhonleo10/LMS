"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const fieldMotion = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.12 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const color = score === 0 ? "rgba(14,27,44,0.1)" : score === 1 ? "#dc2626" : score === 2 ? "#d9a441" : "#1fa89b";
  const label = score === 0 ? "" : score === 1 ? "Weak" : score === 2 ? "Fair" : "Strong";

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      style={{ marginTop: "8px" }}
    >
      <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "2px",
              background: n <= score ? color : "rgba(14, 27, 44, 0.1)",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          {checks.map((c) => (
            <span
              key={c.label}
              style={{
                fontSize: "0.68rem",
                color: c.pass ? "#1fa89b" : "rgba(14, 27, 44, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "3px",
                transition: "color 0.3s",
              }}
            >
              <CheckCircle2 style={{ width: 10, height: 10 }} />
              {c.label}
            </span>
          ))}
        </div>
        {label && (
          <span style={{ fontSize: "0.7rem", color, fontWeight: 600 }}>{label}</span>
        )}
      </div>
    </motion.div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(data.details).forEach(([k, v]) => {
            if (Array.isArray(v) && v[0]) fieldErrors[k] = v[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ form: data.error || "Registration failed" });
        }
        return;
      }

      setSuccess(true);
      await new Promise((r) => setTimeout(r, 600));

      const login = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (login?.error) {
        router.push("/login");
        return;
      }
      const session = await getSession();
      const role = (session?.user as { role?: string })?.role;
      router.push(role === "ADMIN" ? "/admin" : "/dashboard");
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Start your journey"
      subtitle="Register as a student and unlock published video courses instantly."
      visualTitle={
        <>
          Learn <em>7+ languages</em>
          <br />& AI skills.
        </>
      }
      visualSubtitle="From spoken English to Generative AI — build the skills that open doors to global careers."
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center", padding: "32px 0" }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(16,185,129,0.15)",
                border: "1px solid rgba(16,185,129,0.4)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 16px",
              }}
            >
              <CheckCircle2 style={{ width: 32, height: 32, color: "#10b981" }} />
            </div>
            <p style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "1rem" }}>
              Account created!
            </p>
            <p style={{ color: "rgba(148,163,184,0.7)", fontSize: "0.85rem", marginTop: 6 }}>
              Signing you in…
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Error banner */}
            <AnimatePresence>
              {errors.form && (
                <motion.div
                  className="auth-error-banner"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {errors.form}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Full Name */}
            <motion.div
              className="auth-field"
              variants={fieldMotion}
              custom={0}
              initial="hidden"
              animate="visible"
            >
              <User className="auth-field-icon h-4 w-4" />
              <Input
                label="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={errors.name}
                autoComplete="name"
              />
            </motion.div>

            {/* Email */}
            <motion.div
              className="auth-field"
              variants={fieldMotion}
              custom={1}
              initial="hidden"
              animate="visible"
            >
              <Mail className="auth-field-icon h-4 w-4" />
              <Input
                label="Email address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
                autoComplete="email"
              />
            </motion.div>

            {/* Password */}
            <motion.div
              className="auth-field"
              variants={fieldMotion}
              custom={2}
              initial="hidden"
              animate="visible"
            >
              <Lock className="auth-field-icon h-4 w-4" />
              <div style={{ position: "relative" }}>
                <Input
                  label="Password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  error={errors.password}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-2px)",
                    color: "rgba(148,163,184,0.5)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <AnimatePresence>
                {form.password && <PasswordStrength password={form.password} />}
              </AnimatePresence>
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              className="auth-field"
              variants={fieldMotion}
              custom={3}
              initial="hidden"
              animate="visible"
            >
              <Lock className="auth-field-icon h-4 w-4" />
              <div style={{ position: "relative" }}>
                <Input
                  label="Confirm Password"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-2px)",
                    color: "rgba(148,163,184,0.5)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Match indicator */}
              <AnimatePresence>
                {form.confirmPassword && form.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      fontSize: "0.72rem",
                      marginTop: "5px",
                      color:
                        form.password === form.confirmPassword
                          ? "#1fa89b"
                          : "#dc2626",
                    }}
                  >
                    {form.password === form.confirmPassword
                      ? "✓ Passwords match"
                      : "✗ Passwords don't match"}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit */}
            <motion.div
              variants={fieldMotion}
              custom={4}
              initial="hidden"
              animate="visible"
            >
              <Button
                type="submit"
                className="w-full auth-submit-btn"
                size="lg"
                loading={loading}
              >
                Create account
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </motion.div>

            <p className="auth-footer-link">
              Already have an account?{" "}
              <Link href="/login">Sign in</Link>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
