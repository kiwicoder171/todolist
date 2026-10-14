import { Routine, isRoutineScheduledForDate, formatDateKey } from "@/context/RoutinesContext";
import { Partner, matchesAssigneeFilter } from "@/context/HouseholdContext";

export interface DayEvaluation {
  date: string;
  isFreezeDay: boolean;
  totalScheduled: number;
  completedCount: number;
  isPerfectDay: boolean;
}

export interface DayRecord {
  date: string;
  isPerfect: boolean;
  isFreeze: boolean;
}

export interface StreakAndScoreResult {
  points: number;
  streak: number;
}

export interface RewardItem {
  id: string;
  title: string;
  desc: string;
  cost: number;
  emoji?: string;
}

export const DEFAULT_REWARDS: RewardItem[] = [
  {
    id: "reward-1",
    title: "Cook Favorite Dinner 🍝",
    desc: "Partner cooks whatever meal you choose",
    cost: 10,
    emoji: "🍝",
  },
  {
    id: "reward-2",
    title: "30 Min Back Massage 💆",
    desc: "Relaxing massage after a busy week",
    cost: 15,
    emoji: "💆",
  },
  {
    id: "reward-3",
    title: "Pick Movie & Snacks 🍿",
    desc: "Total veto power over Friday movie night",
    cost: 5,
    emoji: "🍿",
  },
  {
    id: "reward-4",
    title: "Breakfast in Bed ☕🥐",
    desc: "Weekend morning coffee & pancakes",
    cost: 20,
    emoji: "☕",
  },
];

/**
 * Penalty ladder for consecutive missed days:
 * 0 or 1 day: 0 points (grace day)
 * 2 consecutive days: -1 point
 * 3 consecutive days: -2 points
 * 4+ consecutive days: -3 points (capped at -3 total for the absence block)
 */
export function calculatePenaltyForConsecutiveMisses(
  consecutiveMisses: number
): number {
  if (consecutiveMisses <= 1) return 0;
  if (consecutiveMisses === 2) return -1;
  if (consecutiveMisses === 3) return -2;
  return -3;
}

/**
 * Evaluates whether a partner achieved 100% completion of scheduled daily routines on a given date.
 */
export function evaluatePartnerDay(
  partner: Partner,
  date: Date,
  routines: Routine[],
  isDateFrozen: (date: Date) => boolean,
  isRoutineCompleted: (id: string, date: Date) => boolean
): DayEvaluation {
  const dateKey = formatDateKey(date);
  const isFreeze = isDateFrozen(date);

  // Filter routines applicable to this partner
  const relevantRoutines = routines.filter((r) =>
    matchesAssigneeFilter(r.assignee, partner, "mine")
  );

  // Filter routines scheduled for this specific day of the week
  const scheduled = relevantRoutines.filter((r) =>
    isRoutineScheduledForDate(r.frequency, date)
  );

  const completedCount = scheduled.filter((r) =>
    isRoutineCompleted(r.id, date)
  ).length;

  const isPerfectDay =
    scheduled.length > 0 && completedCount === scheduled.length;

  return {
    date: dateKey,
    isFreezeDay: isFreeze,
    totalScheduled: scheduled.length,
    completedCount,
    isPerfectDay,
  };
}

/**
 * Calculates streak and point progression over a chronological series of day records.
 */
export function calculatePartnerStreakAndScore(
  basePoints: number,
  records: DayRecord[]
): StreakAndScoreResult {
  let points = basePoints;
  let currentStreak = 0;
  let consecutiveMisses = 0;
  let previousPenaltyApplied = 0;

  for (const record of records) {
    if (record.isFreeze) {
      // Freeze day: preserves streak, waives penalties
      continue;
    }

    if (record.isPerfect) {
      // Earn +1 pt and +1 streak
      points += 1;
      currentStreak += 1;
      consecutiveMisses = 0;
      previousPenaltyApplied = 0;
    } else {
      // Missed day: resets streak and evaluates penalty tier
      currentStreak = 0;
      consecutiveMisses += 1;
      const totalPenaltyForMissBlock =
        calculatePenaltyForConsecutiveMisses(consecutiveMisses);
      const deltaPenalty = totalPenaltyForMissBlock - previousPenaltyApplied;
      points += deltaPenalty;
      previousPenaltyApplied = totalPenaltyForMissBlock;
    }
  }

  return {
    points,
    streak: currentStreak,
  };
}
