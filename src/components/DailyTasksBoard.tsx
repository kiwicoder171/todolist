"use client";

import React, { useState, KeyboardEvent } from "react";
import { useHousehold, matchesAssigneeFilter, Assignee, resolveIntentToAssignee, getAssigneeLabel } from "@/context/HouseholdContext";
import {
  useDailyTasks,
  calculateRolloverTasks,
  DailyTask,
} from "@/context/DailyTasksContext";
import { formatDateKey } from "@/context/RoutinesContext";
import { useNotifications } from "@/context/NotificationContext";
import { TaskDetailDrawer } from "./TaskDetailDrawer";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { Check, CornerDownRight, X, Plus, Play } from "lucide-react";

export function DailyTasksBoard() {
  const { activePartner, assigneeFilter, selectedDate, partnerNames } = useHousehold();
  const { tasks, addDailyTask, toggleDailyTask, updateDailyTask, deleteDailyTask } =
    useDailyTasks();
  const { addNotification } = useNotifications();
  const { startFocus } = useFocusTimer();

  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState<Assignee>("mine");
  const [selectedTaskForDrawer, setSelectedTaskForDrawer] = useState<DailyTask | null>(
    null
  );
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  const partnerName = activePartner === "alex" ? partnerNames.sam : partnerNames.alex;
  const myName = activePartner === "alex" ? partnerNames.alex : partnerNames.sam;

  // Reference "Today" date
  const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";
  const today = isTest ? new Date(2026, 9, 14) : new Date();

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
      const targetTask = tasks.find((t) => t.id === id);
      const otherPartner = activePartner === "alex" ? "sam" : "alex";
      addNotification({
        title: "Task Done 🎉",
        message: targetTask ? `${myName}: ${targetTask.title}` : `${myName} finished a task`,
        type: "task_completed",
        partner: activePartner,
        recipient: otherPartner,
      });
      setTimeout(() => setCelebrationMsg(null), 2000);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTitle.trim()) {
      addDailyTask(newTitle.trim(), resolveIntentToAssignee(newAssignee, activePartner), selectedDate);
      setNewTitle("");
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
      <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05] dark:border-white/[0.06] mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h2 className="font-semibold text-sm tracking-wide text-zinc-900 dark:text-zinc-100">
            Daily Tasks
          </h2>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-400">
          Immediate
        </span>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
        Urgent to-dos &amp; uncompleted tasks automatically rolled over from past days.
      </p>

      {/* Task List Container */}
      <div className="space-y-2 flex-1 overflow-y-auto pt-1 pb-1 pr-1 min-h-[220px]">
        {visibleTasks.length === 0 ? (
          <div className="h-28 border border-dashed border-black/[0.08] dark:border-white/[0.1] rounded-2xl flex items-center justify-center text-xs text-zinc-400">
            No daily tasks for this day
          </div>
        ) : (
          visibleTasks.map((t) => {
            const isRolledOver = t.originDate < formatDateKey(selectedDate);

            return (
              <div
                key={t.id}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${t.title}`}
                className="flex items-start justify-between p-3 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] cursor-pointer group transition focus:outline-none"
                onClick={() => setSelectedTaskForDrawer(t)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedTaskForDrawer(t);
                  }
                }}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0 mr-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(t.id, t.completed);
                    }}
                    aria-label={`Toggle ${t.title}`}
                    className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all apple-press cursor-pointer ${
                      t.completed
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-xs"
                        : "border-black/20 dark:border-white/20 bg-white/60 dark:bg-zinc-800/60 hover:border-black/40 dark:hover:border-white/40 text-transparent"
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </button>

                  <div className="flex flex-col gap-1 min-w-0">
                    <span
                      className={`text-xs font-semibold ink-strikethrough ${
                        t.completed ? "done" : "text-zinc-900 dark:text-zinc-100"
                      } truncate`}
                    >
                      {t.title}
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isRolledOver && (
                        <span className="text-[9px] font-medium uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CornerDownRight className="w-2.5 h-2.5" />
                          <span>Rolled from {t.originDate}</span>
                        </span>
                      )}

                      {t.isKanbanSynced && (
                        <span className="text-[9px] font-medium uppercase border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full">
                          Kanban
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      t.assignee === "both"
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                        : "border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.05] text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {getAssigneeLabel(t.assignee, activePartner, partnerNames)}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startFocus({ id: t.id, title: t.title, type: "daily" });
                    }}
                    title="Focus on this task"
                    aria-label="Start Focus"
                    className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-zinc-400 hover:text-emerald-500 p-1 rounded-lg transition focus:outline-none"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDailyTask(t.id);
                    }}
                    title="Delete Task"
                    aria-label="Delete Task"
                    className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-zinc-400 hover:text-rose-500 p-1 rounded-lg transition focus:outline-none"
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
      <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.06]">
        <div className="flex items-center gap-2 bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-black/10 dark:focus-within:ring-white/10 transition shadow-2xs">
          <Plus className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            id="quick-add-daily-task-input"
            name="dailyTaskTitle"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What gotta finish today?"
            aria-label="What gotta finish today"
            className="bg-transparent text-xs font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none w-full"
          />
          <select
            id="quick-add-daily-task-assignee"
            name="dailyTaskAssignee"
            value={newAssignee}
            aria-label="Daily task assignee"
            onChange={(e) => setNewAssignee(e.target.value as Assignee)}
            className="bg-white/90 dark:bg-zinc-800/90 font-semibold text-[10px] uppercase text-zinc-800 dark:text-zinc-200 rounded-xl px-2.5 py-1.5 border border-black/[0.08] dark:border-white/[0.1] focus:outline-none shrink-0"
          >
            <option value="mine">Me</option>
            <option value="partner">{partnerName}</option>
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
