"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useHousehold, matchesAssigneeFilter, Assignee, getAssigneeLabel, formatDateKey, resolveIntentToAssignee, isMockScores } from "@/context/HouseholdContext";
import { useOptionalAuth } from "@/context/AuthContext";
import {
  useRoutines,
  isRoutineScheduledForDate,
  formatFrequencyLabel,
  RoutineFrequency,
} from "@/context/RoutinesContext";
import { evaluatePartnerDay, getConsecutiveMisses } from "@/utils/gamification";
import { useNotifications } from "@/context/NotificationContext";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { Check, ArrowUp, ArrowDown, X, Plus, Calendar, ChevronDown, Play, AlertTriangle, Sparkles } from "lucide-react";
import { AddRoutineModal } from "./AddRoutineModal";

export function DailyRoutinesBoard() {
  const {
    activePartner,
    assigneeFilter,
    selectedDate,
    partnerNames,
    isDateFrozen,
    updateScore,
    reconcileDailyPenaltiesAndStreaks,
    scores,
    circle,
  } = useHousehold();
  const authContext = useOptionalAuth();
  const user = authContext?.user;
  const {
    routines,
    addRoutine,
    deleteRoutine,
    toggleCompletion,
    isCompleted,
    reorderRoutines,
  } = useRoutines();
  const { startFocus } = useFocusTimer();
  const { addNotification } = useNotifications();

  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState<Assignee>("mine");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialTitle, setModalInitialTitle] = useState("");
  const [showOtherDays, setShowOtherDays] = useState(false);

  const myName = activePartner === "alex" ? partnerNames.alex : partnerNames.sam;
  const otherPartner = activePartner === "alex" ? "sam" : "alex";
  const otherPartnerName = activePartner === "alex" ? partnerNames.sam : partnerNames.alex;

  // Active partner's day evaluation (evaluates partner's assigned 'mine' + 'both' routines)
  const myEvaluation = evaluatePartnerDay(
    activePartner,
    selectedDate,
    routines,
    isDateFrozen,
    isCompleted
  );

  // Other partner's evaluation
  const otherEvaluation = evaluatePartnerDay(
    otherPartner,
    selectedDate,
    routines,
    isDateFrozen,
    isCompleted
  );

  const isMyDayPerfect = myEvaluation.isPerfectDay;
  const isBothHouseholdPerfect = myEvaluation.isPerfectDay && otherEvaluation.isPerfectDay;

  const isMock = !user && !circle && isMockScores(scores);

  const missStatus = isMock
    ? { consecutiveMisses: 0, totalPenalty: 0 }
    : getConsecutiveMisses(
        activePartner,
        selectedDate,
        routines,
        isDateFrozen,
        isCompleted
      );

  const lastEvaluatedKeyRef = useRef<string>("");

  useEffect(() => {
    const selectedKey = formatDateKey(selectedDate);
    // Create signature based on partner, date, routines count and completions
    const completionSig = routines
      .map((r) => `${r.id}:${isCompleted(r.id, selectedDate) ? 1 : 0}`)
      .join(",");
    const evalKey = `${activePartner}-${selectedKey}-${routines.length}-${completionSig}`;

    if (lastEvaluatedKeyRef.current === evalKey) {
      return;
    }
    lastEvaluatedKeyRef.current = evalKey;

    const res = reconcileDailyPenaltiesAndStreaks(routines, isCompleted, selectedDate);
    if (res && res.deltaPoints && res.deltaPoints[activePartner] < 0) {
      addNotification({
        title: "⚠️ Routine Penalty Applied",
        message: `${myName} missed daily routines for 2 consecutive days. 1 point deducted.`,
        type: "streak_alert",
        recipient: "both",
        points: res.deltaPoints[activePartner],
      });
    }
  }, [routines, selectedDate, activePartner, myName, reconcileDailyPenaltiesAndStreaks, isCompleted, addNotification]);

  // Filter routines by schedule date & assignee filter
  const visibleRoutines = routines.filter((r) => {
    const isScheduled = isRoutineScheduledForDate(r.frequency, selectedDate);
    const matchesFilter = matchesAssigneeFilter(
      r.assignee,
      activePartner,
      assigneeFilter
    );
    return isScheduled && matchesFilter;
  });

  // Routines applicable to current filter but scheduled for other days of the week
  const otherDayRoutines = routines.filter((r) => {
    const isScheduled = isRoutineScheduledForDate(r.frequency, selectedDate);
    const matchesFilter = matchesAssigneeFilter(
      r.assignee,
      activePartner,
      assigneeFilter
    );
    return !isScheduled && matchesFilter;
  });

  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    const wasCompleted = isCompleted(id, selectedDate);
    const routine = routines.find((r) => r.id === id);
    const wasMyDayPerfect = myEvaluation.isPerfectDay;
    toggleCompletion(id, selectedDate);

    if (!wasCompleted) {
      const otherPartner = activePartner === "alex" ? "sam" : "alex";
      addNotification({
        title: "Routine Complete! 🎯",
        message: routine ? `${myName} completed "${routine.title}"` : `${myName} checked off a routine`,
        type: "routine_completed",
        partner: activePartner,
        recipient: otherPartner,
      });

      // If completing this routine achieves a Perfect Day for active partner
      if (!wasMyDayPerfect && myEvaluation.completedCount + 1 >= myEvaluation.totalScheduled && myEvaluation.totalScheduled > 0) {
        setCelebrationMsg("🔥 Perfect Day! +1 PT Earned!");
        updateScore(activePartner, 1, 1);
        addNotification({
          title: "🔥 Perfect Day Achieved!",
          message: `${myName} completed all assigned routines for today! (+1 Point earned)`,
          type: "streak_alert",
          partner: activePartner,
          recipient: "both",
          points: 1,
        });
      } else {
        setCelebrationMsg("✨ +1 Routine Done!");
      }
      setTimeout(() => setCelebrationMsg(null), 2500);
    } else {
      // User is unchecking a routine from a previously perfected day
      if (wasMyDayPerfect) {
        updateScore(activePartner, -1, -1);
      }
    }
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const resolved = resolveIntentToAssignee(newAssignee, activePartner);
    addRoutine(newTitle.trim(), resolved, "daily");
    setCelebrationMsg(`✨ Added "${newTitle.trim()}"!`);
    setTimeout(() => setCelebrationMsg(null), 2500);
    setNewTitle("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTitle.trim()) {
      handleQuickAddSubmit(e);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < routines.length) {
      reorderRoutines(index, targetIndex);
    }
  };

  return (
    <div className="apple-card rounded-3xl p-4 sm:p-5 flex flex-col flex-1 relative">
      {celebrationMsg && (
        <div className="absolute top-3 right-5 z-20 px-3 py-1 bg-zinc-900/90 dark:bg-white/90 text-white dark:text-zinc-900 text-[11px] font-semibold rounded-full animate-scale-in backdrop-blur-md shadow-lg">
          {celebrationMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05] dark:border-white/[0.06] mb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-bold text-xs shrink-0">
            1
          </div>
          <h2 className="font-semibold text-sm tracking-wide text-zinc-900 dark:text-zinc-100">
            Daily Routines
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-400 hidden sm:inline-block">
            Recurring
          </span>
          <button
            type="button"
            onClick={() => {
              setModalInitialTitle(newTitle);
              setIsModalOpen(true);
            }}
            className="hidden sm:flex px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 rounded-full font-semibold text-[10px] items-center gap-1 apple-press transition shadow-2xs"
          >
            <Plus className="w-3 h-3" />
            <span>Add Routine</span>
          </button>
        </div>
      </div>

      {isBothHouseholdPerfect ? (
        <div className="mb-3.5 p-3 sm:p-3.5 rounded-2xl border border-emerald-500/25 dark:border-emerald-500/35 bg-emerald-500/[0.08] dark:bg-emerald-500/[0.14] backdrop-blur-xl flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-emerald-950 dark:text-emerald-100 text-xs truncate">
                100% Household Routines Completed
              </p>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 font-normal truncate">
                Perfect Day! +1 point bonus awarded to both partner desks
              </p>
            </div>
          </div>
          <span className="shrink-0 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl border border-emerald-500/30 bg-white/80 dark:bg-zinc-900/80 text-emerald-600 dark:text-emerald-400 shadow-2xs">
            +1 PT
          </span>
        </div>
      ) : isMyDayPerfect ? (
        <div className="mb-3.5 p-3 sm:p-3.5 rounded-2xl border border-emerald-500/25 dark:border-emerald-500/35 bg-emerald-500/[0.08] dark:bg-emerald-500/[0.14] backdrop-blur-xl flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-emerald-950 dark:text-emerald-100 text-xs truncate">
                All Daily Routines Completed
              </p>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 font-normal truncate">
                Perfect Day! +1 point bonus awarded to your desk
              </p>
            </div>
          </div>
          <span className="shrink-0 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl border border-emerald-500/30 bg-white/80 dark:bg-zinc-900/80 text-emerald-600 dark:text-emerald-400 shadow-2xs">
            +1 PT
          </span>
        </div>
      ) : missStatus.consecutiveMisses >= 2 ? (
        <div className="mb-3.5 p-3 sm:p-3.5 rounded-2xl border border-rose-500/25 dark:border-rose-500/35 bg-rose-500/[0.08] dark:bg-rose-500/[0.14] backdrop-blur-xl flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-rose-950 dark:text-rose-100 text-xs truncate">
                {missStatus.consecutiveMisses} Days Missed · Penalty Ladder Active
              </p>
              <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 font-normal truncate">
                -{Math.abs(missStatus.totalPenalty)} pt deduction applied · Complete today to recover streak
              </p>
            </div>
          </div>
          <span className="shrink-0 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl border border-rose-500/30 bg-white/80 dark:bg-zinc-900/80 text-rose-600 dark:text-rose-300 shadow-2xs">
            -{Math.abs(missStatus.totalPenalty)} PTS
          </span>
        </div>
      ) : null}

      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
        Apple Notes style. Press{" "}
        <kbd className="px-1.5 py-0.5 bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] rounded-md font-mono text-[10px] text-zinc-700 dark:text-zinc-300">
          Enter
        </kbd>{" "}
        to add new routine.
      </p>

      {/* Routine Items Container */}
      <div className="space-y-2 flex-1 overflow-y-auto pt-1 pb-1 pr-1 min-h-[220px]">
        {visibleRoutines.length === 0 ? (
          <div className="h-28 border border-dashed border-black/[0.08] dark:border-white/[0.1] rounded-2xl flex items-center justify-center text-xs text-zinc-400">
            No routines scheduled for this day
          </div>
        ) : (
          visibleRoutines.map((r, idx) => {
            const completed = isCompleted(r.id, selectedDate);

            return (
              <div
                key={r.id}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] group transition"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                  <button
                    onClick={() => handleToggle(r.id)}
                    aria-label={`Toggle ${r.title}`}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all apple-press cursor-pointer ${
                      completed
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-xs"
                        : "border-black/20 dark:border-white/20 bg-white/60 dark:bg-zinc-800/60 hover:border-black/40 dark:hover:border-white/40 text-transparent"
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </button>

                  <span
                    className={`text-xs font-medium ink-strikethrough ${
                      completed ? "done" : "text-zinc-900 dark:text-zinc-100"
                    } truncate`}
                  >
                    {r.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {formatFrequencyLabel(r.frequency)}
                  </span>

                  <span
                    className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      r.assignee === "both"
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                        : "border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.05] text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {getAssigneeLabel(r.assignee, activePartner, partnerNames)}
                  </span>

                  {/* Reorder Buttons */}
                  <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 flex items-center gap-0.5 transition">
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      title="Move Up"
                      aria-label="Move routine up"
                      className="p-1 hover:bg-black/[0.05] dark:hover:bg-white/[0.1] rounded-lg text-zinc-400 disabled:opacity-20 focus:outline-none transition"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === visibleRoutines.length - 1}
                      title="Move Down"
                      aria-label="Move routine down"
                      className="p-1 hover:bg-black/[0.05] dark:hover:bg-white/[0.1] rounded-lg text-zinc-400 disabled:opacity-20 focus:outline-none transition"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => startFocus({ id: r.id, title: r.title, type: "routine" })}
                      title="Focus on this routine"
                      aria-label="Start Focus"
                      className="p-1 hover:text-emerald-500 text-zinc-400 rounded-lg transition focus:outline-none"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                    <button
                      onClick={() => deleteRoutine(r.id)}
                      title="Delete Routine"
                      aria-label="Delete routine"
                      className="p-1 hover:text-rose-500 text-zinc-400 rounded-lg transition focus:outline-none"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Other Days Scheduled Routines Accordion */}
        {otherDayRoutines.length > 0 && (
          <div className="pt-2 border-t border-dashed border-black/[0.08] dark:border-white/[0.1]">
            <button
              type="button"
              onClick={() => setShowOtherDays((prev) => !prev)}
              className="text-[11px] font-semibold uppercase text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-between w-full py-1.5 transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>
                  {otherDayRoutines.length} routine{otherDayRoutines.length > 1 ? "s" : ""} on other days
                </span>
              </span>
              <span className="text-[10px] underline">
                {showOtherDays ? "Hide" : "Show"}
              </span>
            </button>

            {showOtherDays && (
              <div className="space-y-1.5 mt-1.5">
                {otherDayRoutines.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-2 rounded-2xl border border-dashed border-black/[0.08] dark:border-white/[0.1] bg-black/[0.01] dark:bg-white/[0.02] opacity-80"
                  >
                    <div className="flex items-center gap-2 min-w-0 mr-2">
                      <div className="w-5 h-5 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-center text-[10px] text-zinc-400 font-mono">
                        —
                      </div>
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 truncate">
                        {r.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-medium text-zinc-500 dark:text-zinc-400 bg-white/80 dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08]">
                        {formatFrequencyLabel(r.frequency)}
                      </span>
                      <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.04] dark:bg-white/[0.06] text-zinc-800 dark:text-zinc-200">
                        {getAssigneeLabel(r.assignee, activePartner, partnerNames)}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteRoutine(r.id)}
                        title="Delete Routine"
                        aria-label="Delete routine"
                        className="p-1 hover:text-rose-500 text-zinc-400 rounded-lg transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Add Routine Bar */}
      <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.06]">
        <form
          onSubmit={handleQuickAddSubmit}
          className="flex items-center gap-1.5 sm:gap-2 bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl px-2.5 sm:px-3 py-1.5 focus-within:ring-2 focus-within:ring-black/10 dark:focus-within:ring-white/10 transition shadow-2xs"
        >
          <Plus className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            id="quick-add-routine-input"
            name="routineTitle"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add daily routine... (Enter)"
            aria-label="New routine title"
            className="bg-transparent text-xs font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none w-full min-w-0"
          />

          <select
            id="quick-add-routine-assignee"
            name="routineAssignee"
            value={newAssignee}
            aria-label="Routine assignee"
            onChange={(e) => setNewAssignee(e.target.value as Assignee)}
            className="bg-white/90 dark:bg-zinc-800/90 font-semibold text-[10px] uppercase text-zinc-800 dark:text-zinc-200 rounded-xl px-2.5 py-1.5 border border-black/[0.08] dark:border-white/[0.1] focus:outline-none shrink-0"
          >
            <option value="mine">Me</option>
            <option value="partner">{otherPartnerName}</option>
            <option value="both">Both</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setModalInitialTitle(newTitle);
              setIsModalOpen(true);
            }}
            title="Pick specific days of the week"
            className="bg-white/90 dark:bg-zinc-800/90 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold text-[10px] uppercase text-zinc-800 dark:text-zinc-200 rounded-xl px-2.5 py-1.5 border border-black/[0.08] dark:border-white/[0.1] apple-press transition shrink-0 flex items-center gap-1 shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Calendar className="w-3 h-3" />
            <span className="hidden sm:inline">Pick Days</span>
          </button>

          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 disabled:opacity-30 font-semibold text-[10px] uppercase rounded-xl px-3.5 py-1.5 apple-press transition shrink-0 shadow-2xs cursor-pointer"
          >
            Add
          </button>
        </form>
      </div>

      <AddRoutineModal
        isOpen={isModalOpen}
        initialTitle={modalInitialTitle || newTitle}
        onClose={() => {
          setIsModalOpen(false);
          setModalInitialTitle("");
        }}
      />
    </div>
  );
}
