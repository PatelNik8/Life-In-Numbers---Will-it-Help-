import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO, isToday, isYesterday } from "date-fns";

// ── Tailwind class merger ─────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Number formatting ─────────────────────────────────────────────────────────
export function formatNumber(n: number, decimals = 1): string {
  return n % 1 === 0 ? n.toString() : n.toFixed(decimals);
}

export function formatPercent(value: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

// ── Date formatting ───────────────────────────────────────────────────────────
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d, yyyy");
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d");
}

export function formatRelative(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function getISODate(date: Date = new Date()): string {
  return format(date, "yyyy-MM-dd");
}

export function getWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// ── Color utilities ───────────────────────────────────────────────────────────
export function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981"; // emerald
  if (score >= 60) return "#6366f1"; // indigo
  if (score >= 40) return "#f59e0b"; // amber
  return "#ef4444"; // red
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Exceptional";
  if (score >= 75) return "Great";
  if (score >= 60) return "Good";
  if (score >= 45) return "Fair";
  if (score >= 30) return "Needs Work";
  return "Low";
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 100) return "🏆";
  if (streak >= 30) return "💎";
  if (streak >= 14) return "⚡";
  if (streak >= 7) return "🔥";
  if (streak >= 3) return "✨";
  return "🌱";
}

// ── Clamp ─────────────────────────────────────────────────────────────────────
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ── Array utilities ───────────────────────────────────────────────────────────
export function groupBy<T, K extends string | number>(
  arr: T[],
  fn: (item: T) => K
): Record<K, T[]> {
  return arr.reduce(
    (acc, item) => {
      const key = fn(item);
      return { ...acc, [key]: [...(acc[key] || []), item] };
    },
    {} as Record<K, T[]>
  );
}

export function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, n) => sum + n, 0) / arr.length;
}
