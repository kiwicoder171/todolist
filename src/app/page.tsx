"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MobileShell, MobileTab } from "@/components/MobileShell";
import { WishlistModal } from "@/components/WishlistModal";
import { DailyRoutinesBoard } from "@/components/DailyRoutinesBoard";
import { DailyTasksBoard } from "@/components/DailyTasksBoard";
import { KanbanBoard } from "@/components/KanbanBoard";

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
            kanbanSlot={<KanbanBoard />}
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
            ) : mobileTab === "kanban" ? (
              <KanbanBoard />
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
