"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { LifeScoreWidget, MetricCard, HabitTracker, WeeklySnapshot, QuickStat, InsightCard } from "@/components/dashboard/widgets";
import { LifeRadarChart, TrendLineChart } from "@/components/charts/charts";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { METRIC_DEFINITIONS } from "@/lib/metrics";
import { getScoreColor } from "@/lib/utils";
import type { LifeScoreBreakdown, Habit, Insight, ChartDataPoint, RadarDataPoint } from "@/types";

// ── Demo / placeholder data (replace with real API calls) ─────────────────────
const DEMO_SCORE: LifeScoreBreakdown = {
  total: 74,
  categories: { sleep: 85, fitness: 70, focus: 80, health: 60, mood: 75, mindfulness: 65, social: 70 },
  streakBonus: 2,
};

const DEMO_HABITS: Habit[] = [
  { id: "1", userId: "u1", name: "Morning Meditation", icon: "🧘", color: "#c084fc", category: "mindfulness", targetValue: 10, unit: "minutes", frequency: "daily", isActive: true, order: 0, createdAt: new Date(), description: null, cue: null, reward: null, stackedWith: null, completedToday: true, currentStreak: 12, longestStreak: 32 },
  { id: "2", userId: "u1", name: "2L Water", icon: "💧", color: "#22d3ee", category: "health", targetValue: 2, unit: "liters", frequency: "daily", isActive: true, order: 1, createdAt: new Date(), description: null, cue: null, reward: null, stackedWith: null, completedToday: false, currentStreak: 4, longestStreak: 21 },
  { id: "3", userId: "u1", name: "30 Min Run", icon: "🏃", color: "#10b981", category: "fitness", targetValue: 30, unit: "minutes", frequency: "daily", isActive: true, order: 2, createdAt: new Date(), description: null, cue: null, reward: null, stackedWith: null, completedToday: true, currentStreak: 7, longestStreak: 15 },
  { id: "4", userId: "u1", name: "Read 20 Pages", icon: "📚", color: "#6366f1", category: "focus", targetValue: 20, unit: "pages", frequency: "daily", isActive: true, order: 3, createdAt: new Date(), description: null, cue: null, reward: null, stackedWith: null, completedToday: false, currentStreak: 0, longestStreak: 45 },
];

const DEMO_WEEKLY: { date: string; score: number }[] = [
  { date: "2026-03-10", score: 65 },
  { date: "2026-03-11", score: 72 },
  { date: "2026-03-12", score: 55 },
  { date: "2026-03-13", score: 80 },
  { date: "2026-03-14", score: 78 },
  { date: "2026-03-15", score: 69 },
  { date: "2026-03-16", score: 74 },
];

const DEMO_TREND: ChartDataPoint[] = DEMO_WEEKLY.map((d) => ({ date: d.date, value: d.score }));

const DEMO_RADAR: RadarDataPoint[] = [
  { subject: "Sleep", value: 85, fullMark: 100 },
  { subject: "Fitness", value: 70, fullMark: 100 },
  { subject: "Focus", value: 80, fullMark: 100 },
  { subject: "Health", value: 60, fullMark: 100 },
  { subject: "Mood", value: 75, fullMark: 100 },
  { subject: "Mind", value: 65, fullMark: 100 },
  { subject: "Social", value: 70, fullMark: 100 },
];

const DEMO_INSIGHTS: Insight[] = [
  { id: "i1", userId: "u1", type: "weekly_summary", title: "Great week overall! 🎉", body: "Your Life Score averaged 70 this week, up 8% from last week. Sleep and focus were your strongest categories. Keep the momentum going!", icon: "📊", color: "#6366f1", weekNum: 11, year: 2026, isRead: false, isPinned: false, createdAt: new Date() },
  { id: "i2", userId: "u1", type: "correlation", title: "Sleep → Mood Connection Found", body: "When you sleep 7.5+ hours, your mood score is 32% higher the next day. Try setting a consistent 10:30 PM bedtime.", icon: "🔗", color: "#22d3ee", weekNum: null, year: null, isRead: false, isPinned: false, createdAt: new Date() },
];

