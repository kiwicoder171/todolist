import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HouseholdProvider } from "@/context/HouseholdContext";
import { RoutinesProvider } from "@/context/RoutinesContext";
import { DailyTasksProvider } from "@/context/DailyTasksContext";
import { KanbanProvider } from "@/context/KanbanContext";
import { KanbanBoard } from "@/components/KanbanBoard";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <HouseholdProvider>
      <RoutinesProvider>
        <DailyTasksProvider>
          <KanbanProvider>{ui}</KanbanProvider>
        </DailyTasksProvider>
      </RoutinesProvider>
    </HouseholdProvider>
  );
}

describe("KanbanBoard (Seam: Board 3 Unified 3-Column Vertical Kanban UI)", () => {
  it("renders the 3 vertical columns with headers and count pills", () => {
    renderWithProviders(<KanbanBoard />);

    expect(screen.getByRole("heading", { name: /Kanban Board/i })).toBeInTheDocument();
    expect(screen.getByText(/3 Vertical Columns/i)).toBeInTheDocument();

    // Headers of the 3 columns
    expect(screen.getByRole("heading", { name: /^To Do$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^In Progress$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Done$/i })).toBeInTheDocument();

    // Category filter pills
    expect(screen.getByRole("button", { name: /^All$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Travel/i })).toBeInTheDocument();
  });

  it("filters cards when clicking category filter pills", () => {
    renderWithProviders(<KanbanBoard />);

    // Initially Tokyo travel card is present
    expect(screen.getByText(/Book flight tickets to Tokyo/i)).toBeInTheDocument();

    // Click Home filter
    fireEvent.click(screen.getByRole("button", { name: /Home/i }));

    // Tokyo flight card should not be visible in Home category
    expect(screen.queryByText(/Book flight tickets to Tokyo/i)).not.toBeInTheDocument();
    // Home card should be visible
    expect(screen.getByText(/Replace living room light dimmer/i)).toBeInTheDocument();
  });

  it("moves a card from To Do to In Progress using the action button", () => {
    renderWithProviders(<KanbanBoard />);

    // Find "Start ➔" button on a To Do card
    const startButtons = screen.getAllByRole("button", { name: /Start/i });
    expect(startButtons.length).toBeGreaterThan(0);

    fireEvent.click(startButtons[0]);

    // Check that Done/Back buttons exist in In Progress
    expect(screen.getAllByRole("button", { name: /Done/i }).length).toBeGreaterThan(0);
  });

  it("toggles Plan Today / Do Today on a Kanban card", () => {
    renderWithProviders(<KanbanBoard />);

    // card-202 has doToday: true initially
    expect(screen.getByText(/⚡ Do Today/i)).toBeInTheDocument();

    // Find a card with "Plan Today"
    const planTodayBtn = screen.getAllByRole("button", { name: /Plan Today/i })[0];
    fireEvent.click(planTodayBtn);

    // Now there should be another "⚡ Do Today"
    expect(screen.getAllByText(/⚡ Do Today/i).length).toBeGreaterThan(1);
  });
});
