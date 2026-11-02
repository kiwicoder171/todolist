import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { HouseholdProvider, useHousehold } from "@/context/HouseholdContext";
import { RoutinesProvider, useRoutines } from "@/context/RoutinesContext";
import { FocusTimerProvider, useFocusTimer } from "@/context/FocusTimerContext";
import { FloatingFocusPill } from "@/components/FloatingFocusPill";
import { PartnerCoFocusBar } from "@/components/PartnerCoFocusBar";
import { DayTimelineRail } from "@/components/DayTimelineRail";
import { WeeklyAttendanceMatrix } from "@/components/WeeklyAttendanceMatrix";

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

describe("YPT Focus, Timeline & Attendance Components (Tickets 08, 09, 10, 11)", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <HouseholdProvider>
      <RoutinesProvider>
        <FocusTimerProvider>{children}</FocusTimerProvider>
      </RoutinesProvider>
    </HouseholdProvider>
  );

  it("renders PartnerCoFocusBar showing both Alex and Sam desks", () => {
    render(
      <TestWrapper>
        <PartnerCoFocusBar />
      </TestWrapper>
    );

    expect(screen.getByTestId("partner-cofocus-bar")).toBeInTheDocument();
    expect(screen.getByText(/Co-Focus Desks/i)).toBeInTheDocument();
    expect(screen.getByText(/Alex \(You\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Sam/i)).toBeInTheDocument();
  });

  it("renders DayTimelineRail with 24h timeline marks and collapse toggle", () => {
    render(
      <TestWrapper>
        <DayTimelineRail />
      </TestWrapper>
    );

    expect(screen.getByTestId("day-timeline-rail")).toBeInTheDocument();
    expect(screen.getByText(/24h Focus Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/6 AM/i)).toBeInTheDocument();
    expect(screen.getByText(/12 PM/i)).toBeInTheDocument();
    expect(screen.getByText(/12 AM/i)).toBeInTheDocument();
  });

  it("renders WeeklyAttendanceMatrix with M T W T F S S pills for both partners", () => {
    render(
      <TestWrapper>
        <WeeklyAttendanceMatrix />
      </TestWrapper>
    );

    expect(screen.getByTestId("weekly-attendance-matrix")).toBeInTheDocument();
    expect(screen.getByText(/Attendance & Habit Matrix/i)).toBeInTheDocument();
    // Verify M-T-W-T-F-S-S pills rendered
    const mondayPills = screen.getAllByText("M");
    expect(mondayPills.length).toBeGreaterThanOrEqual(2);
  });

  it("renders FloatingFocusPill when a session is triggered and allows pause/resume/finish", () => {
    function Starter() {
      const { startFocus } = useFocusTimer();
      return (
        <div>
          <button
            onClick={() =>
              startFocus({ id: "item-1", title: "Deep Work Coding", category: "Dev" }, "stopwatch")
            }
          >
            Launch Focus
          </button>
          <FloatingFocusPill />
        </div>
      );
    }

    render(
      <TestWrapper>
        <Starter />
      </TestWrapper>
    );

    // Before clicking, floating pill should not be visible
    expect(screen.queryByTestId("floating-focus-pill")).not.toBeInTheDocument();

    // Trigger focus
    fireEvent.click(screen.getByRole("button", { name: "Launch Focus" }));

    // Pill now rendered with active task title
    expect(screen.getByTestId("floating-focus-pill")).toBeInTheDocument();
    expect(screen.getByText("Deep Work Coding")).toBeInTheDocument();
    expect(screen.getByText("Dev")).toBeInTheDocument();

    // Pause timer
    const pauseBtn = screen.getByRole("button", { name: "Pause Timer" });
    fireEvent.click(pauseBtn);

    // Resume button appears
    const resumeBtn = screen.getByRole("button", { name: "Resume Timer" });
    expect(resumeBtn).toBeInTheDocument();
    fireEvent.click(resumeBtn);

    // Finish session
    const doneBtn = screen.getByRole("button", { name: "Finish and Save Session" });
    fireEvent.click(doneBtn);

    // Pill clears active session
    expect(screen.queryByTestId("floating-focus-pill")).not.toBeInTheDocument();
  });

  it("allows quick starting a focus session from presets in PartnerCoFocusBar", () => {
    render(
      <TestWrapper>
        <PartnerCoFocusBar />
        <FloatingFocusPill />
      </TestWrapper>
    );

    // Click "+ Focus" button on Desk 1
    const plusFocusBtn = screen.getByRole("button", { name: "+ Focus" });
    expect(plusFocusBtn).toBeInTheDocument();
    fireEvent.click(plusFocusBtn);

    // Presets popup appears
    expect(screen.getByText("Quick Start Focus")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Deep Work" })).toBeInTheDocument();

    // Click "Deep Work" preset
    fireEvent.click(screen.getByRole("button", { name: "Deep Work" }));

    // Floating pill appears with "Deep Work"
    expect(screen.getByTestId("floating-focus-pill")).toBeInTheDocument();
    expect(within(screen.getByTestId("floating-focus-pill")).getByText("Deep Work")).toBeInTheDocument();
  });

  it("renders FocusRingGoal and allows changing daily target minutes", () => {
    render(
      <TestWrapper>
        <PartnerCoFocusBar />
      </TestWrapper>
    );

    expect(screen.getByTestId("focus-ring-goal")).toBeInTheDocument();

    // Click daily focus goal button to open popover
    fireEvent.click(screen.getByRole("button", { name: "Daily focus goal" }));

    expect(screen.getByText("Set Daily Focus Goal")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "90m" })).toBeInTheDocument();

    // Change target to 90m
    fireEvent.click(screen.getByRole("button", { name: "90m" }));

    // Recheck updated target text
    expect(screen.getByText(/90m/i)).toBeInTheDocument();
  });

  it("opens StudiconModal and updates partner desk avatar", () => {
    render(
      <TestWrapper>
        <PartnerCoFocusBar />
      </TestWrapper>
    );

    // Desk 1 has avatar change button
    const avatarBtn = screen.getByRole("button", { name: "Change desk avatar" });
    expect(avatarBtn).toBeInTheDocument();
    fireEvent.click(avatarBtn);

    // Studicon modal appears
    expect(screen.getByTestId("studicon-modal")).toBeInTheDocument();
    expect(screen.getByText("Select Desk Studicon")).toBeInTheDocument();

    // Click cozy kitten avatar 🐱
    const catOption = screen.getByRole("button", { name: /🐱/i });
    fireEvent.click(catOption);

    // Modal closes and desk reflects new avatar
    expect(screen.queryByTestId("studicon-modal")).not.toBeInTheDocument();
    expect(avatarBtn).toHaveTextContent("🐱");
  });

  it("allows switching ambient focus noise and volume in FloatingFocusPill", () => {
    function AudioStarter() {
      const { startFocus } = useFocusTimer();
      return (
        <div>
          <button onClick={() => startFocus({ id: "t-audio", title: "Study Audio" })}>
            Launch
          </button>
          <FloatingFocusPill />
        </div>
      );
    }

    render(
      <TestWrapper>
        <AudioStarter />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole("button", { name: "Launch" }));

    // Click audio controls button
    const audioBtn = screen.getByRole("button", { name: "Ambient Sound and Chimes" });
    fireEvent.click(audioBtn);

    expect(screen.getByText("Focus Audio & Noise")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "🌧️ Rain" })).toBeInTheDocument();

    // Select Rain sound
    fireEvent.click(screen.getByRole("button", { name: "🌧️ Rain" }));

    // Volume slider renders
    expect(screen.getByText("Volume")).toBeInTheDocument();
  });

  it("supports mode switching between pomodoro targets and stopwatch in FloatingFocusPill (Ticket 19)", () => {
    function SwitcherDemo() {
      const { startFocus } = useFocusTimer();
      return (
        <div>
          <button
            onClick={() =>
              startFocus({ id: "t-switch", title: "Review Chemistry" }, "pomodoro", 25)
            }
          >
            Start Pomodoro
          </button>
          <FloatingFocusPill />
        </div>
      );
    }

    render(
      <TestWrapper>
        <SwitcherDemo />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole("button", { name: "Start Pomodoro" }));

    // Click mode switch trigger
    const modeTrigger = screen.getByRole("button", { name: /switch timer mode/i });
    fireEvent.click(modeTrigger);

    expect(screen.getByText("Mode & Duration")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "45m" })).toBeInTheDocument();

    // Select 45m preset
    fireEvent.click(screen.getByRole("button", { name: "45m" }));

    // Verify timer updated to 45:00
    const pill = screen.getByTestId("floating-focus-pill");
    expect(within(pill).getByText("45:00")).toBeInTheDocument();

    // Switch to Open Stopwatch
    fireEvent.click(screen.getByRole("button", { name: /switch timer mode/i }));
    fireEvent.click(screen.getByRole("button", { name: /open stopwatch/i }));

    expect(within(pill).getByText("Focus")).toBeInTheDocument();
  });

  it("provides Complete button for linked tasks and auto-completes item on finish (Ticket 17)", () => {
    function LinkedFinishDemo() {
      const { startFocus } = useFocusTimer();
      const { isCompleted } = useRoutines();
      const { selectedDate } = useHousehold();

      return (
        <div>
          <button
            onClick={() =>
              startFocus({
                id: "routine-5",
                title: "Evening walk together in park",
                type: "routine",
                category: "Household",
              })
            }
          >
            Focus Routine
          </button>
          <div data-testid="routine-status">
            {isCompleted("routine-5", selectedDate) ? "DONE" : "PENDING"}
          </div>
          <FloatingFocusPill />
        </div>
      );
    }

    render(
      <TestWrapper>
        <LinkedFinishDemo />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole("button", { name: "Focus Routine" }));

    // Routine is initially pending
    expect(screen.getByTestId("routine-status")).toHaveTextContent("PENDING");

    // Complete button is displayed for linked routine
    const completeBtn = screen.getByRole("button", { name: "Finish and Complete Task" });
    expect(completeBtn).toBeInTheDocument();

    // Click Complete
    fireEvent.click(completeBtn);

    // Verify routine status marked DONE
    expect(screen.getByTestId("routine-status")).toHaveTextContent("DONE");
    // Verify toast summary appears
    expect(screen.getByText(/✨ Logged/)).toBeInTheDocument();
  });
});
