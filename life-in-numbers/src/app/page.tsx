"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/primitives";

// Load the 3D scene only on client
const LandingScene = dynamic(
  () => import("@/components/3d/Scene").then((m) => ({ default: m.LandingScene })),
  { ssr: false }
);

const STATS = [
  { label: "Metrics Tracked", value: "14+", icon: "📊" },
  { label: "Life Score Factors", value: "7", icon: "⭐" },
  { label: "Habit Streaks", value: "∞", icon: "🔥" },
  { label: "Weekly Insights", value: "AI", icon: "🧠" },
];

const FEATURES = [
  {
    icon: "📊",
    title: "Holistic Analytics",
    description: "Track 14+ daily metrics — sleep, mood, fitness, focus, hydration, and more. See the full picture of your life.",
    color: "#6366f1",
  },
  {
    icon: "🔥",
    title: "Streak Engine",
    description: "Never break the chain. Our Atomic Habits-inspired streak system keeps you accountable with visual cues and bonuses.",
    color: "#f59e0b",
  },
  {
    icon: "⭐",
    title: "Life Score",
    description: "A single weighted score from 0–100 that reflects how good your day was. Know exactly how you're performing.",
    color: "#10b981",
  },
  {
    icon: "🧠",
    title: "AI Insights",
    description: "Discover hidden patterns. Our AI finds correlations between sleep and mood, exercise and focus — and tells you what to change.",
    color: "#22d3ee",
  },
  {
    icon: "📅",
    title: "Heatmap Calendar",
    description: "A bird's-eye view of your entire year. See patterns, gaps, and your growth at a single glance.",
    color: "#a78bfa",
  },
  {
    icon: "⚡",
    title: "Quick Logging",
    description: "Log your daily data in under 60 seconds. No friction — just insight. Designed for consistency.",
    color: "#f472b6",
  },
];

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-hidden">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-[var(--border-default)]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-black">
            L
          </div>
          <span className="font-black text-lg gradient-text">Life in Numbers</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" id="nav-login-btn">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm" id="nav-signup-btn">Get Started Free</Button>
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* 3D background scene */}
        <div className="absolute inset-0 opacity-80">
          <LandingScene />
        </div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 30%, var(--bg-primary) 75%)" }}
        />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold glass border border-[var(--border-default)] text-[var(--color-accent)] mb-8">
              ✨ Google Analytics, but for your life
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black leading-tight mb-6"
          >
            Transform Your
            <br />
            <span className="gradient-text">Daily Data</span>
            <br />
            Into Insights
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Track sleep, mood, fitness, focus &amp; more. Get a daily Life Score, build unbreakable habits, and discover AI-powered insights about yourself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <Button size="lg" variant="primary" id="hero-cta-btn"
                className="px-8 shadow-2xl shadow-indigo-500/30 animate-pulse-glow">
                🚀 Start Tracking Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" id="hero-demo-btn">
                👀 See Demo Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)]"
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-[var(--border-default)] flex items-start justify-center p-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
          </div>
        </motion.div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-mesh">
        <FadeUp>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center card">
                <span className="text-3xl">{stat.icon}</span>
                <p className="text-3xl font-black gradient-text mt-2">{stat.value}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ── Features Grid ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Everything you need to
                <br />
                <span className="gradient-text">understand yourself</span>
              </h2>
              <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
                Built for people obsessed with self-improvement. Every feature designed to help you build better habits and a better life.
              </p>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.1}>
                <div className="card group cursor-default">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: `${f.color}20` }}>
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{f.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.description}</p>
                  <div className="mt-4 h-0.5 rounded-full transition-all duration-500 w-0 group-hover:w-full"
                    style={{ background: `linear-gradient(90deg, ${f.color}, transparent)` }}
                  />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <FadeUp>
          <div className="max-w-3xl mx-auto text-center card glow-primary">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-4xl font-black mb-4">
              Ready to see your <span className="gradient-text">Life Score</span>?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
              Join thousands building better habits. Start logging today and unlock AI-powered insights about your life.
            </p>
            <Link href="/register">
              <Button size="lg" variant="primary" id="footer-cta-btn" className="px-12 shadow-2xl shadow-indigo-500/30">
                Create Free Account
              </Button>
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-[var(--border-default)] text-center text-xs text-[var(--text-muted)]">
        <p>© {new Date().getFullYear()} Life in Numbers. Built with ❤️ for better humans.</p>
      </footer>
    </div>
  );
}
