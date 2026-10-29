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
import { Check, ArrowUp, ArrowDown, X, Plus, Calendar, ChevronDown } from "lucide-react";
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
    <div className="bg-white border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col flex-1 relative">
      {celebrationMsg && (
        <div className="absolute top-2 right-4 z-20 px-3 py-1 bg-black text-white text-[11px] font-heading font-extrabold rounded-full animate-bounce border border-white">
          {celebrationMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b-2 border-black mb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center font-heading font-bold text-xs shrink-0">
            1
          </div>
          <h2 className="font-heading font-black text-sm uppercase tracking-wide text-black">
            Daily Routines
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-full border border-black bg-zinc-100 hidden sm:inline-block">
            Recurring
          </span>
          <button
            type="button"
            onClick={() => {
              setModalInitialTitle(newTitle);
              setIsModalOpen(true);
            }}
            className="px-2.5 py-1 bg-black text-white hover:bg-zinc-800 rounded-full font-heading font-extrabold text-[10px] uppercase flex items-center gap-1 transition shadow-xs"
          >
            <Plus className="w-3 h-3" />
            <span>Add Routine</span>
          </button>
        </div>
      </div>

      {isBothHouseholdPerfect ? (
        <div className="mb-3 p-2.5 rounded-2xl border-2 border-black bg-black text-white flex items-center justify-between text-xs font-heading font-extrabold shadow-[2px_2px_0_0_#000]">
          <div className="flex items-center gap-2">
            <span>🎉</span>
            <span>100% HOUSEHOLD ROUTINES DONE! PERFECT DAY FOR BOTH (+1 PT EACH)</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-white bg-white/20">
            Streak Active
          </span>
        </div>
      ) : isMyDayPerfect ? (
        <div className="mb-3 p-2.5 rounded-2xl border-2 border-black bg-emerald-600 text-white flex items-center justify-between text-xs font-heading font-extrabold shadow-[2px_2px_0_0_#000]">
          <div className="flex items-center gap-2">
            <span>🔥</span>
            <span>ALL YOUR ROUTINES DONE! PERFECT DAY (+1 PT)</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-white bg-white/20">
            Streak Active
          </span>
        </div>
      ) : missStatus.consecutiveMisses >= 2 ? (
        <div className="mb-3 p-2.5 rounded-2xl border-2 border-black bg-rose-50 text-rose-800 flex items-center justify-between text-xs font-heading font-extrabold shadow-[2px_2px_0_0_#000]">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>
              {missStatus.consecutiveMisses} DAYS MISSED ({missStatus.totalPenalty} PT PENALTY APPLIED)
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-rose-600 bg-rose-100 text-rose-700 font-bold">
            Complete Today to Recover
          </span>
        </div>
      ) : null}

      <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
        Apple Notes style. Press{" "}
        <kbd className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-300 rounded font-mono text-[10px] text-black">
          Enter
        </kbd>{" "}
        to add new routine.
      </p>

      {/* Routine Items Container */}
      <div className="space-y-2 flex-1 overflow-y-auto pt-1.5 pb-1 pr-1 min-h-[220px]">
        {visibleRoutines.length === 0 ? (
          <div className="h-28 border-2 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center text-xs text-zinc-400 font-heading">
            No routines scheduled for this day
          </div>
        ) : (
          visibleRoutines.map((r, idx) => {
            const completed = isCompleted(r.id, selectedDate);

            return (
              <div
                key={r.id}
                className="flex items-center justify-between p-2.5 rounded-2xl border-2 border-black bg-white squircle-card group transition"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                  <button
                    onClick={() => handleToggle(r.id)}
                    aria-label={`Toggle ${r.title}`}
                    className={`w-6 h-6 rounded-lg border-2 border-black flex items-center justify-center transition-all ${
                      completed
                        ? "bg-black text-white"
                        : "bg-white hover:bg-zinc-100 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <span
                    className={`text-xs font-semibold ink-strikethrough ${
                      completed ? "done" : "text-black"
                    } truncate`}
                  >
                    {r.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-heading font-bold text-zinc-400">
                    {formatFrequencyLabel(r.frequency)}
                  </span>

                  <span
                    className={`text-[9px] font-heading font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      r.assignee === "both"
                        ? "bg-black text-white"
                        : "border border-black bg-[#f4f4f5] text-black"
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
                      className="p-1 hover:bg-zinc-100 rounded text-zinc-500 disabled:opacity-30 focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === visibleRoutines.length - 1}
                      title="Move Down"
                      aria-label="Move routine down"
                      className="p-1 hover:bg-zinc-100 rounded text-zinc-500 disabled:opacity-30 focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteRoutine(r.id)}
                      title="Delete Routine"
                      aria-label="Delete routine"
                      className="p-1 hover:text-black text-zinc-400 rounded transition focus:outline-none focus:ring-1 focus:ring-black"
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
          <div className="pt-2 border-t border-dashed border-zinc-200">
            <button
              type="button"
              onClick={() => setShowOtherDays((prev) => !prev)}
              className="text-[11px] font-heading font-extrabold uppercase text-zinc-500 hover:text-black flex items-center justify-between w-full py-1.5 transition cursor-pointer"
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
                    className="flex items-center justify-between p-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 opacity-80"
                  >
                    <div className="flex items-center gap-2 min-w-0 mr-2">
                      <div className="w-5 h-5 rounded-md border border-zinc-300 bg-zinc-100 flex items-center justify-center text-[10px] text-zinc-400 font-mono">
                        —
                      </div>
                      <span className="text-xs font-medium text-zinc-600 truncate">
                        {r.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-heading font-bold text-zinc-500 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
                        {formatFrequencyLabel(r.frequency)}
                      </span>
                      <span className="text-[9px] font-heading font-extrabold uppercase px-1.5 py-0.5 rounded border border-black bg-white text-black">
                        {getAssigneeLabel(r.assignee, activePartner, partnerNames)}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteRoutine(r.id)}
                        title="Delete Routine"
                        aria-label="Delete routine"
                        className="p-1 hover:text-black text-zinc-400 rounded transition"
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
      <div className="mt-4 pt-3.5 border-t-2 border-dashed border-zinc-300">
        <form
          onSubmit={handleQuickAddSubmit}
          className="flex items-center gap-1.5 sm:gap-2 bg-[#f4f4f5] border-2 border-black rounded-2xl px-2.5 sm:px-3 py-2 focus-within:ring-2 focus-within:ring-black transition shadow-sm"
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
            className="bg-transparent text-xs font-medium text-black placeholder-zinc-400 focus:outline-none w-full min-w-0"
          />

          <select
            id="quick-add-routine-assignee"
            name="routineAssignee"
            value={newAssignee}
            aria-label="Routine assignee"
            onChange={(e) => setNewAssignee(e.target.value as Assignee)}
            className="bg-white font-heading font-bold text-[10px] uppercase text-black rounded-lg px-2 py-1 border border-black focus:outline-none shrink-0"
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
            className="bg-white hover:bg-black hover:text-white font-heading font-extrabold text-[10px] uppercase text-black rounded-xl px-2.5 py-1.5 border border-black transition shrink-0 flex items-center gap-1 shadow-xs whitespace-nowrap"
          >
            <Calendar className="w-3 h-3" />
            <span className="hidden sm:inline">Pick Days</span>
          </button>

          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="bg-black text-white hover:bg-zinc-800 disabled:opacity-30 font-heading font-extrabold text-[10px] uppercase rounded-xl px-3 py-1.5 border border-black transition shrink-0 shadow-xs cursor-pointer"
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
