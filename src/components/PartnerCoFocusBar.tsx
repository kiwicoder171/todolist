"use client";

import React, { useState, useEffect } from "react";
import { useHousehold, Partner } from "@/context/HouseholdContext";
import { useFocusTimer, formatTimeDisplay } from "@/context/FocusTimerContext";
import { Coffee, Flame, Heart, Sparkles, Zap, Laptop, Bed, Play, X, User } from "lucide-react";
import { StudiconModal } from "./StudiconModal";
import { FocusRingGoal } from "./FocusRingGoal";

export function PartnerCoFocusBar() {
  const { activePartner, partnerNames, partnerAvatars, spaceMode } = useHousehold();
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
  const [isStudiconOpen, setIsStudiconOpen] = useState(false);
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
      className="w-full apple-card p-3.5 sm:p-4 mb-4 rounded-3xl"
    >
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-black/[0.05] dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {spaceMode === "solo"
              ? "Focus Desk"
              : spaceMode === "friends"
              ? "Friends Co-Focus Desks"
              : spaceMode === "family"
              ? "Family Co-Focus Desks"
              : "Co-Focus Desks"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {cheerAnim && (
            <div className="animate-scale-in flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 backdrop-blur-md">
              <span>{cheerAnim}</span>
              <span>{partnerName} sent cheer!</span>
            </div>
          )}
          <FocusRingGoal />
        </div>
      </div>

      <div className={`grid ${spaceMode === "solo" ? "grid-cols-1" : "grid-cols-2"} gap-2 sm:gap-3`}>
        {/* Desk 1: You */}
        <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] transition hover:bg-black/[0.04] dark:hover:bg-white/[0.05]">
          <button
            type="button"
            onClick={() => setIsStudiconOpen(true)}
            title="Change desk Studicon avatar"
            aria-label="Change desk avatar"
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-xl transition-all duration-200 apple-press cursor-pointer ${
              activeSession?.isRunning
                ? "bg-emerald-500/15 dark:bg-emerald-500/25 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                : "bg-white/80 dark:bg-zinc-800/80 border border-black/[0.06] dark:border-white/[0.08] shadow-xs"
            }`}
          >
            <span>{partnerAvatars?.[activePartner] || "💻"}</span>
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">{myName} (You)</span>
              {activeSession && (
                <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {formatTimeDisplay(displaySeconds)}
                </span>
              )}
            </div>
            {activeSession?.isRunning ? (
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                {activeSession.target.title}
              </p>
            ) : (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  {activeSession?.isBreak ? "Break" : "Idle"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLauncherOpen((prev) => !prev)}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 apple-press transition shadow-2xs"
                >
                  + Focus
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desk 2: Partner / Family / Friend (Hidden in Solo mode) */}
        {spaceMode !== "solo" && (
          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] transition hover:bg-black/[0.04] dark:hover:bg-white/[0.05]">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-xl transition-all ${
                isPartnerOnlineAndFocusing
                  ? "bg-amber-500/15 dark:bg-amber-500/25 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                  : "bg-white/60 dark:bg-zinc-800/60 border border-black/[0.06] dark:border-white/[0.08] opacity-60 shadow-xs"
              }`}
            >
              <span>{partnerAvatars?.[otherPartner] || "📚"}</span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">{partnerName}</span>
                {isPartnerOnlineAndFocusing && (
                  <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    {formatTimeDisplay(partnerPresence?.secondsElapsed || 0)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                {isPartnerOnlineAndFocusing
                  ? partnerPresence?.taskTitle || "Focusing"
                  : "Idle"}
              </p>
            </div>

            {/* Quick cheer buttons when partner is focusing */}
            {isPartnerOnlineAndFocusing && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() =>
                    sendCheerToPartner(
                      spaceMode === "partner" ? "❤️" : spaceMode === "friends" ? "🔥" : "🏡"
                    )
                  }
                  aria-label="Send Cheer"
                  title={`Send Cheer ${
                    spaceMode === "partner" ? "❤️" : spaceMode === "friends" ? "🔥" : "🏡"
                  }`}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-xs apple-press transition cursor-pointer"
                >
                  {spaceMode === "partner" ? "❤️" : spaceMode === "friends" ? "🔥" : "🏡"}
                </button>
                <button
                  onClick={() => sendCheerToPartner("👏")}
                  aria-label="Send Clap"
                  title="Send Cheer 👏"
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-xs apple-press transition cursor-pointer"
                >
                  👏
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isLauncherOpen && (
        <div className="mt-3 p-3 rounded-2xl bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.1] shadow-xl space-y-2.5 animate-scale-in">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
            <span>Quick Start Focus</span>
            <button
              onClick={() => setIsLauncherOpen(false)}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-md transition"
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
                className="text-[11px] px-3 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-300 border border-black/[0.04] dark:border-white/[0.06] apple-press transition"
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
            className="flex items-center gap-1.5 pt-1"
          >
            <input
              type="text"
              placeholder="Or enter custom task..."
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="flex-1 text-[12px] bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] rounded-xl px-3 py-1.5 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
            />
            <button
              type="submit"
              disabled={!customTitle.trim()}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-[11px] apple-press hover:opacity-90 disabled:opacity-30 transition shadow-2xs"
            >
              Start
            </button>
          </form>
        </div>
      )}

      <StudiconModal
        isOpen={isStudiconOpen}
        onClose={() => setIsStudiconOpen(false)}
      />
    </div>
  );
}
