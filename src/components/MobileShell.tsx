"use client";

import React, { ReactNode } from "react";
import { LayoutGrid, CheckSquare, Calendar, BarChart2 } from "lucide-react";
import { MobileWeekCalendar } from "@/components/MobileWeekCalendar";
import { useFocusTimer } from "@/context/FocusTimerContext";

export type MobileTab = "habits" | "daily" | "kanban" | "progress";

export interface MobileShellProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  pillTitle: string;
  onQuickAdd: () => void;
  children: ReactNode;
}

export function MobileShell({
  activeTab,
  onTabChange,
  pillTitle,
  onQuickAdd,
  children,
}: MobileShellProps) {
  const { activeSession } = useFocusTimer();

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-80px)] flex flex-col pb-28 relative text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* 7-Day Week Calendar Strip on Habits and Daily tabs only (redundant on Stats which has its own calendar consistency board) */}
      {(activeTab === "habits" || activeTab === "daily") && (
        <div className="px-3.5 pt-2 pb-1">
          <MobileWeekCalendar />
        </div>
      )}

      {/* Mobile Active View Pill */}
      <div className="py-1.5 px-4 flex items-center justify-center">
        <div className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3.5 py-1 rounded-full font-heading font-bold text-[11px] tracking-wider uppercase shadow-xs">
          {pillTitle}
        </div>
      </div>

      {/* Dynamic Body */}
      <div className="flex-1 overflow-y-auto px-3.5 py-1 space-y-4">
        {children}
      </div>

      {/* Floating Action Button - anchored above bottom nav tab bar */}
      <div
        className={`fixed left-0 right-0 max-w-md mx-auto pointer-events-none z-30 transition-all duration-300 ${
          activeSession ? "bottom-36" : "bottom-20"
        }`}
      >
        <div className="relative w-full">
          <button
            onClick={onQuickAdd}
            aria-label="Quick Add"
            className="pointer-events-auto absolute right-4 bottom-0 w-12 h-12 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xl font-light flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.25)] active:scale-90 transition-all duration-200 border border-black/5 dark:border-white/15 cursor-pointer"
          >
            ＋
          </button>
        </div>
      </div>

      {/* Bottom Navigation: 1. Habits, 2. Daily, 3. Kanban, 4. Stats */}
      <div className="fixed bottom-0 left-0 right-0 z-20 h-16 border-t border-black/[0.05] dark:border-white/[0.08] bg-white/80 dark:bg-[#121215]/80 backdrop-blur-2xl flex items-center justify-around px-4 shadow-[0_-4px_24px_rgba(0,0,0,0.03)] max-w-md mx-auto">
        <button
          onClick={() => onTabChange("habits")}
          className={`flex flex-col items-center gap-1 font-medium text-[10px] uppercase transition-all active:scale-95 cursor-pointer ${
            activeTab === "habits" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
              activeTab === "habits"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold tracking-wider">Habits</span>
        </button>

        <button
          onClick={() => onTabChange("daily")}
          className={`flex flex-col items-center gap-1 font-medium text-[10px] uppercase transition-all active:scale-95 cursor-pointer ${
            activeTab === "daily" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
              activeTab === "daily"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold tracking-wider">Daily</span>
        </button>

        <button
          onClick={() => onTabChange("kanban")}
          className={`flex flex-col items-center gap-1 font-medium text-[10px] uppercase transition-all active:scale-95 cursor-pointer ${
            activeTab === "kanban" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
              activeTab === "kanban"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold tracking-wider">Kanban</span>
        </button>

        <button
          onClick={() => onTabChange("progress")}
          className={`flex flex-col items-center gap-1 font-medium text-[10px] uppercase transition-all active:scale-95 cursor-pointer ${
            activeTab === "progress" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
              activeTab === "progress"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold tracking-wider">Stats</span>
        </button>
      </div>
    </div>
  );
}
