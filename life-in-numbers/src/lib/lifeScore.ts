// ─────────────────────────────────────────────────────────────────────────────
// LIFE SCORE ALGORITHM
// Weighted composite score (0–100) derived from daily metrics
// ─────────────────────────────────────────────────────────────────────────────

import { clamp } from "@/lib/utils";
import type { DailyLog, LifeScoreBreakdown } from "@/types";

// ── Category weights (must sum to 1.0) ───────────────────────────────────────
const WEIGHTS = {
  sleep: 0.20,
  fitness: 0.20,
  focus: 0.20,
  health: 0.15,
  mood: 0.15,
  mindfulness: 0.10,
  social: 0.10,
} as const;

// ── Individual category scorers (return 0–1) ──────────────────────────────────

function scoreSleep(hours: number | null, quality: number | null): number {
  if (hours === null) return 0;
  // Ideal: 7–9 hours; penalty below 6 and above 10
  let hoursScore: number;
  if (hours >= 7 && hours <= 9) hoursScore = 1;
  else if (hours >= 6 && hours < 7) hoursScore = 0.7;
  else if (hours > 9 && hours <= 10) hoursScore = 0.8;
  else if (hours >= 5 && hours < 6) hoursScore = 0.4;
  else hoursScore = clamp(hours / 7, 0, 1) * 0.3;

  const qualityScore = quality !== null ? quality / 10 : 0.7; // default if not set
  return hoursScore * 0.6 + qualityScore * 0.4;
}

function scoreFitness(
  exerciseMinutes: number | null,
  stepsCount: number | null
): number {
  const exerciseScore = exerciseMinutes !== null
    ? clamp(exerciseMinutes / 45, 0, 1) // ideal: 45 min
    : 0;
  const stepsScore = stepsCount !== null
    ? clamp(stepsCount / 10000, 0, 1) // ideal: 10,000 steps
    : 0;
  if (exerciseMinutes === null && stepsCount === null) return 0;
  if (exerciseMinutes === null) return stepsScore;
  if (stepsCount === null) return exerciseScore;
  return exerciseScore * 0.6 + stepsScore * 0.4;
}

function scoreFocus(
  studyHours: number | null,
  screenTimeHours: number | null
): number {
  const studyScore = studyHours !== null
    ? clamp(studyHours / 6, 0, 1) // ideal: 6 hours
    : 0;
  // Screen time is a penalty metric: lower is better (ideal: <= 3h)
  const screenPenalty = screenTimeHours !== null
    ? clamp(screenTimeHours / 8, 0, 1) * 0.3 // max 30% penalty
    : 0;
  if (studyHours === null && screenTimeHours === null) return 0;
  if (studyHours === null) return 1 - screenPenalty; // only penalize
  return clamp(studyScore - screenPenalty, 0, 1);
}

function scoreHealth(
  waterLiters: number | null,
  caloriesConsumed: number | null
): number {
  const waterScore = waterLiters !== null
    ? clamp(waterLiters / 2.5, 0, 1) // ideal: 2.5L
    : 0;
  // Calories: ideal range 1800–2400 kcal
  let caloriesScore = 0;
  if (caloriesConsumed !== null) {
    if (caloriesConsumed >= 1800 && caloriesConsumed <= 2400) caloriesScore = 1;
    else if (caloriesConsumed >= 1500 && caloriesConsumed < 1800) caloriesScore = 0.7;
    else if (caloriesConsumed > 2400 && caloriesConsumed <= 2800) caloriesScore = 0.6;
    else caloriesScore = 0.3;
  }
  if (waterLiters === null && caloriesConsumed === null) return 0;
  if (waterLiters === null) return caloriesScore;
  if (caloriesConsumed === null) return waterScore;
  return waterScore * 0.5 + caloriesScore * 0.5;
}

function scoreMood(mood: number | null, energyLevel: number | null): number {
  const moodScore = mood !== null ? mood / 10 : 0;
  const energyScore = energyLevel !== null ? energyLevel / 10 : 0;
  if (mood === null && energyLevel === null) return 0;
  if (mood === null) return energyScore;
  if (energyLevel === null) return moodScore;
  return moodScore * 0.6 + energyScore * 0.4;
}

function scoreMindfulness(
  meditationMins: number | null,
  journalPages: number | null,
  gratitudeItems: number | null
): number {
  const meditationScore = meditationMins !== null
    ? clamp(meditationMins / 20, 0, 1) // ideal: 20 min
    : 0;
  const journalScore = journalPages !== null
    ? clamp(journalPages / 2, 0, 1) // ideal: 2 pages
    : 0;
  const gratitudeScore = gratitudeItems !== null
    ? clamp(gratitudeItems / 3, 0, 1) // ideal: 3 items
    : 0;

  const available = [meditationMins, journalPages, gratitudeItems].filter((x) => x !== null).length;
  if (available === 0) return 0;

  const sum = (meditationMins !== null ? meditationScore : 0) +
    (journalPages !== null ? journalScore : 0) +
    (gratitudeItems !== null ? gratitudeScore : 0);
  return sum / available;
}

function scoreSocial(socialTime: number | null): number {
  if (socialTime === null) return 0;
  return clamp(socialTime / 2, 0, 1); // ideal: 2 hours
}

// ── Streak Bonus ──────────────────────────────────────────────────────────────
function computeStreakBonus(currentStreak: number): number {
  if (currentStreak >= 30) return 5;
  if (currentStreak >= 14) return 3;
  if (currentStreak >= 7) return 2;
  return 0;
}

// ── Main Life Score Computation ───────────────────────────────────────────────
export function computeLifeScore(
  log: Partial<DailyLog>,
  currentStreak: number = 0
): LifeScoreBreakdown {
  const categories = {
    sleep: scoreSleep(log.sleepHours ?? null, log.sleepQuality ?? null),
    fitness: scoreFitness(log.exerciseMinutes ?? null, log.stepsCount ?? null),
    focus: scoreFocus(log.studyHours ?? null, log.screenTimeHours ?? null),
    health: scoreHealth(log.waterLiters ?? null, log.caloriesConsumed ?? null),
    mood: scoreMood(log.mood ?? null, log.energyLevel ?? null),
    mindfulness: scoreMindfulness(
      log.meditationMins ?? null,
      log.journalPages ?? null,
      log.gratitudeItems ?? null
    ),
    social: scoreSocial(log.socialTime ?? null),
  };

  // Count how many categories have data
  const activeWeightSum = (Object.keys(categories) as Array<keyof typeof categories>)
    .filter((k) => categories[k] > 0)
    .reduce((sum, k) => sum + WEIGHTS[k], 0);

  // Weighted sum, re-normalized to account for missing categories
  const rawScore = activeWeightSum > 0
    ? (Object.keys(categories) as Array<keyof typeof categories>).reduce(
        (sum, k) => sum + categories[k] * WEIGHTS[k],
        0
      ) / activeWeightSum
    : 0;

  const streakBonus = computeStreakBonus(currentStreak);
  const total = Math.min(100, Math.round(rawScore * 100 + streakBonus));

  return {
    total,
    categories: {
      sleep: Math.round(categories.sleep * 100),
      fitness: Math.round(categories.fitness * 100),
      focus: Math.round(categories.focus * 100),
      health: Math.round(categories.health * 100),
      mood: Math.round(categories.mood * 100),
      mindfulness: Math.round(categories.mindfulness * 100),
      social: Math.round(categories.social * 100),
    },
    streakBonus,
  };
}
