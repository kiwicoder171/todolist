"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Assignee } from "./HouseholdContext";

export type RoutineFrequency = "daily" | "weekdays" | "weekends" | number[];

export interface Routine {
  id: string;
  title: string;
  assignee: Assignee;
  frequency: RoutineFrequency;
  order: number;
  completions: Record<string, boolean>; // e.g. "2026-10-14": true
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isRoutineScheduledForDate(
  frequency: RoutineFrequency,
  date: Date
): boolean {
  const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday

  if (frequency === "daily") return true;
  if (frequency === "weekdays") return dayOfWeek >= 1 && dayOfWeek <= 5;
  if (frequency === "weekends") return dayOfWeek === 0 || dayOfWeek === 6;
  if (Array.isArray(frequency)) return frequency.includes(dayOfWeek);

  return true;
}

export function formatFrequencyLabel(frequency: RoutineFrequency): string {
  if (frequency === "daily") return "Daily";
  if (frequency === "weekdays") return "Weekdays";
  if (frequency === "weekends") return "Weekends";
  if (Array.isArray(frequency)) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return frequency.map((d) => dayNames[d]).join(", ");
  }
  return "Daily";
}

export interface RoutinesContextType {
  routines: Routine[];
  addRoutine: (
    title: string,
    assignee: Assignee,
    frequency?: RoutineFrequency
  ) => void;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  toggleCompletion: (id: string, date: Date) => void;
  isCompleted: (id: string, date: Date) => boolean;
  reorderRoutines: (startIndex: number, endIndex: number) => void;
}

const RoutinesContext = createContext<RoutinesContextType | undefined>(undefined);

const SEED_ROUTINES: Routine[] = [
  {
    id: "routine-1",
    title: "15-min daily sync & check-in",
    assignee: "both",
    frequency: "daily",
    order: 0,
    completions: { "2026-10-14": true },
  },
  {
    id: "routine-2",
    title: "Tidy kitchen & living room together",
    assignee: "both",
    frequency: "daily",
    order: 1,
    completions: { "2026-10-14": true },
  },
  {
    id: "routine-3",
    title: "Workout / 20 min stretch",
    assignee: "mine",
    frequency: [1, 3, 5], // Mon, Wed, Fri
    order: 2,
    completions: { "2026-10-14": false },
  },
  {
    id: "routine-4",
    title: "Review weekly grocery & meal plan",
    assignee: "partner",
    frequency: "daily",
    order: 3,
    completions: { "2026-10-14": true },
  },
  {
    id: "routine-5",
    title: "Evening walk together in park",
    assignee: "both",
    frequency: "daily",
    order: 4,
    completions: { "2026-10-14": false },
  },
];

const ROUTINES_STORAGE_KEY = "couple_task_hub_routines";

export function RoutinesProvider({ children }: { children: ReactNode }) {
  const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";

  const [routines, setRoutines] = useState<Routine[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(ROUTINES_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return isTest ? SEED_ROUTINES : [];
  });

  const saveRoutines = (updater: (prev: Routine[]) => Routine[]) => {
    setRoutines((prev) => {
      const next = updater(prev);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(ROUTINES_STORAGE_KEY, JSON.stringify(next));
        } catch {}
      }
      return next;
    });
  };

  const addRoutine = (
    title: string,
    assignee: Assignee,
    frequency: RoutineFrequency = "daily"
  ) => {
    const newRoutine: Routine = {
      id: `routine-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      assignee,
      frequency,
      order: routines.length,
      completions: {},
    };
    saveRoutines((prev) => [...prev, newRoutine]);
  };

  const updateRoutine = (id: string, updates: Partial<Routine>) => {
    saveRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const deleteRoutine = (id: string) => {
    saveRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleCompletion = (id: string, date: Date) => {
    const dateKey = formatDateKey(date);
    saveRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const currentVal = !!r.completions[dateKey];
        return {
          ...r,
          completions: {
            ...r.completions,
            [dateKey]: !currentVal,
          },
        };
      })
    );
  };

  const isCompleted = (id: string, date: Date): boolean => {
    const routine = routines.find((r) => r.id === id);
    if (!routine) return false;
    const dateKey = formatDateKey(date);
    return !!routine.completions[dateKey];
  };

  const reorderRoutines = (startIndex: number, endIndex: number) => {
    if (startIndex === endIndex) return;
    saveRoutines((prev) => {
      if (
        startIndex < 0 ||
        startIndex >= prev.length ||
        endIndex < 0 ||
        endIndex >= prev.length
      ) {
        return prev;
      }
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((item, index) => ({ ...item, order: index }));
    });
  };

  return (
    <RoutinesContext.Provider
      value={{
        routines,
        addRoutine,
        updateRoutine,
        deleteRoutine,
        toggleCompletion,
        isCompleted,
        reorderRoutines,
      }}
    >
      {children}
    </RoutinesContext.Provider>
  );
}

export function useRoutines(): RoutinesContextType {
  const context = useContext(RoutinesContext);
  if (!context) {
    throw new Error("useRoutines must be used within a RoutinesProvider");
  }
  return context;
}
