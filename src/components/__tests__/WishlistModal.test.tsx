import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HouseholdProvider, useHousehold } from "@/context/HouseholdContext";
import { WishlistModal } from "@/components/WishlistModal";

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <HouseholdProvider>
      {children}
      <ScoreConsumer />
    </HouseholdProvider>
  );
}

function ScoreConsumer() {
  const { activePartner, scores } = useHousehold();
  return <div data-testid="live-points">{scores[activePartner].points}</div>;
}

describe("WishlistModal (Seam: Ticket 06 Couple Reward Wishlist)", () => {
  it("renders reward items with PTS costs and current score", () => {
    render(
      <TestWrapper>
        <WishlistModal isOpen={true} onClose={() => {}} />
      </TestWrapper>
    );

    expect(screen.getByText(/Couple Wishlist Shop/i)).toBeInTheDocument();
    expect(screen.getByText(/Cook Favorite Dinner/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "10 PTS" })).toBeInTheDocument();
  });

  it("redeems a reward and deducts points from the partner's balance", () => {
    render(
      <TestWrapper>
        <WishlistModal isOpen={true} onClose={() => {}} />
      </TestWrapper>
    );

    // Initial points for Alex is 12
    expect(screen.getByTestId("live-points")).toHaveTextContent("12");

    // Click 10 PTS reward
    fireEvent.click(screen.getByRole("button", { name: "10 PTS" }));

    // Points should now be 2
    expect(screen.getByTestId("live-points")).toHaveTextContent("2");
    expect(screen.getByText(/Redeemed "Cook Favorite Dinner/i)).toBeInTheDocument();
  });

  it("allows balance to drop into negative numbers when redeeming higher cost reward", () => {
    render(
      <TestWrapper>
        <WishlistModal isOpen={true} onClose={() => {}} />
      </TestWrapper>
    );

    // Alex has 12 pts. Click 15 PTS reward (Back Massage)
    fireEvent.click(screen.getByRole("button", { name: "15 PTS" }));

    // 12 - 15 = -3
    expect(screen.getByTestId("live-points")).toHaveTextContent("-3");
  });

  it("allows adding a custom couple reward", () => {
    render(
      <TestWrapper>
        <WishlistModal isOpen={true} onClose={() => {}} />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText(/Add Custom Couple Reward/i));

    fireEvent.change(screen.getByPlaceholderText(/Foot massage/i), {
      target: { value: "Weekend Road Trip 🚗" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: "Drive to the coast and get seafood" },
    });
    fireEvent.change(screen.getByPlaceholderText(/PTS/i), {
      target: { value: "30" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Reward" }));

    expect(screen.getByText(/Weekend Road Trip/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "30 PTS" })).toBeInTheDocument();
  });
});
