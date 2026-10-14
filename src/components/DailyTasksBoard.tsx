"use client";

import React, { useState, KeyboardEvent } from "react";
import { useHousehold, matchesAssigneeFilter, Assignee } from "@/context/HouseholdContext";
import {
  useDailyTasks,
  calculateRolloverTasks,
  DailyTask,
} from "@/context/DailyTasksContext";
import { formatDateKey } from "@/context/RoutinesContext";
import { TaskDetailDrawer } from "./TaskDetailDrawer";
import { Check, CornerDownRight, X, Plus } from "lucide-react";

export function DailyTasksBoard() {
  const { activePartner, assigneeFilter, selectedDate } = useHousehold();
  const { tasks, addDailyTask, toggleDailyTask, updateDailyTask, deleteDailyTask } =
    useDailyTasks();

  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState<Assignee>("mine");
  const [selectedTaskForDrawer, setSelectedTaskForDrawer] = useState<DailyTask | null>(
    null
  );
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  // Reference "Today" date
  const today = new Date(2026, 9, 14);

  // Rollover calculation engine
  const dateTasks = calculateRolloverTasks(tasks, selectedDate, today);

  // Filter by assignee
  const visibleTasks = dateTasks.filter((t) =>
    matchesAssigneeFilter(t.assignee, activePartner, assigneeFilter)
  );

  const handleToggle = (id: string, wasCompleted: boolean) => {
    toggleDailyTask(id, formatDateKey(selectedDate));
    if (!wasCompleted) {
      setCelebrationMsg("🎉 Task Done!");
      setTimeout(() => setCelebrationMsg(null), 2000);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTitle.trim()) {
      addDailyTask(newTitle.trim(), newAssignee, selectedDate);
      setNewTitle("");
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
      <div className="flex items-center justify-between pb-3.5 border-b-2 border-black mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center font-heading font-bold text-xs">
            2
          </div>
          <h2 className="font-heading font-black text-sm uppercase tracking-wide text-black">
            Daily Tasks
          </h2>
        </div>
        <span className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-full border border-black bg-black text-white">
          Immediate
        </span>
      </div>

      <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
        Urgent to-dos &amp; uncompleted tasks automatically rolled over from past days.
      </p>

      {/* Task List Container */}
      <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 min-h-[220px]">
        {visibleTasks.length === 0 ? (
          <div className="h-28 border-2 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center text-xs text-zinc-400 font-heading">
            No daily tasks for this day
          </div>
        ) : (
          visibleTasks.map((t) => {
            const isRolledOver = t.originDate < formatDateKey(selectedDate);

            return (
              <div
                key={t.id}
                className="flex items-start justify-between p-3 rounded-2xl border-2 border-black bg-white squircle-card cursor-pointer group transition"
                onClick={() => setSelectedTaskForDrawer(t)}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0 mr-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(t.id, t.completed);
                    }}
                    aria-label={`Toggle ${t.title}`}
                    className={`mt-0.5 w-6 h-6 rounded-lg border-2 border-black flex items-center justify-center transition-all ${
                      t.completed
                        ? "bg-black text-white"
                        : "bg-white hover:bg-zinc-100 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <div className="flex flex-col gap-1 min-w-0">
                    <span
                      className={`text-xs font-bold ink-strikethrough ${
                        t.completed ? "done" : "text-black"
                      } truncate`}
                    >
                      {t.title}
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isRolledOver && (
                        <span className="text-[9px] font-heading font-extrabold uppercase bg-black text-white px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <CornerDownRight className="w-2.5 h-2.5" />
                          <span>Rolled from {t.originDate}</span>
                        </span>
                      )}

                      {t.isKanbanSynced && (
                        <span className="text-[9px] font-heading font-bold uppercase border border-black bg-zinc-100 text-black px-1.5 py-0.5 rounded-full">
                          Kanban
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-heading font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      t.assignee === "both"
                        ? "bg-black text-white"
                        : "border border-black bg-[#f4f4f5] text-black"
                    }`}
                  >
                    {t.assignee === "mine"
                      ? "Me"
                      : t.assignee === "partner"
                      ? "Sam"
                      : "Both"}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDailyTask(t.id);
                    }}
                    title="Delete Task"
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-black font-bold text-xs px-1 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Add Input */}
      <div className="mt-4 pt-3.5 border-t-2 border-dashed border-zinc-300">
        <div className="flex items-center gap-2 bg-[#f4f4f5] border-2 border-black rounded-2xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-black transition shadow-sm">
          <Plus className="w-4 h-4 text-black" />
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What gotta finish today? (Enter)"
            className="bg-transparent text-xs font-medium text-black placeholder-zinc-400 focus:outline-none w-full"
          />
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

      {/* Slide-over Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTaskForDrawer}
        isOpen={!!selectedTaskForDrawer}
        onClose={() => setSelectedTaskForDrawer(null)}
        onSave={(id, updates) => updateDailyTask(id, updates)}
        onDelete={(id) => deleteDailyTask(id)}
      />
    </div>
  );
}
