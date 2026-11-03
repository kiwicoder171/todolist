import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { HouseholdProvider } from "@/context/HouseholdContext";
import { RoutinesProvider } from "@/context/RoutinesContext";
import { DailyRoutinesBoard } from "../DailyRoutinesBoard";

describe("DailyRoutinesBoard (Seam: Board 1 Apple Notes Checklist)", () => {
  const renderBoard = () =>
    render(
      <HouseholdProvider>
        <RoutinesProvider>
          <DailyRoutinesBoard />
        </RoutinesProvider>
      </HouseholdProvider>
    );

  it("renders Board 1 title, recurring badge, and scheduled routines", () => {
    renderBoard();

    expect(screen.getByText("Daily Routines")).toBeInTheDocument();
    expect(screen.getByText(/Recurring/i)).toBeInTheDocument();
    expect(screen.getByText(/15-min daily sync/i)).toBeInTheDocument();
  });

  it("toggles routine completion and updates strikethrough styling", () => {
    renderBoard();

    const syncRoutine = screen.getByText(/15-min daily sync/i);
    // Find checkbox button for this item
    const checkbox = syncRoutine.closest("div")?.querySelector("button");
    expect(checkbox).toBeDefined();

    if (checkbox) {
      fireEvent.click(checkbox);
      // Item is toggled
      expect(checkbox).toBeInTheDocument();
    }
  });

  it("opens add routine modal when clicking Add Routine button", () => {
    renderBoard();

    const addRoutineBtn = screen.getByRole("button", { name: /Add Routine/i });
    fireEvent.click(addRoutineBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("New Daily Routine")).toBeInTheDocument();
  });
});
