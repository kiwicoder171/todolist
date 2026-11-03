"use client";

import React from "react";
import { useHousehold, Partner, formatDateKey } from "@/context/HouseholdContext";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { useRoutines } from "@/context/RoutinesContext";
import { Trophy, CheckCircle, Clock } from "lucide-react";

export function WeeklyAttendanceMatrix() {
  const { partnerNames, perfectDays, scores } = useHousehold();
  const { getTotalFocusMinutesForDate } = useFocusTimer();
  const { routines, isCompleted } = useRoutines();

  // Get current week Monday - Sunday
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon
  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    return d;
  });

  const weekLabels = ["M", "T", "W", "T", "F", "S", "S"];
  const weekStartStr = `${weekDays[0].getMonth() + 1}/${weekDays[0].getDate()}`;
  const weekEndStr = `${weekDays[6].getMonth() + 1}/${weekDays[6].getDate()}`;

  const partners: Partner[] = ["alex", "sam"];

  return (
    <div
      data-testid="weekly-attendance-matrix"
      className="w-full bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-3 sm:p-4 mb-4 shadow-xs transition-colors duration-200"
    >
      <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/60 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Attendance & Habit Matrix
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-medium">
          {weekStartStr} ~ {weekEndStr}
        </span>
      </div>

      <div className="space-y-3">
        {partners.map((p) => {
          const name = partnerNames[p] || (p === "alex" ? "Alex" : "Sam");
          const score = scores[p] || { points: 0, streak: 0 };
          const pPerfects = perfectDays[p] || [];

          // Compute total week focus minutes
          let totalWeekFocusMin = 0;
          let attendedDaysCount = 0;

          weekDays.forEach((d) => {
            const min = getTotalFocusMinutesForDate(d, p);
            totalWeekFocusMin += min;
            const key = formatDateKey(d);
            if (pPerfects.includes(key) || min > 0) {
              attendedDaysCount++;
            }
          });

          const hours = Math.floor(totalWeekFocusMin / 60);
          const mins = totalWeekFocusMin % 60;
          const timeStr = `${hours}:${String(mins).padStart(2, "0")}:00`;

          return (
            <div
              key={p}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
            >
              {/* Partner Name & Stats */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{name}</span>
                  <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {timeStr}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  {attendedDaysCount}/7 days · 🔥 {score.streak}d streak
                </p>
              </div>

              {/* Day Pills: M T W T F S S */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                {weekDays.map((d, idx) => {
                  const key = formatDateKey(d);
                  const isPerfect = pPerfects.includes(key);
                  const focusMin = getTotalFocusMinutesForDate(d, p);
                  const hasAttended = isPerfect || focusMin > 0;
                  const isCurrentDay = formatDateKey(d) === formatDateKey(today);

                  return (
                    <div
                      key={key}
                      title={`${weekLabels[idx]} (${key}): ${focusMin}m focus, ${
                        isPerfect ? "Perfect Routines" : "Incomplete"
                      }`}
                      className={`w-7 h-7 rounded-lg flex flex-col items-center justify-center text-[10px] font-mono transition-all ${
                        hasAttended
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold border border-zinc-900 dark:border-zinc-200 shadow-xs"
                          : isCurrentDay
                          ? "border border-blue-500/80 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 font-bold"
                          : "border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-900/40"
                      }`}
                    >
                      <span>{weekLabels[idx]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
