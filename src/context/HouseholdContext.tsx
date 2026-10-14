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
  scores: Record<Partner, PartnerScoreState>;
  updateScore: (partner: Partner, deltaPoints: number) => void;
}

export function matchesAssigneeFilter(
  itemAssignee: Assignee,
  _currentPartner: Partner,
  filter: AssigneeFilter
): boolean {
  if (filter === "all") return true;
  if (filter === "mine") return itemAssignee === "mine" || itemAssignee === "both";
  if (filter === "partner") return itemAssignee === "partner" || itemAssignee === "both";
  return true;
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(
  undefined
);

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const [activePartner, setActivePartner] = useState<Partner>("alex");
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 9, 14)); // Oct 14, 2026
  const [isFreezeDay, setIsFreezeDay] = useState<boolean>(false);

  const [scores, setScores] = useState<Record<Partner, PartnerScoreState>>({
    alex: { points: 12, streak: 4 },
    sam: { points: 9, streak: 2 },
  });

  const toggleFreezeDay = () => {
    setIsFreezeDay((prev) => !prev);
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
