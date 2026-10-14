import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { HouseholdProvider } from "@/context/HouseholdContext";
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
});
