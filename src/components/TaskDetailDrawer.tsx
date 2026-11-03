"use client";

import React, { useState, useEffect, useContext } from "react";
import { DailyTask } from "@/context/DailyTasksContext";
import { Assignee, HouseholdContext, formatDateKey, resolveIntentToAssignee, Partner } from "@/context/HouseholdContext";
import { X, CornerDownRight, RefreshCw } from "lucide-react";

export interface TaskDetailDrawerProps {
  task: DailyTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<DailyTask>) => void;
  onDelete: (id: string) => void;
}

export function TaskDetailDrawer({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: TaskDetailDrawerProps) {
  const household = useContext(HouseholdContext);
  const partnerNames = household?.partnerNames || { alex: "Alex", sam: "Sam" };
  const activePartner = household?.activePartner || "alex";
  const myName = activePartner === "alex" ? partnerNames.alex : partnerNames.sam;
  const partnerName = activePartner === "alex" ? partnerNames.sam : partnerNames.alex;
  const selectedDateKey = household?.selectedDate ? formatDateKey(household.selectedDate) : formatDateKey(new Date());

  const [title, setTitle] = useState("");
  const [assigneeIntent, setAssigneeIntent] = useState<"mine" | "partner" | "both">("mine");
  const [notes, setNotes] = useState("");

  const getAssigneeIntent = (rawAssignee: Assignee, partner: Partner): "mine" | "partner" | "both" => {
    if (rawAssignee === "both") return "both";
    const isMine = partner === "alex" ? rawAssignee === "mine" : rawAssignee === "partner";
    return isMine ? "mine" : "partner";
  };

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setAssigneeIntent(getAssigneeIntent(task.assignee, activePartner));
      setNotes(task.notes || "");
    }
  }, [task, activePartner]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const isRolledOver = task.originDate < selectedDateKey || task.originDate < task.targetDate;

  const handleSave = () => {
    onSave(task.id, {
      title,
      assignee: resolveIntentToAssignee(assigneeIntent, activePartner),
      notes,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-heading"
        className="fixed inset-y-0 right-0 w-88 max-w-full bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-3xl border-l border-black/[0.08] dark:border-white/[0.12] shadow-2xl p-6 z-50 flex flex-col justify-between transition-transform duration-300"
      >
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05] dark:border-white/[0.06] mb-5">
            <h3
              id="drawer-heading"
              className="font-semibold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100"
            >
              Task Details
            </h3>
            <button
              onClick={onClose}
              aria-label="Close Drawer"
              className="w-7 h-7 rounded-xl border border-black/[0.06] dark:border-white/[0.08] text-zinc-500 dark:text-zinc-400 flex items-center justify-center font-bold text-sm hover:bg-black/[0.04] dark:hover:bg-white/[0.08] hover:text-zinc-900 dark:hover:text-zinc-100 apple-press transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="drawer-task-title"
                className="block font-semibold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
              >
                Task Title
              </label>
              <input
                id="drawer-task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-2.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            <div>
              <label
                htmlFor="drawer-task-assignee"
                className="block font-semibold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
              >
                Assignee
              </label>
              <select
                id="drawer-task-assignee"
                value={assigneeIntent}
                onChange={(e) => setAssigneeIntent(e.target.value as "mine" | "partner" | "both")}
                className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-2.5 text-xs font-semibold uppercase text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              >
                <option value="mine">{myName} (You)</option>
                <option value="partner">{partnerName}</option>
                <option value="both">Both</option>
              </select>
            </div>

            {isRolledOver && (
              <div>
                <span className="block font-semibold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Origin Log (Rollover)
                </span>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-2.5 text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <CornerDownRight className="w-3.5 h-3.5" />
                  <span>Rolled over from {task.originDate}</span>
                </div>
              </div>
            )}

            {task.isKanbanSynced && (
              <div>
                <span className="block font-semibold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Kanban Synchronization
                </span>
                <div className="bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 animate-spin-slow" />
                    <span>Synced with Kanban Board</span>
                  </div>
                  <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold tracking-wider">
                    2-Way
                  </span>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="drawer-task-notes"
                className="block font-semibold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
              >
                Notes &amp; Links
              </label>
              <textarea
                id="drawer-task-notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add specific notes, links, or instructions..."
                className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>
          </div>
        </div>

        <div className="pt-5 border-t border-black/[0.05] dark:border-white/[0.06] flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold uppercase text-xs py-3 rounded-2xl hover:opacity-90 apple-press transition shadow-2xs cursor-pointer"
          >
            Save Changes
          </button>
          <button
            onClick={handleDelete}
            className="border border-rose-500/30 text-rose-600 dark:text-rose-400 font-semibold uppercase text-xs px-4 py-3 rounded-2xl hover:bg-rose-500/10 apple-press transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </aside>
    </>
  );
}
