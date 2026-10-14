"use client";

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { Assignee } from "./HouseholdContext";
import { formatDateKey } from "./RoutinesContext";

export interface DailyTask {
  id: string;
  title: string;
  assignee: Assignee;
  targetDate: string; // YYYY-MM-DD
  originDate: string; // YYYY-MM-DD (Date originally created)
  completed: boolean;
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
    // Today: includes tasks targeted for today PLUS unfinished tasks from past dates
    return tasks.filter(
      (t) =>
        t.targetDate === todayKey ||
        (t.targetDate < todayKey && !t.completed)
    );
  }

  // Future calendar date: tasks scheduled for that specific date
  return tasks.filter((t) => t.targetDate === viewKey);
}

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
  toggleDailyTask: (id: string) => void;
  updateDailyTask: (id: string, updates: Partial<DailyTask>) => void;
  deleteDailyTask: (id: string) => void;
  setTaskCompletedByKanbanId: (kanbanId: string, completed: boolean) => void;
  removeTaskByKanbanId: (kanbanId: string) => void;
  registerKanbanSyncHook: (
    callback: (kanbanId: string, completed: boolean) => void
  ) => () => void;
}

const DailyTasksContext = createContext<DailyTasksContextType | undefined>(
  undefined
);

const SEED_TASKS: DailyTask[] = [
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

export function DailyTasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<DailyTask[]>(SEED_TASKS);
  const syncHooksRef = useRef<
    ((kanbanId: string, completed: boolean) => void)[]
  >([]);

  const registerKanbanSyncHook = useCallback(
    (callback: (kanbanId: string, completed: boolean) => void) => {
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
      id: `task-${Date.now()}`,
      title,
      assignee,
      targetDate: dateKey,
      originDate: dateKey,
      completed: false,
      notes,
      isKanbanSynced,
      kanbanId,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleDailyTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    const nextCompleted = !target.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
    );

    if (target.isKanbanSynced && target.kanbanId) {
      syncHooksRef.current.forEach((cb) =>
        cb(target.kanbanId as string, nextCompleted)
      );
    }
  };

  const updateDailyTask = (id: string, updates: Partial<DailyTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteDailyTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const setTaskCompletedByKanbanId = (kanbanId: string, completed: boolean) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.kanbanId === kanbanId ? { ...t, completed } : t
      )
    );
  };

  const removeTaskByKanbanId = (kanbanId: string) => {
    setTasks((prev) => prev.filter((t) => t.kanbanId !== kanbanId));
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
