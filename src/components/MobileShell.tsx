"use client";

import React, { ReactNode } from "react";
import { LayoutGrid, CheckSquare, Calendar, BarChart2 } from "lucide-react";

export type MobileTab = "kanban" | "habits" | "daily" | "progress";

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
    <div className="flex justify-center py-4">
      {/* Phone Shell (Matching 4810889.jpg) */}
      <div className="w-[390px] h-[810px] bg-white rounded-[48px] border-[10px] border-[#18181b] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden relative">
        {/* Status Bar */}
        <div className="pt-3 px-7 flex items-center justify-between text-xs font-heading font-bold text-black">
          <span>15:00</span>
          <div className="w-24 h-4 bg-black rounded-b-xl mx-auto -mt-2" />
          <div className="flex items-center gap-1 text-[11px]">
            <span>5G</span>
            <div className="w-4 h-2.5 border border-black rounded-sm p-0.5">
              <div className="w-full h-full bg-black" />
            </div>
          </div>
        </div>

        {/* Phone Header */}
        <div className="pt-4 px-6 pb-3 flex items-center justify-between">
          <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center font-bold text-xs">
            👤
          </div>
          <div className="bg-black text-white px-5 py-1.5 rounded-full font-heading font-extrabold text-xs tracking-wider uppercase shadow-sm">
            {pillTitle}
          </div>
          <button className="w-8 h-8 flex flex-col justify-center items-end gap-1 p-1">
            <span className="w-5 h-0.5 bg-black" />
            <span className="w-5 h-0.5 bg-black" />
            <span className="w-3 h-0.5 bg-black" />
          </button>
        </div>

        {/* Dynamic Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-2 pb-28 space-y-4">
          {children}
        </div>

        {/* Floating Action Button */}
        <button
          onClick={onQuickAdd}
          aria-label="Quick Add"
          className="absolute bottom-20 right-6 w-14 h-14 rounded-2xl bg-black text-white text-3xl font-heading font-light flex items-center justify-center shadow-[4px_4px_0_0_#000] active:scale-95 transition"
        >
          ＋
        </button>

        {/* Bottom Navigation */}
        <div className="h-16 border-t-2 border-zinc-200 bg-white flex items-center justify-around px-4">
          <button
            onClick={() => onTabChange("kanban")}
            className={`flex flex-col items-center gap-1 font-heading font-extrabold text-[10px] uppercase ${
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
            onClick={() => onTabChange("habits")}
            className={`flex flex-col items-center gap-1 font-heading font-extrabold text-[10px] uppercase ${
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
            className={`flex flex-col items-center gap-1 font-heading font-extrabold text-[10px] uppercase ${
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
            onClick={() => onTabChange("progress")}
            className={`flex flex-col items-center gap-1 font-heading font-extrabold text-[10px] uppercase ${
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
    </div>
  );
}
