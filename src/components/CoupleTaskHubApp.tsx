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
import { AuthModal } from "@/components/AuthModal";
import { FloatingFocusPill } from "@/components/FloatingFocusPill";
import { PartnerCoFocusBar } from "@/components/PartnerCoFocusBar";
import { DayTimelineRail } from "@/components/DayTimelineRail";
import { WeeklyAttendanceMatrix } from "@/components/WeeklyAttendanceMatrix";
import { useIsMobile } from "@/hooks/useIsMobile";

export interface CoupleTaskHubAppProps {
  forcedIsMobile?: boolean;
  initialMobileTab?: MobileTab;
}

export function CoupleTaskHubApp({ forcedIsMobile, initialMobileTab }: CoupleTaskHubAppProps = {}) {
  const detectedIsMobile = useIsMobile();
  const isMobile = forcedIsMobile !== undefined ? forcedIsMobile : detectedIsMobile;
  const [dashboardFocus, setDashboardFocus] = useState<"all" | "kanban" | "day">("all");
  const [mobileTab, setMobileTab] = useState<MobileTab>(initialMobileTab || "habits");
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
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-x-hidden max-w-full">
      <Header
        dashboardFocus={dashboardFocus}
        onDashboardFocusChange={(focus) => {
          setDashboardFocus(focus);
          if (isMobile) {
            if (focus === "kanban") setMobileTab("kanban");
            else if (focus === "day") setMobileTab("habits");
          }
        }}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      <FilterBar />

      <main className="flex-1 p-2 sm:p-5 min-w-0 max-w-full overflow-x-hidden sm:overflow-x-auto">
        {isMobile ? (
          /* Mobile View: automatically active on screens < md */
          <MobileShell
            activeTab={mobileTab}
            onTabChange={setMobileTab}
            onQuickAdd={handleMobileQuickAdd}
          >
            {mobileTab === "habits" ? (
              <div className="space-y-3">
                <PartnerCoFocusBar />
                <DayTimelineRail />
                <DailyRoutinesBoard />
              </div>
            ) : mobileTab === "daily" ? (
              <div className="space-y-3">
                <PartnerCoFocusBar />
                <DayTimelineRail />
                <DailyTasksBoard />
              </div>
            ) : mobileTab === "kanban" ? (
              <KanbanBoard isMobile={true} />
            ) : (
              <div className="space-y-3">
                <WeeklyAttendanceMatrix />
                <CalendarConsistencySection />
              </div>
            )}
          </MobileShell>
        ) : (
          /* Desktop View: automatically active on screens >= md */
          <DashboardLayout
            dashboardFocus={dashboardFocus}
            calendarHabitsSlot={
              <div className="space-y-4">
                <WeeklyAttendanceMatrix />
                <CalendarConsistencySection />
              </div>
            }
            dailyExecutionSlot={
              <div className="flex flex-col gap-4 h-full">
                <PartnerCoFocusBar />
                <DayTimelineRail />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full">
                  {/* Board 1: Daily Routines (Apple Notes Style) */}
                  <DailyRoutinesBoard />

                  {/* Board 2: Daily Tasks with Auto-Rollover */}
                  <DailyTasksBoard />
                </div>
              </div>
            }
            kanbanSlot={<KanbanBoard />}
          />
        )}
      </main>

      <FloatingFocusPill />

      <CircleOnboardingModal />
      <AuthModal />

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
