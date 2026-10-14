import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import {
  RoutinesProvider,
  useRoutines,
  isRoutineScheduledForDate,
  formatDateKey,
} from "../RoutinesContext";
import { HouseholdProvider } from "../HouseholdContext";

describe("RoutinesContext (Seam: Daily Routines & Frequency Domain)", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <HouseholdProvider>
      <RoutinesProvider>{children}</RoutinesProvider>
    </HouseholdProvider>
  );

  it("loads default seed routines with frequencies", () => {
    const { result } = renderHook(() => useRoutines(), { wrapper });

    expect(result.current.routines.length).toBeGreaterThan(0);
    const dailySync = result.current.routines.find((r) =>
      r.title.includes("daily sync")
    );
    expect(dailySync).toBeDefined();
    expect(dailySync?.frequency).toBe("daily");
  });

  describe("isRoutineScheduledForDate", () => {
    // 2026-10-14 is a Wednesday (day 3)
    const wednesday = new Date(2026, 9, 14);
    // 2026-10-17 is a Saturday (day 6)
    const saturday = new Date(2026, 9, 17);
    // 2026-10-18 is a Sunday (day 0)
    const sunday = new Date(2026, 9, 18);

    it("returns true for 'daily' on any day of week", () => {
      expect(isRoutineScheduledForDate("daily", wednesday)).toBe(true);
      expect(isRoutineScheduledForDate("daily", saturday)).toBe(true);
      expect(isRoutineScheduledForDate("daily", sunday)).toBe(true);
    });

    it("evaluates 'weekdays' correctly", () => {
      expect(isRoutineScheduledForDate("weekdays", wednesday)).toBe(true);
      expect(isRoutineScheduledForDate("weekdays", saturday)).toBe(false);
      expect(isRoutineScheduledForDate("weekdays", sunday)).toBe(false);
    });

    it("evaluates custom day arrays (e.g. [1, 3, 5] for Mon, Wed, Fri)", () => {
      const monWedFri = [1, 3, 5];
      expect(isRoutineScheduledForDate(monWedFri, wednesday)).toBe(true); // Wed = 3
      expect(isRoutineScheduledForDate(monWedFri, saturday)).toBe(false); // Sat = 6
    });
  });

  it("toggles completion strictly for the specified calendar date without affecting other dates", () => {
    const { result } = renderHook(() => useRoutines(), { wrapper });
    const routineId = result.current.routines[0].id;

    const dateA = new Date(2026, 9, 14);
    const dateB = new Date(2026, 9, 15);
    const keyA = formatDateKey(dateA);
    const keyB = formatDateKey(dateB);

    // Initial state on dateA
    const initialCompletionA = result.current.isCompleted(routineId, dateA);

    act(() => {
      result.current.toggleCompletion(routineId, dateA);
    });

    expect(result.current.isCompleted(routineId, dateA)).toBe(!initialCompletionA);
    // Date B should remain unchanged
    expect(result.current.isCompleted(routineId, dateB)).toBe(false);
  });

  it("adds a new routine and assigns it to the list", () => {
    const { result } = renderHook(() => useRoutines(), { wrapper });

    act(() => {
      result.current.addRoutine("Evening chamomile tea", "mine", "daily");
    });

    const newRoutine = result.current.routines.find(
      (r) => r.title === "Evening chamomile tea"
    );
    expect(newRoutine).toBeDefined();
    expect(newRoutine?.assignee).toBe("mine");
  });

  it("deletes a routine by id", () => {
    const { result } = renderHook(() => useRoutines(), { wrapper });
    const routineId = result.current.routines[0].id;

    act(() => {
      result.current.deleteRoutine(routineId);
    });

    const found = result.current.routines.find((r) => r.id === routineId);
    expect(found).toBeUndefined();
  });
});
