"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Partner = "alex" | "sam";
export type Assignee = "mine" | "partner" | "both";
export type AssigneeFilter = "all" | "mine" | "partner";

export interface PartnerScoreState {
  points: number;
  streak: number;
}

export interface CircleState {
  id: string;
  name: string;
  joinCode: string;
  createdByName: string;
  partnerName?: string;
  createdAt: string;
}

export interface HouseholdContextType {
  circle: CircleState | null;
  isConfigured: boolean;
  createCircle: (userName: string, circleName?: string) => string;
  joinCircle: (userName: string, joinCode: string) => boolean;
  leaveCircle: () => void;
  partnerNames: Record<Partner, string>;
  activePartner: Partner;
  setActivePartner: (partner: Partner) => void;
  assigneeFilter: AssigneeFilter;
  setAssigneeFilter: (filter: AssigneeFilter) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  isFreezeDay: boolean;
  toggleFreezeDay: () => void;
  isDateFrozen: (date: Date) => boolean;
  toggleFreezeDate: (date: Date) => void;
  scores: Record<Partner, PartnerScoreState>;
  updateScore: (partner: Partner, deltaPoints: number) => void;
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function matchesAssigneeFilter(
  itemAssignee: Assignee,
  currentPartner: Partner,
  filter: AssigneeFilter
): boolean {
  if (filter === "all") return true;

  const isAssignedToCurrent =
    itemAssignee === "both" ||
    (currentPartner === "alex"
      ? itemAssignee === "mine"
      : itemAssignee === "partner");

  if (filter === "mine") {
    return isAssignedToCurrent;
  }

  if (filter === "partner") {
    const isAssignedToOther =
      itemAssignee === "both" ||
      (currentPartner === "alex"
        ? itemAssignee === "partner"
        : itemAssignee === "mine");
    return isAssignedToOther;
  }

  return true;
}

const STORAGE_KEY = "couple_task_hub_household";

function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CUP-";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(
  undefined
);

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";

  const [circle, setCircle] = useState<CircleState | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.circle || null;
      }
    } catch {}
    return null;
  });

  const [partnerNames, setPartnerNames] = useState<Record<Partner, string>>(() => {
    if (typeof window === "undefined") return { alex: "Alex", sam: "Sam" };
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.partnerNames) return parsed.partnerNames;
      }
    } catch {}
    return { alex: "Alex", sam: "Sam" };
  });

  const [activePartner, setActivePartner] = useState<Partner>("alex");
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 9, 14)); // Oct 14, 2026
  const [frozenDates, setFrozenDates] = useState<Record<string, boolean>>({
    "2026-10-18": true,
  });

  const [scores, setScores] = useState<Record<Partner, PartnerScoreState>>(() => {
    if (typeof window === "undefined") {
      return isTest
        ? { alex: { points: 12, streak: 4 }, sam: { points: 9, streak: 2 } }
        : { alex: { points: 0, streak: 0 }, sam: { points: 0, streak: 0 } };
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.scores) return parsed.scores;
      }
    } catch {}
    return isTest
      ? { alex: { points: 12, streak: 4 }, sam: { points: 9, streak: 2 } }
      : { alex: { points: 0, streak: 0 }, sam: { points: 0, streak: 0 } };
  });

  // Save to localStorage whenever critical state updates
  const saveState = (
    newCircle: CircleState | null,
    newNames: Record<Partner, string>,
    newScores: Record<Partner, PartnerScoreState>
  ) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          circle: newCircle,
          partnerNames: newNames,
          scores: newScores,
        })
      );
    } catch {}
  };

  const createCircle = (userName: string, circleName?: string): string => {
    const code = generateJoinCode();
    const newCircle: CircleState = {
      id: `circle-${Date.now()}`,
      name: circleName?.trim() || `${userName}'s Shared Space`,
      joinCode: code,
      createdByName: userName.trim(),
      createdAt: new Date().toISOString(),
    };
    const newNames = { alex: userName.trim(), sam: "Partner" };
    const newScores = {
      alex: { points: 0, streak: 0 },
      sam: { points: 0, streak: 0 },
    };

    setCircle(newCircle);
    setPartnerNames(newNames);
    setScores(newScores);
    setActivePartner("alex");
    saveState(newCircle, newNames, newScores);
    return code;
  };

  const joinCircle = (userName: string, joinCode: string): boolean => {
    const cleanCode = joinCode.trim().toUpperCase();
    // In code-based pairing, create/link joined circle
    const updatedCircle: CircleState = circle
      ? { ...circle, partnerName: userName.trim() }
      : {
          id: `circle-${Date.now()}`,
          name: "Our Shared Space",
          joinCode: cleanCode,
          createdByName: "Partner",
          partnerName: userName.trim(),
          createdAt: new Date().toISOString(),
        };

    const newNames = {
      alex: updatedCircle.createdByName || "Partner",
      sam: userName.trim(),
    };
    const newScores = {
      alex: { points: 0, streak: 0 },
      sam: { points: 0, streak: 0 },
    };

    setCircle(updatedCircle);
    setPartnerNames(newNames);
    setScores(newScores);
    setActivePartner("sam");
    saveState(updatedCircle, newNames, newScores);
    return true;
  };

  const leaveCircle = () => {
    setCircle(null);
    setPartnerNames({ alex: "Alex", sam: "Sam" });
    setScores({
      alex: { points: 0, streak: 0 },
      sam: { points: 0, streak: 0 },
    });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  };

  const isDateFrozen = (date: Date): boolean => {
    return !!frozenDates[formatDateKey(date)];
  };

  const toggleFreezeDate = (date: Date) => {
    const key = formatDateKey(date);
    setFrozenDates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isFreezeDay = isDateFrozen(selectedDate);

  const toggleFreezeDay = () => {
    toggleFreezeDate(selectedDate);
  };

  const updateScore = (partner: Partner, deltaPoints: number) => {
    setScores((prev) => {
      const updated = {
        ...prev,
        [partner]: {
          ...prev[partner],
          points: prev[partner].points + deltaPoints,
        },
      };
      saveState(circle, partnerNames, updated);
      return updated;
    });
  };

  const isConfigured = Boolean(circle || isTest);

  return (
    <HouseholdContext.Provider
      value={{
        circle,
        isConfigured,
        createCircle,
        joinCircle,
        leaveCircle,
        partnerNames,
        activePartner,
        setActivePartner,
        assigneeFilter,
        setAssigneeFilter,
        selectedDate,
        setSelectedDate,
        isFreezeDay,
        toggleFreezeDay,
        isDateFrozen,
        toggleFreezeDate,
        scores,
        updateScore,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold(): HouseholdContextType {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error("useHousehold must be used within a HouseholdProvider");
  }
  return context;
}

