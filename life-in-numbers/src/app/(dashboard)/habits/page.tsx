"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, Progress, EmptyState } from "@/components/ui/primitives";
import { StreakBar } from "@/components/charts/charts";
import { getStreakEmoji, cn } from "@/lib/utils";
import { CATEGORY_CONFIG } from "@/lib/metrics";
import type { Habit, HabitCategory } from "@/types";

// Demo data
const DEMO_HABITS: Habit[] = [
  { id: "1", userId: "u1", name: "Morning Meditation", icon: "🧘", color: "#c084fc", category: "mindfulness", targetValue: 10, unit: "minutes", frequency: "daily", isActive: true, order: 0, createdAt: new Date(), description: "Start the day with a clear mind", cue: "Wake up", reward: "Coffee", stackedWith: null, completedToday: true, currentStreak: 12, longestStreak: 32 },
  { id: "2", userId: "u1", name: "2L Water", icon: "💧", color: "#22d3ee", category: "health", targetValue: 2, unit: "liters", frequency: "daily", isActive: true, order: 1, createdAt: new Date(), description: null, cue: "Morning alarm", reward: "Feeling energised", stackedWith: null, completedToday: false, currentStreak: 4, longestStreak: 21 },
  { id: "3", userId: "u1", name: "30 Min Run", icon: "🏃", color: "#10b981", category: "fitness", targetValue: 30, unit: "minutes", frequency: "daily", isActive: true, order: 2, createdAt: new Date(), description: "Build cardiovascular endurance", cue: "After breakfast", reward: "Post-run stretch", stackedWith: null, completedToday: true, currentStreak: 7, longestStreak: 15 },
  { id: "4", userId: "u1", name: "Read 20 Pages", icon: "📚", color: "#6366f1", category: "focus", targetValue: 20, unit: "pages", frequency: "daily", isActive: true, order: 3, createdAt: new Date(), description: "Expand knowledge daily", cue: "Before bed", reward: "Sleep better", stackedWith: null, completedToday: false, currentStreak: 0, longestStreak: 45 },
  { id: "5", userId: "u1", name: "Journaling", icon: "📓", color: "#a3e635", category: "mindfulness", targetValue: 1, unit: "pages", frequency: "daily", isActive: true, order: 4, createdAt: new Date(), description: null, cue: "Evening wind-down", reward: "Clarity", stackedWith: null, completedToday: false, currentStreak: 3, longestStreak: 18 },
];

const HABIT_CATEGORIES: HabitCategory[] = ["health", "focus", "fitness", "mindfulness", "social", "personal"];

interface HabitModalProps {
  habit?: Partial<Habit>;
  onClose: () => void;
  onSave: (h: Partial<Habit>) => void;
}

