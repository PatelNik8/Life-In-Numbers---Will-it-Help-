"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Avatar, Button } from "@/components/ui/primitives";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "⚡", exact: true },
  { href: "/dashboard/log", label: "Log Today", icon: "📝", exact: false },
  { href: "/dashboard/habits", label: "Habits", icon: "🔥", exact: false },
  { href: "/dashboard/history", label: "History", icon: "📈", exact: false },
  { href: "/dashboard/insights", label: "Insights", icon: "🧠", exact: false },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️", exact: false },
];

function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useDashboardStore();

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 220 : 68 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex-shrink-0 h-screen sticky top-0 flex flex-col glass border-r border-[var(--border-default)] overflow-hidden z-50"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--border-default)]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
          L
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="font-black text-sm gradient-text whitespace-nowrap"
            >
              Life in Numbers
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && !item.exact
              ? pathname === item.href || pathname.startsWith(item.href + "/")
              : false;

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-lg shadow-indigo-500/25"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5"
              )}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="text-sm font-semibold whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User & Toggle */}
      <div className="border-t border-[var(--border-default)] p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Avatar name="Niket Patel" size="sm" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <p className="text-xs font-semibold text-[var(--text-primary)] truncate">Niket Patel</p>
                <p className="text-[10px] text-[var(--text-muted)] truncate">niket@example.com</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="w-full aspect-square"
          aria-label="Toggle sidebar"
          id="sidebar-toggle"
        >
          <span className="text-base">{sidebarOpen ? "◀" : "▶"}</span>
        </Button>
      </div>
    </motion.aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-mesh">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
