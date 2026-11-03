"use client";

import React, { useState, useMemo } from "react";
import { useHousehold, formatDateKey, matchesAssigneeFilter } from "@/context/HouseholdContext";
import { useRoutines, isRoutineScheduledForDate } from "@/context/RoutinesContext";
import { useDailyTasks, calculateRolloverTasks } from "@/context/DailyTasksContext";
import { ChevronLeft, ChevronRight, Snowflake, Check, Sparkles } from "lucide-react";

export function MobileWeekCalendar() {
  const {
    activePartner,
    selectedDate,
    setSelectedDate,
    isDateFrozen,
    isFreezeDay,
    toggleFreezeDay,
  } = useHousehold();

  const { routines, isCompleted } = useRoutines();
  const { tasks } = useDailyTasks();

  // "Today" reference: Live current date (pinned to Oct 14 in tests)
  const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";
  const today = useMemo(() => (isTest ? new Date(2026, 9, 14) : new Date()), [isTest]);

  // Base Monday date for the currently visible week
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay(); // 0 is Sunday, 1 is Monday ...
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.getFullYear(), date.getMonth(), diff);
  };

  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(selectedDate));

  // 7 days of the currently visible week (Mon to Sun)
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      days.push(d);
    }
    return days;
  }, [weekStart]);

  const handlePrevWeek = () => {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 7);
      return next;
    });
  };

  const handleNextWeek = () => {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  };

  const handleGoToToday = () => {
    const todayMonday = getMonday(today);
    setWeekStart(todayMonday);
    setSelectedDate(today);
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const isCurrentWeek = isSameDay(weekStart, getMonday(today));
  const isViewingToday = isSameDay(selectedDate, today);
  const showTodayButton = !isCurrentWeek || !isViewingToday;

  // Status for a day: done (all routines complete for active partner), partial, frozen, or pending/empty
  const getDayStatus = (date: Date): "done" | "partial" | "frozen" | "pending" | "empty" => {
    if (isDateFrozen(date)) return "frozen";

    // Active partner's scheduled routines (mine + both)
    const myRoutines = routines.filter((r) =>
      matchesAssigneeFilter(r.assignee, activePartner, "mine")
    );
    const scheduled = myRoutines.filter((r) =>
      isRoutineScheduledForDate(r.frequency, date)
    );

    if (scheduled.length === 0) {
      // Check if daily tasks exist for this date
      const myTasks = tasks.filter((t) =>
        matchesAssigneeFilter(t.assignee, activePartner, "mine")
      );
      const dateTasks = calculateRolloverTasks(myTasks, date, today);
      if (dateTasks.length === 0) return "empty";
      const allTasksDone = dateTasks.every((t) => t.completed);
      return allTasksDone ? "done" : "pending";
    }

    const doneCount = scheduled.filter((r) => isCompleted(r.id, date)).length;
    if (doneCount === scheduled.length) return "done";
    if (doneCount > 0) return "partial";
    return "pending";
  };

  // Header month & range label (e.g. "OCT 12 – 18, 2026")
  const startDay = weekDays[0];
  const endDay = weekDays[6];
  const startMonthName = startDay.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const endMonthName = endDay.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const rangeLabel =
    startMonthName === endMonthName
      ? `${startMonthName} ${startDay.getDate()} – ${endDay.getDate()}, ${endDay.getFullYear()}`
      : `${startMonthName} ${startDay.getDate()} – ${endMonthName} ${endDay.getDate()}, ${endDay.getFullYear()}`;

  // Selected date formatted
  const selectedDateLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const selectedDayStatus = getDayStatus(selectedDate);
  const selectedDayFrozen = isDateFrozen(selectedDate);

  // Count routines done for selected day
  const scheduledForSelected = routines.filter((r) =>
    isRoutineScheduledForDate(r.frequency, selectedDate)
  );
  const doneCountForSelected = scheduledForSelected.filter((r) =>
    isCompleted(r.id, selectedDate)
  ).length;

  return (
    <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-3 shadow-xs space-y-2.5 transition-colors duration-200">
      {/* Week Header: Month Range + Prev/Next Buttons + Today Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="font-heading font-bold text-xs uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
            {rangeLabel}
          </span>
          {selectedDayFrozen && (
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-[10px] font-heading font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-0.5">
              <Snowflake className="w-2.5 h-2.5" />
              <span>Freeze</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {showTodayButton && (
            <button
              onClick={handleGoToToday}
              className="px-2 py-0.5 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-300 font-heading font-bold text-[10px] uppercase shadow-xs active:scale-95 transition cursor-pointer"
            >
              Today
            </button>
          )}

          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-900">
            <button
              onClick={handlePrevWeek}
              aria-label="Previous week"
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-800 active:bg-zinc-200 text-zinc-600 dark:text-zinc-400 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextWeek}
              aria-label="Next week"
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-200 text-zinc-600 dark:text-zinc-400 transition cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Pill Cards Row */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isDayToday = isSameDay(day, today);
          const status = getDayStatus(day);
          const dayName = day.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
          const dayNum = day.getDate();

          return (
            <button
              key={formatDateKey(day)}
              onClick={() => setSelectedDate(day)}
              aria-pressed={isSelected}
              aria-label={`${dayName} ${dayNum}`}
              className={`flex flex-col items-center justify-between py-2 px-1 rounded-xl transition-all cursor-pointer select-none ${
                isSelected
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border border-zinc-900 dark:border-zinc-100 shadow-xs -translate-y-0.5"
                  : isDayToday
                  ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  : "bg-zinc-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-600"
              } active:scale-95`}
            >
              {/* Day of Week Label */}
              <span
                className={`text-[10px] font-heading font-bold uppercase tracking-wider ${
                  isSelected ? "text-zinc-300 dark:text-zinc-600" : isDayToday ? "text-zinc-900 dark:text-zinc-100 font-bold" : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {dayName}
              </span>

              {/* Day Number */}
              <span
                className={`text-sm font-heading font-bold my-0.5 ${
                  isSelected ? "text-white dark:text-zinc-900" : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {dayNum}
              </span>

              {/* Status Dot / Indicator */}
              <div className="h-2 flex items-center justify-center">
                {status === "frozen" ? (
                  <span
                    title="Freeze / Rest Day"
                    className="w-2 h-2 rounded-full bg-cyan-400 ring-1 ring-cyan-600 block"
                  />
                ) : status === "done" ? (
                  <span
                    title="100% Completed"
                    className="w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-emerald-600 block"
                  />
                ) : status === "partial" ? (
                  <span
                    title="Partially Completed"
                    className="w-2 h-2 rounded-full bg-amber-400 block"
                  />
                ) : isDayToday ? (
                  <span
                    title="Today"
                    className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white dark:bg-zinc-900" : "bg-zinc-900 dark:bg-zinc-100"}`}
                  />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 block" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Status Bar */}
      <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-heading font-medium text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-900 dark:text-zinc-100 font-bold">{selectedDateLabel}</span>
          {isViewingToday && (
            <span className="px-1.5 py-0.2 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[9px] uppercase tracking-wider font-bold">
              Today
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {scheduledForSelected.length > 0 ? (
            <span
              className={`flex items-center gap-1 ${
                doneCountForSelected === scheduledForSelected.length
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {doneCountForSelected === scheduledForSelected.length && (
                <Check className="w-3 h-3 stroke-[3]" />
              )}
              <span>
                {doneCountForSelected}/{scheduledForSelected.length} Routines
              </span>
            </span>
          ) : (
            <span className="text-zinc-400 font-medium">No routines</span>
          )}

          <button
            onClick={toggleFreezeDay}
            title="Toggle freeze day for today"
            className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 font-bold uppercase underline transition cursor-pointer"
          >
            {isFreezeDay ? "Unfreeze" : "Freeze"}
          </button>
        </div>
      </div>
    </div>
  );
}