function HabitCard({ habit, onToggle, onEdit }: { habit: Habit; onToggle: () => void; onEdit: () => void }) {
  const cfg = CATEGORY_CONFIG[habit.category as keyof typeof CATEGORY_CONFIG];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "card flex flex-col gap-4 cursor-default",
        habit.completedToday && "border-emerald-500/30 bg-emerald-500/5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${habit.color || "#6366f1"}20` }}>
            {habit.icon || "✨"}
          </div>
          <div>
            <p className="font-bold text-[var(--text-primary)]">{habit.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="purple" className="text-[10px]">{cfg?.icon} {cfg?.label}</Badge>
              <span className="text-xs text-[var(--text-muted)]">
                Goal: {habit.targetValue} {habit.unit}
              </span>
            </div>
          </div>
        </div>
        <button
          id={`complete-habit-${habit.id}`}
          onClick={onToggle}
          className={cn(
            "w-8 h-8 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300",
            habit.completedToday
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-[var(--border-default)] hover:border-[var(--color-primary)]"
          )}
        >
          {habit.completedToday && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Streak */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">
            {getStreakEmoji(habit.currentStreak || 0)} Current Streak
          </span>
          <span className="text-xs font-bold" style={{ color: habit.color || "#6366f1" }}>
            {habit.currentStreak || 0} days
          </span>
        </div>
        <StreakBar streak={habit.currentStreak || 0} maxStreak={habit.longestStreak || 100} color={habit.color || "#6366f1"} />
        <p className="text-[10px] text-[var(--text-muted)]">Best: {habit.longestStreak || 0} days</p>
      </div>

      {/* Atomic Habit details */}
      {(habit.cue || habit.reward) && (
        <div className="flex gap-3">
          {habit.cue && (
            <div className="flex-1 rounded-lg bg-white/3 p-2">
              <p className="text-[10px] text-[var(--text-muted)] font-medium">CUE</p>
              <p className="text-xs text-[var(--text-secondary)]">{habit.cue}</p>
            </div>
          )}
          {habit.reward && (
            <div className="flex-1 rounded-lg bg-white/3 p-2">
              <p className="text-[10px] text-[var(--text-muted)] font-medium">REWARD</p>
              <p className="text-xs text-[var(--text-secondary)]">{habit.reward}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onEdit} id={`edit-habit-${habit.id}`} className="flex-1">
          ✏️ Edit
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 text-red-400">
          🗑 Remove
        </Button>
      </div>
    </motion.div>
  );
}

export default function HabitsPage() {
  const [habits, setHabits] = useState(DEMO_HABITS);
  const [showModal, setShowModal] = useState(false);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({ name: "", icon: "✨", category: "health", targetValue: 1, unit: "minutes", frequency: "daily" });

  function toggleHabit(id: string) {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completedToday: !h.completedToday } : h))
    );
  }

  const completed = habits.filter((h) => h.completedToday).length;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">
            <span className="gradient-text">Habit</span> Library
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {completed}/{habits.length} done today · Build your atomic habits
          </p>
        </div>
        <Button variant="primary" id="add-habit-btn" onClick={() => setShowModal(true)}>
          ✨ Add Habit
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Habits", value: habits.length, icon: "📋", color: "#6366f1" },
          { label: "Done Today", value: `${completed}/${habits.length}`, icon: "✅", color: "#10b981" },
          { label: "Best Streak", value: `${Math.max(...habits.map((h) => h.longestStreak || 0))}d`, icon: "🏆", color: "#f59e0b" },
          { label: "Avg Streak", value: `${Math.round(habits.reduce((s, h) => s + (h.currentStreak || 0), 0) / habits.length)}d`, icon: "📈", color: "#22d3ee" },
        ].map((stat) => (
          <Card key={stat.label} className="flex items-center gap-3">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Cards grid */}
      {habits.length === 0 ? (
        <EmptyState icon="🌱" title="No habits yet" description="Start building your first atomic habit." action={<Button variant="primary" onClick={() => setShowModal(true)}>Add Habit</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onToggle={() => toggleHabit(habit.id)} onEdit={() => { setNewHabit(habit); setShowModal(true); }} />
          ))}
        </div>
      )}

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl" hoverable={false}>
                <h2 className="text-xl font-black">New Atomic Habit</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[var(--text-muted)] font-medium">Habit Name</label>
                    <input id="habit-name-input" value={newHabit.name || ""} onChange={(e) => setNewHabit((p) => ({ ...p, name: e.target.value }))} placeholder="e.g., Morning Meditation" className="w-full mt-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-glass)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[var(--text-muted)] font-medium">Icon (emoji)</label>
                      <input id="habit-icon-input" value={newHabit.icon || ""} onChange={(e) => setNewHabit((p) => ({ ...p, icon: e.target.value }))} placeholder="😊" className="w-full mt-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-glass)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)]" />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-muted)] font-medium">Category</label>
                      <select id="habit-category-select" value={newHabit.category} onChange={(e) => setNewHabit((p) => ({ ...p, category: e.target.value as HabitCategory }))} className="w-full mt-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-glass)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)]">
                        {HABIT_CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#0f1628]">{CATEGORY_CONFIG[c as keyof typeof CATEGORY_CONFIG]?.icon} {c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-muted)] font-medium">Cue (What triggers this habit?)</label>
                    <input id="habit-cue-input" value={newHabit.cue || ""} onChange={(e) => setNewHabit((p) => ({ ...p, cue: e.target.value }))} placeholder="After I wake up / After breakfast" className="w-full mt-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-glass)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)]" />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-muted)] font-medium">Reward (Why does it feel good?)</label>
                    <input id="habit-reward-input" value={newHabit.reward || ""} onChange={(e) => setNewHabit((p) => ({ ...p, reward: e.target.value }))} placeholder="Feeling energised / Clear mind" className="w-full mt-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-glass)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)]" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="primary" className="flex-1" id="save-habit-btn" onClick={() => {
                    setHabits((p) => [...p, { ...newHabit as Habit, id: Date.now().toString(), userId: "u1", createdAt: new Date(), isActive: true, order: p.length, completedToday: false, currentStreak: 0, longestStreak: 0, description: null, stackedWith: null }]);
                    setShowModal(false);
                  }}>
                    Save Habit
                  </Button>
                  <Button variant="secondary" onClick={() => setShowModal(false)} id="cancel-habit-btn">Cancel</Button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
