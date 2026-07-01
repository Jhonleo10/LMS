"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { POPULAR_TECHNOLOGIES } from "@/lib/tech-courses";
import "./landing.css";

const SCRIPTS = ["English", "हिंदी", "தமிழ்", "Deutsch", "français", "español", "AI", "Python"];

const CYCLE_PHRASES = [
  "Learning English",
  "हिंदी सीखना",
  "தமிழ் கற்றல்",
  "Apprendre le français",
  "Deutsch lernen",
  "Aprendiendo español",
  "Mastering Generative AI",
];

const ORBIT_CHIPS = [
  { label: "English", color: "#3B82F6" },
  { label: "हिंदी", color: "#F97316" },
  { label: "Français", color: "#1E3A8A" },
  { label: "தமிழ்", color: "#16A34A" },
  { label: "Deutsch", color: "#CA8A04" },
  { label: "Español", color: "#DC2626" },
  { label: "ChatGPT", color: "#FF6B47" },
];

const LANGUAGES = [
  { script: "Ab", icon: "En", color: "#3B82F6", name: "English", sub: "Spoken · Fluency · IELTS Prep" },
  { script: "अ", icon: "हि", color: "#F97316", name: "Hindi", sub: "Beginner to Advanced" },
  { script: "த", icon: "த", color: "#16A34A", name: "Tamil", sub: "Reading · Writing · Speaking" },
  { script: "Fr", icon: "Fr", color: "#1E3A8A", name: "French", sub: "DELF Aligned Curriculum" },
  { script: "De", icon: "De", color: "#CA8A04", name: "German", sub: "Goethe Certification Track" },
  { script: "Es", icon: "Es", color: "#DC2626", name: "Spanish", sub: "Conversational Mastery" },
  { script: "IE", icon: "IE", color: "#0EA5E9", name: "IELTS", sub: "Band 7+ Coaching" },
];

const SPOKEN_LANGS = ["English", "Hindi", "Tamil", "French", "German", "Spanish"];
const TRENDING = [
  "Data Analysis",
  "Machine Learning",
  "Data Science",
  "Artificial Intelligence",
  "Generative AI",
  "Prompt Engineering",
];

const MARQUEE_ITEMS = [
  "📞 +91 72000 08953",
  "✉ info@aitlanguageacademy.com",
  "📍 Ambattur, Chennai",
];

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".ait-landing .reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useHeaderScroll(headerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const onScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle("scrolled", window.scrollY > 10);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headerRef]);
}

function useTypewriter() {
  const [text, setText] = useState("");

  useEffect(() => {
    let pIndex = 0;
    let cIndex = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = CYCLE_PHRASES[pIndex];
      if (!deleting) {
        cIndex++;
        setText(current.slice(0, cIndex));
        if (cIndex === current.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 1400);
          return;
        }
        timeoutId = setTimeout(tick, 65);
      } else {
        cIndex--;
        setText(current.slice(0, cIndex));
        if (cIndex === 0) {
          deleting = false;
          pIndex = (pIndex + 1) % CYCLE_PHRASES.length;
        }
        timeoutId = setTimeout(tick, 35);
      }
    };

    tick();
    return () => clearTimeout(timeoutId);
  }, []);

  return text;
}

