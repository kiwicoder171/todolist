"use client";

import React, { useState } from "react";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { Play, Pause, Square, Coffee, Check, Flame, ChevronUp, ChevronDown } from "lucide-react";

export function formatTimeDisplay(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function FloatingFocusPill() {
  const {
    activeSession,
    displaySeconds,
    isRunning,
    isBreak,
    pauseFocus,
    resumeFocus,
    toggleBreak,
    stopFocus,
  } = useFocusTimer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [completedSummary, setCompletedSummary] = useState<string | null>(null);

  if (!activeSession) {
    if (completedSummary) {
      return (
        <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in pointer-events-auto">
          <div className="bg-[#121215] text-white border border-zinc-700/60 shadow-xl rounded-full px-4 py-2 flex items-center gap-2 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{completedSummary}</span>
            <button
              onClick={() => setCompletedSummary(null)}
              className="text-zinc-400 hover:text-white ml-1 text-sm font-bold"
            >
              ×
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  const handleFinish = () => {
    const log = stopFocus(true);
    if (log) {
      const summary = `Logged ${log.durationMinutes}m on "${log.taskTitle}"`;
      setCompletedSummary(summary);
      setTimeout(() => setCompletedSummary(null), 4000);
    }
  };

  const remainingPomodoroSec = Math.max(0, activeSession.targetSeconds - displaySeconds);
  const isPomodoro = activeSession.mode === "pomodoro";
  const timerText = isPomodoro
    ? formatTimeDisplay(remainingPomodoroSec)
    : formatTimeDisplay(displaySeconds);

  return (
    <div
      data-testid="floating-focus-pill"
      className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 max-w-[92vw] sm:max-w-md w-auto"
    >
      <div className="bg-[#0e0e11] text-zinc-100 border border-zinc-700/80 shadow-[0_8px_32px_rgba(0,0,0,0.45)] rounded-2xl sm:rounded-full p-2 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row items-center gap-2.5 backdrop-blur-md">
        {/* Left: Status pulse & Title */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 px-1">
          <div className="relative flex items-center justify-center shrink-0">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isBreak
                  ? "bg-amber-400"
                  : isRunning
                  ? "bg-emerald-400 animate-pulse"
                  : "bg-zinc-500"
              }`}
            />
          </div>

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-1.5 flex-nowrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {isBreak ? "Break" : isPomodoro ? "Pomodoro" : "Focus"}
              </span>
              {activeSession.target.category && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono">
                  {activeSession.target.category}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-zinc-100 truncate max-w-[150px] sm:max-w-[180px]">
              {activeSession.target.title}
            </p>
          </div>
        </div>

        {/* Center: Live Timer Display */}
        <div className="font-mono font-bold text-sm sm:text-base tracking-tight text-white px-2 py-0.5 rounded-lg bg-zinc-900/90 border border-zinc-800 shrink-0">
          {timerText}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleBreak}
            aria-label="Toggle Break"
            title={isBreak ? "Switch to Focus" : "Take Short Break"}
            className={`p-1.5 rounded-full transition ${
              isBreak
                ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
          </button>

          {isRunning ? (
            <button
              onClick={pauseFocus}
              aria-label="Pause Timer"
              className="p-1.5 rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 active:scale-95 transition"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={resumeFocus}
              aria-label="Resume Timer"
              className="p-1.5 rounded-full bg-white text-black hover:bg-zinc-200 active:scale-95 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          <button
            onClick={handleFinish}
            aria-label="Finish and Save Session"
            title="Finish & Save Focus Session"
            className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 flex items-center gap-1 text-[11px] font-bold active:scale-95 transition"
          >
            <Check className="w-3 h-3" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}
