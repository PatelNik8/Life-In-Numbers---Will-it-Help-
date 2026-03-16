"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { cn, getScoreColor, getScoreLabel, getStreakEmoji } from "@/lib/utils";
import { Card, Badge, Progress, Skeleton } from "@/components/ui/primitives";
import { CATEGORY_CONFIG } from "@/lib/metrics";
import type { LifeScoreBreakdown, Habit } from "@/types";

// Lazy-load 3D score orb (no SSR)
const ScoreOrb = dynamic(
  () => import("@/components/3d/Scene").then((m) => ({ default: m.ScoreOrb })),
  { ssr: false, loading: () => <Skeleton className="w-full h-full rounded-full" /> }
);

// ─────────────────────────────────────────────────────────────────────────────
// LIFE SCORE WIDGET
// ─────────────────────────────────────────────────────────────────────────────
interface LifeScoreWidgetProps {
  score: LifeScoreBreakdown | null;
  loading?: boolean;
}

export function LifeScoreWidget({ score, loading }: LifeScoreWidgetProps) {
  const total = score?.total ?? 0;
  const color = getScoreColor(total);
  const label = getScoreLabel(total);

  if (loading) {
    return (
      <Card className="col-span-2 row-span-2">
        <Skeleton className="h-8 w-40 mb-6" />
        <Skeleton className="h-40 w-40 rounded-full mx-auto mb-6" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-4" />)}
        </div>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 row-span-2 flex flex-col gap-6" glow>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Life Score</h2>
          <p className="text-xs text-[var(--text-muted)]">Today&apos;s overall performance</p>
        </div>
        <Badge variant={total >= 80 ? "success" : total >= 60 ? "purple" : "warning"}>
          {label}
        </Badge>
      </div>

      {/* 3D Score Orb */}
      <div className="relative flex items-center justify-center">
        <div className="w-44 h-44 relative" id="life-score-orb">
          <ScoreOrb score={total} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.span
              key={total}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-black tabular-nums"
              style={{ color }}
            >
              {total}
            </motion.span>
            <span className="text-xs text-[var(--text-muted)] font-medium">/100</span>
          </div>
        </div>
        {score?.streakBonus && score.streakBonus > 0 && (
          <div className="absolute top-0 right-0">
            <Badge variant="warning">+{score.streakBonus} streak</Badge>
          </div>
        )}
      </div>

      {/* Category breakdown */}
      {score && (
        <div className="space-y-2.5">
          {(Object.entries(score.categories) as [keyof typeof CATEGORY_CONFIG, number][]).map(
            ([cat, val]) => {
              const cfg = CATEGORY_CONFIG[cat];
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-sm w-4">{cfg.icon}</span>
                  <span className="text-xs text-[var(--text-muted)] w-20 capitalize">{cfg.label}</span>
                  <Progress value={val} color={cfg.color} size="sm" className="flex-1" />
                  <span className="text-xs font-semibold tabular-nums w-7 text-right" style={{ color: cfg.color }}>
                    {val}
                  </span>
                </div>
              );
            }
          )}
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// METRIC CARD
// ─────────────────────────────────────────────────────────────────────────────
interface MetricCardProps {
  label: string;
  value: number | null;
  unit: string;
  icon: string;
  color: string;
  ideal: number;
  trend?: number; // % change from yesterday
}

export function MetricCard({ label, value, unit, icon, color, ideal, trend }: MetricCardProps) {
  const pct = value !== null ? Math.min(100, (value / ideal) * 100) : 0;
  const hasTrend = trend !== undefined && trend !== null;

  return (
    <Card className="flex flex-col gap-3 group">
      <div className="flex items-start justify-between">
        <span className="text-2xl">{icon}</span>
        {hasTrend && (
          <span className={cn("text-xs font-semibold", trend >= 0 ? "text-emerald-400" : "text-red-400")}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(0)}%
          </span>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black tabular-nums" style={{ color: value !== null ? color : "var(--text-muted)" }}>
            {value !== null ? value : "—"}
          </span>
          <span className="text-xs text-[var(--text-muted)]">{unit}</span>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{label}</p>
      </div>
      <Progress value={pct} color={color} size="sm" />
      <p className="text-xs text-[var(--text-muted)]">
        Goal: <span style={{ color }}>{ideal} {unit}</span>
      </p>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HABIT TRACKER WIDGET
// ─────────────────────────────────────────────────────────────────────────────
interface HabitTrackerProps {
  habits: Habit[];
  onToggle?: (habit: Habit) => void;
  loading?: boolean;
}

export function HabitTracker({ habits, onToggle, loading }: HabitTrackerProps) {
  if (loading) {
    return (
      <Card>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14" />)}
        </div>
      </Card>
    );
  }

  const completed = habits.filter((h) => h.completedToday).length;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[var(--text-primary)]">Today&apos;s Habits</h3>
          <p className="text-xs text-[var(--text-muted)]">{completed}/{habits.length} completed</p>
        </div>
        <Progress value={habits.length ? (completed / habits.length) * 100 : 0} className="w-20" />
      </div>

      <div className="space-y-2">
        {habits.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] text-center py-4">
            No habits yet. <a href="/dashboard/habits" className="text-[var(--color-primary)] underline">Add one!</a>
          </p>
        )}
        {habits.map((habit) => (
          <motion.button
            key={habit.id}
            id={`habit-toggle-${habit.id}`}
            onClick={() => onToggle?.(habit)}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left",
              habit.completedToday
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-[var(--border-default)] hover:border-[var(--border-accent)]"
            )}
          >
            <span className="text-lg">{habit.icon || "✨"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{habit.name}</p>
              <p className="text-xs text-[var(--text-muted)]">
                {habit.currentStreak ? `${getStreakEmoji(habit.currentStreak)} ${habit.currentStreak}d streak` : "Start your streak!"}
              </p>
            </div>
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
              habit.completedToday
                ? "border-emerald-500 bg-emerald-500"
                : "border-[var(--border-default)]"
            )}>
              {habit.completedToday && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WEEKLY SNAPSHOT WIDGET
// ─────────────────────────────────────────────────────────────────────────────
interface WeeklySnapshotProps {
  scores: { date: string; score: number }[];
}

export function WeeklySnapshot({ scores }: WeeklySnapshotProps) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const avg = scores.length ? Math.round(scores.reduce((s, d) => s + d.score, 0) / scores.length) : 0;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[var(--text-primary)]">This Week</h3>
          <p className="text-xs text-[var(--text-muted)]">Avg score: <span className="font-semibold" style={{ color: getScoreColor(avg) }}>{avg}</span></p>
        </div>
        <Badge variant={avg >= 70 ? "success" : "warning"}>{getScoreLabel(avg)}</Badge>
      </div>

      <div className="flex items-end gap-2 h-20">
        {days.map((day, i) => {
          const entry = scores[i];
          const height = entry ? `${Math.max(8, entry.score)}%` : "8%";
          const color = entry ? getScoreColor(entry.score) : "var(--border-default)";
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{ height, background: color, opacity: entry ? 1 : 0.2 }}
                title={entry ? `${day}: ${entry.score}` : day}
              />
              <span className="text-[10px] text-[var(--text-muted)]">{day[0]}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUICK STATS ROW
// ─────────────────────────────────────────────────────────────────────────────
interface QuickStatProps {
  icon: string;
  label: string;
  value: string;
  subtext?: string;
  color?: string;
}

export function QuickStat({ icon, label, value, subtext, color = "var(--color-primary)" }: QuickStatProps) {
  return (
    <Card className="flex items-center gap-4" hoverable>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: `${color}20` }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[var(--text-muted)] truncate">{label}</p>
        <p className="text-xl font-black tabular-nums" style={{ color }}>{value}</p>
        {subtext && <p className="text-xs text-[var(--text-muted)]">{subtext}</p>}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INSIGHT CARD
// ─────────────────────────────────────────────────────────────────────────────
interface InsightCardProps {
  icon?: string;
  title: string;
  body: string;
  type: string;
  color?: string;
  onRead?: () => void;
}

export function InsightCard({ icon = "💡", title, body, type, color = "#6366f1", onRead }: InsightCardProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const typeLabel: Record<string, string> = {
    weekly_summary: "Weekly Digest",
    ai_tip: "AI Insight",
    correlation: "Correlation",
    prediction: "Prediction",
    milestone: "Milestone 🎉",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <Card className="flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <Badge variant="purple">{typeLabel[type] || type}</Badge>
          </div>
          <button
            onClick={() => { setDismissed(true); onRead?.(); }}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-lg leading-none"
            aria-label="Dismiss insight"
          >
            ×
          </button>
        </div>
        <h4 className="font-bold text-[var(--text-primary)]">{title}</h4>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{body}</p>
      </Card>
    </motion.div>
  );
}
