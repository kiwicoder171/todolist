import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HouseholdProvider } from "@/context/HouseholdContext";
import { RoutinesProvider, useRoutines } from "@/context/RoutinesContext";
import { AddRoutineModal, detectFrequency } from "../AddRoutineModal";

describe("detectFrequency (Smart Auto-Detection)", () => {
  it("detects all 7 days as daily", () => {
    const res = detectFrequency([0, 1, 2, 3, 4, 5, 6]);
    expect(res.frequency).toBe("daily");
    expect(res.badge).toContain("Daily");
  });

  it("detects Monday through Friday as weekdays", () => {
    const res = detectFrequency([1, 2, 3, 4, 5]);
    expect(res.frequency).toBe("weekdays");
    expect(res.badge).toContain("Weekdays");
  });

  it("detects Saturday and Sunday as weekends", () => {
    const res = detectFrequency([0, 6]);
    expect(res.frequency).toBe("weekends");
    expect(res.badge).toContain("Weekends");
  });

  it("detects custom days like Monday and Friday as custom array [1, 5]", () => {
    const res = detectFrequency([1, 5]);
    expect(res.frequency).toEqual([1, 5]);
    expect(res.badge).toContain("Mon, Fri");
  });

  it("handles Mon, Wed, Fri custom combination", () => {
    const res = detectFrequency([1, 3, 5]);
    expect(res.frequency).toEqual([1, 3, 5]);
    expect(res.badge).toContain("Mon, Wed, Fri");
  });
});

describe("AddRoutineModal UI & Interactions", () => {
  function ConsumerComponent() {
    const { routines } = useRoutines();
    return (
      <div data-testid="routine-count">
        {routines.map((r) => (
          <span key={r.id} data-testid={`routine-${r.id}`}>
            {r.title} ({typeof r.frequency === "string" ? r.frequency : r.frequency.join(",")})
          </span>
        ))}
      </div>
    );
  }

  it("opens modal, allows toggling specific days like Monday and Friday, and creates routine", () => {
    const handleClose = vi.fn();

    render(
      <HouseholdProvider>
        <RoutinesProvider>
          <AddRoutineModal isOpen={true} onClose={handleClose} />
          <ConsumerComponent />
        </RoutinesProvider>
      </HouseholdProvider>
    );

    // Dialog should be visible
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("New Daily Routine")).toBeInTheDocument();

    // Type title: "Clean room"
    const input = screen.getByPlaceholderText(/e\.g\. Clean my room/i);
    fireEvent.change(input, { target: { value: "Clean room" } });

    // Click "Weekdays" preset first
    const weekdaysPreset = screen.getByRole("button", { name: /^Weekdays$/i });
    fireEvent.click(weekdaysPreset);
    expect(screen.getByText(/Weekdays \(Mon-Fri\)/i)).toBeInTheDocument();

    // Now deselect Tuesday (2), Wednesday (3), Thursday (4) to leave only Monday (1) and Friday (5)
    fireEvent.click(screen.getByRole("button", { name: "Tuesday" }));
    fireEvent.click(screen.getByRole("button", { name: "Wednesday" }));
    fireEvent.click(screen.getByRole("button", { name: "Thursday" }));

    // Check auto-detected badge shows Mon, Fri
    expect(screen.getByText(/Custom \(Mon, Fri\)/i)).toBeInTheDocument();

    // Submit form
    const saveBtn = screen.getByRole("button", { name: /Save Routine/i });
    fireEvent.click(saveBtn);

    // Verify modal called onClose
    expect(handleClose).toHaveBeenCalled();

    // Verify new routine created with frequency [1, 5]
    expect(screen.getByText(/Clean room \(1,5\)/i)).toBeInTheDocument();
  });

  it("auto-detects Everyday (daily) when all 7 days preset is clicked", () => {
    render(
      <HouseholdProvider>
        <RoutinesProvider>
          <AddRoutineModal isOpen={true} onClose={vi.fn()} />
        </RoutinesProvider>
      </HouseholdProvider>
    );

    // Click All preset
    const allBtn = screen.getByRole("button", { name: /^All$/i });
    fireEvent.click(allBtn);

    expect(screen.getByText(/Daily \(Everyday\)/i)).toBeInTheDocument();
  });

  it("auto-detects Weekends when weekends preset is clicked", () => {
    render(
      <HouseholdProvider>
        <RoutinesProvider>
          <AddRoutineModal isOpen={true} onClose={vi.fn()} />
        </RoutinesProvider>
      </HouseholdProvider>
    );

    // Click Weekends preset
    const weekendsBtn = screen.getByRole("button", { name: /^Weekends$/i });
    fireEvent.click(weekendsBtn);

    expect(screen.getByText(/Weekends \(Sat-Sun\)/i)).toBeInTheDocument();
  });

  it("closes when pressing the Escape key", () => {
    const handleClose = vi.fn();
    render(
      <HouseholdProvider>
        <RoutinesProvider>
          <AddRoutineModal isOpen={true} onClose={handleClose} />
        </RoutinesProvider>
      </HouseholdProvider>
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
