import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import {
  HouseholdProvider,
  useHousehold,
  matchesAssigneeFilter,
  resolveIntentToAssignee,
  getAssigneeLabel,
  isMockScores,
  MOCK_SCORES,
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

    it("correctly resolves intent to domain assignee for both alex and sam", () => {
      // When Alex chooses 'mine' (Me), it maps to 'mine'
      expect(resolveIntentToAssignee("mine", "alex")).toBe("mine");
      // When Alex chooses 'partner' (Partner), it maps to 'partner'
      expect(resolveIntentToAssignee("partner", "alex")).toBe("partner");

      // When Sam chooses 'mine' (Me), it maps to 'partner' (Sam's domain assignee)
      expect(resolveIntentToAssignee("mine", "sam")).toBe("partner");
      // When Sam chooses 'partner' (Partner), it maps to 'mine' (Alex's domain assignee)
      expect(resolveIntentToAssignee("partner", "sam")).toBe("mine");

      // Both always maps to 'both'
      expect(resolveIntentToAssignee("both", "alex")).toBe("both");
      expect(resolveIntentToAssignee("both", "sam")).toBe("both");
    });

    it("returns correct relative user label based on who is viewing", () => {
      const names = { alex: "Alex", sam: "Sam" };

      // Alex viewing
      expect(getAssigneeLabel("mine", "alex", names)).toBe("Me");
      expect(getAssigneeLabel("partner", "alex", names)).toBe("Sam");
      expect(getAssigneeLabel("both", "alex", names)).toBe("Both");

      // Sam viewing
      expect(getAssigneeLabel("partner", "sam", names)).toBe("Me");
      expect(getAssigneeLabel("mine", "sam", names)).toBe("Alex");
      expect(getAssigneeLabel("both", "sam", names)).toBe("Both");
    });

    it("identifies mock scores correctly", () => {
      expect(isMockScores(MOCK_SCORES)).toBe(true);
      expect(
        isMockScores({
          alex: { points: 0, streak: 0 },
          sam: { points: 0, streak: 0 },
        })
      ).toBe(false);
      expect(isMockScores(undefined)).toBe(false);
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

  describe("Space Mode (Solo, Partner, Friends, Family)", () => {
    it("defaults to partner space mode", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HouseholdProvider>{children}</HouseholdProvider>
      );

      const { result } = renderHook(() => useHousehold(), { wrapper });
      expect(result.current.spaceMode).toBe("partner");
    });

    it("allows switching spaceMode to solo, friends, and family", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HouseholdProvider>{children}</HouseholdProvider>
      );

      const { result } = renderHook(() => useHousehold(), { wrapper });

      act(() => {
        result.current.setSpaceMode("solo");
      });
      expect(result.current.spaceMode).toBe("solo");

      act(() => {
        result.current.setSpaceMode("friends");
      });
      expect(result.current.spaceMode).toBe("friends");

      act(() => {
        result.current.setSpaceMode("family");
      });
      expect(result.current.spaceMode).toBe("family");
    });
  });
});
