"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useHousehold } from "@/context/HouseholdContext";
import { useRoutines } from "@/context/RoutinesContext";
import { useDailyTasks } from "@/context/DailyTasksContext";
import {
  Flame,
  Check,
  ExternalLink,
  Heart,
  Sparkles,
  Smartphone,
  Calendar,
  Layers,
} from "lucide-react";

function WidgetContent() {
  const searchParams = useSearchParams();
  const sizeParam = searchParams.get("size") as "small" | "medium" | "large" | null;
  const size = sizeParam === "small" || sizeParam === "large" ? sizeParam : "medium";

  const { activePartner, partnerNames, scores, spaceMode, circle, selectedDate } = useHousehold();
  const { routines, toggleCompletion, isCompleted } = useRoutines();
  const { tasks, toggleDailyTask } = useDailyTasks();
  const [cheered, setCheered] = useState(false);

  const currentScore = scores[activePartner] || { points: 14, streak: 5 };
  const currentPartnerName = partnerNames[activePartner] || "You";

  const completedRoutines = routines.filter((r) => isCompleted(r.id, selectedDate)).length;
  const totalRoutines = routines.length;
  const pct = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0;

  const modeBadge =
    spaceMode === "solo"
      ? "🧍 Solo"
      : spaceMode === "friends"
      ? "🧑‍🤝‍🧑 Friends"
      : spaceMode === "family"
      ? "🏡 Family"
      : "💕 Duo";

  const handleCheer = () => {
    setCheered(true);
    setTimeout(() => setCheered(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#fafaf9] p-4 sm:p-8 flex flex-col items-center justify-center font-body text-black">
      {/* Container simulating widget frame */}
      <div className="w-full max-w-lg flex flex-col items-center gap-4">
        {/* Top bar info */}
        <div className="flex items-center justify-between w-full px-2 text-xs font-heading font-extrabold text-zinc-500 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-black" />
            <span>Couple Task Hub · {size.toUpperCase()} WIDGET</span>
          </div>
          <span className="px-2 py-0.5 rounded-full border border-black bg-white text-black shadow-xs">
            {modeBadge}
          </span>
        </div>

        {/* Small Widget (2x2) */}
        {size === "small" && (
          <div className="w-64 h-64 bg-amber-200 border-3 border-black rounded-3xl p-4 shadow-[6px_6px_0_0_#000] flex flex-col justify-between relative overflow-hidden transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5 bg-black text-white px-2 py-0.5 rounded-full text-[11px] font-heading font-black">
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>{currentScore.streak} DAYS</span>
              </div>
              <span className="text-xl">☀️</span>
            </div>

            <div className="my-auto">
              <div className="text-3xl font-black font-heading tracking-tight leading-none text-black">
                {pct}%
              </div>
              <div className="text-xs font-heading font-bold text-zinc-800 mt-1">
                {completedRoutines}/{totalRoutines} routines done
              </div>
              <div className="w-full bg-white border-2 border-black rounded-full h-3 mt-2 overflow-hidden shadow-xs">
                <div
                  className="bg-black h-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t-2 border-black text-[11px] font-heading font-bold text-zinc-800">
              <span className="truncate max-w-[120px]">{currentPartnerName}</span>
              <span className="text-zinc-600 font-black">{currentScore.points} pts</span>
            </div>
          </div>
        )}

        {/* Medium Widget (4x2) */}
        {size === "medium" && (
          <div className="w-full bg-white border-3 border-black rounded-3xl p-5 shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-heading font-black text-xs shadow-xs">
                  CTH
                </div>
                <div>
                  <div className="font-heading font-black text-sm uppercase leading-tight text-black">
                    Today&apos;s Habits
                  </div>
                  <div className="text-[11px] font-bold text-zinc-500">
                    {currentPartnerName} · {modeBadge}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-amber-300 border-2 border-black px-2 py-0.5 rounded-full text-xs font-heading font-black shadow-xs">
                  <Flame className="w-3.5 h-3.5 text-black fill-black" />
                  <span>{currentScore.streak}d</span>
                </div>
                <div className="text-xs font-heading font-black bg-zinc-100 border-2 border-black px-2 py-0.5 rounded-full shadow-xs">
                  {pct}%
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="py-3 space-y-2">
              {routines.slice(0, 3).map((routine) => {
                const done = isCompleted(routine.id, selectedDate);
                return (
                  <button
                    key={routine.id}
                    onClick={() => toggleCompletion(routine.id, selectedDate)}
                    type="button"
                    className="w-full flex items-center justify-between p-2 rounded-xl border-2 border-black bg-zinc-50 hover:bg-zinc-100 transition text-left cursor-pointer shadow-xs active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md border-2 border-black flex items-center justify-center ${
                          done ? "bg-emerald-400" : "bg-white"
                        }`}
                      >
                        {done && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs font-heading font-bold truncate ${
                          done ? "line-through text-zinc-400" : "text-black"
                        }`}
                      >
                        {routine.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase shrink-0">
                      {routine.assignee}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 7-Day Consistency Dot Strip */}
            <div className="pt-2 border-t-2 border-black flex items-center justify-between">
              <span className="text-[10px] font-heading font-extrabold text-zinc-500 uppercase">
                Last 7 Days
              </span>
              <div className="flex items-center gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <div
                      className={`w-4 h-4 rounded-md border border-black flex items-center justify-center text-[8px] font-black ${
                        i < 5 ? "bg-emerald-400 text-black" : "bg-zinc-200 text-zinc-400"
                      }`}
                    >
                      ✓
                    </div>
                    <span className="text-[8px] font-bold text-zinc-400">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Large Widget (4x4) */}
        {size === "large" && (
          <div className="w-full bg-[#fef08a] border-3 border-black rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div>
                <span className="text-[10px] font-heading font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-black bg-white">
                  {modeBadge}
                </span>
                <h2 className="font-heading font-black text-lg sm:text-xl uppercase mt-1 text-black">
                  {circle ? circle.name : `${currentPartnerName}'s Hub`}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white border-2 border-black px-2.5 py-1 rounded-full text-xs font-heading font-black shadow-xs">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{currentScore.streak} Days</span>
                </div>
                <button
                  onClick={handleCheer}
                  type="button"
                  className="p-1.5 rounded-full border-2 border-black bg-rose-400 hover:bg-rose-500 transition text-white shadow-xs cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                  title="Send Cheer"
                >
                  <Heart className={`w-4 h-4 ${cheered ? "animate-ping fill-white" : ""}`} />
                </button>
              </div>
            </div>

            {/* Routines Grid */}
            <div className="mt-4">
              <div className="text-xs font-heading font-black uppercase text-zinc-800 mb-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Today&apos;s Habits ({completedRoutines}/{totalRoutines})</span>
              </div>
              <div className="space-y-1.5">
                {routines.slice(0, 4).map((routine) => {
                  const done = isCompleted(routine.id, selectedDate);
                  return (
                    <button
                      key={routine.id}
                      onClick={() => toggleCompletion(routine.id, selectedDate)}
                      type="button"
                      className="w-full flex items-center justify-between p-2 rounded-xl border-2 border-black bg-white hover:bg-zinc-50 transition text-left cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-md border-2 border-black flex items-center justify-center ${
                            done ? "bg-emerald-400" : "bg-white"
                          }`}
                        >
                          {done && (
                            <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                          )}
                        </div>
                        <span
                          className={`text-xs font-heading font-bold truncate ${
                            done ? "line-through text-zinc-400" : "text-black"
                          }`}
                        >
                          {routine.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">
                        {routine.assignee}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Tasks */}
            <div className="mt-4">
              <div className="text-xs font-heading font-black uppercase text-zinc-800 mb-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Upcoming Daily Tasks</span>
              </div>
              <div className="space-y-1.5">
                {tasks.slice(0, 2).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleDailyTask(task.id)}
                    type="button"
                    className="w-full flex items-center justify-between p-2 rounded-xl border-2 border-black bg-white hover:bg-zinc-50 transition text-left cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md border-2 border-black flex items-center justify-center ${
                          task.completed ? "bg-emerald-400" : "bg-white"
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs font-heading font-bold truncate ${
                          task.completed ? "line-through text-zinc-400" : "text-black"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">
                      {task.assignee}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between w-full pt-2">
          <div className="flex items-center gap-1">
            <Link
              href="/widget?size=small"
              className={`px-2.5 py-1 rounded-xl border-2 border-black text-xs font-heading font-black shadow-xs transition ${
                size === "small" ? "bg-black text-white" : "bg-white hover:bg-zinc-100"
              }`}
            >
              Small (2×2)
            </Link>
            <Link
              href="/widget?size=medium"
              className={`px-2.5 py-1 rounded-xl border-2 border-black text-xs font-heading font-black shadow-xs transition ${
                size === "medium" ? "bg-black text-white" : "bg-white hover:bg-zinc-100"
              }`}
            >
              Medium (4×2)
            </Link>
            <Link
              href="/widget?size=large"
              className={`px-2.5 py-1 rounded-xl border-2 border-black text-xs font-heading font-black shadow-xs transition ${
                size === "large" ? "bg-black text-white" : "bg-white hover:bg-zinc-100"
              }`}
            >
              Large (4×4)
            </Link>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-black bg-black text-white text-xs font-heading font-black hover:bg-zinc-800 transition shadow-[2px_2px_0_0_#000]"
          >
            <span>Open App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function WidgetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-heading font-bold text-sm">
          Loading Widget Preview...
        </div>
      }
    >
      <WidgetContent />
    </Suspense>
  );
}