export default function LandingPage() {
  const headerRef = useRef<HTMLElement>(null);
  const scriptFieldRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const cycleText = useTypewriter();

  useScrollReveal();
  useHeaderScroll(headerRef);

  useEffect(() => {
    const field = scriptFieldRef.current;
    if (!field) return;
    field.innerHTML = "";
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("span");
      s.textContent = SCRIPTS[i % SCRIPTS.length];
      s.style.fontSize = `${1.4 + Math.random() * 2.2}rem`;
      s.style.top = `${Math.random() * 90}%`;
      s.style.left = `${Math.random() * 92}%`;
      s.style.animationDelay = `${Math.random() * 6}s`;
      s.style.animationDuration = `${14 + Math.random() * 10}s`;
      field.appendChild(s);
    }
  }, []);

  const portalHref = session?.user?.role === "ADMIN" ? "/admin" : "/dashboard";
  const portalLabel = session?.user?.role === "ADMIN" ? "Admin Panel" : "My Courses";

  return (
    <div className="ait-landing">
      <header ref={headerRef} className="site-header" id="siteHeader">
        <div className="nav">
          <Link href="/" className="brand">
            <span className="brand-mark">A</span>
            <span className="brand-text">
              <span className="b1">AIT Language Academy</span>
              <span className="b2">Languages · AI · Data</span>
            </span>
          </Link>

          <nav className="links-pill">
            <a href="#" className="active">Home</a>
            <a href="#about">About</a>
            <a href="#languages">Languages</a>
            <a href="#tech">Courses</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="nav-actions">
            {session ? (
              <Link href={portalHref} className="nav-register">
                {portalLabel}
              </Link>
            ) : (
              <>
                <Link href="/login" className="nav-login">
                  Login
                </Link>
                <Link href="/register" className="nav-register">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className={`nav-toggle${mobileOpen ? " open" : ""}`}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`mobile-drawer${mobileOpen ? " open" : ""}`}>
          <nav className="mobile-links">
            <a href="#" onClick={() => setMobileOpen(false)}>Home</a>
            <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
            <a href="#languages" onClick={() => setMobileOpen(false)}>Languages</a>
            <a href="#tech" onClick={() => setMobileOpen(false)}>Courses</a>
            <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
          </nav>
          <div className="mobile-actions">
            {session ? (
              <Link href={portalHref} className="nav-register" onClick={() => setMobileOpen(false)}>
                {portalLabel}
              </Link>
            ) : (
              <>
                <Link href="/login" className="nav-login" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="nav-register" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="script-field" ref={scriptFieldRef} />
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow on-dark">Chennai&apos;s Language &amp; AI Academy</p>
            <h1>
              Skills for today,
              <br />
              <em>power</em> for tomorrow.
            </h1>
            <p className="lead">
              Learn global languages and master cutting-edge AI &amp; IT skills under one
              roof. AIT helps you grow in communication, technology, and career success.
            </p>
            <div className="script-cycler">
              <span>{cycleText}</span>
              <span className="caret" />
            </div>
            <div className="hero-ctas">
              <a href="#languages" className="btn btn-primary">
                Explore Courses <span className="btn-arrow">→</span>
              </a>
              <a href="tel:+917200008953" className="btn btn-ghost">
                +91 72000 08953
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="orbit-system">
              <div className="orbit-glow" />
              <div className="orbit-ring r1" />
              <div className="orbit-ring r2" />
              <div className="orbit-ring r3" />
              <div className="orbit-center">
                <div className="orbit-center-pulse" />
                <div className="orbit-center-inner">
                  <span className="big">7+</span>
                  <span className="small">Languages &amp; AI Tracks</span>
                </div>
              </div>
              <div className="orbit-track">
                {ORBIT_CHIPS.map((chip, i) => (
                  <div
                    key={chip.label}
                    className="orbit-item"
                    style={{ "--angle": `${i * (360 / ORBIT_CHIPS.length)}deg`, "--chip-color": chip.color } as React.CSSProperties}
                  >
                    <span className="orbit-chip">
                      <span className="orbit-chip-dot" />
                      {chip.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <a
          className="whatsapp-fab"
          href="https://wa.me/917200008953"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="#fff">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.09-1.33A9.93 9.93 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.2 14.18c-.22.62-1.28 1.18-1.77 1.25-.45.07-1.02.1-1.65-.1-.38-.12-.87-.28-1.5-.55-2.64-1.14-4.36-3.8-4.5-3.98-.13-.18-1.08-1.44-1.08-2.74 0-1.3.68-1.94.92-2.2.24-.27.52-.33.7-.33h.5c.16 0 .37-.06.58.44.22.52.74 1.8.8 1.93.07.13.11.28.02.45-.09.18-.13.28-.26.43-.13.15-.27.34-.39.46-.13.13-.26.27-.11.53.15.27.67 1.1 1.44 1.78 1 .88 1.83 1.16 2.1 1.29.27.13.43.11.59-.07.16-.18.67-.78.85-1.05.18-.27.36-.22.6-.13.24.09 1.53.72 1.79.85.27.13.44.2.5.31.07.11.07.62-.15 1.24z" />
          </svg>
        </a>
      </section>

      <section className="welcome reveal" id="about">
        <div className="wrap welcome-grid">
          <div>
            <p className="eyebrow">Welcome</p>
            <h2>Welcome to AIT Language Academy</h2>
            <p>
              At AIT, we specialize exclusively in teaching foreign and regional languages,
              providing in-depth knowledge of both language and culture. Our tailored programmes
              are designed to meet the unique needs of every learner, helping them master language
              skills effectively. With our expert trainers, we empower students to confidently
              prepare for and succeed in international language certification exams.
            </p>
            <p>
              We offer both online and offline courses, providing flexible learning options for
              individuals across different locations. Our high-quality language training equips
              students with the communication skills and confidence required to pursue rewarding
              career opportunities in a global environment.
            </p>
            <Link href={session ? portalHref : "/login"} className="btn btn-dark" style={{ marginTop: 14 }}>
              {session ? "Go to Portal" : "Read More"} <span className="btn-arrow">→</span>
            </Link>
          </div>
          <div className="welcome-img">
            <img
              src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200&auto=format&fit=crop"
              alt="Open book and laptop in classroom"
            />
            <div className="float-badge">
              <div className="n">12+</div>
              <div className="t">Years Guiding Learners</div>
            </div>
          </div>
        </div>
      </section>

      <section className="languages reveal" id="languages">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Languages</p>
            <h2>Teaching Languages</h2>
          </div>
          <div className="lang-grid reveal-stagger">
            {LANGUAGES.map((lang, i) => (
              <div
                key={lang.name}
                className="lang-card"
                data-script={lang.script}
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className="lang-icon" style={{ background: lang.color }}>
                  {lang.icon}
                </div>
                <div>
                  <div className="lang-name">{lang.name}</div>
                  <div className="lang-sub">{lang.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why reveal">
        <div className="wrap">
          <div className="why-grid">
            <div className="why-hero">
              <h3>Why Choose AIT?</h3>
              <p>
                At AIT, we prepare you with the skills that matter today and tomorrow. From
                spoken languages to Generative AI, Data Science, and Deep Learning — we combine
                expert mentorship, practical training, and future-ready programs to help you
                succeed in your career and beyond.
              </p>
              <a href="#tech" className="why-link">
                Learn More{" "}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
            <div className="why-item">
              <div className="why-ic">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B47" strokeWidth="2">
                  <path d="M3 3v18h18M7 14l4-4 3 3 5-6" />
                </svg>
              </div>
              <h4>Future Skills</h4>
              <p>Learn AI, Generative AI, and Deep Learning with industry-driven training programs.</p>
            </div>
            <div className="why-item">
              <div className="why-ic">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1FA89B" strokeWidth="2">
                  <path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.5 5.5 21 7.5 13.5 2 9h7z" />
                </svg>
              </div>
              <h4>Expert Mentors</h4>
              <p>Gain knowledge from certified trainers and industry experts with real-world experience.</p>
            </div>
            <div className="why-item">
              <div className="why-ic">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2">
                  <circle cx="9" cy="8" r="3" />
                  <circle cx="17" cy="9" r="2.5" />
                  <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M14.5 20c0-2.5-1-1.7-2.7-5.7A5 5 0 0121.5 18.5" />
                </svg>
              </div>
              <h4>Global Exposure</h4>
              <p>Master spoken languages and digital skills to communicate and compete worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="phone-banner" id="contact">
        <div className="marquee">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </section>

      <section className="tech reveal" id="tech">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Technology</p>
            <h2>Popular Technology</h2>
          </div>
          <div className="tech-light-grid reveal-stagger">
            {POPULAR_TECHNOLOGIES.map((course, i) => (
              <div
                key={course.name}
                className="tech-light-card"
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className="tech-light-icon">{course.icon}</div>
                <span className="tech-light-name">{course.name}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link href={session ? "/dashboard" : "/register"} className="btn btn-dark">
              {session ? "Watch Published Videos" : "Register to Access Videos"}{" "}
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap footer-grid">
          <div className="footer-brand">
            <h3>AIT Language Academy</h3>
            <p>
              <strong>Address:</strong> Ambattur O.T. Landmark, opp. Bharath Petrol Bunk,
              Chennai, Tamil Nadu 600053.
            </p>
            <p>
              <strong>Phone:</strong> +91 72000 08953
            </p>
            <p>
              <strong>Email:</strong> info@aitlanguageacademy.com
            </p>
            <div className="socials">
              <a href="#" aria-label="X">𝕏</a>
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Instagram">◎</a>
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Spoken Languages</h5>
            <ul className="footer-links">
              {SPOKEN_LANGS.map((l) => (
                <li key={l}>
                  <a href="#languages">{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5>Trending Courses</h5>
            <ul className="footer-links">
              {TRENDING.map((c) => (
                <li key={c}>
                  <a href="#tech">{c}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5>Stay Ahead with AIT</h5>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "rgba(250,246,238,0.7)" }}>
              Get exclusive updates on Spoken Language, AI, Data Science, and Gen AI courses. Be
              the first to know about new batches, free workshops, career tips, and special
              discounts.
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: 1.8,
                color: "rgba(250,246,238,0.7)",
                marginTop: 14,
              }}
            >
              Have questions about our Spoken Languages or Trending AI &amp; Data Courses?
              We&apos;d love to help you choose the right path for your career.
            </p>
          </div>
        </div>
        <div className="footer-fine wrap">
          Best English language learning institute in Ambattur, Spoken English classes in
          Ambattur, English communication course near me, Best Hindi language learning institute
          in Ambattur, Spoken Hindi classes near Ambattur, Hindi speaking course in Chennai,
          Best Tamil language learning institute in Ambattur, Spoken Tamil classes in Ambattur,
          Tamil speaking course near me, Best French language learning institute in Ambattur,
          Best French classes near me, Spoken French course in Chennai, Best German language
          learning institute in Ambattur, Best German speaking classes in Chennai, Spoken German
          training in Ambattur, Best Spanish language learning institute in Ambattur, Best
          Spanish speaking course in Chennai, Spanish classes near me, Best Data Science
          institute in Ambattur, Data Science course with placement in Chennai, Data Science
          classes near me, Best Machine Learning institute in Ambattur, ML training institute
          in Chennai, Machine Learning course near me, Artificial Intelligence training
          institute in Ambattur, Best AI course in Chennai, AI classes near me, Best Generative
          AI course in Ambattur, Gen AI training institute in Chennai, Generative AI classes
          near me, Prompt Engineering course in Ambattur, Best Prompt Engineering institute
          in Chennai, Prompt Engineering classes near me, Best Data Analysis institute in
          Ambattur, Data Analytics course in Chennai, Data Analysis classes near me, Best Data
          Engineering institute in Ambattur, Data Engineering training in Chennai, Data
          Engineering classes near me.
        </div>
      </footer>
    </div>
  );
}
