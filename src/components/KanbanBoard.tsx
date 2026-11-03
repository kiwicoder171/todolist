"use client";

import React, { useState, DragEvent } from "react";
import { useHousehold, getAssigneeLabel } from "@/context/HouseholdContext";
import { KanbanStage, KanbanCard, useKanban } from "@/context/KanbanContext";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { KanbanCardModal } from "./KanbanCardModal";
import { Plus, Check, ArrowRight, ArrowLeft, RotateCcw, Trash2, Play } from "lucide-react";

export interface KanbanBoardProps {
  isMobile?: boolean;
}

export function KanbanBoard({ isMobile = false }: KanbanBoardProps = {}) {
  const { activePartner, partnerNames } = useHousehold();
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
  const { startFocus } = useFocusTimer();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStage, setModalInitialStage] = useState<KanbanStage>("todo");
  const [mobileTab, setMobileTab] = useState<KanbanStage>("todo");
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
    const partnerName = activePartner === "alex" ? partnerNames.sam : partnerNames.alex;

    return (
      <div
        key={card.id}
        draggable
        onDragStart={(e) => handleDragStart(e, card.id)}
        className="p-3.5 rounded-2xl border-2 border-black bg-white text-xs squircle-card flex flex-col gap-2.5 shadow-[2px_2px_0_0_#000] cursor-grab active:cursor-grabbing hover:border-black transition group"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <span
              className={`font-heading font-bold text-xs leading-snug text-black break-words ${
                currentStage === "done" ? "line-through text-zinc-500" : ""
              }`}
            >
              {card.title}
            </span>
            {card.description && (
              <p className="text-[11px] text-zinc-500 line-clamp-2 break-words">
                {card.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[9px] font-heading font-extrabold uppercase px-1.5 py-0.5 rounded border border-black bg-[#f4f4f5] text-black">
              {card.category}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startFocus({
                  id: card.id,
                  title: card.title,
                  type: "kanban",
                  category: card.category,
                });
              }}
              className="opacity-70 md:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-zinc-400 hover:text-emerald-600 p-0.5 transition rounded focus:outline-none focus:ring-1 focus:ring-black"
              title="Focus on this card"
              aria-label={`Focus on ${card.title}`}
            >
              <Play className="w-3 h-3 fill-current" />
            </button>
            <button
              type="button"
              onClick={() => deleteCard(card.id)}
              className="opacity-70 md:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-zinc-400 hover:text-black p-0.5 transition rounded focus:outline-none focus:ring-1 focus:ring-black"
              title="Delete Card"
              aria-label="Delete Card"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-heading font-bold text-zinc-600 truncate max-w-[70px] sm:max-w-none">
              {getAssigneeLabel(card.assignee, activePartner, partnerNames)}
            </span>

            {card.doToday ? (
              <button
                type="button"
                onClick={() => toggleCardDoToday(card.id)}
                title="Remove from Today's Daily Tasks"
                className="text-[9px] font-heading font-extrabold uppercase bg-black text-white px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-zinc-800 transition shrink-0 whitespace-nowrap"
              >
                <span>⚡ Do Today</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => toggleCardDoToday(card.id)}
                title="Surface in Today's Daily Tasks"
                className="text-[9px] font-heading font-bold uppercase text-zinc-600 hover:text-black border border-zinc-300 hover:border-black px-2 py-0.5 rounded-full transition bg-white shrink-0 whitespace-nowrap"
              >
                Plan Today
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {currentStage === "todo" && (
              <button
                type="button"
                onClick={() => moveCardStage(card.id, "inprogress")}
                title="Move to In Progress"
                className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 border border-black rounded hover:bg-black hover:text-white transition flex items-center gap-1 shrink-0 whitespace-nowrap"
              >
                <span>Start</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            {currentStage === "inprogress" && (
              <>
                <button
                  type="button"
                  onClick={() => moveCardStage(card.id, "todo")}
                  title="Move Back to To Do"
                  className="text-[10px] font-heading font-bold border border-zinc-300 rounded px-1.5 py-0.5 hover:border-black transition shrink-0"
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveCardStage(card.id, "done")}
                  title="Mark Done"
                  className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 border border-black bg-black text-white rounded hover:bg-zinc-800 transition flex items-center gap-1 shrink-0 whitespace-nowrap"
                >
                  <span>Done</span>
                  <Check className="w-3 h-3 stroke-[3]" />
                </button>
              </>
            )}

            {currentStage === "done" && (
              <button
                type="button"
                onClick={() => moveCardStage(card.id, "inprogress")}
                title="Reopen Card"
                className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 border border-zinc-300 rounded hover:border-black transition flex items-center gap-1 shrink-0 whitespace-nowrap"
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
    <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-4 sm:p-5 md:p-6 shadow-xs flex flex-col flex-1 w-full transition-colors duration-200">
      {/* Top Header & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs shrink-0">
            3
          </div>
          <div>
            <h2 className="font-semibold text-sm md:text-base tracking-wide text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Kanban Board
              {!isMobile && (
                <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hidden sm:inline-block">
                  3 Vertical Columns
                </span>
              )}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Long-term projects &amp; chores synced with Day View
            </p>
          </div>
        </div>

        {/* Category Filter Pills & Add Card */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full font-medium transition whitespace-nowrap text-xs ${
                selectedCategory === cat.id
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-xs"
                  : "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white/60 dark:bg-zinc-900/40"
              }`}
            >
              {cat.emoji ? `${cat.emoji} ` : ""}
              {cat.name}
            </button>
          ))}

          <button
            onClick={() => openAddCard("todo")}
            className="px-3 py-1 rounded-full font-heading font-bold uppercase bg-black text-white hover:bg-zinc-800 transition whitespace-nowrap flex items-center gap-1 shrink-0 text-xs"
          >
            <Plus className="w-3 h-3" />
            <span>Card</span>
          </button>
        </div>
      </div>

      {/* Mobile-Only Column Switcher Tabs */}
      <div
        className={`${
          isMobile ? "flex" : "flex md:hidden"
        } items-center justify-between gap-1 p-1 bg-zinc-100 border-2 border-black rounded-2xl mb-4 text-xs font-heading font-bold`}
      >
        <button
          type="button"
          onClick={() => setMobileTab("todo")}
          className={`flex-1 py-1.5 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
            mobileTab === "todo"
              ? "bg-black text-white shadow-xs"
              : "text-zinc-600 hover:text-black"
          }`}
        >
          <span>To Do</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              mobileTab === "todo"
                ? "bg-white text-black"
                : "bg-zinc-200 text-zinc-700"
            }`}
          >
            {todoCards.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("inprogress")}
          className={`flex-1 py-1.5 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
            mobileTab === "inprogress"
              ? "bg-black text-white shadow-xs"
              : "text-zinc-600 hover:text-black"
          }`}
        >
          <span>In Progress</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              mobileTab === "inprogress"
                ? "bg-white text-black"
                : "bg-zinc-200 text-zinc-700"
            }`}
          >
            {inProgressCards.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("done")}
          className={`flex-1 py-1.5 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
            mobileTab === "done"
              ? "bg-black text-white shadow-xs"
              : "text-zinc-600 hover:text-black"
          }`}
        >
          <span>Done</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              mobileTab === "done"
                ? "bg-white text-black"
                : "bg-zinc-200 text-zinc-700"
            }`}
          >
            {doneCards.length}
          </span>
        </button>
      </div>

      {/* 3 VERTICAL COLUMNS: Side-by-side grid on desktop, tabbed on mobile */}
      <div
        className={`flex-1 ${
          isMobile
            ? "flex flex-col gap-4"
            : "grid grid-cols-1 md:grid-cols-3 gap-4"
        } overflow-y-auto pt-1 min-h-[460px]`}
      >
        {/* SECTION 1: TO DO */}
        <div
          onDragOver={(e) => handleDragOver(e, "todo")}
          onDragLeave={() => handleDragLeave("todo")}
          onDrop={(e) => handleDrop(e, "todo")}
          className={`border-2 border-black rounded-2xl p-4 bg-zinc-50/70 shadow-sm flex flex-col justify-between transition-colors ${
            isMobile
              ? mobileTab === "todo" ? "flex" : "hidden"
              : mobileTab === "todo" ? "flex" : "hidden md:flex"
          } ${dragOverStage === "todo" ? "bg-zinc-200 border-dashed" : ""}`}
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
            type="button"
            onClick={() => openAddCard("todo")}
            className="mt-3.5 w-full py-2 border-2 border-dashed border-zinc-400 hover:border-black rounded-xl text-zinc-600 hover:text-black font-heading font-bold text-xs uppercase transition flex items-center justify-center gap-1.5 bg-white shadow-xs"
          >
            <Plus className="w-3 h-3" />
            <span>Add To Do</span>
          </button>
        </div>

        {/* SECTION 2: IN PROGRESS */}
        <div
          onDragOver={(e) => handleDragOver(e, "inprogress")}
          onDragLeave={() => handleDragLeave("inprogress")}
          onDrop={(e) => handleDrop(e, "inprogress")}
          className={`border-2 border-black rounded-2xl p-4 bg-white shadow-[3px_3px_0_0_#000] flex flex-col justify-between transition-colors ${
            isMobile
              ? mobileTab === "inprogress" ? "flex" : "hidden"
              : mobileTab === "inprogress" ? "flex" : "hidden md:flex"
          } ${dragOverStage === "inprogress" ? "bg-zinc-100 border-dashed" : ""}`}
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
            type="button"
            onClick={() => openAddCard("inprogress")}
            className="mt-3.5 w-full py-2 border-2 border-dashed border-zinc-400 hover:border-black rounded-xl text-zinc-600 hover:text-black font-heading font-bold text-xs uppercase transition flex items-center justify-center gap-1.5 bg-zinc-50 shadow-xs"
          >
            <Plus className="w-3 h-3" />
            <span>Add Active Task</span>
          </button>
        </div>

        {/* SECTION 3: DONE */}
        <div
          onDragOver={(e) => handleDragOver(e, "done")}
          onDragLeave={() => handleDragLeave("done")}
          onDrop={(e) => handleDrop(e, "done")}
          className={`border-2 border-dashed border-zinc-300 rounded-2xl p-4 bg-[#fcfcfc] flex flex-col justify-between transition-colors ${
            isMobile
              ? mobileTab === "done" ? "flex" : "hidden"
              : mobileTab === "done" ? "flex" : "hidden md:flex"
          } ${dragOverStage === "done" ? "bg-zinc-200" : ""}`}
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
            type="button"
            onClick={clearDoneCards}
            className="mt-3.5 w-full py-2 border border-zinc-300 hover:border-black rounded-xl text-zinc-400 hover:text-black font-heading font-bold text-xs uppercase transition text-center bg-white shadow-xs"
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
