// ─────────────────────────────────────────────────────────────────────────────
// SHARED TYPESCRIPT TYPES
// Life in Numbers – Personal Data Dashboard
// ─────────────────────────────────────────────────────────────────────────────

// ── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}

// ── Daily Log ─────────────────────────────────────────────────────────────────
export interface DailyLog {
  id: string;
  userId: string;
  date: Date;
  sleepHours: number | null;
  sleepQuality: number | null;
  waterLiters: number | null;
  studyHours: number | null;
  exerciseMinutes: number | null;
  exerciseType: string | null;
  mood: number | null;
  energyLevel: number | null;
  screenTimeHours: number | null;
  stepsCount: number | null;
  caloriesConsumed: number | null;
  meditationMins: number | null;
  socialTime: number | null;
  journalPages: number | null;
  gratitudeItems: number | null;
  customMetrics: Record<string, number | boolean> | null;
  lifeScore: number | null;
  noteForDay: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ── Metric Definition (for UI rendering) ─────────────────────────────────────
export interface MetricDefinition {
  key: keyof DailyLog | string;
  label: string;
  unit: string;
  icon: string;
  color: string;
  ideal: number;
  min: number;
  max: number;
  step: number;
  category: MetricCategory;
  penaltyMetric?: boolean; // If true, lower is better
}

export type MetricCategory =
  | "sleep"
  | "fitness"
  | "focus"
  | "health"
  | "mood"
  | "mindfulness"
  | "social";

// ── Life Score ────────────────────────────────────────────────────────────────
export interface LifeScoreBreakdown {
  total: number;
  categories: {
    sleep: number;
    fitness: number;
    focus: number;
    health: number;
    mood: number;
    mindfulness: number;
    social: number;
  };
  streakBonus: number;
}

// ── Habit ─────────────────────────────────────────────────────────────────────
export type HabitFrequency = "daily" | "weekly";
export type HabitUnit =
  | "hours"
  | "liters"
  | "minutes"
  | "steps"
  | "boolean"
  | "pages"
  | "count"
  | "km"
  | "kg";
export type HabitCategory =
  | "health"
  | "focus"
  | "fitness"
  | "mindfulness"
  | "social"
  | "personal";

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  category: HabitCategory;
  targetValue: number;
  unit: HabitUnit;
  frequency: HabitFrequency;
  cue: string | null;
  reward: string | null;
  stackedWith: string | null;
  isActive: boolean;
  order: number;
  createdAt: Date;
  currentStreak?: number;
  longestStreak?: number;
  completedToday?: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: Date;
  value: number;
  completed: boolean;
  streak: number;
  note: string | null;
}

export interface HabitWithLogs extends Habit {
  logs: HabitLog[];
}

// ── Insight ───────────────────────────────────────────────────────────────────
export type InsightType =
  | "weekly_summary"
  | "ai_tip"
  | "correlation"
  | "prediction"
  | "milestone";

export interface Insight {
  id: string;
  userId: string;
  type: InsightType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  icon: string | null;
  color: string | null;
  weekNum: number | null;
  year: number | null;
  isRead: boolean;
  isPinned: boolean;
  createdAt: Date;
}

// ── API Response Wrappers ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

// ── Chart Data Types ──────────────────────────────────────────────────────────
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

export interface HeatmapDataPoint {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

// ── User Settings ─────────────────────────────────────────────────────────────
export interface UserSettings {
  id: string;
  userId: string;
  timezone: string;
  weeklyDigest: boolean;
  enabledMetrics: string[];
  theme: "dark" | "light";
}

// ── Streak ────────────────────────────────────────────────────────────────────
export interface StreakInfo {
  current: number;
  longest: number;
  lastLogged: Date | null;
}
