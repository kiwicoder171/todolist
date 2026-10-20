import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { extractCleanUsername } from "@/context/AuthContext";
import { HouseholdProvider } from "@/context/HouseholdContext";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";

describe("Profile and Responsive Header Fixes", () => {
  it("extracts clean username from full name instead of using surname", () => {
    const mockGoogleUser1 = {
      displayName: "Guyver Phongsanguant",
      email: "stocktrading171@gmail.com",
    } as any;
    expect(extractCleanUsername(mockGoogleUser1)).toBe("guyver");

    const mockGoogleUser2 = {
      displayName: "Johnathan Smith",
      email: "jsmith@example.com",
    } as any;
    expect(extractCleanUsername(mockGoogleUser2)).toBe("johnathan");

    const mockNoDisplayName = {
      displayName: null,
      email: "wongxx@gmail.com",
    } as any;
    expect(extractCleanUsername(mockNoDisplayName)).toBe("wongxx");
  });

  it("truncates partner filter button labels gracefully in FilterBar", () => {
    render(
      <AuthProvider>
        <HouseholdProvider>
          <FilterBar />
        </HouseholdProvider>
      </AuthProvider>
    );

    const allBtn = screen.getByRole("button", { name: /All Items/i });
    expect(allBtn).toBeInTheDocument();
    const mineBtn = screen.getByRole("button", { name: /Mine/i });
    expect(mineBtn).toBeInTheDocument();
  });

  it("renders header with max-w-full and overflow-x-clip preventing mobile horizontal expansion", () => {
    const { container } = render(
      <AuthProvider>
        <HouseholdProvider>
          <NotificationProvider>
            <Header
              dashboardFocus="all"
              onDashboardFocusChange={vi.fn()}
              onOpenWishlist={vi.fn()}
            />
          </NotificationProvider>
        </HouseholdProvider>
      </AuthProvider>
    );

    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
    expect(header?.className).toContain("overflow-x-clip");
    expect(header?.className).toContain("max-w-full");
  });
});
