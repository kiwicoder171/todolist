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
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-heading"
        className="fixed inset-y-0 right-0 w-88 max-w-full bg-white border-l-2 border-black shadow-[-8px_0_24px_rgba(0,0,0,0.1)] p-6 z-50 flex flex-col justify-between transition-transform duration-300"
      >
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b-2 border-black mb-5">
            <h3
              id="drawer-heading"
              className="font-heading font-black text-xs uppercase tracking-wider text-black"
            >
              Task Details
            </h3>
          <button
            onClick={onClose}
            aria-label="Close Drawer"
            className="w-7 h-7 rounded-lg border border-black flex items-center justify-center font-bold text-sm hover:bg-black hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="drawer-task-title"
              className="block font-heading font-bold text-[11px] uppercase text-zinc-500 mb-1.5"
            >
              Task Title
            </label>
            <input
              id="drawer-task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#f4f4f5] border-2 border-black rounded-xl p-2.5 text-xs font-semibold text-black focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="drawer-task-assignee"
              className="block font-heading font-bold text-[11px] uppercase text-zinc-500 mb-1.5"
            >
              Assignee
            </label>
            <select
              id="drawer-task-assignee"
              value={assigneeIntent}
              onChange={(e) => setAssigneeIntent(e.target.value as "mine" | "partner" | "both")}
              className="w-full bg-[#f4f4f5] border-2 border-black rounded-xl p-2.5 text-xs font-heading font-bold uppercase text-black focus:outline-none"
            >
              <option value="mine">{myName} (You)</option>
              <option value="partner">{partnerName}</option>
              <option value="both">Both</option>
            </select>
          </div>

          {isRolledOver && (
            <div>
              <span className="block font-heading font-bold text-[11px] uppercase text-zinc-500 mb-1.5">
                Origin Log (Rollover)
              </span>
              <div className="bg-zinc-100 border border-black rounded-xl p-2.5 text-xs font-heading font-bold text-black flex items-center gap-2">
                <CornerDownRight className="w-3.5 h-3.5" />
                <span>Rolled over from {task.originDate}</span>
              </div>
            </div>
          )}

          {task.isKanbanSynced && (
            <div>
              <span className="block font-heading font-bold text-[11px] uppercase text-zinc-500 mb-1.5">
                Kanban Synchronization
              </span>
              <div className="bg-zinc-100 border border-black rounded-xl p-2.5 text-xs font-heading font-bold text-black flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-black animate-spin-slow" />
                  <span>Synced with Kanban Board</span>
                </div>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-black text-white font-extrabold tracking-wider">
                  2-Way
                </span>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="drawer-task-notes"
              className="block font-heading font-bold text-[11px] uppercase text-zinc-500 mb-1.5"
            >
              Notes &amp; Links
            </label>
            <textarea
              id="drawer-task-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add specific notes, links, or instructions..."
              className="w-full bg-[#f4f4f5] border-2 border-black rounded-xl p-3 text-xs text-black placeholder-zinc-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-5 border-t-2 border-dashed border-zinc-300 flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-black text-white font-heading font-bold uppercase text-xs py-3 rounded-2xl hover:bg-zinc-800 transition shadow-sm"
        >
          Save Changes
        </button>
        <button
          onClick={handleDelete}
          className="border-2 border-black text-black font-heading font-bold uppercase text-xs px-4 py-3 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition"
        >
          Delete
        </button>
      </div>
    </aside>
    </>
  );
}
