"use client";

import React, { ReactNode } from "react";

export interface DashboardLayoutProps {
  dashboardFocus: "all" | "kanban" | "day";
  calendarHabitsSlot: ReactNode;
  dailyExecutionSlot: ReactNode;
  kanbanSlot: ReactNode;
}

export function DashboardLayout({
  dashboardFocus,
  calendarHabitsSlot,
  dailyExecutionSlot,
  kanbanSlot,
}: DashboardLayoutProps) {
  return (
    <div className="grid grid-cols-12 gap-5 min-h-[740px] max-w-[1780px] mx-auto">
      {/* SECTION A: Calendar & Habits Glance */}
      {(dashboardFocus === "all" || dashboardFocus === "day") && (
        <section
          className={
            dashboardFocus === "all"
              ? "col-span-12 lg:col-span-3 flex flex-col gap-4"
              : "col-span-12 lg:col-span-5 flex flex-col gap-4"
          }
        >
          {calendarHabitsSlot}
        </section>
      )}

      {/* SECTION B: Daily Execution (Board 1 & 2) */}
      {(dashboardFocus === "all" || dashboardFocus === "day") && (
        <section
          className={
            dashboardFocus === "all"
              ? "col-span-12 lg:col-span-3 flex flex-col gap-4"
              : "col-span-12 lg:col-span-7 flex flex-col gap-4"
          }
        >
          {dailyExecutionSlot}
        </section>
      )}

      {/* SECTION C: 3-Column Vertical Kanban Board */}
      {(dashboardFocus === "all" || dashboardFocus === "kanban") && (
        <section
          className={
            dashboardFocus === "all"
              ? "col-span-12 lg:col-span-6 bg-white border-2 border-black rounded-3xl p-6 shadow-[4px_4px_0_0_#000] flex flex-col"
              : "col-span-12 bg-white border-2 border-black rounded-3xl p-6 shadow-[4px_4px_0_0_#000] flex flex-col min-h-[680px]"
          }
        >
          {kanbanSlot}
        </section>
      )}
    </div>
  );
}
