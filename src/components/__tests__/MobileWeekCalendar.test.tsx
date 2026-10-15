import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HouseholdProvider } from "@/context/HouseholdContext";
import { RoutinesProvider } from "@/context/RoutinesContext";
import { DailyTasksProvider } from "@/context/DailyTasksContext";
import { MobileWeekCalendar } from "@/components/MobileWeekCalendar";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <HouseholdProvider>
      <RoutinesProvider>
        <DailyTasksProvider>{ui}</DailyTasksProvider>
      </RoutinesProvider>
    </HouseholdProvider>
  );
}

describe("MobileWeekCalendar (7-Day Week Calendar Strip)", () => {
  it("renders all 7 days of the current week (MON to SUN) with date numbers", () => {
    renderWithProviders(<MobileWeekCalendar />);

    // Week containing Oct 14, 2026 starts on Monday Oct 12 and ends on Sunday Oct 18
    expect(screen.getByText("MON")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();

    expect(screen.getByText("TUE")).toBeInTheDocument();
    expect(screen.getByText("13")).toBeInTheDocument();

    expect(screen.getByText("WED")).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();

    expect(screen.getByText("THU")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();

    expect(screen.getByText("FRI")).toBeInTheDocument();
    expect(screen.getByText("16")).toBeInTheDocument();

    expect(screen.getByText("SAT")).toBeInTheDocument();
    expect(screen.getByText("17")).toBeInTheDocument();

    expect(screen.getByText("SUN")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
  });

  it("marks Wednesday 14 as the default active/selected day", () => {
    renderWithProviders(<MobileWeekCalendar />);

    const wedButton = screen.getByRole("button", { name: /Wed 14/i });
    expect(wedButton).toHaveAttribute("aria-pressed", "true");
  });

  it("changes selected day when tapping a different day card (e.g. Thursday 15)", () => {
    renderWithProviders(<MobileWeekCalendar />);

    const thuButton = screen.getByRole("button", { name: /Thu 15/i });
    fireEvent.click(thuButton);

    expect(thuButton).toHaveAttribute("aria-pressed", "true");
    const wedButton = screen.getByRole("button", { name: /Wed 14/i });
    expect(wedButton).toHaveAttribute("aria-pressed", "false");
  });

  it("navigates weeks using previous and next week buttons", () => {
    renderWithProviders(<MobileWeekCalendar />);

    const prevWeekBtn = screen.getByRole("button", { name: /Previous week/i });
    fireEvent.click(prevWeekBtn);

    // Previous week starts on Monday Oct 5
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();

    const nextWeekBtn = screen.getByRole("button", { name: /Next week/i });
    // Go forward twice to get to Oct 19 - 25
    fireEvent.click(nextWeekBtn);
    fireEvent.click(nextWeekBtn);

    expect(screen.getByText("19")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("snaps back to today when clicking the Today button", () => {
    renderWithProviders(<MobileWeekCalendar />);

    // Click next week
    const nextWeekBtn = screen.getByRole("button", { name: /Next week/i });
    fireEvent.click(nextWeekBtn);

    // Today button should now be visible
    const todayBtn = screen.getByRole("button", { name: /Today/i });
    fireEvent.click(todayBtn);

    // Oct 14 should be back in view and selected
    const wedButton = screen.getByRole("button", { name: /Wed 14/i });
    expect(wedButton).toHaveAttribute("aria-pressed", "true");
  });
});
