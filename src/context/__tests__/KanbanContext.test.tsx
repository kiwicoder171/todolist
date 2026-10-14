import { renderHook, act } from "@testing-library/react";
import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { HouseholdProvider } from "../HouseholdContext";
import { RoutinesProvider } from "../RoutinesContext";
import { DailyTasksProvider, useDailyTasks } from "../DailyTasksContext";
import { KanbanProvider, useKanban } from "../KanbanContext";

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <HouseholdProvider>
      <RoutinesProvider>
        <DailyTasksProvider>
          <KanbanProvider>{children}</KanbanProvider>
        </DailyTasksProvider>
      </RoutinesProvider>
    </HouseholdProvider>
  );
}

describe("KanbanContext (Seam: Board 3 Unified Kanban & Two-Way Sync)", () => {
  it("initializes with default categories and seed cards", () => {
    const { result } = renderHook(() => useKanban(), { wrapper });

    expect(result.current.categories.length).toBeGreaterThanOrEqual(4);
    expect(result.current.categories.some((c) => c.id === "home")).toBe(true);
    expect(result.current.cards.length).toBeGreaterThanOrEqual(4);

    const todoCards = result.current.getFilteredCardsByStage("todo");
    const inProgressCards = result.current.getFilteredCardsByStage("inprogress");
    const doneCards = result.current.getFilteredCardsByStage("done");

    expect(todoCards.length).toBeGreaterThan(0);
    expect(inProgressCards.length).toBeGreaterThan(0);
    expect(doneCards.length).toBeGreaterThan(0);
  });

  it("filters cards by selected category", () => {
    const { result } = renderHook(() => useKanban(), { wrapper });

    act(() => {
      result.current.setSelectedCategory("travel");
    });

    expect(result.current.selectedCategory).toBe("travel");
    const todoCards = result.current.getFilteredCardsByStage("todo");
    todoCards.forEach((c) => {
      expect(c.category).toBe("travel");
    });
  });

  it("adds a new card to a specific stage", () => {
    const { result } = renderHook(() => useKanban(), { wrapper });

    act(() => {
      result.current.addCard(
        "Build a cat tree in the living room",
        "home",
        "todo",
        "mine",
        "Use recycled wood"
      );
    });

    const newCard = result.current.cards.find(
      (c) => c.title === "Build a cat tree in the living room"
    );
    expect(newCard).toBeDefined();
    expect(newCard?.stage).toBe("todo");
    expect(newCard?.category).toBe("home");
    expect(newCard?.assignee).toBe("mine");
  });

  it("moves a card across stages (todo -> inprogress -> done)", () => {
    const { result } = renderHook(() => useKanban(), { wrapper });

    const cardToMove = result.current.cards.find((c) => c.stage === "todo")!;
    expect(cardToMove).toBeDefined();

    act(() => {
      result.current.moveCardStage(cardToMove.id, "inprogress");
    });

    expect(
      result.current.cards.find((c) => c.id === cardToMove.id)?.stage
    ).toBe("inprogress");

    act(() => {
      result.current.moveCardStage(cardToMove.id, "done");
    });

    expect(
      result.current.cards.find((c) => c.id === cardToMove.id)?.stage
    ).toBe("done");
  });

  it("adds a custom category", () => {
    const { result } = renderHook(() => useKanban(), { wrapper });

    act(() => {
      result.current.addCategory("finance", "Finance", "💰");
    });

    expect(
      result.current.categories.some((c) => c.id === "finance" && c.emoji === "💰")
    ).toBe(true);
  });

  it("clears / archives done cards", () => {
    const { result } = renderHook(() => useKanban(), { wrapper });

    act(() => {
      result.current.clearDoneCards();
    });

    const doneCards = result.current.getFilteredCardsByStage("done");
    expect(doneCards.length).toBe(0);
  });

  describe("Two-way synchronization with Daily Tasks", () => {
    it("toggling Plan Today (doToday) adds/surfaces the card in Daily Tasks", () => {
      const { result } = renderHook(
        () => ({
          kanban: useKanban(),
          daily: useDailyTasks(),
        }),
        { wrapper }
      );

      // Find a card that is not scheduled for today
      const unscheduledCard = result.current.kanban.cards.find(
        (c) => !c.doToday && c.stage === "todo"
      )!;
      expect(unscheduledCard).toBeDefined();

      act(() => {
        result.current.kanban.toggleCardDoToday(unscheduledCard.id);
      });

      // Verify card doToday is true
      const updatedCard = result.current.kanban.cards.find(
        (c) => c.id === unscheduledCard.id
      )!;
      expect(updatedCard.doToday).toBe(true);

      // Verify daily tasks contains a synced task for this card
      const syncedDailyTask = result.current.daily.tasks.find(
        (t) => t.kanbanId === unscheduledCard.id
      );
      expect(syncedDailyTask).toBeDefined();
      expect(syncedDailyTask?.title).toBe(unscheduledCard.title);
      expect(syncedDailyTask?.isKanbanSynced).toBe(true);
    });

    it("moving a scheduled Kanban card to 'done' marks the synced daily task as completed", () => {
      const { result } = renderHook(
        () => ({
          kanban: useKanban(),
          daily: useDailyTasks(),
        }),
        { wrapper }
      );

      // card-202 is already seeded as doToday: true in SEED_CARDS and task-103 has kanbanId: "card-202"
      act(() => {
        result.current.kanban.moveCardStage("card-202", "done");
      });

      const syncedTask = result.current.daily.tasks.find(
        (t) => t.kanbanId === "card-202"
      );
      expect(syncedTask?.completed).toBe(true);
    });

    it("checking off a daily task in Daily Tasks moves the synced Kanban card to 'done'", () => {
      const { result } = renderHook(
        () => ({
          kanban: useKanban(),
          daily: useDailyTasks(),
        }),
        { wrapper }
      );

      // task-103 is synced with card-202 (initially inprogress)
      expect(
        result.current.kanban.cards.find((c) => c.id === "card-202")?.stage
      ).toBe("inprogress");

      act(() => {
        result.current.daily.toggleDailyTask("task-103");
      });

      expect(
        result.current.kanban.cards.find((c) => c.id === "card-202")?.stage
      ).toBe("done");

      // Unchecking it should revert card to inprogress
      act(() => {
        result.current.daily.toggleDailyTask("task-103");
      });

      expect(
        result.current.kanban.cards.find((c) => c.id === "card-202")?.stage
      ).toBe("inprogress");
    });

    it("deleting a synced daily task resets the linked Kanban card's doToday status to false", () => {
      const { result } = renderHook(
        () => ({
          kanban: useKanban(),
          daily: useDailyTasks(),
        }),
        { wrapper }
      );

      // card-202 is synced with task-103
      expect(
        result.current.kanban.cards.find((c) => c.id === "card-202")?.doToday
      ).toBe(true);

      act(() => {
        result.current.daily.deleteDailyTask("task-103");
      });

      expect(
        result.current.kanban.cards.find((c) => c.id === "card-202")?.doToday
      ).toBe(false);
    });
  });
});
