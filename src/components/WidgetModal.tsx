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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border-2 border-black rounded-3xl p-5 sm:p-7 w-[calc(100vw-28px)] max-w-xl shadow-[6px_6px_0_0_#000] relative my-auto box-border">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-black flex items-center justify-center bg-white hover:bg-zinc-100 transition cursor-pointer z-20 shadow-xs"
          aria-label="Close widget modal"
        >
          <X className="w-4 h-4 text-black" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-amber-300 text-black border-2 border-black flex items-center justify-center font-bold text-sm shadow-[2px_2px_0_0_#000] shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-black text-base sm:text-lg uppercase tracking-tight text-black flex items-center gap-1.5">
              <span>Home Screen Widgets</span>
              <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-mono font-bold">
                NEW
              </span>
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              Glanceable iOS &amp; Android home screen routines, tasks &amp; streak tracker
            </p>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-2 p-1 bg-zinc-100 border-2 border-black rounded-2xl mb-4 text-xs font-heading font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-1.5 rounded-xl transition text-center cursor-pointer ${
              activeTab === "preview"
                ? "bg-black text-white shadow-xs"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            Live Widget Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("install")}
            className={`flex-1 py-1.5 rounded-xl transition text-center cursor-pointer ${
              activeTab === "install"
                ? "bg-black text-white shadow-xs"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            Install / Add to Screen Guide
          </button>
        </div>

        {activeTab === "preview" ? (
          <div className="space-y-4">
            {/* Widget Size Selector */}
            <div className="flex items-center justify-between bg-zinc-50 p-2 rounded-2xl border-2 border-black">
              <span className="text-[11px] font-heading font-extrabold uppercase text-zinc-600 px-2">
                Widget Size:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedSize("small")}
                  className={`px-3 py-1 rounded-xl text-xs font-heading font-extrabold uppercase transition border border-black cursor-pointer ${
                    selectedSize === "small"
                      ? "bg-amber-300 text-black shadow-xs font-black"
                      : "bg-white text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  Small (2×2)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSize("medium")}
                  className={`px-3 py-1 rounded-xl text-xs font-heading font-extrabold uppercase transition border border-black cursor-pointer ${
                    selectedSize === "medium"
                      ? "bg-amber-300 text-black shadow-xs font-black"
                      : "bg-white text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  Medium (4×2)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSize("large")}
                  className={`px-3 py-1 rounded-xl text-xs font-heading font-extrabold uppercase transition border border-black cursor-pointer ${
                    selectedSize === "large"
                      ? "bg-amber-300 text-black shadow-xs font-black"
                      : "bg-white text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  Large (4×4)
                </button>
              </div>
            </div>

            {/* Widget Stage */}
            <div className="p-4 sm:p-6 bg-[#18181b] rounded-3xl border-3 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000] min-h-[220px]">
              {selectedSize === "small" && (
                /* Small 2x2 Widget */
                <div className="w-[170px] h-[170px] bg-amber-300 border-3 border-black rounded-3xl p-3.5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between select-none">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-heading font-extrabold uppercase text-black">
                      {spaceMode === "solo" ? "Solo Streak" : "Hub Streak"}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px]">
                      {currentPartnerName[0]}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-6 h-6 text-black fill-black" />
                      <span className="font-heading font-black text-3xl text-black leading-none">
                        {currentScore.streak}D
                      </span>
                    </div>
                    <span className="text-[11px] font-heading font-extrabold text-black uppercase mt-1 block">
                      {currentScore.points} Total PTS
                    </span>
                  </div>
                  <div className="text-[9px] font-mono font-bold text-black border-t border-black/30 pt-1 flex justify-between">
                    <span>Oct 14</span>
                    <span>100% In Sync</span>
                  </div>
                </div>
              )}

              {selectedSize === "medium" && (
                /* Medium 4x2 Widget */
                <div className="w-full max-w-[360px] h-[170px] bg-emerald-200 border-3 border-black rounded-3xl p-3.5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between select-none">
                  <div className="flex items-center justify-between border-b border-black/20 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-black" />
                      <span className="font-heading font-extrabold text-xs uppercase text-black">
                        Today&apos;s Habits
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-black text-white px-2 py-0.5 rounded-full">
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
                          className="flex items-center gap-2 cursor-pointer bg-white/70 px-2 py-1 rounded-xl border border-black text-xs font-medium"
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded border border-black flex items-center justify-center ${
                              done ? "bg-black text-white" : "bg-white"
                            }`}
                          >
                            {done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span
                            className={`truncate text-xs ${
                              done ? "line-through text-zinc-500" : "text-black font-semibold"
                            }`}
                          >
                            {r.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-black border-t border-black/20 pt-1">
                    <div className="flex gap-1">
                      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                        <span
                          key={i}
                          className={`w-4 h-4 rounded flex items-center justify-center text-[9px] ${
                            i === 2 ? "bg-black text-white" : "bg-white/60 text-black border border-black/30"
                          }`}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                    <span className="font-heading uppercase font-extrabold">
                      🔥 {currentScore.streak}D Streak
                    </span>
                  </div>
                </div>
              )}

              {selectedSize === "large" && (
                /* Large 4x4 Widget */
                <div className="w-full max-w-[340px] h-[300px] bg-white border-3 border-black rounded-3xl p-4 shadow-[4px_4px_0_0_#000] flex flex-col justify-between select-none">
                  <div className="flex items-center justify-between border-b-2 border-black pb-2">
                    <div>
                      <h3 className="font-heading font-black text-sm uppercase text-black">
                        {circle?.name || "Household Hub"}
                      </h3>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {spaceMode.toUpperCase()} &bull; {currentPartnerName}
                      </span>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-amber-300 border-2 border-black font-heading font-black text-xs flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{currentScore.streak}D</span>
                    </div>
                  </div>

                  {/* Routines & Tasks mini lists */}
                  <div className="space-y-2 my-1 overflow-hidden">
                    <div className="space-y-1">
                      <span className="text-[9px] font-heading font-extrabold uppercase text-zinc-400 block">
                        Routines ({completedRoutines}/{totalRoutines})
                      </span>
                      {routines.slice(0, 2).map((r) => {
                        const done = isCompleted(r.id, selectedDate);
                        return (
                          <div
                            key={r.id}
                            onClick={() => toggleCompletion(r.id, selectedDate)}
                            className="flex items-center gap-2 cursor-pointer bg-zinc-50 px-2 py-1 rounded-xl border border-black text-xs"
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded border border-black flex items-center justify-center ${
                                done ? "bg-black text-white" : "bg-white"
                              }`}
                            >
                              {done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span
                              className={`truncate text-xs ${
                                done ? "line-through text-zinc-400" : "text-black font-medium"
                              }`}
                            >
                              {r.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-heading font-extrabold uppercase text-zinc-400 block">
                        Today&apos;s To-Dos
                      </span>
                      {tasks.slice(0, 2).map((t) => (
                        <div
                          key={t.id}
                          onClick={() => toggleDailyTask(t.id)}
                          className="flex items-center gap-2 cursor-pointer bg-zinc-50 px-2 py-1 rounded-xl border border-black text-xs"
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded border border-black flex items-center justify-center ${
                              t.completed ? "bg-black text-white" : "bg-white"
                            }`}
                          >
                            {t.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span
                            className={`truncate text-xs ${
                              t.completed ? "line-through text-zinc-400" : "text-black font-medium"
                            }`}
                          >
                            {t.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="border-t-2 border-black pt-2 flex items-center justify-between text-xs">
                    <span className="font-heading font-bold text-zinc-600">
                      Total Points: <strong className="text-black">{currentScore.points} PTS</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-black text-[10px] font-bold">
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
                className="w-full sm:flex-1 py-2 px-3 rounded-xl border-2 border-black bg-zinc-100 hover:bg-zinc-200 font-heading font-bold text-xs uppercase transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied Widget URL!" : "Copy Embed / Widget URL"}</span>
              </button>

              <Link
                href={`/widget?size=${selectedSize}`}
                target="_blank"
                className="w-full sm:w-auto py-2 px-4 rounded-xl border-2 border-black bg-black text-white hover:bg-zinc-800 font-heading font-bold text-xs uppercase transition flex items-center justify-center gap-1.5"
              >
                <span>Open Clean Standalone</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Installation Guide */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border-2 border-black bg-zinc-50 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍎</span>
                <h3 className="font-heading font-extrabold text-sm uppercase text-black">
                  iOS (iPhone &amp; iPad) Home Screen
                </h3>
              </div>
              <ol className="text-xs text-zinc-600 space-y-1.5 list-decimal list-inside font-medium leading-relaxed">
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

            <div className="p-4 rounded-2xl border-2 border-black bg-zinc-50 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h3 className="font-heading font-extrabold text-sm uppercase text-black">
                  Android Home Screen
                </h3>
              </div>
              <ol className="text-xs text-zinc-600 space-y-1.5 list-decimal list-inside font-medium leading-relaxed">
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

            <div className="p-4 rounded-2xl border-2 border-black bg-zinc-50 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">💻</span>
                <h3 className="font-heading font-extrabold text-sm uppercase text-black">
                  Notion &amp; Desktop Embeds
                </h3>
              </div>
              <p className="text-xs text-zinc-600 font-medium leading-relaxed">
                You can embed the standalone widget URL in Notion, Obsidian, or your desktop sidebar using{" "}
                <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono font-bold">/widget</code>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
