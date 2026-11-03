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
        className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl apple-press bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] transition-all cursor-pointer"
      >
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            <defs>
              <linearGradient id="appleGoalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="appleGoalAmber" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-black/[0.06] dark:text-white/[0.08]"
              fill="transparent"
            />
            {/* Progress Fill with Apple activity ring rounded ends */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isGoalReached ? "url(#appleGoalGradient)" : "url(#appleGoalAmber)"}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              fill="transparent"
            />
          </svg>
          <span className="absolute text-[10px] font-mono font-bold text-zinc-800 dark:text-zinc-200" suppressHydrationWarning>
            {isGoalReached ? "✓" : `${percentage}%`}
          </span>
        </div>

        <div className="text-left hidden sm:block pr-1">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Focus Goal
            </span>
            <ChevronDown className="w-2.5 h-2.5 text-zinc-400 dark:text-zinc-500" />
          </div>
          <p className="font-mono text-[11px] font-semibold text-zinc-900 dark:text-zinc-100" suppressHydrationWarning>
            <span suppressHydrationWarning>{loggedMinutes}</span>
            <span className="text-zinc-400 dark:text-zinc-500" suppressHydrationWarning>/{target}m</span>
          </p>
        </div>
      </button>

      {/* Target Change Popover */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-50 w-52 p-3 rounded-2xl bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-2xl space-y-2.5 animate-scale-in">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 pb-1.5 border-b border-black/[0.05] dark:border-white/[0.08]">
            <span>Set Daily Focus Goal</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{target}m</span>
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
                className={`py-1.5 text-[11px] font-mono rounded-xl apple-press transition ${
                  dailyTargetMinutes === mins
                    ? "bg-emerald-500 text-white font-bold shadow-xs"
                    : "bg-black/[0.03] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.06] dark:hover:bg-white/[0.1] border border-black/[0.04] dark:border-white/[0.06]"
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
