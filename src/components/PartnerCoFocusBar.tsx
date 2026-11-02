"use client";

import React, { useState, useEffect } from "react";
import { useHousehold, Partner } from "@/context/HouseholdContext";
import { useFocusTimer, formatTimeDisplay } from "@/context/FocusTimerContext";
import { Coffee, Flame, Heart, Sparkles, Zap, Laptop, Bed, Play, X } from "lucide-react";

export function PartnerCoFocusBar() {
  const { activePartner, partnerNames } = useHousehold();
  const {
    activeSession,
    displaySeconds,
    partnerPresence,
    sendCheerToPartner,
    cheerReceived,
    startFocus,
  } = useFocusTimer();

  const [cheerAnim, setCheerAnim] = useState<string | null>(null);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  const presets = ["Deep Work", "Reading", "Study", "Chores"];

  const handleStartPreset = (title: string) => {
    startFocus({ id: `quick_${Date.now()}`, title, type: "custom", category: "Focus" });
    setIsLauncherOpen(false);
    setCustomTitle("");
  };

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
            {activeSession?.isRunning ? (
              <p className="text-[10px] text-zinc-400 truncate">
                {activeSession.target.title}
              </p>
            ) : (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-zinc-500">
                  {activeSession?.isBreak ? "Break" : "Idle"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLauncherOpen((prev) => !prev)}
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 hover:bg-zinc-700 transition"
                >
                  + Focus
                </button>
              </div>
            )}
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

      {isLauncherOpen && (
        <div className="mt-2.5 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300">
            <span>Quick Start Focus</span>
            <button
              onClick={() => setIsLauncherOpen(false)}
              className="text-zinc-500 hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleStartPreset(preset)}
                className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40 border border-zinc-700 transition"
              >
                {preset}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customTitle.trim()) handleStartPreset(customTitle.trim());
            }}
            className="flex items-center gap-1.5"
          >
            <input
              type="text"
              placeholder="Or enter custom task..."
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="flex-1 text-[11px] bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-zinc-200 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!customTitle.trim()}
              className="px-2.5 py-1 rounded-lg bg-emerald-500 text-black font-bold text-[10px] uppercase hover:bg-emerald-400 disabled:opacity-40 transition"
            >
              Start
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