const DISPLAY_METRICS = ["sleepHours", "studyHours", "exerciseMinutes", "mood", "waterLiters"];
const DEMO_LOG_VALUES: Record<string, number> = {
  sleepHours: 7.5, studyHours: 5, exerciseMinutes: 35, mood: 8, waterLiters: 1.8,
};

export default function DashboardPage() {
  const today = format(new Date(), "EEEE, MMMM d");
  const [habits, setHabits] = useState(DEMO_HABITS);

  function toggleHabit(habit: Habit) {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habit.id ? { ...h, completedToday: !h.completedToday } : h
      )
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-widest">
            {today}
          </p>
          <h1 className="text-3xl font-black">
            Good evening, <span className="gradient-text">Niket</span> 👋
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            You&apos;ve logged <span className="text-[var(--color-accent)] font-semibold">3/5</span> metrics today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="cyan">🔥 12 day streak</Badge>
          <a href="/dashboard/log">
            <Button variant="primary" size="md" id="quick-log-btn">
              ✏️ Log Today
            </Button>
          </a>
        </div>
      </motion.div>

      {/* ── Top Row: Life Score + Quick Stats ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-1 row-span-2">
          <LifeScoreWidget score={DEMO_SCORE} />
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-5">
          <QuickStat icon="🔥" label="Current Streak" value="12d" subtext="Best: 32d" color="#f59e0b" />
          <QuickStat icon="✅" label="Habits Today" value="2/4" subtext="50% done" color="#10b981" />
          <QuickStat icon="📅" label="Logs This Month" value="14" subtext="14/16 days" color="#6366f1" />
          <QuickStat icon="📈" label="Avg Score (30d)" value="68" subtext="+5 vs last month" color="#22d3ee" />
          <QuickStat icon="🧘" label="Meditation Streak" value="12d" subtext="Personal best!" color="#c084fc" />
          <QuickStat icon="💧" label="Water Today" value="1.8L" subtext="Goal: 2.5L" color="#22d3ee" />
        </div>
      </div>

      {/* ── Middle Row: Metrics + Habits + Radar ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Metric cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">Today&apos;s Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DISPLAY_METRICS.map((key) => {
              const def = METRIC_DEFINITIONS.find((m) => m.key === key);
              if (!def) return null;
              return (
                <MetricCard
                  key={key}
                  label={def.label}
                  value={DEMO_LOG_VALUES[key] ?? null}
                  unit={def.unit}
                  icon={def.icon}
                  color={def.color}
                  ideal={def.ideal}
                  trend={key === "mood" ? 12 : key === "sleepHours" ? 5 : -8}
                />
              );
            })}
          </div>
        </div>

        {/* Radar chart */}
        <div>
          <Card className="h-full">
            <h3 className="font-bold mb-4">Category Breakdown</h3>
            <LifeRadarChart data={DEMO_RADAR} />
          </Card>
        </div>
      </div>

      {/* ── Bottom Row: Trend + Habits + Weekly + Insights ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trend line */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Life Score Trend</h3>
            <div className="flex gap-1.5">
              {(["7d", "30d", "90d"] as const).map((p) => (
                <Button key={p} variant="ghost" size="sm" className={p === "7d" ? "bg-white/10" : ""}>{p}</Button>
              ))}
            </div>
          </div>
          <TrendLineChart data={DEMO_TREND} color={getScoreColor(DEMO_SCORE.total)} label="Life Score" />
        </Card>

        {/* Habits + Weekly snapshot */}
        <div className="space-y-5">
          <HabitTracker habits={habits} onToggle={toggleHabit} />
          <WeeklySnapshot scores={DEMO_WEEKLY} />
        </div>
      </div>

      {/* ── Insights ─────────────────────────────────────────────────────── */}
      {DEMO_INSIGHTS.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">🧠 Your Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEMO_INSIGHTS.map((insight) => (
              <InsightCard
                key={insight.id}
                icon={insight.icon || undefined}
                title={insight.title}
                body={insight.body}
                type={insight.type}
                color={insight.color || undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
