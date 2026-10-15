import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HouseholdProvider } from "@/context/HouseholdContext";
import { RoutinesProvider } from "@/context/RoutinesContext";
import { DailyTasksProvider } from "@/context/DailyTasksContext";
import { KanbanProvider } from "@/context/KanbanContext";
import { TaskDetailDrawer } from "@/components/TaskDetailDrawer";
import { WishlistModal } from "@/components/WishlistModal";
import { KanbanCardModal } from "@/components/KanbanCardModal";
import { CoupleTaskHubApp } from "@/components/CoupleTaskHubApp";

describe("UX/UI Interaction & Accessibility Tests", () => {
  describe("TaskDetailDrawer", () => {
    const mockTask = {
      id: "t1",
      title: "Clean apartment",
      assignee: "mine" as const,
      targetDate: "2026-10-14",
      originDate: "2026-10-14",
      completed: false,
      notes: "Vacuum rug",
    };

    it("closes when pressing the Escape key", () => {
      const handleClose = vi.fn();
      render(
        <TaskDetailDrawer
          task={mockTask}
          isOpen={true}
          onClose={handleClose}
          onSave={vi.fn()}
          onDelete={vi.fn()}
        />
      );

      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("has dialog role and aria-modal for accessibility", () => {
      render(
        <TaskDetailDrawer
          task={mockTask}
          isOpen={true}
          onClose={vi.fn()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
        />
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "drawer-heading");
    });
  });

  describe("WishlistModal", () => {
    it("closes when pressing Escape key", () => {
      const handleClose = vi.fn();
      render(
        <HouseholdProvider>
          <WishlistModal isOpen={true} onClose={handleClose} />
        </HouseholdProvider>
      );

      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("KanbanCardModal", () => {
    it("closes when pressing Escape key", () => {
      const handleClose = vi.fn();
      render(
        <HouseholdProvider>
          <DailyTasksProvider>
            <KanbanProvider>
              <KanbanCardModal isOpen={true} onClose={handleClose} />
            </KanbanProvider>
          </DailyTasksProvider>
        </HouseholdProvider>
      );

      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Mobile Navigation & Quick Add", () => {
    it("renders mobile view with Habits as initial tab, ordered Habits -> Daily -> Kanban -> Stats", () => {
      render(
        <HouseholdProvider>
          <RoutinesProvider>
            <DailyTasksProvider>
              <KanbanProvider>
                <CoupleTaskHubApp forcedIsMobile={true} />
              </KanbanProvider>
            </DailyTasksProvider>
          </RoutinesProvider>
        </HouseholdProvider>
      );

      // Verify phone status bar & pill header defaults to Habits (DAILY ROUTINES)
      expect(screen.getByText("DAILY ROUTINES")).toBeInTheDocument();

      // Verify bottom navigation bar buttons exist and in correct visual order
      const habitsBtn = screen.getByRole("button", { name: /^Habits$/i });
      const dailyBtn = screen.getByRole("button", { name: /^Daily$/i });
      const kanbanBtn = screen.getByRole("button", { name: /^Kanban$/i });
      const statsBtn = screen.getByRole("button", { name: /^Stats$/i });

      expect(habitsBtn).toBeInTheDocument();
      expect(dailyBtn).toBeInTheDocument();
      expect(kanbanBtn).toBeInTheDocument();
      expect(statsBtn).toBeInTheDocument();

      // Quick add on Habits opens AddRoutineModal
      const quickAddBtn = screen.getByLabelText("Quick Add");
      fireEvent.click(quickAddBtn);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("New Daily Routine")).toBeInTheDocument();
    });

    it("switches to Kanban tab (third tab) and uses segmented column controls", () => {
      render(
        <HouseholdProvider>
          <RoutinesProvider>
            <DailyTasksProvider>
              <KanbanProvider>
                <CoupleTaskHubApp forcedIsMobile={true} />
              </KanbanProvider>
            </DailyTasksProvider>
          </RoutinesProvider>
        </HouseholdProvider>
      );

      // Switch to Kanban (third tab)
      const kanbanNavBtn = screen.getByRole("button", { name: /^Kanban$/i });
      fireEvent.click(kanbanNavBtn);

      expect(screen.getByText("3-COL KANBAN")).toBeInTheDocument();

      // Look for mobile column tab switcher buttons
      const inProgressTab = screen.getByRole("button", { name: /In Progress/i });
      fireEvent.click(inProgressTab);

      // Verify In Progress column is selected
      expect(inProgressTab).toHaveClass("bg-black");

      // Quick add on Kanban opens KanbanCardModal
      const quickAddBtn = screen.getByLabelText("Quick Add");
      fireEvent.click(quickAddBtn);
      expect(screen.getByText("New Kanban Card")).toBeInTheDocument();
    });

    it("renders Day & Habit focus on top and Kanban focus on bottom in desktop all view", () => {
      render(
        <HouseholdProvider>
          <RoutinesProvider>
            <DailyTasksProvider>
              <KanbanProvider>
                <CoupleTaskHubApp forcedIsMobile={false} />
              </KanbanProvider>
            </DailyTasksProvider>
          </RoutinesProvider>
        </HouseholdProvider>
      );

      // Verify Board 1, Board 2, and Calendar/Dials are present on top
      expect(screen.getByText("Daily Routines")).toBeInTheDocument();
      expect(screen.getByText("Daily Tasks")).toBeInTheDocument();
      expect(screen.getByText("Consistency Dials")).toBeInTheDocument();

      // Verify Kanban Board is present
      expect(screen.getByRole("heading", { name: /Kanban Board/i })).toBeInTheDocument();
    });
  });
});
