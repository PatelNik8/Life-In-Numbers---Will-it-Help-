"use client";

import { useState } from "react";
import { Card, Button, Badge } from "@/components/ui/primitives";
import { HeatmapCalendar, TrendLineChart, MultiLineChart } from "@/components/charts/charts";
import { METRIC_DEFINITIONS } from "@/lib/metrics";
import { getScoreColor, formatShortDate } from "@/lib/utils";
import type { HeatmapDataPoint, ChartDataPoint } from "@/types";
import { subDays, format } from "date-fns";

// Generate 365 days of demo heatmap data
function generateHeatmap(): HeatmapDataPoint[] {
  const data: HeatmapDataPoint[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const score = Math.floor(Math.random() * 100);
    const level = score >= 80 ? 4 : score >= 60 ? 3 : score >= 40 ? 2 : score >= 20 ? 1 : 0;
    data.push({ date: format(d, "yyyy-MM-dd"), count: score, level: level as 0|1|2|3|4 });
  }
  return data;
}

function generateTrend(days: number): ChartDataPoint[] {
  return Array.from({ length: days }, (_, i) => ({
    date: format(subDays(new Date(), days - 1 - i), "yyyy-MM-dd"),
    value: Math.floor(50 + Math.random() * 40),
  }));
}

const HEATMAP_DATA = generateHeatmap();
const PERIODS: { key: "7d" | "30d" | "90d" | "1y"; label: string; days: number }[] = [
  { key: "7d", label: "7 Days", days: 7 },
  { key: "30d", label: "30 Days", days: 30 },
  { key: "90d", label: "90 Days", days: 90 },
  { key: "1y", label: "1 Year", days: 365 },
];

export default function HistoryPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["sleepHours", "mood", "exerciseMinutes"]);

  const currentDays = PERIODS.find((p) => p.key === period)?.days ?? 30;
  const trendData = generateTrend(currentDays);

  const multiDatasets = selectedMetrics.map((key) => {
    const def = METRIC_DEFINITIONS.find((m) => m.key === key);
    return {
      key,
      label: def?.label ?? key,
      color: def?.color ?? "#6366f1",
      data: Array.from({ length: currentDays }, (_, i) => ({
        date: format(subDays(new Date(), currentDays - 1 - i), "yyyy-MM-dd"),
        value: Math.floor((def?.min ?? 0) + Math.random() * ((def?.max ?? 10) - (def?.min ?? 0))),
      })),
    };
  });

  function toggleMetric(key: string) {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  const avgScore = Math.round(trendData.reduce((s, d) => s + d.value, 0) / trendData.length);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">
            <span className="gradient-text">History</span> & Trends
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Visualise your journey over time
          </p>
        </div>
        {/* Period picker */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-white/5 border border-[var(--border-default)]">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              id={`period-${p.key}`}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${period === p.key ? "bg-[var(--color-primary)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Life Score", value: avgScore, icon: "⭐", color: getScoreColor(avgScore), unit: "" },
          { label: "Days Logged", value: currentDays - 3, icon: "📅", color: "#6366f1", unit: `/${currentDays}` },
          { label: "Peak Score", value: Math.max(...trendData.map((d) => d.value)), icon: "🏆", color: "#f59e0b", unit: "" },
          { label: "Streak Days", value: 12, icon: "🔥", color: "#10b981", unit: "" },
        ].map((s) => (
          <Card key={s.label}>
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-black mt-1 tabular-nums" style={{ color: s.color }}>
              {s.value}{s.unit}
            </p>
            <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Year Heatmap */}
      <Card hoverable={false}>
        <h2 className="font-bold mb-6">📅 Year in Review — Life Score Heatmap</h2>
        <HeatmapCalendar data={HEATMAP_DATA} />
      </Card>

      {/* Life Score Trend */}
      <Card hoverable={false}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold">📈 Life Score Trend</h2>
          <Badge variant={avgScore >= 70 ? "success" : "warning"}>Avg: {avgScore}</Badge>
        </div>
        <TrendLineChart data={trendData} color={getScoreColor(avgScore)} label="Life Score" />
      </Card>

      {/* Multi-Metric Compare */}
      <Card hoverable={false}>
        <h2 className="font-bold mb-4">🔀 Compare Metrics</h2>
        {/* Metric picker */}
        <div className="flex flex-wrap gap-2 mb-5">
          {METRIC_DEFINITIONS.slice(0, 8).map((def) => (
            <button
              key={String(def.key)}
              id={`metric-toggle-${String(def.key)}`}
              onClick={() => toggleMetric(String(def.key))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                selectedMetrics.includes(String(def.key))
                  ? `text-white border-transparent`
                  : "border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
              style={selectedMetrics.includes(String(def.key)) ? { background: def.color, borderColor: def.color } : {}}
            >
              {def.icon} {def.label}
            </button>
          ))}
        </div>
        {selectedMetrics.length > 0 ? (
          <MultiLineChart datasets={multiDatasets} />
        ) : (
          <p className="text-sm text-[var(--text-muted)] text-center py-8">Select at least one metric above</p>
        )}
      </Card>
    </div>
  );
}
