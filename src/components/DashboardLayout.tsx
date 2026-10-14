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
    <div className="flex flex-col gap-6 max-w-[1780px] mx-auto w-full">
      {/* TOP ROW: Day & Habit Focus (Calendar/Dials + Board 1 & Board 2) */}
      {(dashboardFocus === "all" || dashboardFocus === "day") && (
        <div className="grid grid-cols-12 gap-5 w-full">
          {/* SECTION A: Calendar & Consistency Dials */}
          <section
            className={
              dashboardFocus === "all"
                ? "col-span-12 xl:col-span-4 lg:col-span-5 flex flex-col gap-4"
                : "col-span-12 lg:col-span-5 flex flex-col gap-4"
            }
          >
            {calendarHabitsSlot}
          </section>

          {/* SECTION B: Daily Execution (Board 1 & 2 side-by-side) */}
          <section
            className={
              dashboardFocus === "all"
                ? "col-span-12 xl:col-span-8 lg:col-span-7 flex flex-col gap-4"
                : "col-span-12 lg:col-span-7 flex flex-col gap-4"
            }
          >
            {dailyExecutionSlot}
          </section>
        </div>
      )}

      {/* BOTTOM ROW: 3-Column Vertical Kanban Focus (Full-Width) */}
      {(dashboardFocus === "all" || dashboardFocus === "kanban") && (
        <section className="w-full flex flex-col">
          {kanbanSlot}
        </section>
      )}
    </div>
  );
}
