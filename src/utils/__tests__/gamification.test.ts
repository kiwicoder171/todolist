import { describe, it, expect } from "vitest";
import {
  calculatePenaltyForConsecutiveMisses,
  evaluatePartnerDay,
  calculatePartnerStreakAndScore,
  RewardItem,
} from "../gamification";
import { Routine } from "@/context/RoutinesContext";
import { Partner } from "@/context/HouseholdContext";

describe("Gamification Engine (Seam: Ticket 06 Scoring, Streaks & Penalty Ladder)", () => {
  describe("calculatePenaltyForConsecutiveMisses", () => {
    it("gives 0 penalty for 0 misses", () => {
      expect(calculatePenaltyForConsecutiveMisses(0)).toBe(0);
    });

    it("gives 0 penalty for 1 missed day (grace day)", () => {
      expect(calculatePenaltyForConsecutiveMisses(1)).toBe(0);
    });

    it("gives -1 point penalty for 2 consecutive missed days", () => {
      expect(calculatePenaltyForConsecutiveMisses(2)).toBe(-1);
    });

    it("gives -2 points penalty for 3 consecutive missed days", () => {
      expect(calculatePenaltyForConsecutiveMisses(3)).toBe(-2);
    });

    it("caps penalty at -3 points for 4 or more consecutive missed days (not per day)", () => {
      expect(calculatePenaltyForConsecutiveMisses(4)).toBe(-3);
      expect(calculatePenaltyForConsecutiveMisses(5)).toBe(-3);
      expect(calculatePenaltyForConsecutiveMisses(10)).toBe(-3);
    });
  });

  describe("evaluatePartnerDay", () => {
    const mockRoutines: Routine[] = [
      {
        id: "r1",
        title: "Morning Water",
        assignee: "both",
        frequency: "daily",
        order: 1,
        completions: { "2026-10-14": true },
      },
      {
        id: "r2",
        title: "Gym Workout",
        assignee: "mine", // Alex
        frequency: "daily",
        order: 2,
        completions: { "2026-10-14": true },
      },
      {
        id: "r3",
        title: "Meditation",
        assignee: "partner", // Sam
        frequency: "daily",
        order: 3,
        completions: { "2026-10-14": false },
      },
    ];

    it("evaluates Perfect Day for Alex when all Alex's routines are completed", () => {
      const evaluation = evaluatePartnerDay(
        "alex",
        new Date(2026, 9, 14),
        mockRoutines,
        () => false,
        (id, date) => {
          const key = "2026-10-14";
          return id === "r1" || id === "r2";
        }
      );

      expect(evaluation.totalScheduled).toBe(2); // r1 (both) and r2 (mine)
      expect(evaluation.completedCount).toBe(2);
      expect(evaluation.isPerfectDay).toBe(true);
      expect(evaluation.isFreezeDay).toBe(false);
    });

    it("evaluates non-perfect day for Sam when an assigned routine is not completed", () => {
      const evaluation = evaluatePartnerDay(
        "sam",
        new Date(2026, 9, 14),
        mockRoutines,
        () => false,
        (id) => id === "r1" // r3 is not completed
      );

      expect(evaluation.totalScheduled).toBe(2); // r1 (both) and r3 (partner)
      expect(evaluation.completedCount).toBe(1);
      expect(evaluation.isPerfectDay).toBe(false);
    });

    it("recognizes Freeze Day and waives penalty requirements", () => {
      const evaluation = evaluatePartnerDay(
        "alex",
        new Date(2026, 9, 18),
        mockRoutines,
        (d) => d.getDate() === 18, // 18th is frozen
        () => false
      );

      expect(evaluation.isFreezeDay).toBe(true);
    });
  });

  describe("calculatePartnerStreakAndScore", () => {
    it("accumulates streak and points for consecutive perfect days", () => {
      const dayRecords = [
        { date: "2026-10-10", isPerfect: true, isFreeze: false },
        { date: "2026-10-11", isPerfect: true, isFreeze: false },
        { date: "2026-10-12", isPerfect: true, isFreeze: false },
      ];

      const result = calculatePartnerStreakAndScore(10, dayRecords);
      // Started with 10 pts + 3 perfect days = 13 pts, streak = 3
      expect(result.streak).toBe(3);
      expect(result.points).toBe(13);
    });

    it("preserves streak during Freeze Days without penalty", () => {
      const dayRecords = [
        { date: "2026-10-10", isPerfect: true, isFreeze: false },
        { date: "2026-10-11", isPerfect: true, isFreeze: false },
        { date: "2026-10-12", isPerfect: false, isFreeze: true }, // Freeze day!
        { date: "2026-10-13", isPerfect: true, isFreeze: false },
      ];

      const result = calculatePartnerStreakAndScore(5, dayRecords);
      expect(result.streak).toBe(3); // 3 completed days, freeze day didn't reset streak
      expect(result.points).toBe(8); // 5 + 3 = 8 pts
    });

    it("applies penalty ladder and resets streak after consecutive misses, then resumes on return", () => {
      const dayRecords = [
        { date: "2026-10-01", isPerfect: true, isFreeze: false }, // streak 1, +1 pt
        { date: "2026-10-02", isPerfect: false, isFreeze: false }, // miss 1: grace (0 penalty)
        { date: "2026-10-03", isPerfect: false, isFreeze: false }, // miss 2: -1 pt
        { date: "2026-10-04", isPerfect: false, isFreeze: false }, // miss 3: -2 pts cumulative (-1 additional)
        { date: "2026-10-05", isPerfect: false, isFreeze: false }, // miss 4: -3 pts cumulative (-1 additional)
        { date: "2026-10-06", isPerfect: false, isFreeze: false }, // miss 5: capped at -3 total!
        { date: "2026-10-07", isPerfect: true, isFreeze: false }, // Returns! Resets miss block, streak 1, +1 pt
      ];

      // Initial: 10 pts
      // Oct 01: +1 (11)
      // Oct 02-06: -3 total penalty (8)
      // Oct 07: +1 (9)
      const result = calculatePartnerStreakAndScore(10, dayRecords);
      expect(result.streak).toBe(1);
      expect(result.points).toBe(9);
    });

    it("supports negative points balance", () => {
      const dayRecords = [
        { date: "2026-10-01", isPerfect: false, isFreeze: false }, // grace
        { date: "2026-10-02", isPerfect: false, isFreeze: false }, // -1
        { date: "2026-10-03", isPerfect: false, isFreeze: false }, // -2
        { date: "2026-10-04", isPerfect: false, isFreeze: false }, // -3
      ];

      // Initial: 1 pt. Penalty -3 -> Score: -2 pts
      const result = calculatePartnerStreakAndScore(1, dayRecords);
      expect(result.points).toBe(-2);
    });
  });
});
