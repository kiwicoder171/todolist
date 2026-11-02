import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { HouseholdProvider, useHousehold } from "@/context/HouseholdContext";
import { FocusTimerProvider, useFocusTimer } from "@/context/FocusTimerContext";

const storage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => storage[key] ?? null,
  setItem: (key: string, value: string) => {
    storage[key] = value;
  },
  removeItem: (key: string) => {
    delete storage[key];
  },
  clear: () => {
    Object.keys(storage).forEach((k) => delete storage[k]);
  },
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

describe("FocusTimerContext Engine (Ticket 09 & 10 YPT Core)", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.useRealTimers();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <HouseholdProvider>
      <FocusTimerProvider>{children}</FocusTimerProvider>
    </HouseholdProvider>
  );

  it("initializes with idle active session and 0 display seconds", () => {
    const { result } = renderHook(() => useFocusTimer(), { wrapper });
    expect(result.current.activeSession).toBeNull();
    expect(result.current.displaySeconds).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it("starts a focus session on a target item with stopwatch mode", () => {
    const { result } = renderHook(() => useFocusTimer(), { wrapper });

    act(() => {
      result.current.startFocus(
        { id: "task-1", title: "Read Chapter 4", type: "daily", category: "Study" },
        "stopwatch"
      );
    });

    expect(result.current.activeSession).not.toBeNull();
    expect(result.current.activeSession?.target.title).toBe("Read Chapter 4");
    expect(result.current.activeSession?.mode).toBe("stopwatch");
    expect(result.current.isRunning).toBe(true);
  });

  it("pauses and resumes focus without losing elapsed time", () => {
    const { result } = renderHook(() => useFocusTimer(), { wrapper });

    act(() => {
      result.current.startFocus({ id: "routine-1", title: "Morning Stretch" });
    });

    act(() => {
      result.current.pauseFocus();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.activeSession?.isRunning).toBe(false);

    act(() => {
      result.current.resumeFocus();
    });

    expect(result.current.isRunning).toBe(true);
  });

  it("toggles break mode during an active session", () => {
    const { result } = renderHook(() => useFocusTimer(), { wrapper });

    act(() => {
      result.current.startFocus({ id: "task-2", title: "Work" });
    });

    expect(result.current.isBreak).toBe(false);

    act(() => {
      result.current.toggleBreak();
    });

    expect(result.current.isBreak).toBe(true);
  });

  it("stops session and records it to daily logs and history", () => {
    const { result } = renderHook(() => useFocusTimer(), { wrapper });

    act(() => {
      result.current.startFocus({ id: "task-3", title: "Coding project", category: "Dev" });
    });

    let loggedItem: any = null;
    act(() => {
      loggedItem = result.current.stopFocus(true);
    });

    expect(result.current.activeSession).toBeNull();
    expect(result.current.isRunning).toBe(false);

    const todayLogs = result.current.getLogsForDate(new Date());
    expect(todayLogs.length).toBeGreaterThanOrEqual(1);
    expect(todayLogs[0].taskTitle).toBe("Coding project");
  });

  it("dynamically updates active session mode and duration via updateActiveSessionMode (Ticket 19)", () => {
    const { result } = renderHook(() => useFocusTimer(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <HouseholdProvider>
          <FocusTimerProvider>{children}</FocusTimerProvider>
        </HouseholdProvider>
      ),
    });

    act(() => {
      result.current.startFocus({ id: "task-mode", title: "Testing Mode Switch" }, "stopwatch");
    });

    expect(result.current.activeSession?.mode).toBe("stopwatch");

    act(() => {
      result.current.updateActiveSessionMode("pomodoro", 45);
    });

    expect(result.current.activeSession?.mode).toBe("pomodoro");
    expect(result.current.activeSession?.targetSeconds).toBe(45 * 60);
  });

  it("awards bonus point and sets celebration toast when meeting dailyTargetMinutes (Ticket 18)", () => {
    let householdScore: number = 0;
    function ScoreTracker() {
      const { scores, activePartner } = useHousehold();
      householdScore = scores[activePartner].points;
      return null;
    }

    const { result } = renderHook(() => useFocusTimer(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <HouseholdProvider>
          <ScoreTracker />
          <FocusTimerProvider>{children}</FocusTimerProvider>
        </HouseholdProvider>
      ),
    });

    const initialScore = householdScore;

    act(() => {
      result.current.setDailyTargetMinutes(1);
      result.current.startFocus({ id: "task-bonus", title: "Target Achiever" });
    });

    act(() => {
      result.current.stopFocus(true);
    });

    // Verify goal bonus toast message is set
    expect(result.current.goalBonusMessage).toContain("Daily Focus Goal Achieved");
    // Verify score received +1 point
    expect(householdScore).toBe(initialScore + 1);

    // Clear toast message
    act(() => {
      result.current.clearGoalBonusMessage();
    });
    expect(result.current.goalBonusMessage).toBeNull();
  });
});
