"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, Button, Switch, Badge } from "@/components/ui/primitives";
import { METRIC_DEFINITIONS, DEFAULT_ENABLED_METRICS } from "@/lib/metrics";

export default function SettingsPage() {
  const [enabledMetrics, setEnabledMetrics] = useState<string[]>(DEFAULT_ENABLED_METRICS);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [saved, setSaved] = useState(false);

  function toggleMetric(key: string) {
    setEnabledMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function handleSave() {
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black">
          ⚙️ <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Personalise your Life in Numbers experience</p>
      </div>

      {/* Profile */}
      <Card hoverable={false}>
        <h2 className="font-bold mb-4">👤 Profile</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] font-medium">Display Name</label>
            <input id="settings-name" defaultValue="Niket Patel" className="w-full mt-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-glass)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] font-medium">Email</label>
            <input id="settings-email" defaultValue="niket@example.com" className="w-full mt-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-glass)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)]" />
          </div>
        </div>
      </Card>

      {/* Metrics Configuration */}
      <Card hoverable={false}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold">📊 Tracked Metrics</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Choose which metrics appear in your log</p>
          </div>
          <Badge variant="cyan">{enabledMetrics.length} active</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {METRIC_DEFINITIONS.map((def) => {
            const isEnabled = enabledMetrics.includes(String(def.key));
            return (
              <div
                key={String(def.key)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${isEnabled ? "border-[var(--border-accent)] bg-[var(--bg-card-hover)]" : "border-[var(--border-default)]"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{def.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{def.label}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{def.unit}</p>
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onChange={() => toggleMetric(String(def.key))}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Notifications */}
      <Card hoverable={false}>
        <h2 className="font-bold mb-4">🔔 Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Weekly Digest Email</p>
              <p className="text-xs text-[var(--text-muted)]">AI summary of your week every Monday</p>
            </div>
            <Switch checked={weeklyDigest} onChange={setWeeklyDigest} />
          </div>
        </div>
      </Card>

      {/* Timezone */}
      <Card hoverable={false}>
        <h2 className="font-bold mb-4">🌍 Timezone</h2>
        <select
          id="settings-timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-glass)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
        >
          {["Asia/Kolkata", "UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Asia/Tokyo", "Australia/Sydney"].map((tz) => (
            <option key={tz} value={tz} className="bg-[#0f1628]">{tz.replace(/_/g, " ")}</option>
          ))}
        </select>
      </Card>

      {/* Future Integrations */}
      <Card hoverable={false}>
        <h2 className="font-bold mb-2">🔌 Integrations <Badge variant="purple" className="ml-2">Coming Soon</Badge></h2>
        <p className="text-xs text-[var(--text-muted)] mb-4">Connect your devices and apps for automatic syncing</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: "Apple Health", icon: "🍎", status: "soon" },
            { name: "Google Fit", icon: "🏃", status: "soon" },
            { name: "Fitbit", icon: "⌚", status: "soon" },
            { name: "Garmin", icon: "🛰", status: "soon" },
            { name: "Notion", icon: "📋", status: "soon" },
            { name: "Google Calendar", icon: "📅", status: "soon" },
          ].map((app) => (
            <div key={app.name} className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-default)] opacity-60">
              <span className="text-xl">{app.icon}</span>
              <span className="text-xs font-semibold text-[var(--text-muted)]">{app.name}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Save */}
      <motion.div className="pb-8">
        <Button id="save-settings-btn" variant="primary" size="lg" className="w-full" onClick={handleSave}>
          {saved ? "✅ Settings Saved!" : "💾 Save Settings"}
        </Button>
      </motion.div>
    </div>
  );
}
