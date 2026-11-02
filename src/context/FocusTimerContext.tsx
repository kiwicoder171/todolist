"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useHousehold, Partner, formatDateKey } from "./HouseholdContext";
import { supabase } from "@/lib/supabase";

export type FocusMode = "stopwatch" | "pomodoro";

export interface FocusTarget {
  id: string;
  title: string;
  type?: "routine" | "daily" | "kanban" | "custom";
  category?: string;
}

export interface FocusSession {
  id: string;
  partner?: Partner;
  target: FocusTarget;
  mode: FocusMode;
  startedAt: number; // Date.now() timestamp
  accumulatedSeconds: number;
  isRunning: boolean;
  isBreak: boolean;
  targetSeconds: number; // e.g. 25 * 60 = 1500
  breakSeconds: number; // e.g. 5 * 60 = 300
}

export interface FocusLogItem {
  id: string;
  partner: Partner;
  taskTitle: string;
  category?: string;
  durationSeconds: number;
  durationMinutes: number;
  startedAt: string;
  startedAtTimestamp?: number;
  completedAt: string;
  dateKey: string;
  mode: FocusMode;
}

export interface PartnerFocusPresence {
  partner: Partner;
  isFocusing: boolean;
  taskTitle?: string;
  category?: string;
  mode?: FocusMode;
  secondsElapsed?: number;
  isBreak?: boolean;
  updatedAt: number;
}

