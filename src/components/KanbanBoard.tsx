"use client";

import React, { useState, DragEvent } from "react";
import { useHousehold } from "@/context/HouseholdContext";
import { KanbanStage, KanbanCard, useKanban } from "@/context/KanbanContext";
import { KanbanCardModal } from "./KanbanCardModal";
import { Plus, Check, ArrowRight, ArrowLeft, RotateCcw, Trash2 } from "lucide-react";

export function KanbanBoard() {
  const { activePartner } = useHousehold();
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    getFilteredCardsByStage,
    moveCardStage,
    toggleCardDoToday,
    deleteCard,
    clearDoneCards,
  } = useKanban();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStage, setModalInitialStage] = useState<KanbanStage>("todo");
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<KanbanStage | null>(null);

  const todoCards = getFilteredCardsByStage("todo");
  const inProgressCards = getFilteredCardsByStage("inprogress");
  const doneCards = getFilteredCardsByStage("done");

  const openAddCard = (stage: KanbanStage = "todo") => {
    setModalInitialStage(stage);
    setIsModalOpen(true);
  };

  // Drag and drop handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.setData("text/plain", cardId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, stage: KanbanStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = (stage: KanbanStage) => {
    if (dragOverStage === stage) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, stage: KanbanStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const cardId = e.dataTransfer.getData("text/plain") || draggedCardId;
    if (cardId) {
      moveCardStage(cardId, stage);
    }
    setDraggedCardId(null);
  };

  const renderCard = (card: KanbanCard, currentStage: KanbanStage) => {
    const partnerName = activePartner === "alex" ? "Sam" : "Alex";

    return (
      <div
        key={card.id}
        draggable
        onDragStart={(e) => handleDragStart(e, card.id)}
        className="p-3.5 rounded-2xl border-2 border-black bg-white text-xs squircle-card flex flex-col gap-2.5 shadow-[2px_2px_0_0_#000] cursor-grab active:cursor-grabbing hover:border-black transition group"
      >
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex flex-col gap-1 min-w-0">
            <span
              className={`font-heading font-bold text-xs leading-snug text-black ${
                currentStage === "done" ? "line-through text-zinc-500" : ""
              }`}
            >
              {card.title}
            </span>
            {card.description && (
              <p className="text-[11px] text-zinc-500 line-clamp-2">
                {card.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[9px] font-heading font-extrabold uppercase px-2 py-0.5 rounded border border-black bg-[#f4f4f5] text-black">
              {card.category}
            </span>
            <button
              onClick={() => deleteCard(card.id)}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-black p-0.5 transition"
              title="Delete Card"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 gap-1 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] font-heading font-bold text-zinc-600">
              {card.assignee === "mine"
                ? "Me"
                : card.assignee === "partner"
                ? partnerName
                : "Both"}
            </span>

            {card.doToday ? (
              <button
                onClick={() => toggleCardDoToday(card.id)}
                title="Remove from Today's Daily Tasks"
                className="text-[9px] font-heading font-extrabold uppercase bg-black text-white px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-zinc-800 transition"
              >
                <span>⚡ Do Today</span>
              </button>
            ) : (
              <button
                onClick={() => toggleCardDoToday(card.id)}
                title="Surface in Today's Daily Tasks"
                className="text-[9px] font-heading font-bold uppercase text-zinc-600 hover:text-black border border-zinc-300 hover:border-black px-2 py-0.5 rounded-full transition bg-white"
              >
                Plan Today
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            {currentStage === "todo" && (
              <button
                onClick={() => moveCardStage(card.id, "inprogress")}
                title="Move to In Progress"
                className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 border border-black rounded hover:bg-black hover:text-white transition flex items-center gap-1"
              >
                <span>Start</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            {currentStage === "inprogress" && (
              <>
                <button
                  onClick={() => moveCardStage(card.id, "todo")}
                  title="Move Back to To Do"
                  className="text-[10px] font-heading font-bold border border-zinc-300 rounded px-1.5 py-0.5 hover:border-black transition"
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={() => moveCardStage(card.id, "done")}
                  title="Mark Done"
                  className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 border border-black bg-black text-white rounded hover:bg-zinc-800 transition flex items-center gap-1"
                >
                  <span>Done</span>
                  <Check className="w-3 h-3 stroke-[3]" />
                </button>
              </>
            )}

            {currentStage === "done" && (
              <button
                onClick={() => moveCardStage(card.id, "inprogress")}
                title="Reopen Card"
                className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 border border-zinc-300 rounded hover:border-black transition flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reopen</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-[4px_4px_0_0_#000] flex flex-col flex-1">
      {/* Top Header & Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b-2 border-black mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-heading font-bold text-xs">
            3
          </div>
          <div>
            <h2 className="font-heading font-black text-base uppercase tracking-wide text-black flex items-center gap-2">
              Kanban Board
              <span className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-full border border-black bg-zinc-100 text-black">
                3 Vertical Columns
              </span>
            </h2>
            <p className="text-xs text-zinc-500">
              Long-term projects &amp; chores synced with Day View
            </p>
          </div>
        </div>

        {/* Category Filter Pills & Add Card */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full font-heading font-bold transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-black text-white"
                  : "border border-zinc-300 text-zinc-700 hover:border-black"
              }`}
            >
              {cat.emoji ? `${cat.emoji} ` : ""}
              {cat.name}
            </button>
          ))}

          <button
            onClick={() => openAddCard("todo")}
            className="px-3 py-1 rounded-full font-heading font-bold uppercase bg-black text-white hover:bg-zinc-800 transition whitespace-nowrap flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Card</span>
          </button>
        </div>
      </div>

      {/* 3 VERTICAL COLUMNS: Side-by-side grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto pt-1 min-h-[460px]">
        {/* COLUMN 1: TO DO */}
        <div
          onDragOver={(e) => handleDragOver(e, "todo")}
          onDragLeave={() => handleDragLeave("todo")}
          onDrop={(e) => handleDrop(e, "todo")}
          className={`border-2 border-black rounded-2xl p-3.5 bg-zinc-50/70 shadow-sm flex flex-col justify-between transition-colors ${
            dragOverStage === "todo" ? "bg-zinc-200 border-dashed" : ""
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-zinc-300 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-black bg-white" />
                <h3 className="font-heading font-black text-xs uppercase tracking-wider text-black">
                  To Do
                </h3>
              </div>
              <span className="text-xs font-heading font-extrabold px-2 py-0.5 rounded-full bg-white border border-black text-black">
                {todoCards.length}
              </span>
            </div>

            <div className="space-y-2.5 min-h-[140px]">
              {todoCards.length === 0 ? (
                <div className="h-24 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center text-[11px] font-heading font-bold text-zinc-400">
                  No cards in To Do
                </div>
              ) : (
                todoCards.map((c) => renderCard(c, "todo"))
              )}
            </div>
          </div>

          <button
            onClick={() => openAddCard("todo")}
            className="mt-3 w-full py-2 border-2 border-dashed border-zinc-400 hover:border-black rounded-xl text-zinc-600 hover:text-black font-heading font-bold text-xs uppercase transition flex items-center justify-center gap-1.5 bg-white"
          >
            <Plus className="w-3 h-3" />
            <span>Add To Do</span>
          </button>
        </div>

        {/* COLUMN 2: IN PROGRESS */}
        <div
          onDragOver={(e) => handleDragOver(e, "inprogress")}
          onDragLeave={() => handleDragLeave("inprogress")}
          onDrop={(e) => handleDrop(e, "inprogress")}
          className={`border-2 border-black rounded-2xl p-3.5 bg-white shadow-[3px_3px_0_0_#000] flex flex-col justify-between transition-colors ${
            dragOverStage === "inprogress" ? "bg-zinc-100 border-dashed" : ""
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-black" />
                <h3 className="font-heading font-black text-xs uppercase tracking-wider text-black">
                  In Progress
                </h3>
              </div>
              <span className="text-xs font-heading font-extrabold px-2 py-0.5 rounded-full bg-black text-white">
                {inProgressCards.length}
              </span>
            </div>

            <div className="space-y-2.5 min-h-[140px]">
              {inProgressCards.length === 0 ? (
                <div className="h-24 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center text-[11px] font-heading font-bold text-zinc-400">
                  No cards in In Progress
                </div>
              ) : (
                inProgressCards.map((c) => renderCard(c, "inprogress"))
              )}
            </div>
          </div>

          <button
            onClick={() => openAddCard("inprogress")}
            className="mt-3 w-full py-2 border-2 border-dashed border-zinc-400 hover:border-black rounded-xl text-zinc-600 hover:text-black font-heading font-bold text-xs uppercase transition flex items-center justify-center gap-1.5 bg-zinc-50"
          >
            <Plus className="w-3 h-3" />
            <span>Add Active Task</span>
          </button>
        </div>

        {/* COLUMN 3: DONE */}
        <div
          onDragOver={(e) => handleDragOver(e, "done")}
          onDragLeave={() => handleDragLeave("done")}
          onDrop={(e) => handleDrop(e, "done")}
          className={`border-2 border-dashed border-zinc-300 rounded-2xl p-3.5 bg-[#fcfcfc] flex flex-col justify-between transition-colors ${
            dragOverStage === "done" ? "bg-zinc-200" : ""
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-zinc-300 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-black flex items-center justify-center text-[7px] text-white">
                  ✓
                </div>
                <h3 className="font-heading font-black text-xs uppercase tracking-wider text-zinc-500">
                  Done
                </h3>
              </div>
              <span className="text-xs font-heading font-extrabold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                {doneCards.length}
              </span>
            </div>

            <div className="space-y-2.5 min-h-[140px]">
              {doneCards.length === 0 ? (
                <div className="h-24 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center text-[11px] font-heading font-bold text-zinc-400">
                  No cards in Done
                </div>
              ) : (
                doneCards.map((c) => renderCard(c, "done"))
              )}
            </div>
          </div>

          <button
            onClick={clearDoneCards}
            className="mt-3 w-full py-2 border border-zinc-300 hover:border-black rounded-xl text-zinc-400 hover:text-black font-heading font-bold text-xs uppercase transition text-center bg-white"
          >
            Archive Done
          </button>
        </div>
      </div>

      <KanbanCardModal
        isOpen={isModalOpen}
        initialStage={modalInitialStage}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
