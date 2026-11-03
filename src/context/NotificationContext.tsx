"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { HouseholdContext, Partner } from "./HouseholdContext";
import {
  subscribeToNotifications,
  upsertNotificationToFirebase,
  markNotificationReadInFirebase,
  clearNotificationsFromFirebase,
} from "@/lib/firebaseSync";

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
  createdAt?: number;
  read: boolean;
  readBy?: string[];
  partner?: string;
  sender?: string;
  recipient?: string;
  points?: number;
}

export interface NotificationContextType {
  notifications: AppNotification[];
  allNotifications?: AppNotification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<AppNotification, "id" | "timestamp" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  sendCheer: (fromName: string, message?: string, targetRecipient?: string) => void;
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
    title: "4-Day Streak 🔥",
    message: "In sync! Keep the flame burning.",
    timestamp: "Just now",
    createdAt: Date.now() - 60000,
    read: false,
    recipient: "both",
  },
  {
    id: "notif-2",
    type: "cheer",
    title: "Cheer Received ❤️",
    message: "Alex: “Doing amazing today!”",
    timestamp: "10m ago",
    createdAt: Date.now() - 600000,
    read: false,
    recipient: "both",
  },
  {
    id: "notif-3",
    type: "task_completed",
    title: "Task Done ✅",
    message: "Dry cleaning & coats (+3 PTS).",
    timestamp: "1h ago",
    createdAt: Date.now() - 3600000,
    read: true,
    recipient: "both",
  },
];

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";
  const household = useContext(HouseholdContext);
  const circleId = household?.circle?.id;
  const activePartner: Partner = household?.activePartner || "alex";
  const otherPartner: Partner = activePartner === "alex" ? "sam" : "alex";

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

  // Real-time listener from Firebase for circles
  useEffect(() => {
    if (!circleId) return;
    const unsub = subscribeToNotifications(circleId, (remoteNotifs) => {
      if (remoteNotifs && Array.isArray(remoteNotifs)) {
        setNotifications((prev) => {
          const remoteIds = new Set(remoteNotifs.map((n) => n.id));
          const localOnly = prev.filter(
            (n) => !remoteIds.has(n.id) && !INITIAL_NOTIFICATIONS.some((i) => i.id === n.id)
          );
          const merged = [...(remoteNotifs as AppNotification[]), ...localOnly].sort(
            (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
          );
          saveToStorage(merged);

          // Check if any new unread notification is targeted to active user for native push
          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            const incoming = remoteNotifs.find(
              (n) =>
                !n.read &&
                (!n.readBy || !n.readBy.includes(activePartner)) &&
                (n.recipient === activePartner || n.recipient === "both") &&
                Date.now() - (n.createdAt || 0) < 15000 // received within last 15 seconds
            );
            if (incoming) {
              try {
                new Notification(incoming.title, {
                  body: incoming.message,
                  icon: "/favicon.png",
                });
              } catch {}
            }
          }

          return merged;
        });
      }
    });
    return () => unsub();
  }, [circleId, activePartner]);

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
      createdAt: Date.now(),
      read: false,
      readBy: [],
      sender: notif.sender || activePartner,
      recipient:
        notif.recipient ||
        (notif.type === "task_completed" || notif.type === "routine_completed"
          ? otherPartner
          : "both"),
    };

    setNotifications((prev) => {
      const updated = [newNotif, ...prev].slice(0, 50); // keep recent 50
      saveToStorage(updated);
      return updated;
    });

    if (circleId) {
      upsertNotificationToFirebase(circleId, newNotif).catch((err) =>
        console.warn("Notification sync warning:", err?.message || err)
      );
    }

    // Native browser notification if permission granted
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted" &&
      (newNotif.recipient === activePartner || newNotif.recipient === "both")
    ) {
      try {
        new Notification(newNotif.title, {
          body: newNotif.message,
          icon: "/favicon.png",
        });
      } catch {}
    }
  };

  const markAsRead = (id: string) => {
    let updatedNotif: AppNotification | undefined;
    setNotifications((prev) => {
      const updated = prev.map((n) => {
        if (n.id === id) {
          const currentReadBy = Array.isArray(n.readBy) ? n.readBy : [];
          const readBy = Array.from(new Set([...currentReadBy, activePartner]));
          updatedNotif = { ...n, read: true, readBy };
          return updatedNotif;
        }
        return n;
      });
      saveToStorage(updated);
      return updated;
    });

    if (circleId && updatedNotif) {
      markNotificationReadInFirebase(
        circleId,
        id,
        (updatedNotif as AppNotification).readBy || [activePartner]
      ).catch((err) => console.warn("Mark read sync warning:", err?.message || err));
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => {
        const currentReadBy = Array.isArray(n.readBy) ? n.readBy : [];
        const readBy = Array.from(new Set([...currentReadBy, activePartner]));
        if (circleId) {
          markNotificationReadInFirebase(circleId, n.id, readBy).catch(() => {});
        }
        return { ...n, read: true, readBy };
      });
      saveToStorage(updated);
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    saveToStorage([]);
    if (circleId) {
      clearNotificationsFromFirebase(circleId).catch((err) =>
        console.warn("Clear notifications sync warning:", err?.message || err)
      );
    }
  };

  const sendCheer = (fromName: string, message?: string, targetRecipient?: string) => {
    const toPartner = targetRecipient || otherPartner;
    const cheerNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: "cheer",
      title: "Cheer Received ❤️",
      message: `${fromName}: "${message || "Keep it up!"}"`,
      timestamp: "Just now",
      createdAt: Date.now(),
      read: false,
      readBy: [],
      sender: activePartner,
      partner: fromName,
      recipient: toPartner,
    };

    setNotifications((prev) => {
      const updated = [cheerNotif, ...prev].slice(0, 50);
      saveToStorage(updated);
      return updated;
    });

    if (circleId) {
      upsertNotificationToFirebase(circleId, cheerNotif).catch((err) =>
        console.warn("Send cheer sync warning:", err?.message || err)
      );
    }
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

  // Filter notifications visible for the active partner
  const visibleNotifications = notifications.filter((n) => {
    if (isTest || !circleId) return true;
    if (n.recipient === activePartner || n.recipient === "both" || !n.recipient) return true;
    return false;
  });

  const unreadCount = visibleNotifications.filter((n) => {
    if (n.readBy && n.readBy.includes(activePartner)) return false;
    return !n.read;
  }).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications: visibleNotifications,
        allNotifications: notifications,
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

