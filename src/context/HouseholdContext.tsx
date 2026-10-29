"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  saveCircleToFirebase,
  findCircleByJoinCode,
  subscribeToCircle,
  updateScoresInFirebase,
} from "@/lib/firebaseSync";
import { useOptionalAuth } from "./AuthContext";
import { reconcileGamificationState } from "@/utils/gamification";

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
  updatePartnerName: (partner: Partner, newName: string) => void;
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
  updateScore: (partner: Partner, deltaPoints: number, deltaStreak?: number) => void;
  perfectDays: Record<Partner, string[]>;
  reconcilePerfectDays: (partner: Partner, perfectDateKeys: string[]) => void;
  appliedPenalties: Record<Partner, Record<string, number>>;
  reconcileDailyPenaltiesAndStreaks: (
    routineList: any[],
    isRoutineCompleted: (id: string, date: Date) => boolean,
    asOfDate?: Date
  ) => { deltaPoints: Record<Partner, number>; streaks: Record<Partner, number> };
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

/**
 * Maps the user's intent in task/routine forms ("mine" -> Me, "partner" -> Partner, "both" -> Both)
 * to the domain storage assignee relative to who is active.
 * - When activePartner is "alex": Me -> "mine", Partner -> "partner", Both -> "both"
 * - When activePartner is "sam":  Me -> "partner", Partner -> "mine", Both -> "both"
 */
export function resolveIntentToAssignee(
  intent: "mine" | "partner" | "both",
  activePartner: Partner
): Assignee {
  if (intent === "both") return "both";
  if (activePartner === "alex") {
    return intent === "mine" ? "mine" : "partner";
  } else {
    return intent === "mine" ? "partner" : "mine";
  }
}

/**
 * Maps a domain storage assignee to a relative user-facing label:
 * - "Me" (if assigned to the currently active partner)
 * - partnerName (if assigned to the other partner)
 * - "Both" (if assigned to both)
 */
