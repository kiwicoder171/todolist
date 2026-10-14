import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { HouseholdProvider } from "@/context/HouseholdContext";
import { DailyTasksProvider } from "@/context/DailyTasksContext";
import { DailyTasksBoard } from "../DailyTasksBoard";

describe("DailyTasksBoard (Seam: Board 2 Daily Tasks & Rollover UI)", () => {
  const renderBoard = () =>
    render(
      <HouseholdProvider>
        <DailyTasksProvider>
          <DailyTasksBoard />
        </DailyTasksProvider>
      </HouseholdProvider>
    );

  it("renders Board 2 title, immediate badge, and tasks", () => {
    renderBoard();

    expect(screen.getByText("Daily Tasks")).toBeInTheDocument();
    expect(screen.getByText(/Immediate/i)).toBeInTheDocument();
    expect(screen.getByText(/Call plumber/i)).toBeInTheDocument();
  });

  it("renders rollover badge for tasks rolled over from past dates", () => {
    renderBoard();

    // The dry cleaning task originated on Oct 13 and is rolled over to Oct 14
    expect(screen.getByText(/Rolled from 2026-10-13/i)).toBeInTheDocument();
  });

  it("adds a new daily task when pressing Enter in the quick add input", () => {
    renderBoard();

    const input = screen.getByPlaceholderText(/What gotta finish today/i);
    fireEvent.change(input, { target: { value: "Buy milk and eggs" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(screen.getByText(/Buy milk and eggs/i)).toBeInTheDocument();
  });

  it("opens the detail drawer when clicking a task card", () => {
    renderBoard();

    const taskTitle = screen.getByText(/Call plumber/i);
    fireEvent.click(taskTitle);

    // Detail drawer opens with Task Details header and notes field
    expect(screen.getByText("Task Details")).toBeInTheDocument();
    expect(screen.getByLabelText(/Task Title/i)).toHaveValue(
      "Call plumber for slow kitchen drain"
    );
  });
});
