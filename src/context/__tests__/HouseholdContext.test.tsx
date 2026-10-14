import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import {
  HouseholdProvider,
  useHousehold,
  matchesAssigneeFilter,
} from "../HouseholdContext";

describe("HouseholdContext & Assignee Filter (Seam: Household State)", () => {
  it("provides default household state with active partner and assignee filter", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HouseholdProvider>{children}</HouseholdProvider>
    );

    const { result } = renderHook(() => useHousehold(), { wrapper });

    expect(result.current.activePartner).toBe("alex");
    expect(result.current.assigneeFilter).toBe("all");
    expect(result.current.selectedDate).toBeDefined();
    expect(result.current.isFreezeDay).toBe(false);
  });

  it("allows switching active partner and updates identity", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HouseholdProvider>{children}</HouseholdProvider>
    );

    const { result } = renderHook(() => useHousehold(), { wrapper });

    act(() => {
      result.current.setActivePartner("sam");
    });

    expect(result.current.activePartner).toBe("sam");
  });

  it("allows changing assignee filter", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HouseholdProvider>{children}</HouseholdProvider>
    );

    const { result } = renderHook(() => useHousehold(), { wrapper });

    act(() => {
      result.current.setAssigneeFilter("mine");
    });
    expect(result.current.assigneeFilter).toBe("mine");

    act(() => {
      result.current.setAssigneeFilter("partner");
    });
    expect(result.current.assigneeFilter).toBe("partner");
  });

  describe("matchesAssigneeFilter domain logic", () => {
    it("returns true for all items when filter is 'all'", () => {
      expect(matchesAssigneeFilter("mine", "alex", "all")).toBe(true);
      expect(matchesAssigneeFilter("partner", "alex", "all")).toBe(true);
      expect(matchesAssigneeFilter("both", "alex", "all")).toBe(true);
    });

    it("matches personal and shared items when filter is 'mine'", () => {
      // When Alex is viewing 'mine'
      expect(matchesAssigneeFilter("mine", "alex", "mine")).toBe(true);
      expect(matchesAssigneeFilter("both", "alex", "mine")).toBe(true);
      expect(matchesAssigneeFilter("partner", "alex", "mine")).toBe(false);
    });

    it("matches partner's and shared items when filter is 'partner'", () => {
      // When Alex is viewing 'partner'
      expect(matchesAssigneeFilter("partner", "alex", "partner")).toBe(true);
      expect(matchesAssigneeFilter("both", "alex", "partner")).toBe(true);
      expect(matchesAssigneeFilter("mine", "alex", "partner")).toBe(false);
    });
  });

  it("toggles freeze day state", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HouseholdProvider>{children}</HouseholdProvider>
    );

    const { result } = renderHook(() => useHousehold(), { wrapper });

    expect(result.current.isFreezeDay).toBe(false);

    act(() => {
      result.current.toggleFreezeDay();
    });

    expect(result.current.isFreezeDay).toBe(true);
  });
});
