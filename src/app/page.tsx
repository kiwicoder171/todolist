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
import { CalendarConsistencySection } from "@/components/CalendarConsistencySection";

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
            calendarHabitsSlot={<CalendarConsistencySection />}
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
              <CalendarConsistencySection />
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
