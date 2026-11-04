"use client";

import React, { useState, useEffect, useContext } from "react";
import { KanbanCard, KanbanStage, useKanban } from "@/context/KanbanContext";
import {
  Assignee,
  HouseholdContext,
  resolveIntentToAssignee,
  Partner,
} from "@/context/HouseholdContext";
import { X, Layers, Plus } from "lucide-react";

export interface KanbanCardDetailDrawerProps {
  card: KanbanCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<KanbanCard>) => void;
  onDelete: (id: string) => void;
}

export function KanbanCardDetailDrawer({
  card,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: KanbanCardDetailDrawerProps) {
  const household = useContext(HouseholdContext);
  const partnerNames = household?.partnerNames || { alex: "Alex", sam: "Sam" };
  const activePartner = household?.activePartner || "alex";
  const partnerName = activePartner === "alex" ? partnerNames.sam : partnerNames.alex;

  const { categories, addCategory } = useKanban();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<KanbanStage>("todo");
  const [category, setCategory] = useState("");
  const [assigneeIntent, setAssigneeIntent] = useState<"mine" | "partner" | "both">("both");

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("📌");

  const getAssigneeIntent = (rawAssignee: Assignee, partner: Partner): "mine" | "partner" | "both" => {
    if (rawAssignee === "both") return "both";
    const isMine = partner === "alex" ? rawAssignee === "mine" : rawAssignee === "partner";
    return isMine ? "mine" : "partner";
  };

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || "");
      setStage(card.stage);
      setCategory(card.category || "");
      setAssigneeIntent(getAssigneeIntent(card.assignee, activePartner));
    }
  }, [card, activePartner]);

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

  if (!isOpen || !card) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    const resolved = resolveIntentToAssignee(assigneeIntent, activePartner);
    onSave(card.id, {
      title: title.trim(),
      description: description.trim(),
      stage,
      category,
      assignee: resolved,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(card.id);
    onClose();
  };

  const handleCreateCategory = () => {
    if (!newCatName.trim()) return;
    const catId = newCatName.toLowerCase().replace(/\s+/g, "-");
    addCategory(catId, newCatName.trim(), newCatEmoji || "📌");
    setCategory(catId);
    setNewCatName("");
    setIsAddingCategory(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="kanban-drawer-title"
        className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-2xl border-l border-black/[0.08] dark:border-white/[0.1] shadow-2xl p-6 flex flex-col justify-between animate-slide-in-right"
      >
        <div className="overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.05] dark:border-white/[0.06] mb-5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xs">
                <Layers className="w-3.5 h-3.5" />
              </span>
              <h2
                id="kanban-drawer-title"
                className="font-semibold text-sm uppercase tracking-wide text-zinc-900 dark:text-zinc-100"
              >
                Kanban Card Details
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close card details"
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="kanban-drawer-title-input"
                className="block font-semibold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
              >
                Title
              </label>
              <input
                id="kanban-drawer-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="kanban-drawer-stage"
                  className="block font-semibold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
                >
                  Stage
                </label>
                <select
                  id="kanban-drawer-stage"
                  value={stage}
                  onChange={(e) => setStage(e.target.value as KanbanStage)}
                  className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3 py-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none"
                >
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="kanban-drawer-assignee"
                  className="block font-semibold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
                >
                  Assigned To
                </label>
                <select
                  id="kanban-drawer-assignee"
                  value={assigneeIntent}
                  onChange={(e) => setAssigneeIntent(e.target.value as "mine" | "partner" | "both")}
                  className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3 py-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none"
                >
                  <option value="mine">Me</option>
                  <option value="partner">{partnerName}</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Category
              </label>
              {!isAddingCategory ? (
                <div className="flex gap-1.5 items-center">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3 py-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value="">None</option>
                    {categories
                      .filter((c) => c.id !== "all")
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.emoji ? `${c.emoji} ` : ""}
                          {c.name}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(true)}
                    className="p-2 border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.04] rounded-2xl hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 apple-press transition cursor-pointer"
                    title="Add Category"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-1 items-center">
                  <input
                    type="text"
                    value={newCatEmoji}
                    onChange={(e) => setNewCatEmoji(e.target.value)}
                    className="w-8 px-1 py-1.5 border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.04] rounded-xl text-center text-zinc-900 dark:text-zinc-100 text-xs"
                    placeholder="Emoji"
                  />
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full px-2 py-1.5 border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.04] rounded-xl text-xs text-zinc-900 dark:text-zinc-100"
                    placeholder="New category name"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-2.5 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[10px] font-semibold uppercase shrink-0"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="kanban-drawer-description"
                className="block font-semibold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
              >
                Description &amp; Details
              </label>
              <textarea
                id="kanban-drawer-description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add in-depth details, project checklists, links, or instructions..."
                className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
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
