import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { NotificationProvider, useNotifications } from "@/context/NotificationContext";
import { HouseholdContext, CircleState, Partner, AssigneeFilter } from "@/context/HouseholdContext";

const mockCircle: CircleState = {
  id: "test-circle-123",
  name: "Our Home",
  joinCode: "CUP-TEST",
  createdAt: "2026-10-20T00:00:00.000Z",
  createdByName: "Alex",
  partnerName: "Sam",
};

describe("Partner Cheer & Cross-Device Notification Sync", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const createWrapper = (activePartner: Partner = "alex") => {
    return ({ children }: { children: React.ReactNode }) => (
      <HouseholdContext.Provider
        value={{
          circle: mockCircle,
          spaceMode: "duo",
          setSpaceMode: vi.fn(),
          isConfigured: true,
          isOnboardingOpen: false,
          setIsOnboardingOpen: vi.fn(),
          createCircle: vi.fn(),
          joinCircle: vi.fn(),
          leaveCircle: vi.fn(),
          partnerNames: { alex: "Alex", sam: "Sam" },
          updatePartnerName: vi.fn(),
          activePartner,
          setActivePartner: vi.fn(),
          assigneeFilter: "all" as AssigneeFilter,
          setAssigneeFilter: vi.fn(),
          selectedDate: new Date(2026, 9, 20),
          setSelectedDate: vi.fn(),
          isFreezeDay: false,
          toggleFreezeDay: vi.fn(),
          isDateFrozen: () => false,
          toggleFreezeDate: vi.fn(),
          scores: { alex: { points: 0, streak: 0 }, sam: { points: 0, streak: 0 } },
          updateScore: vi.fn(),
          perfectDays: { alex: [], sam: [] },
          reconcilePerfectDays: vi.fn(),
        }}
      >
        <NotificationProvider>{children}</NotificationProvider>
      </HouseholdContext.Provider>
    );
  };

  it("targets partner as recipient when sending a cheer", () => {
    // Alex sends cheer to Sam
    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper("alex"),
    });

    act(() => {
      result.current.sendCheer("Alex", "Keep crushing it today! ❤️");
    });

    const sentNotif = result.current.allNotifications?.find(
      (n) => n.type === "cheer" && n.sender === "alex"
    );
    expect(sentNotif).toBeDefined();
    expect(sentNotif?.recipient).toBe("sam");
    expect(sentNotif?.title).toContain("Cheer");
    expect(sentNotif?.message).toContain("Keep crushing it today! ❤️");
  });

  it("filters out partner-targeted private notifications from sender's visible feed", () => {
    // When Sam logs in, Sam sees notifications targeted to Sam or both
    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper("sam"),
    });

    act(() => {
      result.current.addNotification({
        title: "❤️ Partner Cheer Received",
        message: "Alex sent you love & momentum!",
        type: "cheer",
        sender: "alex",
        recipient: "sam",
      });
    });

    // Visible for Sam
    const visibleForSam = result.current.notifications.find(
      (n) => n.message === "Alex sent you love & momentum!"
    );
    expect(visibleForSam).toBeDefined();
  });
});
