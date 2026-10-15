import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { HouseholdProvider } from "@/context/HouseholdContext";
import { AuthContext } from "@/context/AuthContext";
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

  it("removes all mock tasks, mock streak/points, and 'Alex & Sam' names when user logs in without a circle", () => {
    const mockAuthValue = {
      user: {
        uid: "user-123",
        username: "kiwicoder",
        email: "kiwi@example.com",
        circleId: null,
      },
      firebaseUser: null,
      loading: false,
      isConfigured: true,
      register: async () => {},
      login: async () => {},
      signInWithGoogle: async () => {},
      logout: async () => {},
      updateUserCircle: async () => {},
      isAuthModalOpen: false,
      setIsAuthModalOpen: () => {},
      authModalMode: "login" as const,
      openAuthModal: () => {},
      closeAuthModal: () => {},
    };

    render(
      <AuthContext.Provider value={mockAuthValue}>
        <HouseholdProvider>
          <RoutinesProvider>
            <DailyTasksProvider>
              <KanbanProvider>
                <CoupleTaskHubApp forcedIsMobile={false} />
              </KanbanProvider>
            </DailyTasksProvider>
          </RoutinesProvider>
        </HouseholdProvider>
      </AuthContext.Provider>
    );

    // 1. Header space title should be the user's space, NOT Alex & Sam
    expect(screen.getByText("kiwicoder's Space")).toBeInTheDocument();
    expect(screen.queryByText(/Alex & Sam's Space/i)).not.toBeInTheDocument();

    // 2. Active partner badge should show @kiwicoder and NOT buttons for Alex or Sam
    expect(screen.getAllByText("@kiwicoder").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByRole("button", { name: /^Alex$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Sam$/i })).not.toBeInTheDocument();

    // 3. FilterBar should show Partner's, NOT Sam's
    expect(screen.queryByRole("button", { name: /Sam's/i })).not.toBeInTheDocument();

    // 4. Streaks & Points should be 0, NOT mock numbers (12 PTS / 4 DAYS)
    expect(screen.getByText(/0 DAYS/i)).toBeInTheDocument();
    expect(screen.getByText(/0 PTS/i)).toBeInTheDocument();
    expect(screen.queryByText(/4 DAYS/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/12 PTS/i)).not.toBeInTheDocument();

    // 5. All mock tasks across the 3 boards should be GONE
    expect(screen.queryByText(/15-min daily sync & check-in/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Pick up dry cleaning & winter coats/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Research Hakone onsens & ryokan/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Replace living room light dimmer/i)).not.toBeInTheDocument();
  });
});

