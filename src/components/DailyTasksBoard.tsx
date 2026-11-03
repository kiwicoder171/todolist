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
        title: "Task Done! 🎉",
        message: targetTask ? `${myName} checked off "${targetTask.title}"` : `${myName} checked off a daily task`,
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
    <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col flex-1 relative transition-colors duration-200">
      {celebrationMsg && (
        <div className="absolute top-2 right-4 z-20 px-3 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-[11px] font-semibold rounded-full animate-bounce shadow-md">
          {celebrationMsg}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h2 className="font-semibold text-sm tracking-wide text-zinc-900 dark:text-zinc-100">
            Daily Tasks
          </h2>
        </div>
        <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500">
          Immediate
        </span>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
        Urgent to-dos &amp; uncompleted tasks automatically rolled over from past days.
      </p>

      {/* Task List Container */}
      <div className="space-y-2.5 flex-1 overflow-y-auto pt-1.5 pb-1 pr-1 min-h-[220px]">
        {visibleTasks.length === 0 ? (
          <div className="h-28 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-xs text-zinc-400">
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
                className="flex items-start justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer group transition focus:outline-none"
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
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      t.completed
                        ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-950"
                        : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-500 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
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
                        <span className="text-[9px] font-medium uppercase bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <CornerDownRight className="w-2.5 h-2.5" />
                          <span>Rolled from {t.originDate}</span>
                        </span>
                      )}

                      {t.isKanbanSynced && (
                        <span className="text-[9px] font-medium uppercase border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded-full">
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
                    className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-zinc-400 hover:text-emerald-600 font-bold p-1 transition focus:outline-none focus:ring-1 focus:ring-black rounded"
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
                    className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-zinc-400 hover:text-black font-bold text-xs px-1 transition focus:outline-none focus:ring-1 focus:ring-black rounded"
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
            id="quick-add-daily-task-input"
            name="dailyTaskTitle"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What gotta finish today? (Enter)"
            aria-label="What gotta finish today"
            className="bg-transparent text-xs font-medium text-black placeholder-zinc-400 focus:outline-none w-full"
          />
          <select
            id="quick-add-daily-task-assignee"
            name="dailyTaskAssignee"
            value={newAssignee}
            aria-label="Daily task assignee"
            onChange={(e) => setNewAssignee(e.target.value as Assignee)}
            className="bg-white font-heading font-bold text-[10px] uppercase text-black rounded-lg px-2 py-1 border border-black focus:outline-none"
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
