"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MobileShell, MobileTab } from "@/components/MobileShell";
import { WishlistModal } from "@/components/WishlistModal";
import { DailyRoutinesBoard } from "@/components/DailyRoutinesBoard";
import { DailyTasksBoard } from "@/components/DailyTasksBoard";

export default function Home() {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [dashboardFocus, setDashboardFocus] = useState<"all" | "kanban" | "day">("all");
  const [mobileTab, setMobileTab] = useState<MobileTab>("kanban");
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const getMobilePillTitle = (tab: MobileTab) => {
    switch (tab) {
      case "kanban":
        return "3-COL KANBAN";
      case "habits":
        return "MY HABITS";
      case "daily":
        return "DAILY TASKS";
      case "progress":
        return "STATISTICS";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#18181b]">
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        dashboardFocus={dashboardFocus}
        onDashboardFocusChange={setDashboardFocus}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      <FilterBar />

      <main className="flex-1 p-5 overflow-x-auto">
        {viewMode === "desktop" ? (
          <DashboardLayout
            dashboardFocus={dashboardFocus}
            calendarHabitsSlot={
              <div className="bg-white border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                  <h2 className="font-heading font-black text-sm uppercase tracking-wider text-black">
                    Calendar &amp; Consistency
                  </h2>
                  <span className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-full border border-black bg-zinc-100">
                    October 2026
                  </span>
                </div>
                <div className="p-4 border-2 border-dashed border-zinc-300 rounded-2xl text-center text-xs text-zinc-500 font-heading">
                  [Calendar &amp; Consistency Dials Slot (Ticket 05)]
                </div>
              </div>
            }
            dailyExecutionSlot={
              <div className="space-y-4">
                {/* Board 1: Daily Routines (Apple Notes Style) */}
                <DailyRoutinesBoard />

                {/* Board 2: Daily Tasks with Auto-Rollover */}
                <DailyTasksBoard />
              </div>
            }
            kanbanSlot={
              <div>
                <div className="flex flex-wrap items-center justify-between pb-4 border-b-2 border-black mb-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-heading font-bold text-xs">
                      3
                    </div>
                    <div>
                      <h2 className="font-heading font-black text-base uppercase tracking-wide text-black flex items-center gap-2">
                        Kanban Board
                        <span className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-full border border-black bg-zinc-100 text-black">
                          3 Vertical Columns
                        </span>
                      </h2>
                      <p className="text-xs text-zinc-500">
                        Long-term projects &amp; chores synced with Day View
                      </p>
                    </div>
                  </div>
                </div>

                {/* The 3 Vertical Columns Container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[460px]">
                  {/* To Do */}
                  <div className="border-2 border-black rounded-2xl p-4 bg-zinc-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2.5 border-b-2 border-dashed border-zinc-300 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full border-2 border-black bg-white" />
                          <h3 className="font-heading font-black text-xs uppercase tracking-wider text-black">
                            To Do
                          </h3>
                        </div>
                        <span className="text-xs font-heading font-extrabold px-2 py-0.5 rounded-full bg-white border border-black text-black">
                          0
                        </span>
                      </div>
                      <div className="p-3 border-2 border-dashed border-zinc-200 rounded-xl text-center text-[11px] text-zinc-400 font-heading">
                        [To Do Cards Slot (Ticket 04)]
                      </div>
                    </div>
                    <button className="mt-3 w-full py-2 border-2 border-dashed border-zinc-400 hover:border-black rounded-xl text-zinc-600 font-heading font-bold text-xs uppercase transition text-center bg-white">
                      ＋ Add To Do
                    </button>
                  </div>

                  {/* In Progress */}
                  <div className="border-2 border-black rounded-2xl p-4 bg-white shadow-[3px_3px_0_0_#000] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2.5 border-b-2 border-black mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-black" />
                          <h3 className="font-heading font-black text-xs uppercase tracking-wider text-black">
                            In Progress
                          </h3>
                        </div>
                        <span className="text-xs font-heading font-extrabold px-2 py-0.5 rounded-full bg-black text-white">
                          0
                        </span>
                      </div>
                      <div className="p-3 border-2 border-dashed border-zinc-200 rounded-xl text-center text-[11px] text-zinc-400 font-heading">
                        [In Progress Cards Slot (Ticket 04)]
                      </div>
                    </div>
                    <button className="mt-3 w-full py-2 border-2 border-dashed border-zinc-400 hover:border-black rounded-xl text-zinc-600 font-heading font-bold text-xs uppercase transition text-center bg-zinc-50">
                      ＋ Add Active Task
                    </button>
                  </div>

                  {/* Done */}
                  <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-4 bg-[#fcfcfc] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2.5 border-b-2 border-dashed border-zinc-300 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-black flex items-center justify-center text-[7px] text-white">
                            ✓
                          </div>
                          <h3 className="font-heading font-black text-xs uppercase tracking-wider text-zinc-500">
                            Done
                          </h3>
                        </div>
                        <span className="text-xs font-heading font-extrabold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                          0
                        </span>
                      </div>
                      <div className="p-3 border-2 border-dashed border-zinc-200 rounded-xl text-center text-[11px] text-zinc-400 font-heading">
                        [Done Cards Slot (Ticket 04)]
                      </div>
                    </div>
                    <button className="mt-3 w-full py-2 border border-zinc-300 rounded-xl text-zinc-400 font-heading font-bold text-xs uppercase transition text-center bg-white">
                      Archive Done
                    </button>
                  </div>
                </div>
              </div>
            }
          />
        ) : (
          <MobileShell
            activeTab={mobileTab}
            onTabChange={setMobileTab}
            pillTitle={getMobilePillTitle(mobileTab)}
            onQuickAdd={() => alert("Quick Add opened!")}
          >
            {mobileTab === "habits" ? (
              <DailyRoutinesBoard />
            ) : mobileTab === "daily" ? (
              <DailyTasksBoard />
            ) : (
              <div className="p-4 border-2 border-dashed border-zinc-300 rounded-2xl text-center text-xs text-zinc-500 font-heading">
                Active Mobile View: {getMobilePillTitle(mobileTab)}
              </div>
            )}
          </MobileShell>
        )}
      </main>

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </div>
  );
}
