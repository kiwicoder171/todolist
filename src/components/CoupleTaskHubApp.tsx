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
import { KanbanCardModal } from "@/components/KanbanCardModal";
import { AddRoutineModal } from "@/components/AddRoutineModal";
import { CircleOnboardingModal } from "@/components/CircleOnboardingModal";
import { useIsMobile } from "@/hooks/useIsMobile";

export interface CoupleTaskHubAppProps {
  forcedIsMobile?: boolean;
}

export function CoupleTaskHubApp({ forcedIsMobile }: CoupleTaskHubAppProps = {}) {
  const detectedIsMobile = useIsMobile();
  const isMobile = forcedIsMobile !== undefined ? forcedIsMobile : detectedIsMobile;
  const [dashboardFocus, setDashboardFocus] = useState<"all" | "kanban" | "day">("all");
  const [mobileTab, setMobileTab] = useState<MobileTab>("kanban");
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isKanbanModalOpen, setIsKanbanModalOpen] = useState(false);
  const [isAddRoutineOpen, setIsAddRoutineOpen] = useState(false);

  const getMobilePillTitle = (tab: MobileTab) => {
    switch (tab) {
      case "kanban":
        return "3-COL KANBAN";
      case "habits":
        return "DAILY ROUTINES";
      case "daily":
        return "DAILY TASKS";
      case "progress":
        return "STATISTICS";
    }
  };

  const handleMobileQuickAdd = () => {
    if (mobileTab === "kanban") {
      setIsKanbanModalOpen(true);
    } else if (mobileTab === "habits") {
      setIsAddRoutineOpen(true);
    } else {
      const inputs = document.querySelectorAll<HTMLInputElement>("input[type='text']");
      if (inputs.length > 0) {
        inputs[inputs.length - 1].focus();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#18181b]">
      <Header
        dashboardFocus={dashboardFocus}
        onDashboardFocusChange={setDashboardFocus}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      <FilterBar />

      <main className="flex-1 p-3 sm:p-5 overflow-x-auto">
        {isMobile ? (
          /* Mobile View: automatically active on screens < md */
          <MobileShell
            activeTab={mobileTab}
            onTabChange={setMobileTab}
            pillTitle={getMobilePillTitle(mobileTab)}
            onQuickAdd={handleMobileQuickAdd}
          >
            {mobileTab === "habits" ? (
              <DailyRoutinesBoard />
            ) : mobileTab === "daily" ? (
              <DailyTasksBoard />
            ) : mobileTab === "kanban" ? (
              <KanbanBoard isMobile={true} />
            ) : (
              <CalendarConsistencySection />
            )}
          </MobileShell>
        ) : (
          /* Desktop View: automatically active on screens >= md */
          <DashboardLayout
            dashboardFocus={dashboardFocus}
            calendarHabitsSlot={<CalendarConsistencySection />}
            dailyExecutionSlot={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full">
                {/* Board 1: Daily Routines (Apple Notes Style) */}
                <DailyRoutinesBoard />

                {/* Board 2: Daily Tasks with Auto-Rollover */}
                <DailyTasksBoard />
              </div>
            }
            kanbanSlot={<KanbanBoard />}
          />
        )}
      </main>

      <CircleOnboardingModal />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      <KanbanCardModal
        isOpen={isKanbanModalOpen}
        onClose={() => setIsKanbanModalOpen(false)}
      />

      <AddRoutineModal
        isOpen={isAddRoutineOpen}
        onClose={() => setIsAddRoutineOpen(false)}
      />
    </div>
  );
}
