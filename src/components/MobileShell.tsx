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
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-80px)] flex flex-col pb-24 relative bg-[#fcfcfd] dark:bg-[#0c0c0e] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
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

      {/* Floating Action Button - smoothly lifts when floating focus pill is active */}
      <button
        onClick={onQuickAdd}
        aria-label="Quick Add"
        className={`fixed right-5 z-30 w-13 h-13 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-2xl font-heading font-light flex items-center justify-center shadow-lg active:scale-95 transition-all duration-300 border border-zinc-800/10 dark:border-zinc-200/20 ${
          activeSession ? "bottom-36" : "bottom-20"
        }`}
      >
        ＋
      </button>

      {/* Bottom Navigation: 1. Habits, 2. Daily, 3. Kanban, 4. Stats */}
      <div className="fixed bottom-0 left-0 right-0 z-20 h-16 border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-[#121215]/90 backdrop-blur-md flex items-center justify-around px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] max-w-md mx-auto">
        <button
          onClick={() => onTabChange("habits")}
          className={`flex flex-col items-center gap-1 font-heading font-bold text-[10px] uppercase transition ${
            activeTab === "habits" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
              activeTab === "habits"
                ? "border border-zinc-900 dark:border-zinc-100 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                : "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/60"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <span>Habits</span>
        </button>

        <button
          onClick={() => onTabChange("daily")}
          className={`flex flex-col items-center gap-1 font-heading font-bold text-[10px] uppercase transition ${
            activeTab === "daily" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
              activeTab === "daily"
                ? "border border-zinc-900 dark:border-zinc-100 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                : "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/60"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </div>
          <span>Daily</span>
        </button>

        <button
          onClick={() => onTabChange("kanban")}
          className={`flex flex-col items-center gap-1 font-heading font-bold text-[10px] uppercase transition ${
            activeTab === "kanban" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
              activeTab === "kanban"
                ? "border border-zinc-900 dark:border-zinc-100 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                : "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/60"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <span>Kanban</span>
        </button>

        <button
          onClick={() => onTabChange("progress")}
          className={`flex flex-col items-center gap-1 font-heading font-bold text-[10px] uppercase transition ${
            activeTab === "progress" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
              activeTab === "progress"
                ? "border border-zinc-900 dark:border-zinc-100 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                : "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/60"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
          </div>
          <span>Stats</span>
        </button>
      </div>
    </div>
  );
}
