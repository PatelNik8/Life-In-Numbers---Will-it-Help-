import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DailyLog, Habit, Insight, LifeScoreBreakdown } from "@/types";

interface DashboardState {
  // Selected date (for viewing specific day's data)
  selectedDate: string; // ISO date string YYYY-MM-DD
  setSelectedDate: (date: string) => void;

  // Today's log (cached from API)
  todayLog: DailyLog | null;
  setTodayLog: (log: DailyLog | null) => void;

  // Life score
  lifeScore: LifeScoreBreakdown | null;
  setLifeScore: (score: LifeScoreBreakdown | null) => void;

  // Habits
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;

  // Insights
  insights: Insight[];
  setInsights: (insights: Insight[]) => void;

  // UI state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  activeMetricFilter: string;
  setActiveMetricFilter: (filter: string) => void;

  chartPeriod: "7d" | "30d" | "90d" | "1y";
  setChartPeriod: (period: "7d" | "30d" | "90d" | "1y") => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      selectedDate: new Date().toISOString().split("T")[0],
      setSelectedDate: (date) => set({ selectedDate: date }),

      todayLog: null,
      setTodayLog: (log) => set({ todayLog: log }),

      lifeScore: null,
      setLifeScore: (score) => set({ lifeScore: score }),

      habits: [],
      setHabits: (habits) => set({ habits }),

      insights: [],
      setInsights: (insights) => set({ insights }),

      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      activeMetricFilter: "all",
      setActiveMetricFilter: (filter) => set({ activeMetricFilter: filter }),

      chartPeriod: "30d",
      setChartPeriod: (period) => set({ chartPeriod: period }),
    }),
    {
      name: "lin-dashboard",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        chartPeriod: state.chartPeriod,
      }),
    }
  )
);
