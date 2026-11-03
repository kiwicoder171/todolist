"use client";

import React, { useState, useEffect } from "react";
import { useHousehold, formatDateKey } from "@/context/HouseholdContext";
import { useFocusTimer, FocusLogItem } from "@/context/FocusTimerContext";
import { Clock, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

export function DayTimelineRail() {
  const { selectedDate } = useHousehold();
  const { getLogsForDate, getTotalFocusMinutesForDate } = useFocusTimer();
  const [isExpanded, setIsExpanded] = useState(false);
  const [nowMinute, setNowMinute] = useState(0);

  // Update current time needle every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setNowMinute(now.getHours() * 60 + now.getMinutes());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const logs = getLogsForDate(selectedDate);
  const totalMinutes = getTotalFocusMinutesForDate(selectedDate);

  const isSelectedDateToday =
    formatDateKey(selectedDate) === formatDateKey(new Date());

  // Hours to show in timeline: 6 AM to 12 AM (18 hours) or 24h
  const startHour = 6;
  const endHour = 24; // 18 hours span
  const totalSpanMinutes = (endHour - startHour) * 60;

  // Needle position percentage
  const currentNeedlePercentage = Math.min(
    100,
    Math.max(0, ((nowMinute - startHour * 60) / totalSpanMinutes) * 100)
  );

  const hoursMarks = [6, 9, 12, 15, 18, 21, 24];

  return (
    <div
      data-testid="day-timeline-rail"
      className="w-full apple-card p-3.5 sm:p-4 mb-4 rounded-3xl"
    >
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-black/[0.05] dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            24h Focus Timeline
          </span>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
            {totalMinutes}m logged
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1 px-2 py-1 rounded-xl apple-press transition cursor-pointer"
        >
          <span>{isExpanded ? "Collapse" : "Details"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Visual Horizontal Timeline Bar (Always visible) */}
      <div className="mt-2.5 relative">
        {/* Timeline Axis Track */}
        <div className="h-7 w-full bg-black/[0.03] dark:bg-white/[0.04] rounded-2xl relative overflow-hidden border border-black/[0.05] dark:border-white/[0.08] flex items-center">
          {/* Hour subdivisions */}
          {hoursMarks.map((h) => {
            const leftPct = ((h - startHour) / (endHour - startHour)) * 100;
            return (
              <div
                key={h}
                className="absolute top-0 bottom-0 border-l border-black/[0.05] dark:border-white/[0.08] pointer-events-none"
                style={{ left: `${leftPct}%` }}
              />
            );
          })}

          {/* Render logged focus intervals at their exact time of day */}
          {logs.map((log) => {
            let leftPct = 0;
            if (log.startedAtTimestamp) {
              const d = new Date(log.startedAtTimestamp);
              const m = d.getHours() * 60 + d.getMinutes();
              leftPct = Math.max(0, Math.min(98, ((m - startHour * 60) / totalSpanMinutes) * 100));
            } else {
              const parts = log.startedAt?.split(":") || [];
              if (parts.length >= 2) {
                const hour = parseInt(parts[0], 10);
                const min = parseInt(parts[1], 10);
                if (!isNaN(hour) && !isNaN(min)) {
                  const m = hour * 60 + min;
                  leftPct = Math.max(0, Math.min(98, ((m - startHour * 60) / totalSpanMinutes) * 100));
                }
              }
            }
            const durationPct = Math.max(2, (log.durationMinutes / totalSpanMinutes) * 100);
            return (
              <div
                key={log.id}
                title={`${log.taskTitle} (${log.durationMinutes}m at ${log.startedAt})`}
                className="absolute top-1 bottom-1 bg-emerald-500/35 dark:bg-emerald-500/45 border border-emerald-500/70 dark:border-emerald-400 rounded-lg hover:bg-emerald-500/60 transition cursor-pointer z-5"
                style={{ left: `${leftPct}%`, width: `${durationPct}%` }}
              />
            );
          })}

          {/* Current Time Needle (if today) */}
          {isSelectedDateToday && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 dark:bg-blue-400 shadow-[0_0_8px_#3b82f6] z-10"
              style={{ left: `${currentNeedlePercentage}%` }}
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 -translate-x-[3px] -translate-y-0.5 shadow-sm" />
            </div>
          )}
        </div>

        {/* Hour Axis Labels */}
        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-1.5 px-1.5">
          <span>6 AM</span>
          <span>9 AM</span>
          <span>12 PM</span>
          <span>3 PM</span>
          <span>6 PM</span>
          <span>9 PM</span>
          <span>12 AM</span>
        </div>
      </div>

      {/* Expanded Logs Breakdown */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] space-y-2 animate-fade-in">
          {logs.length === 0 ? (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 italic text-center py-2">
              No focus blocks logged yet for this date.
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between text-xs py-2 px-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06]"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{log.taskTitle}</span>
                  {log.category && (
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 bg-black/[0.05] dark:bg-white/[0.08] px-2 py-0.5 rounded-full font-mono">
                      {log.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 font-mono text-[11px] shrink-0">
                  <span>{log.startedAt}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{log.durationMinutes}m</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
