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
import Home from "@/app/page";

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
    it("switches to mobile view and opens KanbanCardModal on quick add", () => {
      render(
        <HouseholdProvider>
          <RoutinesProvider>
            <DailyTasksProvider>
              <KanbanProvider>
                <Home />
              </KanbanProvider>
            </DailyTasksProvider>
          </RoutinesProvider>
        </HouseholdProvider>
      );

      // Switch to Mobile Preview
      const mobileBtn = screen.getByRole("button", { name: "Mobile" });
      fireEvent.click(mobileBtn);

      // Verify phone status bar & pill header
      expect(screen.getByText("3-COL KANBAN")).toBeInTheDocument();

      // Click floating action button (+)
      const quickAddBtn = screen.getByLabelText("Quick Add");
      fireEvent.click(quickAddBtn);

      // Verify KanbanCardModal opened
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("New Kanban Card")).toBeInTheDocument();
    });
  });
});
