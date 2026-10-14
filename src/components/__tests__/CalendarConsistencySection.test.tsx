import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HouseholdProvider, useHousehold } from "@/context/HouseholdContext";
import { RoutinesProvider } from "@/context/RoutinesContext";
import { DailyTasksProvider } from "@/context/DailyTasksContext";
import { KanbanProvider } from "@/context/KanbanContext";
import { CalendarConsistencySection } from "@/components/CalendarConsistencySection";

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <HouseholdProvider>
      <RoutinesProvider>
        <DailyTasksProvider>
          <KanbanProvider>
            {children}
            <ActiveDateConsumer />
          </KanbanProvider>
        </DailyTasksProvider>
      </RoutinesProvider>
    </HouseholdProvider>
  );
}

function ActiveDateConsumer() {
  const { selectedDate, isFreezeDay } = useHousehold();
  return (
    <div data-testid="consumer-info">
      <span data-testid="selected-day">{selectedDate.getDate()}</span>
      <span data-testid="is-frozen">{isFreezeDay ? "frozen" : "active"}</span>
    </div>
  );
}

describe("CalendarConsistencySection (Seam: Ticket 05 Calendar & Dials)", () => {
  it("renders the interactive calendar with month header and legend", () => {
    render(
      <TestWrapper>
        <CalendarConsistencySection />
      </TestWrapper>
    );

    expect(screen.getByText(/October 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Done/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
    expect(screen.getByText(/Freeze Day/i)).toBeInTheDocument();
  });

  it("navigates months when clicking next and previous buttons", () => {
    render(
      <TestWrapper>
        <CalendarConsistencySection />
      </TestWrapper>
    );

    const nextBtn = screen.getByRole("button", { name: "Next month" });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/November 2026/i)).toBeInTheDocument();

    const prevBtn = screen.getByRole("button", { name: "Previous month" });
    fireEvent.click(prevBtn);

    expect(screen.getByText(/October 2026/i)).toBeInTheDocument();
  });

  it("selects a calendar date when clicked and updates app state", () => {
    render(
      <TestWrapper>
        <CalendarConsistencySection />
      </TestWrapper>
    );

    // Click day 20 in October 2026
    const day20Btn = screen.getByRole("button", { name: "Day 20" });
    fireEvent.click(day20Btn);

    expect(screen.getByTestId("selected-day")).toHaveTextContent("20");
  });

  it("renders weekly habit progress bars with 7-segments", () => {
    render(
      <TestWrapper>
        <CalendarConsistencySection />
      </TestWrapper>
    );

    expect(screen.getByText(/This Week Habits/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("segment-bar").length).toBeGreaterThan(0);
  });

  it("renders consistency dials and handles Couple Momentum cheer", () => {
    render(
      <TestWrapper>
        <CalendarConsistencySection />
      </TestWrapper>
    );

    expect(screen.getByText(/Consistency Dials/i)).toBeInTheDocument();
    expect(screen.getByText(/Couple Momentum/i)).toBeInTheDocument();

    const cheerBtn = screen.getByRole("button", { name: /Cheer/i });
    fireEvent.click(cheerBtn);

    expect(screen.getByText(/Cheered!/i)).toBeInTheDocument();
  });
});
