import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import {
  calculatePenaltyForConsecutiveMisses,
  getConsecutiveMisses,
  reconcileGamificationState,
} from "@/utils/gamification";
import { Routine } from "@/context/RoutinesContext";
import { HouseholdProvider, useHousehold } from "@/context/HouseholdContext";
import { RoutinesProvider } from "@/context/RoutinesContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AuthProvider } from "@/context/AuthContext";
import { DailyRoutinesBoard } from "@/components/DailyRoutinesBoard";

describe("Gamification Penalty Ladder & Missed Routines Reconciliation", () => {
  const sampleRoutines: Routine[] = [
    {
      id: "r-1",
      title: "Morning Stretch",
      assignee: "mine",
      frequency: "daily",
      order: 0,
      completions: {},
    },
    {
      id: "r-2",
      title: "Evening Reading",
      assignee: "both",
      frequency: "daily",
      order: 1,
      completions: {},
    },
  ];

  it("applies penalty ladder: 0 on 1 miss, -1 on 2 misses, -2 on 3 misses, -3 capped on 4+ misses", () => {
    expect(calculatePenaltyForConsecutiveMisses(0)).toBe(0);
    expect(calculatePenaltyForConsecutiveMisses(1)).toBe(0); // Grace day
    expect(calculatePenaltyForConsecutiveMisses(2)).toBe(-1); // -1 pt for 2 consecutive misses
    expect(calculatePenaltyForConsecutiveMisses(3)).toBe(-2); // -2 pts for 3 consecutive misses
    expect(calculatePenaltyForConsecutiveMisses(4)).toBe(-3); // -3 pts cap
    expect(calculatePenaltyForConsecutiveMisses(10)).toBe(-3); // -3 pts cap
  });

  it("reconciles -1 point penalty after 2 days of not completing daily routines", () => {
    // As of 2026-10-24, 2026-10-22 and 2026-10-23 were both missed
    const initialScores = {
      alex: { points: 10, streak: 3 },
      sam: { points: 5, streak: 1 },
    };

    const result = reconcileGamificationState({
      scores: initialScores,
      appliedPenalties: { alex: {}, sam: {} },
      perfectDays: { alex: [], sam: [] },
      routines: sampleRoutines,
      isDateFrozen: () => false,
      isRoutineCompleted: () => false,
      asOfDate: new Date(2026, 9, 24), // Oct 24
      earliestAllowedDate: "2026-10-22",
    });

    expect(result.changed).toBe(true);
    // 2 consecutive misses (Oct 22 and Oct 23): -1 pt penalty, streak reset to 0
    expect(result.scores.alex.points).toBe(9); // 10 - 1 = 9
    expect(result.scores.alex.streak).toBe(0);
    expect(result.appliedPenalties.alex["2026-10-23"]).toBe(-1);
  });

  it("is idempotent: re-evaluating does not double-deduct penalties", () => {
    const scores = {
      alex: { points: 9, streak: 0 },
      sam: { points: 4, streak: 0 },
    };
    const appliedPenalties = {
      alex: { "2026-10-23": -1 },
      sam: { "2026-10-23": -1 },
    };

    const result = reconcileGamificationState({
      scores,
      appliedPenalties,
      perfectDays: { alex: [], sam: [] },
      routines: sampleRoutines,
      isDateFrozen: () => false,
      isRoutineCompleted: () => false,
      asOfDate: new Date(2026, 9, 24),
      earliestAllowedDate: "2026-10-22",
    });

    expect(result.changed).toBe(false);
    expect(result.scores.alex.points).toBe(9);
    expect(result.deltaPoints.alex).toBe(0);
  });

  it("supports negative points balances when starting from 0", () => {
    const initialScores = {
      alex: { points: 0, streak: 0 },
      sam: { points: 0, streak: 0 },
    };

    const result = reconcileGamificationState({
      scores: initialScores,
      appliedPenalties: { alex: {}, sam: {} },
      perfectDays: { alex: [], sam: [] },
      routines: sampleRoutines,
      isDateFrozen: () => false,
      isRoutineCompleted: () => false,
      asOfDate: new Date(2026, 9, 24),
      earliestAllowedDate: "2026-10-22",
    });

    expect(result.scores.alex.points).toBe(-1);
    expect(result.scores.alex.streak).toBe(0);
  });

  it("waives penalties on Freeze Days and preserves streaks", () => {
    const initialScores = {
      alex: { points: 5, streak: 2 },
      sam: { points: 5, streak: 2 },
    };

    // Oct 22 and Oct 23 are frozen
    const result = reconcileGamificationState({
      scores: initialScores,
      appliedPenalties: { alex: {}, sam: {} },
      perfectDays: { alex: [], sam: [] },
      routines: sampleRoutines,
      isDateFrozen: (d) => d.getDate() === 22 || d.getDate() === 23,
      isRoutineCompleted: () => false,
      asOfDate: new Date(2026, 9, 24),
      earliestAllowedDate: "2026-10-22",
    });

    expect(result.scores.alex.points).toBe(5);
    expect(result.scores.alex.streak).toBe(2);
  });

  it("refunds penalties if a user retroactively completes routines for a missed day", () => {
    const initialScores = {
      alex: { points: 9, streak: 0 },
      sam: { points: 4, streak: 0 },
    };
    const appliedPenalties = {
      alex: { "2026-10-23": -1 },
      sam: {},
    };

    // User now completed routines on 2026-10-23!
    const routinesWithCompletion: Routine[] = [
      {
        ...sampleRoutines[0],
        completions: { "2026-10-23": true },
      },
      {
        ...sampleRoutines[1],
        completions: { "2026-10-23": true },
      },
    ];

    const result = reconcileGamificationState({
      scores: initialScores,
      appliedPenalties,
      perfectDays: { alex: [], sam: [] },
      routines: routinesWithCompletion,
      isDateFrozen: () => false,
      isRoutineCompleted: (id, d) => {
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        return k === "2026-10-23";
      },
      asOfDate: new Date(2026, 9, 24),
      earliestAllowedDate: "2026-10-22",
    });

    // The -1 penalty for Oct 23 is refunded (+1 point)
    expect(result.scores.alex.points).toBe(10);
    expect(result.appliedPenalties.alex["2026-10-23"]).toBeUndefined();
    expect(result.scores.alex.streak).toBe(1);
  });

  it("calculates consecutive misses correctly using getConsecutiveMisses", () => {
    const asOf = new Date(2026, 9, 24);
    const status = getConsecutiveMisses(
      "alex",
      asOf,
      sampleRoutines,
      () => false,
      () => false,
      2
    );

    expect(status.consecutiveMisses).toBe(2);
    expect(status.totalPenalty).toBe(-1);
  });
});
