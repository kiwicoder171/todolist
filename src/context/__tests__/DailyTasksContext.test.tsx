import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import {
  DailyTasksProvider,
  useDailyTasks,
  calculateRolloverTasks,
  DailyTask,
} from "../DailyTasksContext";
import { HouseholdProvider } from "../HouseholdContext";

describe("DailyTasksContext & Rollover Engine (Seam: Daily Tasks Domain)", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <HouseholdProvider>
      <DailyTasksProvider>{children}</DailyTasksProvider>
    </HouseholdProvider>
  );

  const oct13 = new Date(2026, 9, 13);
  const oct14 = new Date(2026, 9, 14); // "Today"
  const oct15 = new Date(2026, 9, 15);

  describe("calculateRolloverTasks domain engine", () => {
    const tasks: DailyTask[] = [
      {
        id: "task-1",
        title: "Pick up dry cleaning",
        assignee: "partner",
        targetDate: "2026-10-13",
        originDate: "2026-10-13",
        completed: false,
        notes: "Ticket #492",
      },
      {
        id: "task-2",
        title: "Buy groceries for dinner",
        assignee: "both",
        targetDate: "2026-10-13",
        originDate: "2026-10-13",
        completed: true, // Completed yesterday
        notes: "",
      },
      {
        id: "task-3",
        title: "Call plumber for kitchen sink",
        assignee: "mine",
        targetDate: "2026-10-14",
        originDate: "2026-10-14",
        completed: false,
        notes: "",
      },
      {
        id: "task-4",
        title: "Future vet appointment",
        assignee: "both",
        targetDate: "2026-10-15",
        originDate: "2026-10-15",
        completed: false,
        notes: "",
      },
    ];

    it("rolls forward unfinished past tasks to today with rollover metadata", () => {
      const todayTasks = calculateRolloverTasks(tasks, oct14, oct14);

      // task-1 (unfinished from yesterday) should be rolled over to today
      const rolledTask = todayTasks.find((t) => t.id === "task-1");
      expect(rolledTask).toBeDefined();
      expect(rolledTask?.originDate).toBe("2026-10-13");

      // task-3 (created today) should be present
      const currentTask = todayTasks.find((t) => t.id === "task-3");
      expect(currentTask).toBeDefined();

      // task-2 was completed yesterday, so it should NOT roll over to today
      const completedYesterday = todayTasks.find((t) => t.id === "task-2");
      expect(completedYesterday).toBeUndefined();

      // task-4 is in the future, should not be in today's list
      const futureTask = todayTasks.find((t) => t.id === "task-4");
      expect(futureTask).toBeUndefined();
    });

    it("preserves accurate historical log when viewing past calendar dates", () => {
      const yesterdayTasks = calculateRolloverTasks(tasks, oct13, oct14);

      // Viewing yesterday (Oct 13) shows both tasks that originated yesterday
      expect(yesterdayTasks.some((t) => t.id === "task-1")).toBe(true);
      expect(yesterdayTasks.some((t) => t.id === "task-2")).toBe(true);

      // Does not show tasks created on Oct 14
      expect(yesterdayTasks.some((t) => t.id === "task-3")).toBe(false);
    });

    it("shows scheduled tasks when viewing future calendar dates", () => {
      const futureTasks = calculateRolloverTasks(tasks, oct15, oct14);

      expect(futureTasks.some((t) => t.id === "task-4")).toBe(true);
      expect(futureTasks.some((t) => t.id === "task-3")).toBe(false);
    });
  });

  describe("DailyTasks state operations", () => {
    it("adds a new daily task with today as origin date", () => {
      const { result } = renderHook(() => useDailyTasks(), { wrapper });

      act(() => {
        result.current.addDailyTask(
          "Pay wifi bill",
          "mine",
          oct14,
          "Due today"
        );
      });

      const added = result.current.tasks.find((t) => t.title === "Pay wifi bill");
      expect(added).toBeDefined();
      expect(added?.assignee).toBe("mine");
      expect(added?.originDate).toBe("2026-10-14");
      expect(added?.notes).toBe("Due today");
      expect(added?.completed).toBe(false);
    });

    it("toggles task completion state", () => {
      const { result } = renderHook(() => useDailyTasks(), { wrapper });
      const taskId = result.current.tasks[0].id;
      const initialCompleted = result.current.tasks[0].completed;

      act(() => {
        result.current.toggleDailyTask(taskId);
      });

      const updated = result.current.tasks.find((t) => t.id === taskId);
      expect(updated?.completed).toBe(!initialCompleted);
    });

    it("updates task details including notes and assignee", () => {
      const { result } = renderHook(() => useDailyTasks(), { wrapper });
      const taskId = result.current.tasks[0].id;

      act(() => {
        result.current.updateDailyTask(taskId, {
          title: "Updated Title",
          notes: "Updated Notes",
          assignee: "both",
        });
      });

      const updated = result.current.tasks.find((t) => t.id === taskId);
      expect(updated?.title).toBe("Updated Title");
      expect(updated?.notes).toBe("Updated Notes");
      expect(updated?.assignee).toBe("both");
    });

    it("deletes a daily task by id", () => {
      const { result } = renderHook(() => useDailyTasks(), { wrapper });
      const taskId = result.current.tasks[0].id;

      act(() => {
        result.current.deleteDailyTask(taskId);
      });

      const found = result.current.tasks.find((t) => t.id === taskId);
      expect(found).toBeUndefined();
    });
  });
});
