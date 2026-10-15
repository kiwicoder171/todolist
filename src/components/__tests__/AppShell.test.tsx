import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { HouseholdProvider } from "@/context/HouseholdContext";
import { RoutinesProvider } from "@/context/RoutinesContext";
import { DailyTasksProvider } from "@/context/DailyTasksContext";
import { KanbanProvider } from "@/context/KanbanContext";
import { CoupleTaskHubApp } from "../CoupleTaskHubApp";
import { Header } from "../Header";
import { FilterBar } from "../FilterBar";

describe("App Shell Components (Seam: Header & FilterBar)", () => {
  it("renders brand title, partner switcher, and streak counter", () => {
    render(
      <HouseholdProvider>
        <Header
          viewMode="desktop"
          onViewModeChange={() => {}}
          dashboardFocus="all"
          onDashboardFocusChange={() => {}}
          onOpenWishlist={() => {}}
        />
      </HouseholdProvider>
    );

    expect(screen.getByText("Couple Task Hub")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Alex/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sam/i })).toBeInTheDocument();
    expect(screen.getByText(/4 DAYS/i)).toBeInTheDocument();
    expect(screen.getByText(/12 PTS/i)).toBeInTheDocument();
  });

  it("switches partner identity when clicking partner button in header", () => {
    render(
      <HouseholdProvider>
        <Header
          viewMode="desktop"
          onViewModeChange={() => {}}
          dashboardFocus="all"
          onDashboardFocusChange={() => {}}
          onOpenWishlist={() => {}}
        />
      </HouseholdProvider>
    );

    const samBtn = screen.getByRole("button", { name: /Sam/i });
    fireEvent.click(samBtn);

    // After clicking Sam, Sam's points (9 PTS) and streak (2 DAYS) are displayed
    expect(screen.getByText(/2 DAYS/i)).toBeInTheDocument();
    expect(screen.getByText(/9 PTS/i)).toBeInTheDocument();
  });

  it("renders filter bar with assignee toggles and freeze day toggle", () => {
    render(
      <HouseholdProvider>
        <FilterBar />
      </HouseholdProvider>
    );

    expect(screen.getByRole("button", { name: /All Items/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Mine/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sam's/i })).toBeInTheDocument();

    const freezeBtn = screen.getByRole("button", { name: /Freeze \/ Rest Day/i });
    expect(freezeBtn).toHaveTextContent("Off");

    fireEvent.click(freezeBtn);
    expect(freezeBtn).toHaveTextContent("ON");
  });

  it("renders mock tasks for all three boards and mock points/streak before user login", () => {
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

    // Mock Streak and Points in Header
    expect(screen.getByText(/4 DAYS/i)).toBeInTheDocument();
    expect(screen.getByText(/12 PTS/i)).toBeInTheDocument();

    // Board 1: Daily Routines mock tasks
    expect(screen.getAllByText(/15-min daily sync & check-in/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tidy kitchen & living room together/i).length).toBeGreaterThan(0);

    // Board 2: Daily Tasks mock tasks
    expect(screen.getByText(/Pick up dry cleaning & winter coats/i)).toBeInTheDocument();
    expect(screen.getByText(/Call plumber for slow kitchen drain/i)).toBeInTheDocument();

    // Board 3: Kanban mock cards
    expect(screen.getByText(/Research Hakone onsens & ryokan/i)).toBeInTheDocument();
    expect(screen.getByText(/Replace living room light dimmer/i)).toBeInTheDocument();
  });
});
