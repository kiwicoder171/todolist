"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  saveCircleToFirebase,
  findCircleByJoinCode,
  subscribeToCircle,
  updateScoresInFirebase,
} from "@/lib/firebaseSync";
import { useOptionalAuth } from "./AuthContext";

export type Partner = "alex" | "sam";
export type Assignee = "mine" | "partner" | "both";
export type AssigneeFilter = "all" | "mine" | "partner";
export type SpaceMode = "solo" | "partner" | "friends" | "family";

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
  mode?: SpaceMode;
}

export interface HouseholdContextType {
  circle: CircleState | null;
  spaceMode: SpaceMode;
  setSpaceMode: (mode: SpaceMode) => void;
  isConfigured: boolean;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  createCircle: (userName: string, circleName?: string, mode?: SpaceMode) => string;
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

export const MOCK_SCORES: Record<Partner, PartnerScoreState> = {
  alex: { points: 12, streak: 4 },
  sam: { points: 9, streak: 2 },
};

export const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";
  const authContext = useOptionalAuth();
  const user = authContext?.user;
  const updateUserCircle = authContext?.updateUserCircle || (async () => {});

  const [circle, setCircle] = useState<CircleState | null>(() => {
    if (isTest && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.circle || null;
        }
      } catch {}
    }
    return null;
  });

  const [partnerNames, setPartnerNames] = useState<Record<Partner, string>>(() => {
    if (isTest && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.partnerNames) return parsed.partnerNames;
        }
      } catch {}
    }
    return { alex: "Alex", sam: "Sam" };
  });

  const [activePartner, setActivePartner] = useState<Partner>("alex");
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 9, 14)); // Oct 14, 2026
  const [frozenDates, setFrozenDates] = useState<Record<string, boolean>>({
    "2026-10-18": true,
  });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [spaceMode, setSpaceModeState] = useState<SpaceMode>(() => {
    if (isTest && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.spaceMode) return parsed.spaceMode;
          if (parsed.circle?.mode) return parsed.circle.mode;
        }
      } catch {}
    }
    return "partner";
  });

  const [scores, setScores] = useState<Record<Partner, PartnerScoreState>>(() => {
    if (isTest && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.circle && parsed.scores) return parsed.scores;
          if (parsed.scores) return parsed.scores;
        }
      } catch {}
    }
    return MOCK_SCORES;
  });

  // Client-side hydration from localStorage (runs after mount, eliminating SSR hydration mismatch)
  useEffect(() => {
    if (isTest || typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.circle) setCircle(parsed.circle);
        if (parsed.partnerNames) setPartnerNames(parsed.partnerNames);
        if (parsed.scores) setScores(parsed.scores);
        if (parsed.spaceMode) setSpaceModeState(parsed.spaceMode);
        else if (parsed.circle?.mode) setSpaceModeState(parsed.circle.mode);
      }
    } catch {}
  }, [isTest]);

  // Synchronize mock vs authenticated state:
  // - Pre-login: mock names "Alex & Sam", mock scores (12 & 9 pts)
  // - Logged in without circle: user's space, clean scores (0 pts, 0 streak), NO "Alex & Sam"
  useEffect(() => {
    if (user && !circle) {
      setScores({
        alex: { points: 0, streak: 0 },
        sam: { points: 0, streak: 0 },
      });
      setPartnerNames({
        alex: user.username || "You",
        sam: "Partner",
      });
    } else if (!user && !circle) {
      setPartnerNames({ alex: "Alex", sam: "Sam" });
      setScores((prev) => {
        if (
          prev.alex.points === 0 &&
          prev.alex.streak === 0 &&
          prev.sam.points === 0 &&
          prev.sam.streak === 0
        ) {
          return MOCK_SCORES;
        }
        return prev;
      });
    }
  }, [user, circle]);

  // Save to localStorage whenever critical state updates
  const saveState = (
    newCircle: CircleState | null,
    newNames: Record<Partner, string>,
    newScores: Record<Partner, PartnerScoreState>,
    newMode?: SpaceMode
  ) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          circle: newCircle,
          partnerNames: newNames,
          scores: newScores,
          spaceMode: newMode !== undefined ? newMode : spaceMode,
        })
      );
    } catch {}
  };

  const setSpaceMode = (newMode: SpaceMode) => {
    setSpaceModeState(newMode);
    if (circle) {
      const updated = { ...circle, mode: newMode };
      setCircle(updated);
      saveCircleToFirebase(updated).catch((err) =>
        console.warn("Update circle mode warning:", err?.message || err)
      );
      saveState(updated, partnerNames, scores, newMode);
    } else {
      saveState(circle, partnerNames, scores, newMode);
    }
  };

  // Cross-device sync: If user is logged in and has a circleId attached, subscribe to it!
  useEffect(() => {
    if (!user?.circleId) return;
    const unsub = subscribeToCircle(user.circleId, (remoteCircle) => {
      setCircle(remoteCircle);
      const names = {
        alex: remoteCircle.createdByName || user?.username || "You",
        sam: remoteCircle.partnerName || "Partner",
      };
      setPartnerNames(names);
      if ((remoteCircle as any).scores) {
        setScores((remoteCircle as any).scores);
      }
      if (user.partnerRole) {
        setActivePartner(user.partnerRole);
      }
      saveState(remoteCircle, names, (remoteCircle as any).scores || scores);
    });
    return () => unsub();
  }, [user?.circleId, user?.partnerRole]);

  // Real-time listener for current active circle from Firebase
  useEffect(() => {
    if (!circle?.id) return;
    const unsub = subscribeToCircle(circle.id, (remoteCircle) => {
      setCircle((prev) => ({ ...prev, ...remoteCircle }));
      if (remoteCircle.createdByName || remoteCircle.partnerName) {
        setPartnerNames((prev) => ({
          alex: remoteCircle.createdByName || prev.alex,
          sam: remoteCircle.partnerName || prev.sam,
        }));
      }
      if ((remoteCircle as any).scores) {
        setScores((remoteCircle as any).scores);
      }
    });
    return () => unsub();
  }, [circle?.id]);

  const createCircle = (userName: string, circleName?: string, mode: SpaceMode = "partner"): string => {
    const finalName = user?.username || userName.trim() || "Alex";
    const code = generateJoinCode();
    let defaultTitle = `${finalName}'s Shared Space`;
    if (mode === "solo") defaultTitle = `${finalName}'s Space`;
    else if (mode === "friends") defaultTitle = `${finalName}'s Friends Hub`;
    else if (mode === "family") defaultTitle = `${finalName}'s Family Space`;

    const newCircle: CircleState = {
      id: `circle-${Date.now()}`,
      name: circleName?.trim() || defaultTitle,
      joinCode: code,
      createdByName: finalName,
      createdAt: new Date().toISOString(),
      mode,
    };
    const newNames = {
      alex: finalName,
      sam: mode === "solo" ? "Solo" : mode === "friends" ? "Friends" : mode === "family" ? "Family" : "Partner",
    };
    const newScores = {
      alex: { points: 0, streak: 0 },
      sam: { points: 0, streak: 0 },
    };

    setCircle(newCircle);
    setPartnerNames(newNames);
    setScores(newScores);
    setSpaceModeState(mode);
    setActivePartner("alex");
    saveState(newCircle, newNames, newScores, mode);
    saveCircleToFirebase(newCircle).catch((err) =>
      console.warn("Save circle warning:", err?.message || err)
    );

    // Link circle to user profile if authenticated
    if (user?.uid) {
      updateUserCircle(newCircle.id, "alex").catch((err) =>
        console.warn("Update user circle warning:", err?.message || err)
      );
    }
    setIsOnboardingOpen(false);
    return code;
  };

  const joinCircle = (userName: string, joinCode: string): boolean => {
    const finalName = user?.username || userName.trim() || "Sam";
    const cleanCode = joinCode.trim().toUpperCase();
    const updatedCircle: CircleState = circle
      ? { ...circle, partnerName: finalName }
      : {
          id: `circle-${Date.now()}`,
          name: "Our Shared Space",
          joinCode: cleanCode,
          createdByName: "Partner",
          partnerName: finalName,
          createdAt: new Date().toISOString(),
        };

    const newNames = {
      alex: updatedCircle.createdByName || "Partner",
      sam: finalName,
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
    setIsOnboardingOpen(false);

    // Merge with remote circle from Firebase if it exists
    findCircleByJoinCode(cleanCode)
      .then((remoteCircle) => {
        if (remoteCircle) {
          const merged: CircleState = {
            ...remoteCircle,
            partnerName: finalName,
          };
          setCircle(merged);
          if (remoteCircle.mode) {
            setSpaceModeState(remoteCircle.mode);
          }
          const mergedNames = {
            alex: merged.createdByName || "Partner",
            sam: finalName,
          };
          setPartnerNames(mergedNames);
          saveState(merged, mergedNames, scores, remoteCircle.mode);
          saveCircleToFirebase(merged).catch((err) =>
            console.warn("Save merged circle warning:", err?.message || err)
          );

          if (user?.uid) {
            updateUserCircle(remoteCircle.id, "sam").catch((err) =>
              console.warn("Update user circle warning:", err?.message || err)
            );
          }
        } else {
          saveCircleToFirebase(updatedCircle).catch((err) =>
            console.warn("Save circle warning:", err?.message || err)
          );
          if (user?.uid) {
            updateUserCircle(updatedCircle.id, "sam").catch((err) =>
              console.warn("Update user circle warning:", err?.message || err)
            );
          }
        }
      })
      .catch((err) => console.warn("Find circle warning:", err?.message || err));

    return true;
  };

  const leaveCircle = () => {
    // 1. Unlink circle from user profile in Firestore
    if (user?.uid) {
      updateUserCircle(null, null).catch((err) =>
        console.warn("Unlink user circle warning:", err?.message || err)
      );
    }

    // 2. Reset circle and score state
    setCircle(null);
    setPartnerNames(
      user
        ? { alex: user.username || "You", sam: "Partner" }
        : { alex: "Alex", sam: "Sam" }
    );
    setScores({
      alex: { points: 0, streak: 0 },
      sam: { points: 0, streak: 0 },
    });

    // 3. Clear local storage and session storage
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("couple_task_hub_daily_tasks");
        localStorage.removeItem("couple_task_hub_routines");
        localStorage.removeItem("couple_task_hub_kanban_cards");
        sessionStorage.removeItem("couple_hub_onboarding_dismissed");

        // Dispatch broadcast event for all sibling context providers
        window.dispatchEvent(new CustomEvent("couple_hub_circle_left"));
      } catch {}
    }

    // 4. Immediately trigger onboarding modal so user can join/create again
    setIsOnboardingOpen(true);
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
      if (circle?.id) {
        updateScoresInFirebase(circle.id, updated).catch((err) =>
          console.warn("Update scores warning:", err?.message || err)
        );
      }
      return updated;
    });
  };

  const isConfigured = Boolean(circle || isTest);

  return (
    <HouseholdContext.Provider
      value={{
        circle,
        spaceMode,
        setSpaceMode,
        isConfigured,
        isOnboardingOpen,
        setIsOnboardingOpen,
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
