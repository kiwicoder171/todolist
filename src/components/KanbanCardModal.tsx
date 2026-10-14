"use client";

import React, { useState } from "react";
import { Assignee } from "@/context/HouseholdContext";
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

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(
    categories.find((c) => c.id !== "all")?.id || "home"
  );
  const [stage, setStage] = useState<KanbanStage>(initialStage);
  const [assignee, setAssignee] = useState<Assignee>("both");
  const [description, setDescription] = useState("");

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("📌");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCard(title.trim(), category, stage, assignee, description.trim());
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
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-black rounded-3xl p-6 shadow-[6px_6px_0_0_#000] w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
          <h3 className="font-heading font-black text-sm uppercase tracking-wide text-black">
            New Kanban Card
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-black hover:bg-black hover:text-white flex items-center justify-center transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-heading font-bold uppercase text-[11px] text-black mb-1">
              Card Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Research Hakone ryokans..."
              className="w-full px-3 py-2 border-2 border-black rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-black"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-heading font-bold uppercase text-[11px] text-black mb-1">
                Category
              </label>
              {!isAddingCategory ? (
                <div className="flex gap-1.5 items-center">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-2 border-2 border-black rounded-xl bg-white font-heading font-bold text-xs"
                  >
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
                    className="p-2 border-2 border-black rounded-xl hover:bg-black hover:text-white transition"
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
                    className="w-8 px-1 py-1.5 border-2 border-black rounded-lg text-center"
                    placeholder="Emoji"
                  />
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full px-2 py-1.5 border-2 border-black rounded-lg text-xs"
                    placeholder="Cat Name"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-2 py-1.5 bg-black text-white rounded-lg font-bold"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-1.5 py-1.5 border border-zinc-300 rounded-lg text-zinc-500"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block font-heading font-bold uppercase text-[11px] text-black mb-1">
                Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as KanbanStage)}
                className="w-full px-2.5 py-2 border-2 border-black rounded-xl bg-white font-heading font-bold text-xs"
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-heading font-bold uppercase text-[11px] text-black mb-1">
              Assignee
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["mine", "partner", "both"] as Assignee[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAssignee(opt)}
                  className={`py-1.5 px-2 rounded-xl font-heading font-bold text-xs uppercase border-2 transition ${
                    assignee === opt
                      ? "border-black bg-black text-white"
                      : "border-black bg-white text-black hover:bg-zinc-100"
                  }`}
                >
                  {opt === "mine" ? "Me" : opt === "partner" ? "Partner" : "Both"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-heading font-bold uppercase text-[11px] text-black mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key links, details or sub-items..."
              className="w-full px-3 py-2 border-2 border-black rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t-2 border-dashed border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-300 rounded-xl font-heading font-bold uppercase text-zinc-600 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white border-2 border-black rounded-xl font-heading font-extrabold uppercase hover:bg-zinc-800 transition"
            >
              Create Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
