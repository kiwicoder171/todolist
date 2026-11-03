"use client";

import React, { useState } from "react";
import { useHousehold } from "@/context/HouseholdContext";
import { useRoutines } from "@/context/RoutinesContext";
import { useDailyTasks } from "@/context/DailyTasksContext";
import {
  Smartphone,
  X,
  Flame,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  Share2,
  Calendar,
  Layers,
} from "lucide-react";
import Link from "next/link";

export interface WidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WidgetModal({ isOpen, onClose }: WidgetModalProps) {
  const { activePartner, partnerNames, scores, spaceMode, circle, selectedDate } = useHousehold();
  const { routines, toggleCompletion, isCompleted } = useRoutines();
  const { tasks, toggleDailyTask } = useDailyTasks();
  const [activeTab, setActiveTab] = useState<"preview" | "install">("preview");
  const [selectedSize, setSelectedSize] = useState<"small" | "medium" | "large">("medium");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentScore = scores[activePartner] || { points: 12, streak: 4 };
  const currentPartnerName = partnerNames[activePartner] || "You";

  const completedRoutines = routines.filter((r) => isCompleted(r.id, selectedDate)).length;
  const totalRoutines = routines.length;

  const widgetUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/widget?size=${selectedSize}`
      : "/widget";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(widgetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md animate-fade-in duration-200 overflow-y-auto">
      <div className="bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.12] rounded-3xl p-5 sm:p-7 w-[calc(100vw-28px)] max-w-xl shadow-2xl relative my-auto box-border animate-scale-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] apple-press transition cursor-pointer z-20"
          aria-label="Close widget modal"
        >
          <X className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-base sm:text-lg uppercase tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>Home Screen Widgets</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-mono font-bold shadow-xs">
                NEW
              </span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Glanceable iOS &amp; Android home screen routines, tasks &amp; streak tracker
            </p>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1 p-1 apple-segmented-track rounded-2xl mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-1.5 rounded-xl transition text-center cursor-pointer apple-press ${
              activeTab === "preview"
                ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Live Widget Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("install")}
            className={`flex-1 py-1.5 rounded-xl transition text-center cursor-pointer apple-press ${
              activeTab === "install"
                ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Install / Add to Screen Guide
          </button>
        </div>

        {activeTab === "preview" ? (
          <div className="space-y-4">
            {/* Widget Size Selector */}
            <div className="flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.03] p-1.5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-2">
                Widget Size:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedSize("small")}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase transition apple-press cursor-pointer ${
                    selectedSize === "small"
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xs font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  }`}
                >
                  Small (2×2)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSize("medium")}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase transition apple-press cursor-pointer ${
                    selectedSize === "medium"
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xs font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  }`}
                >
                  Medium (4×2)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSize("large")}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase transition apple-press cursor-pointer ${
                    selectedSize === "large"
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xs font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  }`}
                >
                  Large (4×4)
                </button>
              </div>
            </div>

            {/* Widget Stage */}
            <div className="p-4 sm:p-6 bg-zinc-100 dark:bg-black/60 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center min-h-[220px]">
              {selectedSize === "small" && (
                /* Small 2x2 Widget */
                <div className="w-[160px] h-[160px] bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent dark:from-amber-400/20 dark:via-zinc-900 dark:to-zinc-900 border border-amber-500/30 rounded-[28px] p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.12)] flex flex-col justify-between select-none backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                      {spaceMode === "solo" ? "Solo Streak" : "Hub Streak"}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                      {currentPartnerName[0]}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-3xl text-zinc-900 dark:text-white leading-none tracking-tight">
                        {currentScore.streak}D
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-1 block">
                      {currentScore.points} Total PTS
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 border-t border-black/[0.06] dark:border-white/[0.08] pt-1 flex justify-between">
                    <span>Today</span>
                    <span className="text-emerald-500 font-semibold">In Sync</span>
                  </div>
                </div>
              )}

              {selectedSize === "medium" && (
                /* Medium 4x2 Widget */
                <div className="w-full max-w-[340px] h-[160px] bg-white/90 dark:bg-zinc-900/90 border border-black/[0.08] dark:border-white/[0.1] rounded-[28px] p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.12)] flex flex-col justify-between select-none backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
                      <span className="font-semibold text-xs tracking-tight text-zinc-900 dark:text-white">
                        Today&apos;s Habits
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-medium bg-black/[0.05] dark:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full">
                      {completedRoutines}/{totalRoutines} Done
                    </span>
                  </div>

                  <div className="space-y-1.5 my-auto">
                    {routines.slice(0, 3).map((r) => {
                      const done = isCompleted(r.id, selectedDate);
                      return (
                        <div
                          key={r.id}
                          onClick={() => toggleCompletion(r.id, selectedDate)}
                          className="flex items-center gap-2 cursor-pointer bg-black/[0.02] dark:bg-white/[0.04] px-2.5 py-1 rounded-xl border border-black/[0.04] dark:border-white/[0.06] text-xs font-medium"
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              done ? "bg-emerald-500 border-emerald-500 text-white" : "border-zinc-300 dark:border-zinc-600 bg-transparent"
                            }`}
                          >
                            {done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span
                            className={`truncate text-xs ${
                              done ? "line-through text-zinc-400" : "text-zinc-800 dark:text-zinc-200"
                            }`}
                          >
                            {r.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-black/[0.06] dark:border-white/[0.08] pt-1">
                    <div className="flex gap-1">
                      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                        <span
                          key={i}
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                            i === 2 ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold" : "text-zinc-400"
                          }`}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                    <span className="font-semibold text-amber-500 flex items-center gap-0.5">
                      <Flame className="w-3 h-3" /> {currentScore.streak}D
                    </span>
                  </div>
                </div>
              )}

              {selectedSize === "large" && (
                /* Large 4x4 Widget */
                <div className="w-full max-w-[320px] h-[280px] bg-white/90 dark:bg-zinc-900/90 border border-black/[0.08] dark:border-white/[0.1] rounded-[28px] p-4 shadow-[0_12px_36px_rgba(0,0,0,0.12)] flex flex-col justify-between select-none backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-2">
                    <div>
                      <h3 className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-white">
                        {circle?.name || "Household Hub"}
                      </h3>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {spaceMode.toUpperCase()} &bull; {currentPartnerName}
                      </span>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold text-xs flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{currentScore.streak}D</span>
                    </div>
                  </div>

                  {/* Routines & Tasks mini lists */}
                  <div className="space-y-2.5 my-1 overflow-hidden">
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                        Routines ({completedRoutines}/{totalRoutines})
                      </span>
                      {routines.slice(0, 2).map((r) => {
                        const done = isCompleted(r.id, selectedDate);
                        return (
                          <div
                            key={r.id}
                            onClick={() => toggleCompletion(r.id, selectedDate)}
                            className="flex items-center gap-2 cursor-pointer bg-black/[0.02] dark:bg-white/[0.04] px-2.5 py-1.5 rounded-xl border border-black/[0.04] dark:border-white/[0.06] text-xs"
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                done ? "bg-emerald-500 border-emerald-500 text-white" : "border-zinc-300 dark:border-zinc-600 bg-transparent"
                              }`}
                            >
                              {done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span
                              className={`truncate text-xs ${
                                done ? "line-through text-zinc-400" : "text-zinc-800 dark:text-zinc-200 font-medium"
                              }`}
                            >
                              {r.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                        Today&apos;s To-Dos
                      </span>
                      {tasks.slice(0, 2).map((t) => (
                        <div
                          key={t.id}
                          onClick={() => toggleDailyTask(t.id)}
                          className="flex items-center gap-2 cursor-pointer bg-black/[0.02] dark:bg-white/[0.04] px-2.5 py-1.5 rounded-xl border border-black/[0.04] dark:border-white/[0.06] text-xs"
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              t.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-zinc-300 dark:border-zinc-600 bg-transparent"
                            }`}
                          >
                            {t.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span
                            className={`truncate text-xs ${
                              t.completed ? "line-through text-zinc-400" : "text-zinc-800 dark:text-zinc-200 font-medium"
                            }`}
                          >
                            {t.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="border-t border-black/[0.06] dark:border-white/[0.08] pt-2 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium">
                      Total Points: <strong className="text-zinc-900 dark:text-white font-semibold">{currentScore.points} PTS</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                      All Systems Go
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Standalone Route Link & Copy */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full sm:flex-1 py-2.5 px-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 font-semibold text-xs apple-press transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied Widget URL!" : "Copy Embed / Widget URL"}</span>
              </button>

              <Link
                href={`/widget?size=${selectedSize}`}
                target="_blank"
                className="w-full sm:w-auto py-2.5 px-4 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 font-semibold text-xs apple-press transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Open Clean Standalone</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Installation Guide */
          <div className="space-y-3.5">
            <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍎</span>
                <h3 className="font-semibold text-xs uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                  iOS (iPhone &amp; iPad) Home Screen
                </h3>
              </div>
              <ol className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-decimal list-inside font-normal leading-relaxed">
                <li>
                  Open this app in <strong>Safari</strong> on your iPhone.
                </li>
                <li>
                  Tap the <strong>Share</strong> button (box with an arrow pointing up at the bottom).
                </li>
                <li>
                  Scroll down and tap <strong>Add to Home Screen</strong>.
                </li>
                <li>
                  The Couple Task Hub icon and standalone widget view will appear directly on your home screen!
                </li>
              </ol>
            </div>

            <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h3 className="font-semibold text-xs uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                  Android Home Screen
                </h3>
              </div>
              <ol className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-decimal list-inside font-normal leading-relaxed">
                <li>
                  Open this app in <strong>Google Chrome</strong> on Android.
                </li>
                <li>
                  Tap the three dots <strong>(⋮)</strong> in the top right corner.
                </li>
                <li>
                  Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                </li>
                <li>
                  Your phone will create an app shortcut and allow widget pinning.
                </li>
              </ol>
            </div>

            <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">💻</span>
                <h3 className="font-semibold text-xs uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                  Notion &amp; Desktop Embeds
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
                You can embed the standalone widget URL in Notion, Obsidian, or your desktop sidebar using{" "}
                <code className="bg-black/[0.05] dark:bg-white/[0.08] px-1.5 py-0.5 rounded-md font-mono text-[11px] text-zinc-800 dark:text-zinc-200">/widget</code>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
