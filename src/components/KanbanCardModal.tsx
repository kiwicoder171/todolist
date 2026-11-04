"use client";

import React, { useState } from "react";
import { Assignee, useHousehold, resolveIntentToAssignee } from "@/context/HouseholdContext";
import { KanbanStage, useKanban } from "@/context/KanbanContext";
import { X, Plus } from "lucide-react";

interface KanbanCardModalProps {
  isOpen: boolean;
  initialStage?: KanbanStage;
  onClose: () => void;
}

export function KanbanCardModal({
  isOpen,
  initialStage = "todo",
  onClose,
}: KanbanCardModalProps) {
  const { categories, addCard, addCategory } = useKanban();
  const { activePartner, partnerNames } = useHousehold();
  const partnerName = activePartner === "alex" ? partnerNames.sam : partnerNames.alex;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(
    categories.find((c) => c.id !== "all")?.id || ""
  );
  const [stage, setStage] = useState<KanbanStage>(initialStage);
  const [assignee, setAssignee] = useState<Assignee>("both");
  const [description, setDescription] = useState("");

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("📌");

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCard(
      title.trim(),
      category,
      stage,
      resolveIntentToAssignee(assignee, activePartner),
      description.trim()
    );
    setTitle("");
    setDescription("");
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kanban-modal-title"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.12] rounded-3xl p-6 shadow-2xl w-full max-w-md relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05] dark:border-white/[0.06] mb-4">
          <h3
            id="kanban-modal-title"
            className="font-semibold text-sm uppercase tracking-wide text-zinc-900 dark:text-zinc-100"
          >
            New Kanban Card
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-xl border border-black/[0.06] dark:border-white/[0.08] text-zinc-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] flex items-center justify-center apple-press transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase text-[11px] text-zinc-600 dark:text-zinc-400 mb-1.5">
              Card Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Research Hakone ryokans..."
              className="w-full px-3.5 py-2.5 border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.04] rounded-2xl text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase text-[11px] text-zinc-600 dark:text-zinc-400 mb-1.5">
                Category
              </label>
              {!isAddingCategory ? (
                <div className="flex gap-1.5 items-center">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.04] rounded-2xl font-semibold text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
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
                    className="w-8 px-1 py-1.5 border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.04] rounded-xl text-center text-zinc-900 dark:text-zinc-100"
                    placeholder="Emoji"
                  />
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full px-2 py-1.5 border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.04] rounded-xl text-xs text-zinc-900 dark:text-zinc-100"
                    placeholder="Cat Name"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-2.5 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold apple-press cursor-pointer"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-2 py-1.5 border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-zinc-400 hover:text-zinc-700 apple-press"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold uppercase text-[11px] text-zinc-600 dark:text-zinc-400 mb-1.5">
                Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as KanbanStage)}
                className="w-full px-3 py-2 border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.04] rounded-2xl font-semibold text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase text-[11px] text-zinc-600 dark:text-zinc-400 mb-1.5">
              Assignee
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["mine", "partner", "both"] as Assignee[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAssignee(opt)}
                  className={`py-2 px-2.5 rounded-2xl font-semibold text-xs uppercase border apple-press transition cursor-pointer ${
                    assignee === opt
                      ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xs"
                      : "border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  }`}
                >
                  {opt === "mine" ? "Me" : opt === "partner" ? partnerName : "Both"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase text-[11px] text-zinc-600 dark:text-zinc-400 mb-1.5">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key links, details or sub-items..."
              className="w-full px-3.5 py-2.5 border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.04] rounded-2xl text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          <div className="pt-2.5 flex items-center justify-end gap-2 border-t border-black/[0.05] dark:border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl font-semibold uppercase text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] apple-press transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-semibold uppercase hover:opacity-90 apple-press transition shadow-2xs cursor-pointer"
            >
              Create Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
