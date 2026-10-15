import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { HouseholdProvider, useHousehold } from "@/context/HouseholdContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CircleOnboardingModal } from "../CircleOnboardingModal";
import { Header } from "../Header";

describe("Circle Onboarding & Auth Gating", () => {
  it("does NOT auto-open CircleOnboardingModal when user is not logged in", () => {
    render(
      <AuthProvider>
        <HouseholdProvider>
          <CircleOnboardingModal />
        </HouseholdProvider>
      </AuthProvider>
    );

    // Modal should NOT be visible
    expect(screen.queryByText(/Account Required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Welcome to Couple Task Hub/i)).not.toBeInTheDocument();
  });

  it("shows 'Account Required' screen when opened while not authenticated", () => {
    render(
      <AuthProvider>
        <HouseholdProvider>
          <CircleOnboardingModal isOpen={true} />
        </HouseholdProvider>
      </AuthProvider>
    );

    expect(screen.getByText(/Account Required/i)).toBeInTheDocument();
    expect(screen.getByText(/Having an account ensures your couple circle and tasks stay in sync/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Register with Gmail/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In with Username/i })).toBeInTheDocument();
  });

  it("header mobile and desktop Join Circle buttons trigger register modal when logged out", () => {
    function TestWrapper() {
      const { isAuthModalOpen, authModalMode } = useAuth();
      return (
        <div>
          <Header
            dashboardFocus="all"
            onDashboardFocusChange={() => {}}
            onOpenWishlist={() => {}}
          />
          {isAuthModalOpen && <div data-testid="auth-modal-open">{authModalMode}</div>}
        </div>
      );
    }

    render(
      <AuthProvider>
        <HouseholdProvider>
          <TestWrapper />
        </HouseholdProvider>
      </AuthProvider>
    );

    // Find desktop Join Circle button
    const joinButtons = screen.getAllByRole("button", { name: /Join Circle/i });
    expect(joinButtons.length).toBeGreaterThan(0);

    // Click first join button (mobile or desktop)
    fireEvent.click(joinButtons[0]);

    // Should open auth modal in register mode
    expect(screen.getByTestId("auth-modal-open")).toHaveTextContent("register");
  });
});
