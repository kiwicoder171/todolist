import React, { useState } from "react";
import { useHousehold, matchesAssigneeFilter, Partner } from "@/context/HouseholdContext";
import { useRoutines, isRoutineScheduledForDate } from "@/context/RoutinesContext";
import { useNotifications } from "@/context/NotificationContext";
import { DateCalendar } from "@/components/base/date-picker/date-calendar";
import { CalendarDate } from "@internationalized/date";
import { Heart } from "lucide-react";

export function CalendarConsistencySection() {
  const {
    selectedDate,
    setSelectedDate,
    isDateFrozen,
    activePartner,
    partnerNames,
  } = useHousehold();

  const { routines, isCompleted } = useRoutines();
  const { sendCheer } = useNotifications();
  const [hasCheered, setHasCheered] = useState(false);

  // Convert JavaScript Date to CalendarDate for BoardUI React Aria Calendar
  const calendarValue = new CalendarDate(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    selectedDate.getDate()
  );

  const handleDateChange = (newDate: CalendarDate) => {
    setSelectedDate(new Date(newDate.year, newDate.month - 1, newDate.day));
  };

  // Glance indicator status for a date
  const getDateStatus = (date: Date): "done" | "frozen" | "pending" | "empty" => {
    if (isDateFrozen(date)) return "frozen";

    const myRoutines = routines.filter((r) =>
      matchesAssigneeFilter(r.assignee, activePartner, "mine")
    );
    const scheduled = myRoutines.filter((r) =>
      isRoutineScheduledForDate(r.frequency, date)
    );
    if (scheduled.length === 0) return "empty";

    const allDone = scheduled.every((r) => isCompleted(r.id, date));
    return allDone ? "done" : "pending";
  };

  // 7-segment habit days of the current week (Sunday to Saturday)
  const getWeekDates = () => {
    const current = new Date(selectedDate);
    const dayOfWeek = current.getDay();
    const sunday = new Date(current);
    sunday.setDate(current.getDate() - dayOfWeek);

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const currentWeek = getWeekDates();

  // Habit consistency calculation for past 7 days
  const getHabitPast7Count = (routineId: string) => {
    let completedCount = 0;
    currentWeek.forEach((date) => {
      if (isCompleted(routineId, date)) {
        completedCount++;
      }
    });
    return completedCount;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. BoardUI Date Calendar Card */}
      <div className="apple-card rounded-3xl p-5 flex flex-col items-center">
        <DateCalendar
          className="w-full flex justify-center"
          value={calendarValue}
          onChange={handleDateChange}
          renderDayExtra={(ariaDate) => {
            const d = new Date(ariaDate.year, ariaDate.month - 1, ariaDate.day);
            const status = getDateStatus(d);
            const isSelected =
              d.getDate() === selectedDate.getDate() &&
              d.getMonth() === selectedDate.getMonth() &&
              d.getFullYear() === selectedDate.getFullYear();

            if (status === "frozen") {
              return (
                <span
                  title="Freeze Day"
                  className={`w-1.5 h-1.5 rounded-full border border-dashed ${
                    isSelected
                      ? "border-white dark:border-zinc-900"
                      : "border-zinc-400 dark:border-zinc-500"
                  }`}
                />
              );
            }
            if (status === "done") {
              return (
                <span
                  title="100% Routines Completed"
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected
                      ? "bg-white dark:bg-zinc-900"
                      : "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                  }`}
                />
              );
            }
            if (status === "pending") {
              return (
                <span
                  title="Pending Tasks"
                  className={`w-1.5 h-1.5 rounded-full border ${
                    isSelected
                      ? "border-white dark:border-zinc-900 bg-transparent"
                      : "border-zinc-400 dark:border-zinc-500 bg-transparent"
                  }`}
                />
              );
            }
            return null;
          }}
        />

        {/* Legend */}
        <div className="w-full mt-4 pt-3.5 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
            <span>100% Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-zinc-400 dark:border-zinc-500" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-dashed border-zinc-500 dark:border-zinc-400" />
            <span>Freeze Day</span>
          </div>
        </div>
      </div>

      {/* 2. Consistency Dials Card */}
      <div className="apple-card rounded-3xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/[0.05] dark:border-white/[0.06]">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Consistency Dials
            </h3>
            <span className="text-[10px] font-semibold uppercase text-zinc-400 dark:text-zinc-500">
              Past 7 Days
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            {routines.slice(0, 3).map((r) => {
              const count = getHabitPast7Count(r.id);
              const label = r.title.split("/")[0].split("(")[0].trim();
              const pct = Math.round((count / 7) * 100);
              const radius = 22;
              const circum = 2 * Math.PI * radius;
              const strokeOffset = circum - (count / 7) * circum;

              return (
                <div key={r.id} className="flex flex-col items-center">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 52 52">
                      <circle
                        cx="26"
                        cy="26"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="3.5"
                        className="text-black/[0.06] dark:text-white/[0.08]"
                        fill="transparent"
                      />
                      <circle
                        cx="26"
                        cy="26"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeDasharray={circum}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        className="text-emerald-500 transition-all duration-700"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute font-mono font-bold text-xs text-zinc-800 dark:text-zinc-200">
                      {count}/7
                    </span>
                  </div>
                  <span className="text-[11px] font-medium mt-1 text-zinc-700 dark:text-zinc-300 truncate max-w-[80px]">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Couple Cheer Section */}
        <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 flex items-center justify-center bg-rose-500/10">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Couple Momentum
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">In sync today!</p>
            </div>
          </div>

          <button
            onClick={() => {
              setHasCheered(true);
              const sender = partnerNames[activePartner] || "You";
              const otherPartner: Partner = activePartner === "alex" ? "sam" : "alex";
              sendCheer(sender, "sent you love & momentum! Keep rocking it! ❤️", otherPartner);
              setTimeout(() => setHasCheered(false), 3000);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold apple-press transition cursor-pointer ${
              hasCheered
                ? "bg-rose-500 text-white shadow-xs"
                : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 shadow-2xs"
            }`}
          >
            {hasCheered ? "Cheered! ❤️" : "Cheer ❤️"}
          </button>
        </div>
      </div>
    </div>
  );
}
