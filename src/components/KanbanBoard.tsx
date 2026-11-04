"use client";

import React, { useState, DragEvent } from "react";
import { useHousehold, getAssigneeLabel } from "@/context/HouseholdContext";
import { KanbanStage, KanbanCard, useKanban } from "@/context/KanbanContext";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { KanbanCardModal } from "./KanbanCardModal";
import { KanbanCardDetailDrawer } from "./KanbanCardDetailDrawer";
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
    updateCard,
    deleteCard,
    clearDoneCards,
  } = useKanban();
  const { startFocus } = useFocusTimer();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStage, setModalInitialStage] = useState<KanbanStage>("todo");
  const [selectedCardForDrawer, setSelectedCardForDrawer] = useState<KanbanCard | null>(null);
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
        onClick={() => setSelectedCardForDrawer(card)}
        className="p-3.5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-[#18181b]/90 text-xs flex flex-col gap-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] cursor-pointer active:scale-[0.99] transition-all duration-200 group"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <span
              className={`font-semibold text-xs leading-snug text-zinc-900 dark:text-zinc-100 break-words ${
                currentStage === "done" ? "line-through text-zinc-400 dark:text-zinc-500" : ""
              }`}
            >
              {card.title}
            </span>
            {card.description && (
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 break-words">
                {card.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300">
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
              className="opacity-70 md:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-zinc-400 hover:text-emerald-500 p-1 transition rounded-lg focus:outline-none"
              title="Focus on this card"
              aria-label={`Focus on ${card.title}`}
            >
              <Play className="w-3 h-3 fill-current" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                deleteCard(card.id);
              }}
              className="opacity-70 md:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-zinc-400 hover:text-rose-500 p-1 transition rounded-lg focus:outline-none"
              title="Delete Card"
              aria-label="Delete Card"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between pt-2 border-t border-black/[0.04] dark:border-white/[0.06] gap-1.5"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 truncate max-w-[70px] sm:max-w-none">
              {getAssigneeLabel(card.assignee, activePartner, partnerNames)}
            </span>

            {card.doToday ? (
              <button
                type="button"
                onClick={() => toggleCardDoToday(card.id)}
                title="Remove from Today's Daily Tasks"
                className="text-[9px] font-semibold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 apple-press hover:bg-amber-500/25 transition shrink-0 whitespace-nowrap"
              >
                <span>⚡ Do Today</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => toggleCardDoToday(card.id)}
                title="Surface in Today's Daily Tasks"
                className="text-[9px] font-medium uppercase text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-black/[0.08] dark:border-white/[0.1] px-2 py-0.5 rounded-full transition bg-black/[0.02] dark:bg-white/[0.04] apple-press shrink-0 whitespace-nowrap"
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
                className="text-[10px] font-semibold uppercase px-2.5 py-0.5 border border-black/[0.1] dark:border-white/[0.15] bg-black/[0.03] dark:bg-white/[0.06] rounded-xl hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 apple-press transition flex items-center gap-1 shrink-0 whitespace-nowrap"
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
                  className="text-[10px] font-semibold border border-black/[0.08] dark:border-white/[0.1] rounded-xl px-2 py-0.5 hover:bg-black/[0.05] dark:hover:bg-white/[0.1] apple-press transition shrink-0"
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveCardStage(card.id, "done")}
                  title="Mark Done"
                  className="text-[10px] font-semibold uppercase px-2.5 py-0.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:opacity-90 apple-press transition flex items-center gap-1 shrink-0 whitespace-nowrap shadow-2xs"
                >
                  <span>Done</span>
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </button>
              </>
            )}

            {currentStage === "done" && (
              <button
                type="button"
                onClick={() => moveCardStage(card.id, "inprogress")}
                title="Reopen Card"
                className="text-[10px] font-semibold uppercase px-2 py-0.5 border border-black/[0.08] dark:border-white/[0.1] rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.1] apple-press transition flex items-center gap-1 shrink-0 whitespace-nowrap"
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
    <div className="apple-card rounded-3xl p-4 sm:p-5 md:p-6 flex flex-col flex-1 w-full">
      {/* Top Header & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/[0.05] dark:border-white/[0.06] mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-bold text-xs shrink-0">
            3
          </div>
          <div>
            <h2 className="font-semibold text-sm md:text-base tracking-wide text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Kanban Board
              {!isMobile && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-400 hidden sm:inline-block">
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
          {categories.length > 1 &&
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full font-medium transition whitespace-nowrap text-xs apple-press ${
                  selectedCategory === cat.id
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xs font-semibold"
                    : "border border-black/[0.06] dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-black/[0.02] dark:bg-white/[0.04]"
                }`}
              >
                {cat.emoji ? `${cat.emoji} ` : ""}
                {cat.name}
              </button>
            ))}

          <button
            onClick={() => openAddCard("todo")}
            className="hidden sm:flex px-3.5 py-1 rounded-full font-semibold uppercase bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition whitespace-nowrap items-center gap-1 shrink-0 text-xs apple-press shadow-2xs cursor-pointer"
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
        } items-center justify-between gap-1 p-1 apple-segmented-track rounded-2xl mb-4 text-xs font-semibold`}
      >
        <button
          type="button"
          onClick={() => setMobileTab("todo")}
          className={`flex-1 py-1.5 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 apple-press ${
            mobileTab === "todo"
              ? "bg-black text-white dark:bg-white dark:text-zinc-900 shadow-xs font-semibold"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <span>To Do</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              mobileTab === "todo"
                ? "bg-white/20 dark:bg-black/10 text-white dark:text-zinc-900"
                : "bg-black/[0.04] dark:bg-white/[0.06] text-zinc-500"
            }`}
          >
            {todoCards.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("inprogress")}
          className={`flex-1 py-1.5 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 apple-press ${
            mobileTab === "inprogress"
              ? "bg-black text-white dark:bg-white dark:text-zinc-900 shadow-xs font-semibold"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <span>In Progress</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              mobileTab === "inprogress"
                ? "bg-white/20 dark:bg-black/10 text-white dark:text-zinc-900"
                : "bg-black/[0.04] dark:bg-white/[0.06] text-zinc-500"
            }`}
          >
            {inProgressCards.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("done")}
          className={`flex-1 py-1.5 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 apple-press ${
            mobileTab === "done"
              ? "bg-black text-white dark:bg-white dark:text-zinc-900 shadow-xs font-semibold"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <span>Done</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              mobileTab === "done"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-black/[0.04] dark:bg-white/[0.06] text-zinc-500"
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
          className={`rounded-3xl p-4 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between transition-colors ${
            isMobile
              ? mobileTab === "todo" ? "flex" : "hidden"
              : mobileTab === "todo" ? "flex" : "hidden md:flex"
          } ${dragOverStage === "todo" ? "bg-black/[0.05] dark:bg-white/[0.06] border-dashed" : ""}`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.05] dark:border-white/[0.06] mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full border border-black/30 dark:border-white/30 bg-white dark:bg-zinc-800" />
                <h3 className="font-semibold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  To Do
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300">
                {todoCards.length}
              </span>
            </div>

            <div className="space-y-2.5 min-h-[140px]">
              {todoCards.length === 0 ? (
                <div className="h-24 border border-dashed border-black/[0.08] dark:border-white/[0.1] rounded-2xl flex items-center justify-center text-[11px] font-medium text-zinc-400">
                  No cards in To Do
                </div>
              ) : (
                todoCards.map((c) => renderCard(c, "todo"))
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: IN PROGRESS */}
        <div
          onDragOver={(e) => handleDragOver(e, "inprogress")}
          onDragLeave={() => handleDragLeave("inprogress")}
          onDrop={(e) => handleDrop(e, "inprogress")}
          className={`rounded-3xl p-4 bg-blue-500/[0.02] dark:bg-blue-500/[0.04] border border-blue-500/20 dark:border-blue-400/20 flex flex-col justify-between transition-colors ${
            isMobile
              ? mobileTab === "inprogress" ? "flex" : "hidden"
              : mobileTab === "inprogress" ? "flex" : "hidden md:flex"
          } ${dragOverStage === "inprogress" ? "bg-blue-500/[0.06] border-dashed" : ""}`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-blue-500/15 dark:border-blue-400/15 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <h3 className="font-semibold text-xs uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  In Progress
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {inProgressCards.length}
              </span>
            </div>

            <div className="space-y-2.5 min-h-[140px]">
              {inProgressCards.length === 0 ? (
                <div className="h-24 border border-dashed border-blue-500/20 rounded-2xl flex items-center justify-center text-[11px] font-medium text-zinc-400">
                  No cards in In Progress
                </div>
              ) : (
                inProgressCards.map((c) => renderCard(c, "inprogress"))
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: DONE */}
        <div
          onDragOver={(e) => handleDragOver(e, "done")}
          onDragLeave={() => handleDragLeave("done")}
          onDrop={(e) => handleDrop(e, "done")}
          className={`rounded-3xl p-4 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.03] border border-emerald-500/20 dark:border-emerald-400/20 flex flex-col justify-between transition-colors ${
            isMobile
              ? mobileTab === "done" ? "flex" : "hidden"
              : mobileTab === "done" ? "flex" : "hidden md:flex"
          } ${dragOverStage === "done" ? "bg-emerald-500/[0.06] border-dashed" : ""}`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15 dark:border-emerald-400/15 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] flex items-center justify-center text-[7px] text-white">
                  ✓
                </div>
                <h3 className="font-semibold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Done
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {doneCards.length}
              </span>
            </div>

            <div className="space-y-2.5 min-h-[140px]">
              {doneCards.length === 0 ? (
                <div className="h-24 border border-dashed border-emerald-500/20 rounded-2xl flex items-center justify-center text-[11px] font-medium text-zinc-400">
                  No cards in Done
                </div>
              ) : (
                doneCards.map((c) => renderCard(c, "done"))
              )}
            </div>
          </div>

          {doneCards.length > 0 && (
            <button
              type="button"
              onClick={clearDoneCards}
              className="mt-3.5 w-full py-2 border border-black/[0.08] dark:border-white/[0.1] hover:border-black/20 rounded-2xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold text-xs uppercase apple-press transition text-center bg-black/[0.02] dark:bg-white/[0.03] cursor-pointer"
            >
              Archive Done
            </button>
          )}
        </div>
      </div>

      <KanbanCardModal
        isOpen={isModalOpen}
        initialStage={modalInitialStage}
        onClose={() => setIsModalOpen(false)}
      />

      <KanbanCardDetailDrawer
        card={selectedCardForDrawer}
        isOpen={Boolean(selectedCardForDrawer)}
        onClose={() => setSelectedCardForDrawer(null)}
        onSave={(id, updates) => updateCard(id, updates)}
        onDelete={(id) => deleteCard(id)}
      />
    </div>
  );
}
