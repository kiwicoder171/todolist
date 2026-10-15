"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { Assignee, useHousehold } from "./HouseholdContext";
import { useOptionalAuth } from "./AuthContext";
import { formatDateKey } from "./RoutinesContext";
import {
  subscribeToDailyTasks,
  upsertDailyTaskToFirebase,
  deleteDailyTaskFromFirebase,
} from "@/lib/firebaseSync";

export interface DailyTask {
  id: string;
  title: string;
  assignee: Assignee;
  targetDate: string; // YYYY-MM-DD
  originDate: string; // YYYY-MM-DD (Date originally created)
  completed: boolean;
  completedDate?: string; // YYYY-MM-DD (Date completed)
  notes: string;
  isKanbanSynced?: boolean;
  kanbanId?: number | string;
}

export function calculateRolloverTasks(
  tasks: DailyTask[],
  viewDate: Date,
  todayDate: Date
): DailyTask[] {
  const viewKey = formatDateKey(viewDate);
  const todayKey = formatDateKey(todayDate);

  if (viewKey < todayKey) {
    // Past calendar date: preserve the original historical log of tasks that originated on that day
    return tasks.filter((t) => t.originDate === viewKey);
  }

  if (viewKey === todayKey) {
    // Today: includes tasks targeted for today, unfinished tasks from past dates,
    // and rolled-over tasks that were completed today
    return tasks.filter(
      (t) =>
        t.targetDate === todayKey ||
        (t.targetDate < todayKey && !t.completed) ||
        (t.completed && t.completedDate === todayKey)
    );
  }

  // Future calendar date: tasks scheduled for that specific date
  return tasks.filter((t) => t.targetDate === viewKey);
}

export type KanbanSyncAction = "status" | "delete";
export type KanbanSyncCallback = (
  kanbanId: string,
  completed: boolean,
  action?: KanbanSyncAction
) => void;

export interface DailyTasksContextType {
  tasks: DailyTask[];
  addDailyTask: (
    title: string,
    assignee: Assignee,
    targetDate: Date,
    notes?: string,
    isKanbanSynced?: boolean,
    kanbanId?: string
  ) => void;
  toggleDailyTask: (id: string, completedDateKey?: string) => void;
  updateDailyTask: (id: string, updates: Partial<DailyTask>) => void;
  deleteDailyTask: (id: string) => void;
  setTaskCompletedByKanbanId: (kanbanId: string, completed: boolean) => void;
  removeTaskByKanbanId: (kanbanId: string) => void;
  registerKanbanSyncHook: (callback: KanbanSyncCallback) => () => void;
}

const DailyTasksContext = createContext<DailyTasksContextType | undefined>(
  undefined
);

export const SEED_TASKS: DailyTask[] = [
  {
    id: "task-101",
    title: "Pick up dry cleaning & winter coats",
    assignee: "partner",
    targetDate: "2026-10-13",
    originDate: "2026-10-13",
    completed: false,
    notes: "Ticket #492 at corner cleaner",
  },
  {
    id: "task-102",
    title: "Call plumber for slow kitchen drain",
    assignee: "mine",
    targetDate: "2026-10-14",
    originDate: "2026-10-14",
    completed: false,
    notes: "Ask for quote first",
  },
  {
    id: "task-103",
    title: "✈️ Book flight tickets to Tokyo",
    assignee: "both",
    targetDate: "2026-10-14",
    originDate: "2026-10-14",
    completed: false,
    isKanbanSynced: true,
    kanbanId: "card-202",
    notes: "Direct flights preferred",
  },
  {
    id: "task-104",
    title: "Submit quarterly electric bill",
    assignee: "mine",
    targetDate: "2026-10-14",
    originDate: "2026-10-14",
    completed: true,
    notes: "Receipt filed in Google Drive",
  },
];

const TASKS_STORAGE_KEY = "couple_task_hub_daily_tasks";

