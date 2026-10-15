"use client";

import React, { ReactNode } from "react";
import { LayoutGrid, CheckSquare, Calendar, BarChart2 } from "lucide-react";

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
  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-80px)] flex flex-col pb-24 relative bg-[#fafafa]">
      {/* Mobile Active View Pill */}
      <div className="py-2 px-4 flex items-center justify-center">
        <div className="bg-black text-white px-4 py-1 rounded-full font-heading font-extrabold text-[11px] tracking-wider uppercase shadow-xs">
          {pillTitle}
        </div>
      </div>

      {/* Dynamic Body */}
      <div className="flex-1 overflow-y-auto px-3.5 py-1 space-y-4">
        {children}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onQuickAdd}
        aria-label="Quick Add"
        className="fixed bottom-20 right-5 z-30 w-14 h-14 rounded-2xl bg-black text-white text-3xl font-heading font-light flex items-center justify-center shadow-[4px_4px_0_0_#000] active:scale-95 transition"
      >
        ＋
      </button>

      {/* Bottom Navigation: 1. Habits, 2. Daily, 3. Kanban, 4. Stats */}
      <div className="fixed bottom-0 left-0 right-0 z-20 h-16 border-t-2 border-black bg-white flex items-center justify-around px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] max-w-md mx-auto">
        <button
          onClick={() => onTabChange("habits")}
          className={`flex flex-col items-center gap-1 font-heading font-extrabold text-[10px] uppercase transition ${
            activeTab === "habits" ? "text-black" : "text-zinc-400 hover:text-black"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center ${
              activeTab === "habits"
                ? "border border-black bg-black text-white"
                : "border border-zinc-300 text-black"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <span>Habits</span>
        </button>

        <button
          onClick={() => onTabChange("daily")}
          className={`flex flex-col items-center gap-1 font-heading font-extrabold text-[10px] uppercase transition ${
            activeTab === "daily" ? "text-black" : "text-zinc-400 hover:text-black"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center ${
              activeTab === "daily"
                ? "border border-black bg-black text-white"
                : "border border-zinc-300 text-black"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </div>
          <span>Daily</span>
        </button>

        <button
          onClick={() => onTabChange("kanban")}
          className={`flex flex-col items-center gap-1 font-heading font-extrabold text-[10px] uppercase transition ${
            activeTab === "kanban" ? "text-black" : "text-zinc-400 hover:text-black"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center ${
              activeTab === "kanban"
                ? "border border-black bg-black text-white"
                : "border border-zinc-300 text-black"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <span>Kanban</span>
        </button>

        <button
          onClick={() => onTabChange("progress")}
          className={`flex flex-col items-center gap-1 font-heading font-extrabold text-[10px] uppercase transition ${
            activeTab === "progress" ? "text-black" : "text-zinc-400 hover:text-black"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center ${
              activeTab === "progress"
                ? "border border-black bg-black text-white"
                : "border border-zinc-300 text-black"
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
