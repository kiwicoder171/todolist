"use client";

import React, { useState, useEffect } from "react";
import { useHousehold, Partner } from "@/context/HouseholdContext";
import { useFocusTimer, formatTimeDisplay } from "@/context/FocusTimerContext";
import { Coffee, Flame, Heart, Sparkles, Zap, Laptop, Bed } from "lucide-react";

export function PartnerCoFocusBar() {
  const { activePartner, partnerNames } = useHousehold();
  const {
    activeSession,
    displaySeconds,
    partnerPresence,
    sendCheerToPartner,
    cheerReceived,
  } = useFocusTimer();

  const [cheerAnim, setCheerAnim] = useState<string | null>(null);

  // Animate cheers when received
  useEffect(() => {
    if (cheerReceived) {
      setCheerAnim(cheerReceived.emoji);
      const timer = setTimeout(() => setCheerAnim(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [cheerReceived]);

  const otherPartner: Partner = activePartner === "alex" ? "sam" : "alex";
  const myName = partnerNames[activePartner] || (activePartner === "alex" ? "Alex" : "Sam");
  const partnerName = partnerNames[otherPartner] || (otherPartner === "alex" ? "Alex" : "Sam");

  const isPartnerOnlineAndFocusing = Boolean(
    partnerPresence &&
      partnerPresence.partner === otherPartner &&
      partnerPresence.isFocusing &&
      Date.now() - (partnerPresence.updatedAt || 0) < 60000 // Within 60 seconds
  );

  return (
    <div
      data-testid="partner-cofocus-bar"
      className="w-full bg-[#121215] text-zinc-200 border border-zinc-800/80 rounded-2xl p-3 sm:p-3.5 mb-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Co-Focus Desks
          </span>
        </div>

        {cheerAnim && (
          <div className="animate-bounce flex items-center gap-1 text-xs font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
            <span>{cheerAnim}</span>
            <span>{partnerName} sent cheer!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Desk 1: You */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              activeSession?.isRunning
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {activeSession?.isRunning ? (
              <Laptop className="w-4 h-4 animate-pulse" />
            ) : (
              <Bed className="w-4 h-4" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-100 truncate">{myName} (You)</span>
              {activeSession && (
                <span className="font-mono text-[11px] font-bold text-emerald-400">
                  {formatTimeDisplay(displaySeconds)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 truncate">
              {activeSession?.isRunning
                ? activeSession.target.title
                : activeSession?.isBreak
                ? "Resting / Break"
                : "Idle"}
            </p>
          </div>
        </div>

        {/* Desk 2: Partner */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isPartnerOnlineAndFocusing
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {isPartnerOnlineAndFocusing ? (
              <Laptop className="w-4 h-4" />
            ) : (
              <Bed className="w-4 h-4" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-100 truncate">{partnerName}</span>
              {isPartnerOnlineAndFocusing && (
                <span className="font-mono text-[11px] font-bold text-amber-400">
                  {formatTimeDisplay(partnerPresence?.secondsElapsed || 0)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 truncate">
              {isPartnerOnlineAndFocusing
                ? partnerPresence?.taskTitle || "Focusing"
                : "Offline / Idle"}
            </p>
          </div>

          {/* Quick cheer buttons when partner is focusing */}
          {isPartnerOnlineAndFocusing && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => sendCheerToPartner("❤️")}
                aria-label="Send Love"
                title="Send Cheer ❤️"
                className="p-1 rounded-md hover:bg-zinc-800 text-xs active:scale-90 transition"
              >
                ❤️
              </button>
              <button
                onClick={() => sendCheerToPartner("👏")}
                aria-label="Send Clap"
                title="Send Cheer 👏"
                className="p-1 rounded-md hover:bg-zinc-800 text-xs active:scale-90 transition"
              >
                👏
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
