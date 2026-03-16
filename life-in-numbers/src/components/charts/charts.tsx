"use client";

import {
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { CATEGORY_CONFIG } from "@/lib/metrics";
import { formatShortDate, getScoreColor } from "@/lib/utils";
import type { RadarDataPoint, ChartDataPoint, HeatmapDataPoint } from "@/types";

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; color?: string; name?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f1628] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RADAR CHART – Life Category Breakdown
// ─────────────────────────────────────────────────────────────────────────────
interface RadarProps {
  data: RadarDataPoint[];
}

export function LifeRadarChart({ data }: RadarProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ReRadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Radar
          name="Ideal"
          dataKey="fullMark"
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeDasharray="4 4"
          strokeWidth={1}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TREND LINE CHART – Score or metric over time
// ─────────────────────────────────────────────────────────────────────────────
interface TrendLineProps {
  data: ChartDataPoint[];
  color?: string;
  label?: string;
  showGrid?: boolean;
}

export function TrendLineChart({ data, color = "#6366f1", label = "Score", showGrid = true }: TrendLineProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -32, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        )}
        <XAxis
          dataKey="date"
          tick={{ fill: "var(--text-muted)", fontSize: 10 }}
          tickFormatter={(v) => formatShortDate(v)}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          name={label}
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#grad-${label})`}
          dot={false}
          activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HEATMAP CALENDAR – GitHub-style year view
// ─────────────────────────────────────────────────────────────────────────────
interface HeatmapProps {
  data: HeatmapDataPoint[];
}

const LEVEL_COLORS = [
  "rgba(255,255,255,0.05)",  // 0 – no data
  "#312e81",                  // 1 – low
  "#4338ca",                  // 2 – moderate
  "#6366f1",                  // 3 – good
  "#818cf8",                  // 4 – excellent
];

export function HeatmapCalendar({ data }: HeatmapProps) {
  const dataMap = Object.fromEntries(data.map((d) => [d.date, d]));
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);

  const weeks: Date[][] = [];
  let current = new Date(startDate);
  // Move to Sunday
  current.setDate(current.getDate() - current.getDay());

  while (current <= today) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => {
              const dateStr = day.toISOString().split("T")[0];
              const entry = dataMap[dateStr];
              const level = entry?.level ?? 0;
              const isFuture = day > today;
              return (
                <div
                  key={di}
                  title={entry ? `${dateStr}: ${entry.count}` : dateStr}
                  className="w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125 cursor-pointer"
                  style={{ background: isFuture ? "transparent" : LEVEL_COLORS[level] }}
                />
              );
            })}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-xs text-[var(--text-muted)]">Less</span>
        {LEVEL_COLORS.map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />
        ))}
        <span className="text-xs text-[var(--text-muted)]">More</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STREAK BAR – Visual streak progress for a habit
// ─────────────────────────────────────────────────────────────────────────────
interface StreakBarProps {
  streak: number;
  maxStreak: number;
  color?: string;
  checkpoints?: number[];
}

export function StreakBar({ streak, maxStreak, color = "#f59e0b", checkpoints = [7, 14, 30, 60, 100] }: StreakBarProps) {
  const pct = Math.min(100, (streak / maxStreak) * 100);
  return (
    <div className="space-y-2">
      <div className="relative h-3 rounded-full overflow-hidden bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }}
        />
        {checkpoints.map((cp) => {
          const cpPct = (cp / maxStreak) * 100;
          return cpPct <= 100 ? (
            <div
              key={cp}
              className="absolute top-0 bottom-0 w-px bg-white/20"
              style={{ left: `${cpPct}%` }}
              title={`${cp} days`}
            />
          ) : null;
        })}
      </div>
      <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
        <span>0d</span>
        {checkpoints.filter((cp) => cp <= maxStreak).map((cp) => (
          <span key={cp} className={streak >= cp ? "font-bold" : ""} style={{ color: streak >= cp ? color : undefined }}>
            {cp}d
          </span>
        ))}
        <span>{maxStreak}d</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-LINE CHART – Compare multiple metrics
// ─────────────────────────────────────────────────────────────────────────────
interface MultiLineProps {
  datasets: { key: string; label: string; data: ChartDataPoint[]; color: string }[];
}

export function MultiLineChart({ datasets }: MultiLineProps) {
  const merged = datasets[0]?.data.map((point, i) => ({
    date: point.date,
    ...Object.fromEntries(datasets.map((ds) => [ds.key, ds.data[i]?.value ?? null])),
  })) ?? [];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={merged} margin={{ top: 4, right: 8, left: -32, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickFormatter={(v) => formatShortDate(v)} tickLine={false} axisLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        {datasets.map((ds) => (
          <Line
            key={ds.key}
            type="monotone"
            dataKey={ds.key}
            name={ds.label}
            stroke={ds.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: ds.color, strokeWidth: 0 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
