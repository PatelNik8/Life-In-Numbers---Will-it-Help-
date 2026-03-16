"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Card, Button, Progress, Badge } from "@/components/ui/primitives";
import { METRIC_DEFINITIONS, DEFAULT_ENABLED_METRICS, CATEGORY_CONFIG } from "@/lib/metrics";
import { computeLifeScore } from "@/lib/lifeScore";
import { getScoreColor, getScoreLabel, cn } from "@/lib/utils";
import type { MetricCategory } from "@/types";

type LogValues = Record<string, number | null>;

const INITIAL_VALUES: LogValues = Object.fromEntries(
  METRIC_DEFINITIONS.map((m) => [m.key as string, null])
);

function MetricInput({
  def,
  value,
  onChange,
}: {
  def: (typeof METRIC_DEFINITIONS)[number];
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  const pct = value !== null ? Math.min(100, (value / def.ideal) * 100) : 0;
  const isSet = value !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "card flex flex-col gap-3 cursor-pointer transition-all duration-300",
        isSet && "border-[var(--border-accent)]"
      )}
      style={{ borderColor: isSet ? `${def.color}40` : undefined }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{def.icon}</span>
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">{def.label}</p>
            <p className="text-xs text-[var(--text-muted)]">
              Ideal: {def.ideal} {def.unit}
            </p>
          </div>
        </div>
        {isSet && (
          <div className="text-right">
            <span className="text-lg font-black tabular-nums" style={{ color: def.color }}>
              {value}
            </span>
            <span className="text-xs text-[var(--text-muted)] ml-1">{def.unit}</span>
          </div>
        )}
      </div>

      {/* Slider-style input */}
      <div className="space-y-1.5">
        <input
          id={`metric-${String(def.key)}`}
          type="range"
          min={def.min}
          max={def.max}
          step={def.step}
          value={value ?? def.min}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseEnter={() => { if (value === null) onChange(def.min); }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: isSet
              ? `linear-gradient(90deg, ${def.color} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`
              : "rgba(255,255,255,0.1)",
          }}
        />
        <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
          <span>{def.min}{def.unit}</span>
          <span>{def.max}{def.unit}</span>
        </div>
      </div>

      {isSet && (
        <div className="flex items-center justify-between">
          <Progress value={pct} color={def.color} size="sm" className="flex-1 mr-3" />
          <button
            onClick={() => onChange(null)}
            className="text-[10px] text-[var(--text-muted)] hover:text-red-400 transition-colors"
          >
            clear
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function LogPage() {
  const [values, setValues] = useState<LogValues>(INITIAL_VALUES);
  const [note, setNote] = useState("");
  const [activeCategory, setActiveCategory] = useState<MetricCategory | "all">("all");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const enabledDefs = METRIC_DEFINITIONS.filter((m) =>
    DEFAULT_ENABLED_METRICS.includes(String(m.key))
  );

  const filteredDefs =
    activeCategory === "all"
      ? enabledDefs
      : enabledDefs.filter((m) => m.category === activeCategory);

  const filledCount = Object.values(values).filter((v) => v !== null).length;
  const completionPct = Math.round((filledCount / enabledDefs.length) * 100);

  const currentLog = Object.fromEntries(
    Object.entries(values).map(([k, v]) => [k, v ?? undefined])
  );
  const preview = computeLifeScore(currentLog as never);

  const categories: Array<MetricCategory | "all"> = ["all", "sleep", "fitness", "focus", "health", "mood", "mindfulness", "social"];

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200)); // Demo delay
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-medium">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
          <h1 className="text-3xl font-black">
            Log Today&apos;s <span className="gradient-text">Metrics</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {filledCount === 0
              ? "Start sliding to log your day"
              : `${filledCount} of ${enabledDefs.length} metrics filled`}
          </p>
        </div>

        {/* Live score preview */}
        <div className="glass rounded-2xl px-6 py-4 border border-[var(--border-default)] flex flex-col items-center">
          <p className="text-xs text-[var(--text-muted)] mb-1">Live Score Preview</p>
          <span className="text-4xl font-black tabular-nums" style={{ color: getScoreColor(preview.total) }}>
            {filledCount > 0 ? preview.total : "--"}
          </span>
          {filledCount > 0 && (
            <Badge variant={preview.total >= 70 ? "success" : "warning"} className="mt-1">
              {getScoreLabel(preview.total)}
            </Badge>
          )}
        </div>
      </div>

      {/* Overall progress */}
      <Card hoverable={false}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Today&apos;s Completion</span>
          <span className="text-sm font-bold" style={{ color: completionPct === 100 ? "#10b981" : "var(--color-primary)" }}>
            {completionPct}%
          </span>
        </div>
        <Progress value={completionPct} color={completionPct === 100 ? "#10b981" : "var(--color-primary)"} />
      </Card>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => {
          const cfg = cat === "all" ? null : CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              id={`filter-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border",
                activeCategory === cat
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-accent)]"
              )}
            >
              {cfg && <span>{cfg.icon}</span>}
              <span className="capitalize">{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Metric inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDefs.map((def) => (
          <MetricInput
            key={String(def.key)}
            def={def}
            value={values[String(def.key)] ?? null}
            onChange={(v) => setValues((prev) => ({ ...prev, [String(def.key)]: v }))}
          />
        ))}
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="day-note">
          Note for today (optional)
        </label>
        <textarea
          id="day-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How was your day? Any reflections..."
          rows={3}
          className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-glass)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] resize-none transition-all"
        />
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <Button
          id="save-log-btn"
          variant="primary"
          size="lg"
          className="flex-1 md:flex-none md:px-12"
          onClick={handleSave}
          loading={saving}
          disabled={filledCount === 0}
        >
          {saved ? "✅ Saved!" : "💾 Save Today's Log"}
        </Button>
        {filledCount > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-[var(--text-muted)]"
          >
            Your score will be calculated automatically.
          </motion.p>
        )}
      </div>
    </div>
  );
}
