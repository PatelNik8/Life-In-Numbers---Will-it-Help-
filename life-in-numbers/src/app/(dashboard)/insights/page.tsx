"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Badge, Button, EmptyState } from "@/components/ui/primitives";
import type { Insight } from "@/types";

const DEMO_INSIGHTS: Insight[] = [
  {
    id: "1", userId: "u1", type: "weekly_summary",
    title: "Week 11 — Great Performance! 🎉",
    body: "You averaged a Life Score of 70 this week, a +8% increase from last week. Sleep (85/100) and Focus (80/100) were your standout categories. Water intake is your most consistent area for improvement. Try hitting 2.5L before 6PM each day.",
    icon: "📊", color: "#6366f1", weekNum: 11, year: 2026, isRead: false, isPinned: true, createdAt: new Date(),
    data: null,
  },
  {
    id: "2", userId: "u1", type: "correlation",
    title: "Sleep → Mood Connection",
    body: "When you sleep 7.5+ hours, your mood score is 32% higher the next day. Over the last 30 days, the Pearson correlation is r = 0.71 (strong positive). Consider a consistent 10:30 PM bedtime.",
    icon: "🔗", color: "#22d3ee", weekNum: null, year: null, isRead: false, isPinned: false, createdAt: new Date(),
    data: null,
  },
  {
    id: "3", userId: "u1", type: "ai_tip",
    title: "Your Screen Time is Hurting Focus",
    body: "On days where screen time exceeds 6 hours, your study output drops by an average of 1.8 hours. Try the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.",
    icon: "💡", color: "#f59e0b", weekNum: null, year: null, isRead: false, isPinned: false, createdAt: new Date(),
    data: null,
  },
  {
    id: "4", userId: "u1", type: "prediction",
    title: "Tomorrow: High Energy Day Predicted",
    body: "Based on your last 7 days pattern — tonight you slept well, exercised, and meditated. Model predicts tomorrow's mood at 8.2/10 and energy at 7.8/10 with 78% confidence.",
    icon: "🔮", color: "#a78bfa", weekNum: null, year: null, isRead: false, isPinned: false, createdAt: new Date(),
    data: null,
  },
  {
    id: "5", userId: "u1", type: "milestone",
    title: "🏆 30-Day Meditation Streak!",
    body: "You have meditated for 30 consecutive days! This puts you in the top 5% of consistent meditators. Studies show this level of consistency leads to measurable reductions in stress and enhanced focus. Keep going!",
    icon: "🏆", color: "#10b981", weekNum: null, year: null, isRead: false, isPinned: true, createdAt: new Date(),
    data: null,
  },
];

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  weekly_summary: { label: "Weekly Digest", color: "#6366f1" },
  correlation: { label: "Correlation", color: "#22d3ee" },
  ai_tip: { label: "AI Tip", color: "#f59e0b" },
  prediction: { label: "Prediction", color: "#a78bfa" },
  milestone: { label: "Milestone", color: "#10b981" },
};

export default function InsightsPage() {
  const [insights, setInsights] = useState(DEMO_INSIGHTS);
  const [filter, setFilter] = useState<string>("all");
  const [generating, setGenerating] = useState(false);

  const filters = ["all", "weekly_summary", "correlation", "ai_tip", "prediction", "milestone"];

  const filtered = filter === "all" ? insights : insights.filter((i) => i.type === filter);
  const unread = insights.filter((i) => !i.isRead).length;

  function markRead(id: string) {
    setInsights((prev) => prev.map((i) => (i.id === id ? { ...i, isRead: true } : i)));
  }

  function dismiss(id: string) {
    setInsights((prev) => prev.filter((i) => i.id !== id));
  }

  async function generateAi() {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
    setInsights((prev) => [{
      id: Date.now().toString(),
      userId: "u1",
      type: "ai_tip",
      title: "New Insight: Exercise Timing Matters",
      body: "Analysing your last 60 days — you perform 24% better on focus metrics when you exercise before 9AM vs. after 6PM. Try moving your workout to the morning this week.",
      icon: "💡", color: "#f59e0b", weekNum: null, year: null, isRead: false, isPinned: false, createdAt: new Date(), data: null,
    }, ...prev]);
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">
            🧠 <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {unread > 0 ? `${unread} new insights awaiting` : "You're all caught up!"}
          </p>
        </div>
        <Button id="generate-ai-btn" variant="primary" loading={generating} onClick={generateAi}>
          ✨ Generate AI Insights
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const cfg = TYPE_CONFIG[f];
          return (
            <button
              key={f}
              id={`insight-filter-${f}`}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                filter === f
                  ? "text-white border-transparent"
                  : "border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
              style={filter === f ? { background: cfg?.color ?? "var(--color-primary)", borderColor: cfg?.color ?? "var(--color-primary)" } : {}}
            >
              {f === "all" ? "All Insights" : cfg?.label ?? f}
            </button>
          );
        })}
      </div>

      {/* Insight cards */}
      {filtered.length === 0 ? (
        <EmptyState icon="🔍" title="No insights here" description="Generate AI insights or check another filter." />
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((insight) => {
              const cfg = TYPE_CONFIG[insight.type];
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`flex flex-col gap-4 relative overflow-hidden h-full ${!insight.isRead ? "border-[var(--border-accent)]" : ""}`} hoverable={false}>
                    {/* Top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${insight.color || "#6366f1"}, transparent)` }} />

                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-2xl">{insight.icon}</span>
                        <Badge style={{ background: `${cfg?.color}20`, color: cfg?.color, borderColor: `${cfg?.color}40` }}>
                          {cfg?.label}
                        </Badge>
                        {insight.isPinned && <Badge variant="warning">📌 Pinned</Badge>}
                        {!insight.isRead && <Badge variant="cyan">New</Badge>}
                      </div>
                      <button
                        onClick={() => dismiss(insight.id)}
                        className="text-[var(--text-muted)] hover:text-red-400 transition-colors text-xl leading-none"
                        aria-label="Dismiss"
                      >
                        ×
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-bold text-[var(--text-primary)] mb-2">{insight.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{insight.body}</p>
                    </div>

                    {/* Actions */}
                    {!insight.isRead && (
                      <Button variant="ghost" size="sm" onClick={() => markRead(insight.id)} id={`mark-read-${insight.id}`} className="self-start">
                        ✓ Mark as read
                      </Button>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
