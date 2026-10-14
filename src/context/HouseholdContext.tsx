"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Partner = "alex" | "sam";
export type Assignee = "mine" | "partner" | "both";
export type AssigneeFilter = "all" | "mine" | "partner";

export interface PartnerScoreState {
  points: number;
  streak: number;
}

export interface HouseholdContextType {
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

const HouseholdContext = createContext<HouseholdContextType | undefined>(
  undefined
);

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const [activePartner, setActivePartner] = useState<Partner>("alex");
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 9, 14)); // Oct 14, 2026
  const [frozenDates, setFrozenDates] = useState<Record<string, boolean>>({
    "2026-10-18": true,
  });

  const [scores, setScores] = useState<Record<Partner, PartnerScoreState>>({
    alex: { points: 12, streak: 4 },
    sam: { points: 9, streak: 2 },
  });

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
    setScores((prev) => ({
      ...prev,
      [partner]: {
        ...prev[partner],
        points: prev[partner].points + deltaPoints,
      },
    }));
  };

  return (
    <HouseholdContext.Provider
      value={{
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
