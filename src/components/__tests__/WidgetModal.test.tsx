import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { WidgetModal } from "../WidgetModal";
import { HouseholdProvider } from "@/context/HouseholdContext";
import { RoutinesProvider } from "@/context/RoutinesContext";
import { DailyTasksProvider } from "@/context/DailyTasksContext";

describe("WidgetModal (Seam: Home Screen Widgets UI)", () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <HouseholdProvider>
        <RoutinesProvider>
          <DailyTasksProvider>{ui}</DailyTasksProvider>
        </RoutinesProvider>
      </HouseholdProvider>
    );
  };

  it("does not render when isOpen is false", () => {
    const { container } = renderWithProviders(
      <WidgetModal isOpen={false} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders modal header and widget size tabs when isOpen is true", () => {
    renderWithProviders(<WidgetModal isOpen={true} onClose={() => {}} />);

    expect(screen.getByText("Home Screen Widgets")).toBeInTheDocument();
    expect(screen.getByText(/home screen routines, tasks & streak tracker/i)).toBeInTheDocument();
    expect(screen.getByText("Small (2×2)")).toBeInTheDocument();
    expect(screen.getByText("Medium (4×2)")).toBeInTheDocument();
    expect(screen.getByText("Large (4×4)")).toBeInTheDocument();
  });

  it("allows switching widget sizes", () => {
    renderWithProviders(<WidgetModal isOpen={true} onClose={() => {}} />);

    // Click Small tab
    fireEvent.click(screen.getByText("Small (2×2)"));
    expect(screen.getByText("Hub Streak")).toBeInTheDocument();

    // Click Large tab
    fireEvent.click(screen.getByText("Large (4×4)"));
    expect(screen.getByText(/Household Hub/i)).toBeInTheDocument();
  });

  it("switches to install guide tab", () => {
    renderWithProviders(<WidgetModal isOpen={true} onClose={() => {}} />);

    const installTab = screen.getByText(/Install \/ Add to Screen Guide/i);
    fireEvent.click(installTab);

    expect(screen.getByText(/iOS \(iPhone & iPad\) Home Screen/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Android Home Screen/i)[0]).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    renderWithProviders(<WidgetModal isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByLabelText("Close widget modal");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
