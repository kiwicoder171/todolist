import { Routine, isRoutineScheduledForDate, formatDateKey } from "@/context/RoutinesContext";
import type { Partner, PartnerScoreState } from "@/context/HouseholdContext";
import { matchesAssigneeFilter } from "@/context/HouseholdContext";

export interface DayEvaluation {
  date: string;
  isFreezeDay: boolean;
  totalScheduled: number;
  completedCount: number;
  isPerfectDay: boolean;
  isExempt?: boolean;
}

export interface DayRecord {
  date: string;
  isPerfect: boolean;
  isFreeze: boolean;
  isExempt?: boolean;
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

  const isExempt = scheduled.length === 0;
  const isPerfectDay =
    scheduled.length > 0 && completedCount === scheduled.length;

  return {
    date: dateKey,
    isFreezeDay: isFreeze,
    totalScheduled: scheduled.length,
    completedCount,
    isPerfectDay,
    isExempt,
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

  // Defensive: ensure day records are processed chronologically
  const sortedRecords = [...records].sort((a, b) => a.date.localeCompare(b.date));

  for (const record of sortedRecords) {
    if (record.isFreeze || record.isExempt) {
      // Freeze or exempt day: preserves streak, waives penalties
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

export interface MissStatus {
  consecutiveMisses: number;
  totalPenalty: number;
}

/**
 * Calculates how many consecutive missed days have occurred prior to asOfDate.
 */
export function getConsecutiveMisses(
  partner: Partner,
  asOfDate: Date,
  routines: Routine[],
  isDateFrozen: (d: Date) => boolean,
  isRoutineCompleted: (id: string, d: Date) => boolean,
  lookbackDays = 14
): MissStatus {
  let consecutiveMisses = 0;

  // Walk backwards from yesterday
  for (let i = 1; i <= lookbackDays; i++) {
    const past = new Date(asOfDate);
    past.setDate(asOfDate.getDate() - i);
    const ev = evaluatePartnerDay(partner, past, routines, isDateFrozen, isRoutineCompleted);

    if (ev.isFreezeDay || ev.isExempt) {
      continue;
    }

    if (ev.isPerfectDay) {
      break;
    } else {
      consecutiveMisses++;
    }
  }

  return {
    consecutiveMisses,
    totalPenalty: calculatePenaltyForConsecutiveMisses(consecutiveMisses),
  };
}

export interface GamificationReconciliationInput {
  scores: Record<Partner, PartnerScoreState>;
  appliedPenalties: Record<Partner, Record<string, number>>;
  perfectDays: Record<Partner, string[]>;
  routines: Routine[];
  isDateFrozen: (d: Date) => boolean;
  isRoutineCompleted: (id: string, d: Date) => boolean;
  asOfDate: Date;
  earliestAllowedDate?: string | null;
  skipMock?: boolean;
}

export interface GamificationReconciliationResult {
  scores: Record<Partner, PartnerScoreState>;
  appliedPenalties: Record<Partner, Record<string, number>>;
  perfectDays: Record<Partner, string[]>;
  deltaPoints: Record<Partner, number>;
  changed: boolean;
}

/**
 * Calculates a partner's current streak deterministically by inspecting consecutive perfect days
 * backwards from asOfDate (including asOfDate if completed today).
 */
export function calculateCurrentStreak(
  partner: Partner,
  asOfDate: Date,
  routines: Routine[],
  isDateFrozen: (d: Date) => boolean,
  isRoutineCompleted: (id: string, d: Date) => boolean,
  maxLookbackDays = 60
): number {
  let streak = 0;

  // Check today first
  const todayEv = evaluatePartnerDay(partner, asOfDate, routines, isDateFrozen, isRoutineCompleted);
  if (todayEv.isPerfectDay) {
    streak += 1;
  }

  // Walk backwards from yesterday
  for (let i = 1; i <= maxLookbackDays; i++) {
    const past = new Date(asOfDate);
    past.setDate(asOfDate.getDate() - i);
    const ev = evaluatePartnerDay(partner, past, routines, isDateFrozen, isRoutineCompleted);

    if (ev.isFreezeDay || ev.isExempt) {
      // Freezes or exempt days preserve the streak without incrementing it
      continue;
    }

    if (ev.isPerfectDay) {
      streak += 1;
    } else {
      // Streak broken
      break;
    }
  }

  return streak;
}

export function reconcileGamificationState(
  input: GamificationReconciliationInput
): GamificationReconciliationResult {
  const {
    scores,
    appliedPenalties,
    perfectDays,
    routines,
    isDateFrozen,
    isRoutineCompleted,
    asOfDate,
    earliestAllowedDate,
    skipMock,
  } = input;

  if (skipMock || !routines || routines.length === 0) {
    return {
      scores,
      appliedPenalties,
      perfectDays,
      deltaPoints: { alex: 0, sam: 0 },
      changed: false,
    };
  }

  const asOfKey = formatDateKey(asOfDate);

  // Gather past date keys to evaluate (all past completed dates, recorded penalties, perfect dates, and up to 14 days back)
  const dateKeysSet = new Set<string>();
  routines.forEach((r) => {
    Object.keys(r.completions || {}).forEach((k) => dateKeysSet.add(k));
  });
  Object.keys(appliedPenalties.alex || {}).forEach((k) => dateKeysSet.add(k));
  Object.keys(appliedPenalties.sam || {}).forEach((k) => dateKeysSet.add(k));
  (perfectDays.alex || []).forEach((k) => dateKeysSet.add(k));
  (perfectDays.sam || []).forEach((k) => dateKeysSet.add(k));

  for (let i = 1; i <= 14; i++) {
    const past = new Date(asOfDate);
    past.setDate(asOfDate.getDate() - i);
    dateKeysSet.add(formatDateKey(past));
  }

  const sortedPastDates = Array.from(dateKeysSet)
    .filter((k) => k < asOfKey && (!earliestAllowedDate || k >= earliestAllowedDate))
    .sort();

  const partners: Partner[] = ["alex", "sam"];
  let changed = false;

  const nextScores: Record<Partner, PartnerScoreState> = {
    alex: { ...scores.alex },
    sam: { ...scores.sam },
  };
  const nextPenalties: Record<Partner, Record<string, number>> = {
    alex: { ...(appliedPenalties.alex || {}) },
    sam: { ...(appliedPenalties.sam || {}) },
  };
  const nextPerfectDays: Record<Partner, string[]> = {
    alex: [...(perfectDays.alex || [])],
    sam: [...(perfectDays.sam || [])],
  };
  const deltaPoints: Record<Partner, number> = { alex: 0, sam: 0 };

  for (const partner of partners) {
    let consecutiveMisses = 0;
    let previousPenaltyInBlock = 0;
    const partnerPerfectDates = new Set<string>();
    let partnerDelta = 0;

    for (const dateStr of sortedPastDates) {
      const parts = dateStr.split("-").map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);

      const ev = evaluatePartnerDay(partner, d, routines, isDateFrozen, isRoutineCompleted);

      if (ev.isFreezeDay || ev.isExempt) {
        continue;
      }

      if (ev.isPerfectDay) {
        partnerPerfectDates.add(dateStr);
        consecutiveMisses = 0;
        previousPenaltyInBlock = 0;

        const previouslyApplied = nextPenalties[partner][dateStr] || 0;
        if (previouslyApplied !== 0) {
          partnerDelta -= previouslyApplied; // refund
          delete nextPenalties[partner][dateStr];
          changed = true;
        }
      } else {
        consecutiveMisses += 1;
        const totalPenalty = calculatePenaltyForConsecutiveMisses(consecutiveMisses);
        const expectedDelta = totalPenalty - previousPenaltyInBlock;
        previousPenaltyInBlock = totalPenalty;

        const previouslyApplied = nextPenalties[partner][dateStr] || 0;
        const deltaToApply = expectedDelta - previouslyApplied;

        if (deltaToApply !== 0) {
          partnerDelta += deltaToApply;
        }

        if (expectedDelta !== 0) {
          if (nextPenalties[partner][dateStr] !== expectedDelta) {
            nextPenalties[partner][dateStr] = expectedDelta;
            changed = true;
          }
        } else if (nextPenalties[partner][dateStr] !== undefined) {
          delete nextPenalties[partner][dateStr];
          changed = true;
        }
      }
    }

    // Evaluate today (asOfDate) for completion & streak addition
    const todayEv = evaluatePartnerDay(partner, asOfDate, routines, isDateFrozen, isRoutineCompleted);
    if (todayEv.isPerfectDay) {
      partnerPerfectDates.add(asOfKey);
    }

    // Determine streak deterministically:
    // 1. If the partner had consecutive misses leading up to today, streak is broken (0).
    // 2. Walk backwards chronologically through sortedPastDates + today to compute streak from consecutive perfect days.
    // 3. If no past dates or today broke the streak (e.g. days were frozen/exempt), preserve existing scores[partner].streak.
    let finalStreak = 0;
    if (consecutiveMisses > 0) {
      finalStreak = 0;
    } else {
      // Calculate backwards from today
      const currentBackwardsStreak = calculateCurrentStreak(partner, asOfDate, routines, isDateFrozen, isRoutineCompleted);
      finalStreak = Math.max(scores[partner].streak || 0, currentBackwardsStreak);
    }

    deltaPoints[partner] = partnerDelta;

    const newPoints = scores[partner].points + partnerDelta;
    if (newPoints !== scores[partner].points || finalStreak !== scores[partner].streak) {
      nextScores[partner] = {
        points: newPoints,
        streak: finalStreak,
      };
      changed = true;
    }

    const updatedPerfectList = Array.from(partnerPerfectDates).sort();
    const oldPerfectList = (perfectDays[partner] || []).slice().sort();
    if (
      updatedPerfectList.length !== oldPerfectList.length ||
      updatedPerfectList.some((d, idx) => d !== oldPerfectList[idx])
    ) {
      nextPerfectDays[partner] = updatedPerfectList;
      changed = true;
    }
  }

  return {
    scores: nextScores,
    appliedPenalties: nextPenalties,
    perfectDays: nextPerfectDays,
    deltaPoints,
    changed,
  };
}
