"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { completeAuthRedirect } from "@/lib/auth-redirect";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle, Zap } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const fieldMotion = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@example.com", password: "admin123", color: "#e04e2d" },
  { label: "Student", email: "learner@example.com", password: "learner123", color: "#1fa89b" },
];

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setErrors({ form: "Invalid email or password. Please try again." });
      return;
    }

    await completeAuthRedirect(getSession, callbackUrl);
  };

  const fillDemo = (acc: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrors({});
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to access your courses, progress, and learning portal."
      visualTitle={
        <>
          Skills for today,
          <br />
          <em>power</em> for tomorrow.
        </>
      }
      visualSubtitle="Join thousands of learners mastering languages and cutting-edge technology at AIT Language Academy."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error banner */}
        <AnimatePresence>
          {errors.form && (
            <motion.div
              className="auth-error-banner"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errors.form}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email */}
        <motion.div
          className="auth-field"
          variants={fieldMotion}
          custom={0}
          initial="hidden"
          animate="visible"
        >
          <Mail className="auth-field-icon h-4 w-4" />
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
        </motion.div>

        {/* Password */}
        <motion.div
          className="auth-field"
          variants={fieldMotion}
          custom={1}
          initial="hidden"
          animate="visible"
        >
          <Lock className="auth-field-icon h-4 w-4" />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />
        </motion.div>

        {/* Submit */}
        <motion.div variants={fieldMotion} custom={2} initial="hidden" animate="visible">
          <Button
            type="submit"
            className="w-full auth-submit-btn"
            size="lg"
            loading={loading}
          >
            Sign in
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </motion.div>

        {/* Footer */}
        <p className="auth-footer-link">
          No account?{" "}
          <Link href="/register">Create one free</Link>
        </p>

        {/* Demo credentials - quick fill */}
        <motion.div
          className="auth-demo-hint"
          variants={fieldMotion}
          custom={3}
          initial="hidden"
          animate="visible"
        >
          <div className="auth-demo-hint-title flex items-center gap-1.5">
            <Zap className="h-3 w-3" />
            Quick-fill demo accounts
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.label}
                type="button"
                onClick={() => fillDemo(acc)}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  borderRadius: "10px",
                  border: `1px solid ${acc.color}30`,
                  background: `${acc.color}10`,
                  color: acc.color,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${acc.color}20`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `${acc.color}60`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${acc.color}10`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `${acc.color}30`;
                }}
              >
                → {acc.label}
              </button>
            ))}
          </div>
          <p style={{ marginTop: "8px", fontSize: "0.72rem", opacity: 0.6 }}>
            Click a button above to auto-fill credentials
          </p>
        </motion.div>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
