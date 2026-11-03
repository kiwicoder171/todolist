"use client";

import React, { useState } from "react";
import { useFocusTimer, FocusMode } from "@/context/FocusTimerContext";
import { useRoutines } from "@/context/RoutinesContext";
import { useDailyTasks } from "@/context/DailyTasksContext";
import { useKanban } from "@/context/KanbanContext";
import { useHousehold } from "@/context/HouseholdContext";
import { focusAudio } from "@/utils/focusAudio";
import {
  Play,
  Pause,
  Coffee,
  Check,
  CheckCheck,
  ChevronDown,
  Volume2,
  VolumeX,
  Timer,
  Clock,
} from "lucide-react";

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
    soundEnabled,
    toggleSound,
    ambientSound,
    setAmbientSound,
    ambientVolume,
    setAmbientVolume,
    updateActiveSessionMode,
    goalBonusMessage,
    clearGoalBonusMessage,
  } = useFocusTimer();

  const { selectedDate } = useHousehold();
  const { toggleCompletion } = useRoutines();
  const { toggleDailyTask } = useDailyTasks();
  const { moveCardStage } = useKanban();

  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [completedSummary, setCompletedSummary] = useState<string | null>(null);

  if (!activeSession) {
    if (goalBonusMessage) {
      return (
        <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in pointer-events-auto">
          <div className="bg-zinc-900/95 dark:bg-zinc-950/95 text-white border border-amber-500/50 shadow-2xl rounded-full px-4 py-2 flex items-center gap-2 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>{goalBonusMessage}</span>
            <button
              onClick={clearGoalBonusMessage}
              className="text-zinc-400 hover:text-white ml-1 text-sm font-bold"
            >
              ×
            </button>
          </div>
        </div>
      );
    }
    if (completedSummary) {
      return (
        <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in pointer-events-auto">
          <div className="bg-zinc-900/95 dark:bg-zinc-950/95 text-white border border-zinc-700/60 shadow-xl rounded-full px-4 py-2 flex items-center gap-2 text-xs font-medium backdrop-blur-md">
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

  const handleFinish = (markDone: boolean = false) => {
    const target = activeSession.target;

    if (markDone && target.id) {
      if (target.type === "routine") {
        toggleCompletion(target.id, selectedDate);
      } else if (target.type === "daily") {
        toggleDailyTask(target.id);
      } else if (target.type === "kanban") {
        moveCardStage(target.id, "done");
      }
    }

    const log = stopFocus(true);

    if (log) {
      const summary = markDone
        ? `✨ Logged ${log.durationMinutes}m & Completed "${log.taskTitle}"!`
        : `Logged ${log.durationMinutes}m on "${log.taskTitle}"`;
      setCompletedSummary(summary);
      setTimeout(() => setCompletedSummary(null), 4000);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    focusAudio.playVolumeTick();
  };

  const handleSelectModePreset = (mode: FocusMode, minutes?: number) => {
    updateActiveSessionMode(mode, minutes);
    setShowModeMenu(false);
  };

  const remainingPomodoroSec = Math.max(0, (activeSession.targetSeconds || 0) - displaySeconds);
  const isPomodoro = activeSession.mode === "pomodoro";
  const timerText = isPomodoro
    ? formatTimeDisplay(remainingPomodoroSec)
    : formatTimeDisplay(displaySeconds);
  const hasCompletableItem = Boolean(activeSession.target.id && activeSession.target.type !== "custom");

  return (
    <div
      data-testid="floating-focus-pill"
      className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 max-w-[94vw] sm:max-w-lg w-auto"
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
              {/* Mode Switcher Popover Trigger */}
              <button
                type="button"
                aria-label="Switch timer mode and duration"
                onClick={() => {
                  setShowModeMenu(!showModeMenu);
                  setShowAudioMenu(false);
                }}
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-0.5 transition"
                title="Switch Timer Mode & Duration"
              >
                <span>{isBreak ? "Break" : isPomodoro ? "Pomodoro" : "Focus"}</span>
                <ChevronDown className="w-2.5 h-2.5 opacity-70" />
              </button>

              {activeSession.target.category && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono">
                  {activeSession.target.category}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-zinc-100 truncate max-w-[130px] sm:max-w-[170px]">
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
            onClick={() => {
              setShowAudioMenu(!showAudioMenu);
              setShowModeMenu(false);
            }}
            aria-label="Ambient Sound and Chimes"
            title="Focus Sound & Ambient Noise"
            className={`p-1.5 rounded-full transition ${
              ambientSound !== "off"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                : soundEnabled
                ? "bg-zinc-800 text-zinc-300 hover:text-white"
                : "bg-zinc-900 text-zinc-600"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

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

          {/* Ticket 17: Finish & Complete synergy */}
          {hasCompletableItem && (
            <button
              onClick={() => handleFinish(true)}
              aria-label="Finish and Complete Task"
              title="Finish Focus Session and Mark Item Complete"
              className="px-2 py-1 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 font-bold flex items-center gap-1 text-[11px] active:scale-95 transition shadow-sm"
            >
              <CheckCheck className="w-3 h-3" />
              <span>Complete</span>
            </button>
          )}

          <button
            onClick={() => handleFinish(false)}
            aria-label="Finish and Save Session"
            title="Log Focus Session without marking done"
            className="px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 flex items-center gap-1 text-[11px] font-medium active:scale-95 transition"
          >
            <Check className="w-3 h-3" />
            <span>{hasCompletableItem ? "Log Only" : "Done"}</span>
          </button>
        </div>
      </div>

      {/* Ticket 19: Mode & Duration Switcher Popover */}
      {showModeMenu && (
        <div className="absolute bottom-full mb-2 left-2 w-56 p-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl text-xs space-y-2 animate-fade-in backdrop-blur-md">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-zinc-400 font-semibold text-[11px]">
            <span>Mode & Duration</span>
            <button
              onClick={() => setShowModeMenu(false)}
              className="text-zinc-500 hover:text-zinc-200"
            >
              ×
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">
              Pomodoro Targets
            </span>
            <div className="grid grid-cols-4 gap-1">
              {[15, 25, 45, 60].map((mins) => {
                const isSelected =
                  isPomodoro && activeSession.targetSeconds === mins * 60;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleSelectModePreset("pomodoro", mins)}
                    className={`py-1 text-center rounded-lg text-[10px] font-semibold transition ${
                      isSelected
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                        : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800"
                    }`}
                  >
                    {mins}m
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-1 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={() => handleSelectModePreset("stopwatch")}
              className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-semibold flex items-center justify-between transition ${
                !isPomodoro
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/50"
                  : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>Open Stopwatch</span>
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">Count Up</span>
            </button>
          </div>
        </div>
      )}

      {/* Ambient Audio & Chimes Popover (Ticket 20 Audio Feedback) */}
      {showAudioMenu && (
        <div className="absolute bottom-full mb-2 right-0 w-64 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl text-xs space-y-2.5 animate-fade-in backdrop-blur-md">
          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
            <span className="font-bold text-zinc-200">Focus Audio & Noise</span>
            <button
              onClick={() => {
                toggleSound();
                if (!soundEnabled) {
                  focusAudio.playChime("pomodoro");
                }
              }}
              className={`text-[10px] px-2 py-0.5 rounded-full border ${
                soundEnabled
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-zinc-800 text-zinc-500 border-zinc-700"
              }`}
            >
              Chimes: {soundEnabled ? "On" : "Muted"}
            </button>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
              Ambient Background
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: "off", label: "Off" },
                  { id: "rain", label: "🌧️ Rain" },
                  { id: "brown", label: "🌊 Brown Noise" },
                  { id: "white", label: "💨 White Noise" },
                  { id: "stream", label: "🌿 Stream" },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAmbientSound(item.id)}
                  className={`py-1 px-2 rounded-lg text-[10px] text-left transition ${
                    ambientSound === item.id
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/50 font-bold"
                      : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800/80"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {ambientSound !== "off" && (
            <div className="pt-1">
              <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                <span>Volume</span>
                <span>{Math.round(ambientVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
