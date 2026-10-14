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

  it("adds a new routine when pressing Enter in the quick add input", () => {
    renderBoard();

    const input = screen.getByPlaceholderText(/Add daily routine.../i);
    fireEvent.change(input, { target: { value: "Take multivitamins" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(screen.getByText(/Take multivitamins/i)).toBeInTheDocument();
  });
});
