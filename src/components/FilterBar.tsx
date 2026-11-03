"use client";

import React from "react";
import { useHousehold, AssigneeFilter } from "@/context/HouseholdContext";

export function FilterBar() {
  const {
    assigneeFilter,
    setAssigneeFilter,
    selectedDate,
    isFreezeDay,
    toggleFreezeDay,
    activePartner,
    partnerNames,
  } = useHousehold();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(selectedDate);

  const otherPartnerName = activePartner === "alex" ? partnerNames.sam : partnerNames.alex;

  const filters: { key: AssigneeFilter; label: string }[] = [
    { key: "all", label: "All Items" },
    { key: "mine", label: "Mine" },
    { key: "partner", label: `${otherPartnerName}'s` },
  ];

  return (
    <div className="bg-[#f5f5f7]/70 dark:bg-[#000000]/70 backdrop-blur-2xl border-b border-black/[0.05] dark:border-white/[0.06] px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between text-xs flex-wrap gap-2 sm:gap-3 transition-colors duration-200 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]">
      {/* Assignee Filter Segmented Track */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 dark:text-zinc-500 font-semibold uppercase text-[10px] sm:text-[11px] tracking-wider">
          Show:
        </span>
        <div className="flex items-center bg-black/[0.05] dark:bg-white/[0.08] p-0.5 rounded-full border border-black/[0.04] dark:border-white/[0.06] backdrop-blur-md">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setAssigneeFilter(f.key)}
              title={f.label}
              className={`px-3 py-1 rounded-full font-medium text-xs transition-all cursor-pointer max-w-[125px] sm:max-w-[180px] active:scale-95 ${
                assigneeFilter === f.key
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-[0_2px_8px_rgba(0,0,0,0.1)] font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <span className="truncate block">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Date Display & Freeze Day Button (Desktop & Tablet) */}
      <div className="hidden sm:flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-zinc-400 dark:text-zinc-500 text-[10px] sm:text-[11px] font-semibold uppercase hidden sm:inline tracking-wider">
            Calendar:
          </span>
          <span
            suppressHydrationWarning
            className="font-medium text-xs text-zinc-800 dark:text-zinc-200 bg-black/[0.03] dark:bg-white/[0.06] px-3 py-1 rounded-full border border-black/[0.06] dark:border-white/[0.08] shadow-xs"
          >
            {formattedDate}
          </span>
        </div>

        {/* Freeze Day Quick Toggle */}
        <button
          type="button"
          onClick={toggleFreezeDay}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium transition cursor-pointer active:scale-95 shadow-xs ${
            isFreezeDay
              ? "bg-sky-500/15 border-sky-500/30 text-sky-700 dark:text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.2)]"
              : "border-black/[0.06] dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-white/70 dark:bg-zinc-900/50"
          }`}
          title="Mark selected date as rest/freeze day (preserves streak without routine penalties)"
        >
          <span>🧊</span>
          <span>Freeze / Rest Day: {isFreezeDay ? "ON" : "Off"}</span>
        </button>
      </div>
    </div>
  );
}
