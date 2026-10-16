"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type NotificationType =
  | "task_completed"
  | "routine_completed"
  | "cheer"
  | "streak_alert"
  | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  partner?: string;
  points?: number;
}

export interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<AppNotification, "id" | "timestamp" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  sendCheer: (fromName: string, message?: string) => void;
  requestBrowserPermission: () => Promise<boolean>;
  browserPermission: NotificationPermission | "unsupported";
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const STORAGE_KEY = "couple_task_hub_notifications";

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    type: "streak_alert",
    title: "🔥 4-Day Streak Active!",
    message: "You and your partner are in sync! Keep the flame alive today.",
    timestamp: "Just now",
    read: false,
  },
  {
    id: "notif-2",
    type: "cheer",
    title: "❤️ Partner Cheer Received",
    message: "Alex sent you a cheer: 'You're doing amazing today!'",
    timestamp: "10m ago",
    read: false,
  },
  {
    id: "notif-3",
    type: "task_completed",
    title: "✅ Task Completed",
    message: "Pick up dry cleaning & winter coats marked done (+3 PTS).",
    timestamp: "1h ago",
    read: true,
  },
];

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [browserPermission, setBrowserPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (isTest && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Client-side hydration
  useEffect(() => {
    if (isTest || typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
      if ("Notification" in window) {
        setBrowserPermission(Notification.permission);
      } else {
        setBrowserPermission("unsupported");
      }
    } catch {}
  }, [isTest]);

  const saveToStorage = (updated: AppNotification[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const addNotification = (
    notif: Omit<AppNotification, "id" | "timestamp" | "read">
  ) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: "Just now",
      read: false,
    };

    setNotifications((prev) => {
      const updated = [newNotif, ...prev].slice(0, 30); // keep recent 30
      saveToStorage(updated);
      return updated;
    });

    // Native browser notification if permission granted
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      try {
        new Notification(notif.title, {
          body: notif.message,
          icon: "/favicon.png",
        });
      } catch {}
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveToStorage(updated);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveToStorage(updated);
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    saveToStorage([]);
  };

  const sendCheer = (fromName: string, message?: string) => {
    addNotification({
      type: "cheer",
      title: "❤️ Cheer Sent!",
      message: `${fromName}: "${message || "Keep up the great momentum today! Love you!"}"`,
      partner: fromName,
    });
  };

  const requestBrowserPermission = async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setBrowserPermission("unsupported");
      return false;
    }
    try {
      const perm = await Notification.requestPermission();
      setBrowserPermission(perm);
      if (perm === "granted") {
        new Notification("Couple Task Hub Notifications Enabled!", {
          body: "You will now receive alerts for task completions, streaks, and partner cheers.",
          icon: "/favicon.png",
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        sendCheer,
        requestBrowserPermission,
        browserPermission,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      notifications: INITIAL_NOTIFICATIONS,
      unreadCount: 2,
      addNotification: () => {},
      markAsRead: () => {},
      markAllAsRead: () => {},
      clearAll: () => {},
      sendCheer: () => {},
      requestBrowserPermission: async () => false,
      browserPermission: "unsupported",
      isDrawerOpen: false,
      setIsDrawerOpen: () => {},
    };
  }
  return context;
}