export function formatTimeDisplay(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export interface FocusTimerContextType {
  activeSession: FocusSession | null;
  displaySeconds: number;
  isRunning: boolean;
  isBreak: boolean;
  startFocus: (target: FocusTarget, mode?: FocusMode, targetMinutes?: number) => void;
  pauseFocus: () => void;
  resumeFocus: () => void;
  toggleBreak: () => void;
  stopFocus: (record?: boolean) => FocusLogItem | null;
  partnerPresence: PartnerFocusPresence | null;
  sendCheerToPartner: (emoji: string) => void;
  cheerReceived: { emoji: string; from: Partner; id: string } | null;
  logs: FocusLogItem[];
  getLogsForDate: (date: Date) => FocusLogItem[];
  getTotalFocusMinutesForDate: (date: Date, partner?: Partner) => number;
}

const STORAGE_ACTIVE_KEY = "couple_task_hub_active_focus";
const STORAGE_LOGS_KEY = "couple_task_hub_focus_logs";
const STORAGE_PRESENCE_KEY = "couple_task_hub_partner_presence";
const CHANNEL_NAME = "couple_focus_sync_channel";

const FocusTimerContext = createContext<FocusTimerContextType | undefined>(undefined);

export function FocusTimerProvider({ children }: { children: ReactNode }) {
  const { activePartner, circle } = useHousehold();
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);
  const [displaySeconds, setDisplaySeconds] = useState<number>(0);
  const [partnerPresence, setPartnerPresence] = useState<PartnerFocusPresence | null>(null);
  const [cheerReceived, setCheerReceived] = useState<{ emoji: string; from: Partner; id: string } | null>(null);
  const [logs, setLogs] = useState<FocusLogItem[]>([]);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Load logs and active session on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedLogs = localStorage.getItem(STORAGE_LOGS_KEY);
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }

      const savedActive = localStorage.getItem(STORAGE_ACTIVE_KEY);
      if (savedActive) {
        const parsed: FocusSession = JSON.parse(savedActive);
        setActiveSession(parsed);
        if (parsed.isRunning) {
          const delta = Math.floor((Date.now() - parsed.startedAt) / 1000);
          const currentElapsed = parsed.accumulatedSeconds + Math.max(0, delta);
          setDisplaySeconds(currentElapsed);
        } else {
          setDisplaySeconds(parsed.accumulatedSeconds);
        }
      }

      const savedPresence = localStorage.getItem(STORAGE_PRESENCE_KEY);
      if (savedPresence) {
        setPartnerPresence(JSON.parse(savedPresence));
      }
    } catch (e) {
      console.warn("Failed to read focus timer state from localStorage", e);
    }
  }, []);

  // Setup BroadcastChannel for multi-tab instantaneous synchronization
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    const channel = new BroadcastChannel(CHANNEL_NAME);
    broadcastChannelRef.current = channel;

    channel.onmessage = (event) => {
      const data = event.data;
      if (!data) return;

      if (data.type === "PRESENCE_UPDATE") {
        if (data.presence && data.presence.partner !== activePartner) {
          setPartnerPresence(data.presence);
        }
      } else if (data.type === "CHEER") {
        if (data.to === activePartner) {
          setCheerReceived({ emoji: data.emoji, from: data.from, id: String(Date.now()) });
        }
      } else if (data.type === "LOG_ADDED") {
        setLogs((prev) => [data.log, ...prev.filter((l) => l.id !== data.log.id)]);
      }
    };

    return () => {
      channel.close();
    };
  }, [activePartner]);

  // Broadcast presence updates helper
  const broadcastPresence = useCallback(
    (presence: PartnerFocusPresence) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_PRESENCE_KEY, JSON.stringify(presence));
        } catch (_) {}
      }
      broadcastChannelRef.current?.postMessage({
        type: "PRESENCE_UPDATE",
        presence,
      });

      // If Supabase realtime is available and linked to a household circle
      if (supabase && circle?.id) {
        try {
          const channel = supabase.channel(`household_focus_${circle.id}`);
          channel.send({
            type: "broadcast",
            event: "presence",
            payload: presence,
          });
        } catch (_) {}
      }
    },
    [circle]
  );

  // Tick interval for active timer using timestamp delta
  useEffect(() => {
    if (!activeSession || !activeSession.isRunning) return;

    const interval = setInterval(() => {
      const delta = Math.floor((Date.now() - activeSession.startedAt) / 1000);
      const totalSec = activeSession.accumulatedSeconds + Math.max(0, delta);
      setDisplaySeconds(totalSec);

      // Periodically update presence
      broadcastPresence({
        partner: activePartner,
        isFocusing: true,
        taskTitle: activeSession.target.title,
        category: activeSession.target.category,
        mode: activeSession.mode,
        secondsElapsed: totalSec,
        isBreak: activeSession.isBreak,
        updatedAt: Date.now(),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, activePartner, broadcastPresence]);

  const saveActiveSession = (session: FocusSession | null) => {
    setActiveSession(session);
    if (typeof window !== "undefined") {
      try {
        if (session) {
          localStorage.setItem(STORAGE_ACTIVE_KEY, JSON.stringify(session));
        } else {
          localStorage.removeItem(STORAGE_ACTIVE_KEY);
        }
      } catch (_) {}
    }
  };

  const startFocus = useCallback(
    (target: FocusTarget, mode: FocusMode = "stopwatch", targetMinutes: number = 25) => {
      const newSession: FocusSession = {
        id: `focus_${Date.now()}`,
        partner: activePartner,
        target,
        mode,
        startedAt: Date.now(),
        accumulatedSeconds: 0,
        isRunning: true,
        isBreak: false,
        targetSeconds: targetMinutes * 60,
        breakSeconds: 5 * 60,
      };

      saveActiveSession(newSession);
      setDisplaySeconds(0);

      broadcastPresence({
        partner: activePartner,
        isFocusing: true,
        taskTitle: target.title,
        category: target.category,
        mode,
        secondsElapsed: 0,
        isBreak: false,
        updatedAt: Date.now(),
      });
    },
    [activePartner, broadcastPresence]
  );

  const pauseFocus = useCallback(() => {
    if (!activeSession || !activeSession.isRunning) return;
    const delta = Math.floor((Date.now() - activeSession.startedAt) / 1000);
    const updatedSec = activeSession.accumulatedSeconds + Math.max(0, delta);

    const pausedSession: FocusSession = {
      ...activeSession,
      isRunning: false,
      accumulatedSeconds: updatedSec,
    };

    saveActiveSession(pausedSession);
    setDisplaySeconds(updatedSec);

    broadcastPresence({
      partner: activePartner,
      isFocusing: false,
      taskTitle: activeSession.target.title,
      category: activeSession.target.category,
      mode: activeSession.mode,
      secondsElapsed: updatedSec,
      isBreak: activeSession.isBreak,
      updatedAt: Date.now(),
    });
  }, [activeSession, activePartner, broadcastPresence]);

  const resumeFocus = useCallback(() => {
    if (!activeSession || activeSession.isRunning) return;
    const resumedSession: FocusSession = {
      ...activeSession,
      isRunning: true,
      startedAt: Date.now(),
    };

    saveActiveSession(resumedSession);

    broadcastPresence({
      partner: activePartner,
      isFocusing: true,
      taskTitle: activeSession.target.title,
      category: activeSession.target.category,
      mode: activeSession.mode,
      secondsElapsed: activeSession.accumulatedSeconds,
      isBreak: activeSession.isBreak,
      updatedAt: Date.now(),
    });
  }, [activeSession, activePartner, broadcastPresence]);

  const toggleBreak = useCallback(() => {
    if (!activeSession) return;
    const delta = activeSession.isRunning
      ? Math.floor((Date.now() - activeSession.startedAt) / 1000)
      : 0;
    const currentAccumulated = activeSession.accumulatedSeconds + Math.max(0, delta);

    const updatedSession: FocusSession = {
      ...activeSession,
      isBreak: !activeSession.isBreak,
      startedAt: Date.now(),
      accumulatedSeconds: currentAccumulated,
    };

    saveActiveSession(updatedSession);
  }, [activeSession]);

  const stopFocus = useCallback(
    (record: boolean = true): FocusLogItem | null => {
      if (!activeSession) return null;

      const delta = activeSession.isRunning
        ? Math.floor((Date.now() - activeSession.startedAt) / 1000)
        : 0;
      const finalDuration = activeSession.accumulatedSeconds + Math.max(0, delta);

      let logItem: FocusLogItem | null = null;
      if (record) {
        const now = new Date();
        logItem = {
          id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          partner: activeSession.partner || activePartner,
          taskTitle: activeSession.target.title,
          category: activeSession.target.category,
          durationSeconds: finalDuration,
          durationMinutes: Math.max(1, Math.round(finalDuration / 60)),
          startedAt: new Date(activeSession.startedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          startedAtTimestamp: activeSession.startedAt,
          completedAt: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          dateKey: formatDateKey(now),
          mode: activeSession.mode,
        };

        setLogs((prev) => {
          const next = [logItem!, ...prev];
          try {
            localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(next));
          } catch (_) {}
          return next;
        });

        broadcastChannelRef.current?.postMessage({
          type: "LOG_ADDED",
          log: logItem,
        });
      }

      saveActiveSession(null);
      setDisplaySeconds(0);

      broadcastPresence({
        partner: activePartner,
        isFocusing: false,
        taskTitle: undefined,
        secondsElapsed: 0,
        isBreak: false,
        updatedAt: Date.now(),
      });

      return logItem;
    },
    [activeSession, activePartner, broadcastPresence]
  );

  const sendCheerToPartner = useCallback(
    (emoji: string) => {
      const otherPartner: Partner = activePartner === "alex" ? "sam" : "alex";
      broadcastChannelRef.current?.postMessage({
        type: "CHEER",
        emoji,
        from: activePartner,
        to: otherPartner,
      });

      if (supabase && circle?.id) {
        try {
          const channel = supabase.channel(`household_focus_${circle.id}`);
          channel.send({
            type: "broadcast",
            event: "cheer",
            payload: { emoji, from: activePartner, to: otherPartner },
          });
        } catch (_) {}
      }
    },
    [activePartner, circle]
  );

  const getLogsForDate = useCallback(
    (date: Date) => {
      const key = formatDateKey(date);
      return logs.filter((l) => l.dateKey === key);
    },
    [logs]
  );

  const getTotalFocusMinutesForDate = useCallback(
    (date: Date, partner?: Partner) => {
      const key = formatDateKey(date);
      return logs
        .filter((l) => l.dateKey === key && (!partner || l.partner === partner))
        .reduce((sum, l) => sum + l.durationMinutes, 0);
    },
    [logs]
  );

  const effectivePartnerPresence: PartnerFocusPresence | null =
    activeSession &&
    activeSession.partner &&
    activeSession.partner !== activePartner &&
    activeSession.isRunning
      ? {
          partner: activeSession.partner,
          isFocusing: true,
          taskTitle: activeSession.target.title,
          category: activeSession.target.category,
          mode: activeSession.mode,
          secondsElapsed: displaySeconds,
          isBreak: activeSession.isBreak,
          updatedAt: Date.now(),
        }
      : partnerPresence;

  return (
    <FocusTimerContext.Provider
      value={{
        activeSession:
          activeSession?.partner && activeSession.partner !== activePartner
            ? null
            : activeSession,
        displaySeconds,
        isRunning: Boolean(
          activeSession?.isRunning &&
            (!activeSession.partner || activeSession.partner === activePartner)
        ),
        isBreak: Boolean(activeSession?.isBreak),
        startFocus,
        pauseFocus,
        resumeFocus,
        toggleBreak,
        stopFocus,
        partnerPresence: effectivePartnerPresence,
        sendCheerToPartner,
        cheerReceived,
        logs,
        getLogsForDate,
        getTotalFocusMinutesForDate,
      }}
    >
      {children}
    </FocusTimerContext.Provider>
  );
}

const fallbackFocusContext: FocusTimerContextType = {
  activeSession: null,
  displaySeconds: 0,
  isRunning: false,
  isBreak: false,
  startFocus: () => {},
  pauseFocus: () => {},
  resumeFocus: () => {},
  toggleBreak: () => {},
  stopFocus: () => null,
  partnerPresence: null,
  sendCheerToPartner: () => {},
  cheerReceived: null,
  logs: [],
  getLogsForDate: () => [],
  getTotalFocusMinutesForDate: () => 0,
};

export function useFocusTimer() {
  const context = useContext(FocusTimerContext);
  return context || fallbackFocusContext;
}
