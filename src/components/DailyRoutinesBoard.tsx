"use client";

import React, { useState, KeyboardEvent } from "react";
import { useHousehold, matchesAssigneeFilter, Assignee } from "@/context/HouseholdContext";
import {
  useRoutines,
  isRoutineScheduledForDate,
  formatFrequencyLabel,
  RoutineFrequency,
} from "@/context/RoutinesContext";
import { Check, ArrowUp, ArrowDown, X, Plus } from "lucide-react";

export function DailyRoutinesBoard() {
  const { activePartner, assigneeFilter, selectedDate } = useHousehold();
  const {
    routines,
    addRoutine,
    deleteRoutine,
    toggleCompletion,
    isCompleted,
    reorderRoutines,
  } = useRoutines();

  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState<Assignee>("mine");
  const [newFrequency, setNewFrequency] = useState<RoutineFrequency>("daily");

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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTitle.trim()) {
      addRoutine(newTitle.trim(), newAssignee, newFrequency);
      setNewTitle("");
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < routines.length) {
      reorderRoutines(index, targetIndex);
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b-2 border-black mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center font-heading font-bold text-xs">
            1
          </div>
          <h2 className="font-heading font-black text-sm uppercase tracking-wide text-black">
            Daily Routines
          </h2>
        </div>
        <span className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-full border border-black bg-zinc-100">
          Recurring
        </span>
      </div>

      <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
        Apple Notes style. Press{" "}
        <kbd className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-300 rounded font-mono text-[10px] text-black">
          Enter
        </kbd>{" "}
        to add new routine.
      </p>

      {/* Routine Items Container */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-1 min-h-[220px]">
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
                    onClick={() => toggleCompletion(r.id, selectedDate)}
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
                    {r.assignee === "mine"
                      ? "Me"
                      : r.assignee === "partner"
                      ? "Sam"
                      : "Both"}
                  </span>

                  {/* Reorder Buttons */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition">
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      title="Move Up"
                      className="p-1 hover:bg-zinc-100 rounded text-zinc-500 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === visibleRoutines.length - 1}
                      title="Move Down"
                      className="p-1 hover:bg-zinc-100 rounded text-zinc-500 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteRoutine(r.id)}
                      title="Delete Routine"
                      className="p-1 hover:text-black text-zinc-400 rounded transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Add Routine Input */}
      <div className="mt-4 pt-3.5 border-t-2 border-dashed border-zinc-300">
        <div className="flex items-center gap-2 bg-[#f4f4f5] border-2 border-black rounded-2xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-black transition shadow-sm">
          <Plus className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add daily routine... (Enter)"
            className="bg-transparent text-xs font-medium text-black placeholder-zinc-400 focus:outline-none w-full"
          />

          <select
            value={typeof newFrequency === "string" ? newFrequency : "custom"}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "daily" || val === "weekdays" || val === "weekends") {
                setNewFrequency(val);
              } else if (val === "mon-wed-fri") {
                setNewFrequency([1, 3, 5]);
              }
            }}
            className="bg-white font-heading font-bold text-[10px] uppercase text-black rounded-lg px-2 py-1 border border-black focus:outline-none"
          >
            <option value="daily">Daily</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="mon-wed-fri">Mon, Wed, Fri</option>
          </select>

          <select
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value as Assignee)}
            className="bg-white font-heading font-bold text-[10px] uppercase text-black rounded-lg px-2 py-1 border border-black focus:outline-none"
          >
            <option value="mine">Me</option>
            <option value="partner">Sam</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>
    </div>
  );
}
