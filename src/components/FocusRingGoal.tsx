"use client";

import React, { useState } from "react";
import { useHousehold } from "@/context/HouseholdContext";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { Target, Check, ChevronDown } from "lucide-react";

export function FocusRingGoal() {
  const { selectedDate, activePartner } = useHousehold();
  const { getTotalFocusMinutesForDate, dailyTargetMinutes, setDailyTargetMinutes } =
    useFocusTimer();

  const [isOpen, setIsOpen] = useState(false);

  const loggedMinutes = getTotalFocusMinutesForDate(selectedDate, activePartner);
  const target = Math.max(1, dailyTargetMinutes);
  const percentage = Math.min(100, Math.round((loggedMinutes / target) * 100));
  const isGoalReached = loggedMinutes >= target;

  // SVG ring parameters
  const size = 44;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const targetPresets = [30, 45, 60, 90, 120, 180];

  return (
    <div className="relative inline-block" data-testid="focus-ring-goal">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={`Daily Focus Goal: ${loggedMinutes}m / ${target}m (${percentage}%) - Click to change`}
        aria-label="Daily focus goal"
        suppressHydrationWarning
        className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition cursor-pointer"
      >
        <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-zinc-200 dark:text-zinc-800"
              fill="transparent"
            />
            {/* Progress Fill */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-500 ${
                isGoalReached ? "text-emerald-500" : "text-amber-500"
              }`}
              fill="transparent"
            />
          </svg>
          <span className="absolute text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-200" suppressHydrationWarning>
            {isGoalReached ? "✓" : `${percentage}%`}
          </span>
        </div>

        <div className="text-left hidden sm:block pr-1">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Focus Goal
            </span>
            <ChevronDown className="w-2.5 h-2.5 text-zinc-400 dark:text-zinc-500" />
          </div>
          <p className="font-mono text-[11px] font-semibold text-zinc-800 dark:text-zinc-200" suppressHydrationWarning>
            {loggedMinutes}
            <span className="text-zinc-400 dark:text-zinc-500">/{target}m</span>
          </p>
        </div>
      </button>

      {/* Target Change Popover */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-50 w-48 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-700 dark:text-zinc-300 pb-1 border-b border-zinc-100 dark:border-zinc-800">
            <span>Set Daily Focus Goal</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">{target}m</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {targetPresets.map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => {
                  setDailyTargetMinutes(mins);
                  setIsOpen(false);
                }}
                className={`py-1 text-[10px] font-mono rounded-lg transition ${
                  dailyTargetMinutes === mins
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-bold"
                    : "bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
