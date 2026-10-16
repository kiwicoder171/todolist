import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { NotificationProvider, useNotifications } from "../NotificationContext";

const storage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => storage[key] ?? null,
  setItem: (key: string, value: string) => {
    storage[key] = value;
  },
  removeItem: (key: string) => {
    delete storage[key];
  },
  clear: () => {
    Object.keys(storage).forEach((k) => delete storage[k]);
  },
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

describe("NotificationContext (Seam: In-App & Web Notifications)", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NotificationProvider>{children}</NotificationProvider>
  );

  it("initializes with default notifications and unread count", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    expect(result.current.notifications.length).toBeGreaterThan(0);
    expect(result.current.unreadCount).toBeGreaterThan(0);
    expect(result.current.isDrawerOpen).toBe(false);
  });

  it("can toggle notification drawer open/closed state", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.setIsDrawerOpen(true);
    });
    expect(result.current.isDrawerOpen).toBe(true);

    act(() => {
      result.current.setIsDrawerOpen(false);
    });
    expect(result.current.isDrawerOpen).toBe(false);
  });

  it("allows adding a new notification and increments unread count", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });
    const initialCount = result.current.unreadCount;

    act(() => {
      result.current.addNotification({
        title: "Test Alert",
        message: "This is a test notification",
        type: "system",
      });
    });

    expect(result.current.notifications[0].title).toBe("Test Alert");
    expect(result.current.notifications[0].read).toBe(false);
    expect(result.current.unreadCount).toBe(initialCount + 1);
  });

  it("marks a specific notification as read", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });
    const unreadItem = result.current.notifications.find((n) => !n.read);
    expect(unreadItem).toBeDefined();

    const initialUnread = result.current.unreadCount;

    act(() => {
      result.current.markAsRead(unreadItem!.id);
    });

    const updated = result.current.notifications.find((n) => n.id === unreadItem!.id);
    expect(updated?.read).toBe(true);
    expect(result.current.unreadCount).toBe(initialUnread - 1);
  });

  it("marks all notifications as read", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.markAllAsRead();
    });

    expect(result.current.unreadCount).toBe(0);
    expect(result.current.notifications.every((n) => n.read)).toBe(true);
  });

  it("clears all notifications", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.notifications.length).toBe(0);
    expect(result.current.unreadCount).toBe(0);
  });

  it("supports sending a cheer and adding a cheer notification", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.sendCheer("Alex", "Great job today! ❤️");
    });

    const cheerNotif = result.current.notifications[0];
    expect(cheerNotif.type).toBe("cheer");
    expect(cheerNotif.title).toContain("Cheer");
    expect(cheerNotif.message).toContain("Great job today! ❤️");
  });
});