export function DailyTasksProvider({ children }: { children: ReactNode }) {
  const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";
  const { circle } = useHousehold();
  const circleId = circle?.id;
  const authContext = useOptionalAuth();
  const user = authContext?.user;

  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    if (user && !circleId) return [];
    if (isTest && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(TASKS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return user && !circleId ? [] : SEED_TASKS;
  });

  // Client-side hydration from localStorage (runs after mount, eliminating SSR hydration mismatch)
  useEffect(() => {
    if (isTest || typeof window === "undefined" || (user && !circleId)) return;
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
        }
      }
    } catch {}
  }, [isTest, user, circleId]);
  const syncHooksRef = useRef<KanbanSyncCallback[]>([]);

  // Ensure mock tasks vanish when user logs in without circle, and reappear if unauthenticated
  useEffect(() => {
    if (user && !circleId) {
      setTasks([]);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(TASKS_STORAGE_KEY);
        } catch {}
      }
    } else if (!user && !circleId) {
      setTasks(SEED_TASKS);
    }
  }, [user, circleId]);

  // Real-time listener from Firestore
  useEffect(() => {
    if (!circleId) return;
    const unsub = subscribeToDailyTasks(circleId, (remoteTasks) => {
      if (remoteTasks && remoteTasks.length > 0) {
        setTasks(remoteTasks);
        try {
          localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(remoteTasks));
        } catch {}
      }
    });
    return () => unsub();
  }, [circleId]);

  // Reset tasks when user leaves circle
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleLeave = () => {
      setTasks(user ? [] : SEED_TASKS);
    };
    window.addEventListener("couple_hub_circle_left", handleLeave);
    return () => window.removeEventListener("couple_hub_circle_left", handleLeave);
  }, [user]);

  const saveTasks = (updater: (prev: DailyTask[]) => DailyTask[]) => {
    setTasks((prev) => {
      const next = updater(prev);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(next));
        } catch {}
      }
      return next;
    });
  };

  const registerKanbanSyncHook = useCallback(
    (callback: KanbanSyncCallback) => {
      syncHooksRef.current.push(callback);
      return () => {
        syncHooksRef.current = syncHooksRef.current.filter((cb) => cb !== callback);
      };
    },
    []
  );

  const addDailyTask = (
    title: string,
    assignee: Assignee,
    targetDate: Date,
    notes: string = "",
    isKanbanSynced?: boolean,
    kanbanId?: string
  ) => {
    const dateKey = formatDateKey(targetDate);
    const newTask: DailyTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      assignee,
      targetDate: dateKey,
      originDate: dateKey,
      completed: false,
      notes,
      isKanbanSynced,
      kanbanId,
    };
    saveTasks((prev) => [...prev, newTask]);
    if (circleId) {
      upsertDailyTaskToFirebase(circleId, newTask).catch((err) =>
        console.warn("Daily tasks sync warning:", err?.message || err)
      );
    }
  };

  const toggleDailyTask = (id: string, completedDateKey?: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    const nextCompleted = !target.completed;
    const todayKey = completedDateKey || formatDateKey(new Date(2026, 9, 14));
    const updatedTask = {
      ...target,
      completed: nextCompleted,
      completedDate: nextCompleted ? todayKey : undefined,
    };

    saveTasks((prev) =>
      prev.map((t) => (t.id === id ? updatedTask : t))
    );

    if (circleId) {
      upsertDailyTaskToFirebase(circleId, updatedTask).catch((err) =>
        console.warn("Daily tasks sync warning:", err?.message || err)
      );
    }

    if (target.isKanbanSynced && target.kanbanId) {
      syncHooksRef.current.forEach((cb) =>
        cb(target.kanbanId as string, nextCompleted)
      );
    }
  };

  const updateDailyTask = (id: string, updates: Partial<DailyTask>) => {
    const current = tasks.find((t) => t.id === id);
    if (current && circleId) {
      upsertDailyTaskToFirebase(circleId, { ...current, ...updates }).catch((err) =>
        console.warn("Daily tasks sync warning:", err?.message || err)
      );
    }
    saveTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteDailyTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (target?.isKanbanSynced && target.kanbanId) {
      syncHooksRef.current.forEach((cb) =>
        cb(target.kanbanId as string, false, "delete")
      );
    }
    saveTasks((prev) => prev.filter((t) => t.id !== id));
    if (circleId) {
      deleteDailyTaskFromFirebase(circleId, id).catch((err) =>
        console.warn("Daily tasks sync warning:", err?.message || err)
      );
    }
  };

  const setTaskCompletedByKanbanId = (kanbanId: string, completed: boolean) => {
    saveTasks((prev) =>
      prev.map((t) =>
        t.kanbanId === kanbanId ? { ...t, completed } : t
      )
    );
  };

  const removeTaskByKanbanId = (kanbanId: string) => {
    saveTasks((prev) => prev.filter((t) => t.kanbanId !== kanbanId));
  };

  return (
    <DailyTasksContext.Provider
      value={{
        tasks,
        addDailyTask,
        toggleDailyTask,
        updateDailyTask,
        deleteDailyTask,
        setTaskCompletedByKanbanId,
        removeTaskByKanbanId,
        registerKanbanSyncHook,
      }}
    >
      {children}
    </DailyTasksContext.Provider>
  );
}

export function useDailyTasks(): DailyTasksContextType {
  const context = useContext(DailyTasksContext);
  if (!context) {
    throw new Error("useDailyTasks must be used within a DailyTasksProvider");
  }
  return context;
}
