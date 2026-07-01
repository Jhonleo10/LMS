"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Zap } from "lucide-react";
import { Logo } from "@/components/Logo";
import "./auth.css";

const FLOATING_WORDS = [
  "English", "हिंदी", "தமிழ்", "Français", "Deutsch",
  "Español", "AI", "Python", "React", "Next.js", "ML",
];

interface AuthShellProps {
  title: string;
  subtitle: string;
  visualTitle: React.ReactNode;
  visualSubtitle: string;
  children: React.ReactNode;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function AuthShell({ title, subtitle, visualTitle, visualSubtitle, children }: AuthShellProps) {
  const scriptsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  /* Floating script words */
  useEffect(() => {
    const field = scriptsRef.current;
    if (!field) return;
    field.innerHTML = "";
    FLOATING_WORDS.forEach((text, i) => {
      const s = document.createElement("span");
      s.textContent = text;
      s.style.top = `${5 + ((i * 13) % 88)}%`;
      s.style.left = `${3 + ((i * 19) % 85)}%`;
      s.style.fontSize = `${1.1 + (i % 3) * 0.55}rem`;
      s.style.animationDelay = `${i * 1.1}s`;
      s.style.animationDuration = `${18 + (i % 4) * 5}s`;
      field.appendChild(s);
    });
  }, []);

  /* Rising particles */
  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    container.innerHTML = "";
    const count = 22;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = `${Math.random() * 20}%`;
      p.style.width = `${1 + Math.random() * 2}px`;
      p.style.height = `${1 + Math.random() * 2}px`;
      p.style.animationDuration = `${6 + Math.random() * 12}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      p.style.opacity = `${0.2 + Math.random() * 0.5}`;
      container.appendChild(p);
    }
  }, []);

  return (
    <div className="auth-page">
      {/* ── Visual Side ── */}
      <div className="auth-visual">
        {/* Orbs */}
        <div className="auth-orb o1" />
        <div className="auth-orb o2" />
        <div className="auth-orb o3" />

        {/* Particles */}
        <div className="auth-particles" ref={particlesRef} />

        {/* Floating words */}
        <div className="auth-scripts" ref={scriptsRef} />

        <motion.div
          className="auth-visual-content"
          variants={slideIn}
          initial="hidden"
          animate="visible"
        >
          {/* Live badge */}
          <div className="auth-visual-badge">
            <span className="auth-visual-badge-dot" />
            <span>Live Learning Platform</span>
          </div>

          <h2>{visualTitle}</h2>
          <p>{visualSubtitle}</p>

          {/* Stats row */}
          <div className="auth-stats">
            <div className="auth-stat">
              <div className="n">7+</div>
              <div className="l">Languages</div>
            </div>
            <div className="auth-stat">
              <div className="n">19</div>
              <div className="l">Courses</div>
            </div>
            <div className="auth-stat">
              <div className="n">12+</div>
              <div className="l">Years</div>
            </div>
          </div>

          {/* Orbit widget */}
          <div className="auth-mini-orbit" aria-hidden>
            <div className="center">7+</div>
            <div className="ring">
              {[0, 51, 103, 154, 206, 257, 309].map((a) => (
                <span
                  key={a}
                  className="dot"
                  style={{ "--a": `${a}deg` } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Form Side ── */}
      <div className="auth-form-side">
        <Link href="/" className="auth-home-link">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <motion.div
          className="auth-form-wrap"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          <motion.div className="auth-form-header" variants={fadeUp} custom={0}>
            <div className="brand-row">
              <Logo showTagline={false} />
            </div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </motion.div>

          <motion.div className="auth-glass-card" variants={fadeUp} custom={1}>
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