export function getAssigneeLabel(
  assignee: Assignee,
  activePartner: Partner,
  partnerNames: Record<Partner, string>
): string {
  if (assignee === "both") return "Both";
  const isMine =
    activePartner === "alex" ? assignee === "mine" : assignee === "partner";
  if (isMine) return "Me";
  return activePartner === "alex" ? partnerNames.sam : partnerNames.alex;
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

export const isMockScores = (s: Record<Partner, PartnerScoreState> | undefined | null): boolean => {
  if (!s || !s.alex || !s.sam) return false;
  return (
    s.alex.points === MOCK_SCORES.alex.points &&
    s.alex.streak === MOCK_SCORES.alex.streak &&
    s.sam.points === MOCK_SCORES.sam.points &&
    s.sam.streak === MOCK_SCORES.sam.streak
  );
};

export function sanitizeScores(raw: any): Record<Partner, PartnerScoreState> {
  if (!raw || isMockScores(raw)) {
    return { alex: { points: 0, streak: 0 }, sam: { points: 0, streak: 0 } };
  }
  const alexRaw = Number(raw?.alex?.points);
  const samRaw = Number(raw?.sam?.points);
  const alexPts = Number.isFinite(alexRaw) ? Math.max(0, alexRaw) : 0;
  const samPts = Number.isFinite(samRaw) ? Math.max(0, samRaw) : 0;

  return {
    alex: {
      points: alexPts,
      streak: Math.max(0, Number(raw?.alex?.streak) || 0),
    },
    sam: {
      points: samPts,
      streak: Math.max(0, Number(raw?.sam?.streak) || 0),
    },
  };
}

export const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";
  const authContext = useOptionalAuth();
  const user = authContext?.user;
  const authLoading = authContext?.loading ?? false;
  const updateUserCircle = authContext?.updateUserCircle || (async () => {});

  const [circle, setCircle] = useState<CircleState | null>(() => {
    if (typeof window !== "undefined") {
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
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.partnerNames) return parsed.partnerNames;
        }
      } catch {}
    }
    if (user) {
      return { alex: user.username || "You", sam: "Partner" };
    }
    return { alex: "Alex", sam: "Sam" };
  });

  const [activePartner, setActivePartner] = useState<Partner>("alex");
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    isTest ? new Date(2026, 9, 14) : new Date()
  );
  const [frozenDates, setFrozenDates] = useState<Record<string, boolean>>({
    "2026-10-18": true,
  });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [spaceMode, setSpaceModeState] = useState<SpaceMode>(() => {
    if (typeof window !== "undefined") {
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
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.scores) {
            if ((user || parsed.circle) && isMockScores(parsed.scores)) {
              return { alex: { points: 0, streak: 0 }, sam: { points: 0, streak: 0 } };
            }
            return parsed.scores;
          }
        }
      } catch {}
    }
    if (user) {
      return { alex: { points: 0, streak: 0 }, sam: { points: 0, streak: 0 } };
    }
    return MOCK_SCORES;
  });

  const [perfectDays, setPerfectDays] = useState<Record<Partner, string[]>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.perfectDays) return parsed.perfectDays;
        }
      } catch {}
    }
    return { alex: [], sam: [] };
  });

  const [appliedPenalties, setAppliedPenalties] = useState<
    Record<Partner, Record<string, number>>
  >(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.appliedPenalties) return parsed.appliedPenalties;
        }
      } catch {}
    }
    return { alex: {}, sam: {} };
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
        if (parsed.perfectDays) setPerfectDays(parsed.perfectDays);
        if (parsed.appliedPenalties) setAppliedPenalties(parsed.appliedPenalties);
        if (parsed.scores) {
          if ((user || parsed.circle) && isMockScores(parsed.scores)) {
            const clean = { alex: { points: 0, streak: 0 }, sam: { points: 0, streak: 0 } };
            setScores(clean);
            saveState(parsed.circle || circle, parsed.partnerNames || partnerNames, clean, parsed.spaceMode || spaceMode, parsed.perfectDays, parsed.appliedPenalties);
          } else {
            setScores(parsed.scores);
          }
        }
        if (parsed.spaceMode) setSpaceModeState(parsed.spaceMode);
        else if (parsed.circle?.mode) setSpaceModeState(parsed.circle.mode);
      }
    } catch {}
  }, [isTest, user]);

  // Synchronize mock vs authenticated state:
  // - Pre-login: mock names "Alex & Sam", mock scores (12 & 9 pts)
  // - Logged in without circle: user's space, clean scores (0 pts, 0 streak), NO "Alex & Sam"
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      setScores((prev) => {
        if (isMockScores(prev)) {
          return { alex: { points: 0, streak: 0 }, sam: { points: 0, streak: 0 } };
        }
        return prev;
      });
      if (!circle) {
        setPartnerNames({
          alex: user.username || "You",
          sam: "Partner",
        });
      }
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
  }, [user, circle, authLoading]);

  // Save to localStorage whenever critical state updates
  const saveState = (
    newCircle: CircleState | null,
    newNames: Record<Partner, string>,
    newScores: Record<Partner, PartnerScoreState>,
    newMode?: SpaceMode,
    newPerfectDays?: Record<Partner, string[]>,
    newPenalties?: Record<Partner, Record<string, number>>
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
          perfectDays: newPerfectDays !== undefined ? newPerfectDays : perfectDays,
          appliedPenalties: newPenalties !== undefined ? newPenalties : appliedPenalties,
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
      const cleanScores = sanitizeScores((remoteCircle as any).scores);
      setScores((prev) => {
        if (
          prev.alex.points === cleanScores.alex.points &&
          prev.alex.streak === cleanScores.alex.streak &&
          prev.sam.points === cleanScores.sam.points &&
          prev.sam.streak === cleanScores.sam.streak
        ) {
          return prev;
        }
        return cleanScores;
      });
      if (user.partnerRole) {
        setActivePartner(user.partnerRole);
      }
      if ((remoteCircle as any).perfectDays) {
        setPerfectDays((remoteCircle as any).perfectDays);
      }
      if ((remoteCircle as any).appliedPenalties) {
        setAppliedPenalties((remoteCircle as any).appliedPenalties);
      }
      saveState(
        remoteCircle,
        names,
        cleanScores,
        undefined,
        (remoteCircle as any).perfectDays,
        (remoteCircle as any).appliedPenalties
      );
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
        const cleanScores = sanitizeScores((remoteCircle as any).scores);
        setScores((prev) => {
          if (
            prev.alex.points === cleanScores.alex.points &&
            prev.alex.streak === cleanScores.alex.streak &&
            prev.sam.points === cleanScores.sam.points &&
            prev.sam.streak === cleanScores.sam.streak
          ) {
            return prev;
          }
          return cleanScores;
        });
      }
      if ((remoteCircle as any).perfectDays) {
        setPerfectDays((remoteCircle as any).perfectDays);
      }
      if ((remoteCircle as any).appliedPenalties) {
        setAppliedPenalties((remoteCircle as any).appliedPenalties);
      }
    });
    return () => unsub();
  }, [circle?.id]);

  const createCircle = (userName: string, circleName?: string, mode: SpaceMode = "partner"): string => {
    const finalName = userName.trim() || user?.username || "Alex";
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
    const finalName = userName.trim() || user?.username || "Sam";
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

  const updateScore = (partner: Partner, deltaPoints: number, deltaStreak: number = 0) => {
    setScores((prev) => {
      const base =
        (user || circle) && isMockScores(prev)
          ? { alex: { points: 0, streak: 0 }, sam: { points: 0, streak: 0 } }
          : prev;
      const nextPoints = Math.max(0, base[partner].points + deltaPoints);
      const nextStreak = Math.max(0, base[partner].streak + deltaStreak);
      if (nextPoints === base[partner].points && nextStreak === base[partner].streak) {
        return prev;
      }
      const updated = {
        ...base,
        [partner]: {
          points: nextPoints,
          streak: nextStreak,
        },
      };
      saveState(circle, partnerNames, updated, spaceMode, perfectDays);
      if (circle?.id) {
        updateScoresInFirebase(circle.id, updated).catch((err) =>
          console.warn("Update scores warning:", err?.message || err)
        );
      }
      return updated;
    });
  };

  const reconcilePerfectDays = (partner: Partner, perfectDateKeys: string[]) => {
    setPerfectDays((prevPerfect) => {
      const currentDates = prevPerfect[partner] || [];
      const newDatesSet = new Set(perfectDateKeys);
      const currentDatesSet = new Set(currentDates);

      // Check if there are any differences
      const addedDates = perfectDateKeys.filter((d) => !currentDatesSet.has(d));
      const removedDates = currentDates.filter((d) => !newDatesSet.has(d));

      if (addedDates.length === 0 && removedDates.length === 0) {
        return prevPerfect; // No change
      }

      const deltaPoints = addedDates.length - removedDates.length;

      // Calculate streak: consecutive perfect dates
      const sorted = [...perfectDateKeys].sort();
      let currentStreak = 0;
      if (sorted.length > 0) {
        currentStreak = 1;
        for (let i = sorted.length - 1; i > 0; i--) {
          const curr = new Date(sorted[i]);
          const prev = new Date(sorted[i - 1]);
          const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      setScores((prevScores) => {
        const base =
          (user || circle) && isMockScores(prevScores)
            ? { alex: { points: 0, streak: 0 }, sam: { points: 0, streak: 0 } }
            : prevScores || { alex: { points: 0, streak: 0 }, sam: { points: 0, streak: 0 } };

        const updatedPartnerScore: PartnerScoreState = {
          points: Math.max(0, base[partner].points + deltaPoints),
          streak: currentStreak,
        };
        const updatedScores = {
          ...base,
          [partner]: updatedPartnerScore,
        };

        const updatedPerfect = {
          ...prevPerfect,
          [partner]: [...perfectDateKeys],
        };

        saveState(circle, partnerNames, updatedScores, spaceMode, updatedPerfect);

        if (circle?.id) {
          updateScoresInFirebase(circle.id, updatedScores).catch((err) =>
            console.warn("Update scores warning:", err?.message || err)
          );
        }

        return updatedScores;
      });

      return {
        ...prevPerfect,
        [partner]: [...perfectDateKeys],
      };
    });
  };

  const reconcileDailyPenaltiesAndStreaks = useCallback(
    (
      routineList: any[],
      isRoutineCompleted: (id: string, date: Date) => boolean,
      asOfDate?: Date
    ) => {
      const now = new Date();
      const targetDate = asOfDate
        ? asOfDate
        : selectedDate && selectedDate.getTime() > now.getTime()
        ? selectedDate
        : now;
      const skipMock = !user && !circle && isMockScores(scores);

      const result = reconcileGamificationState({
        scores,
        appliedPenalties,
        perfectDays,
        routines: routineList,
        isDateFrozen,
        isRoutineCompleted,
        asOfDate: targetDate,
        earliestAllowedDate: circle?.createdAt ? formatDateKey(new Date(circle.createdAt)) : null,
        skipMock,
      });

      if (result.changed) {
        setScores(result.scores);
        setAppliedPenalties(result.appliedPenalties);
        setPerfectDays(result.perfectDays);
        saveState(
          circle,
          partnerNames,
          result.scores,
          spaceMode,
          result.perfectDays,
          result.appliedPenalties
        );
        if (circle?.id) {
          updateScoresInFirebase(
            circle.id,
            result.scores,
            result.appliedPenalties,
            result.perfectDays
          ).catch((err) =>
            console.warn("Update scores warning:", err?.message || err)
          );
        }
      }

      return {
        deltaPoints: result.deltaPoints,
        streaks: { alex: result.scores.alex.streak, sam: result.scores.sam.streak },
      };
    },
    [
      circle,
      partnerNames,
      scores,
      spaceMode,
      perfectDays,
      appliedPenalties,
      user,
      selectedDate,
      isDateFrozen,
    ]
  );

  const updatePartnerName = (partner: Partner, newName: string) => {
    const clean = newName.trim();
    if (!clean) return;
    const updatedNames = { ...partnerNames, [partner]: clean };
    setPartnerNames(updatedNames);
    if (circle) {
      const updatedCircle: CircleState = {
        ...circle,
        createdByName: partner === "alex" ? clean : circle.createdByName,
        partnerName: partner === "sam" ? clean : circle.partnerName,
      };
      setCircle(updatedCircle);
      saveCircleToFirebase(updatedCircle).catch((err) =>
        console.warn("Update circle partner name warning:", err?.message || err)
      );
      saveState(updatedCircle, updatedNames, scores, spaceMode);
    } else {
      saveState(circle, updatedNames, scores, spaceMode);
    }
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
        updatePartnerName,
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
        perfectDays,
        reconcilePerfectDays,
        appliedPenalties,
        reconcileDailyPenaltiesAndStreaks,
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
