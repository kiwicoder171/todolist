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
      className="w-full bg-[#121215] text-zinc-200 border border-zinc-800/80 rounded-2xl p-3 sm:p-4 mb-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
            24h Focus Timeline
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-emerald-400 font-semibold">
            {totalMinutes}m logged
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 p-1 rounded-md transition"
        >
          <span>{isExpanded ? "Collapse" : "Details"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Visual Horizontal Timeline Bar (Always visible) */}
      <div className="mt-3 relative">
        {/* Timeline Axis Track */}
        <div className="h-6 w-full bg-zinc-900/90 rounded-xl relative overflow-hidden border border-zinc-800/80 flex items-center">
          {/* Hour subdivisions */}
          {hoursMarks.map((h) => {
            const leftPct = ((h - startHour) / (endHour - startHour)) * 100;
            return (
              <div
                key={h}
                className="absolute top-0 bottom-0 border-l border-zinc-800/60 pointer-events-none"
                style={{ left: `${leftPct}%` }}
              />
            );
          })}

          {/* Render logged focus intervals */}
          {logs.map((log) => {
            // Rough placement across day
            const durationPct = Math.max(3, (log.durationMinutes / totalSpanMinutes) * 100);
            return (
              <div
                key={log.id}
                title={`${log.taskTitle} (${log.durationMinutes}m)`}
                className="h-full bg-emerald-500/40 border-r border-emerald-400/80 hover:bg-emerald-500/60 transition cursor-pointer"
                style={{ width: `${durationPct}%` }}
              />
            );
          })}

          {/* Current Time Needle (if today) */}
          {isSelectedDateToday && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-400 shadow-[0_0_8px_#60a5fa] z-10"
              style={{ left: `${currentNeedlePercentage}%` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 -translate-x-[2px] -translate-y-0.5" />
            </div>
          )}
        </div>

        {/* Hour Axis Labels */}
        <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 mt-1 px-1">
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
        <div className="mt-3.5 pt-3 border-t border-zinc-800/80 space-y-2">
          {logs.length === 0 ? (
            <p className="text-xs text-zinc-500 italic text-center py-2">
              No focus blocks logged yet for this date.
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="font-semibold text-zinc-200 truncate">{log.taskTitle}</span>
                  {log.category && (
                    <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.2 rounded font-mono">
                      {log.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-zinc-400 font-mono text-[11px] shrink-0">
                  <span>{log.startedAt}</span>
                  <span className="font-bold text-emerald-400">{log.durationMinutes}m</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
