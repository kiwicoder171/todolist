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
    <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between text-xs flex-wrap gap-2 sm:gap-3 transition-colors duration-200">
      {/* Assignee Filter Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="text-zinc-400 dark:text-zinc-500 font-medium uppercase text-[10px] sm:text-[11px]">
          Show:
        </span>
        <div className="flex gap-1 sm:gap-1.5 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setAssigneeFilter(f.key)}
              title={f.label}
              className={`px-3 py-1 rounded-full font-medium text-xs transition cursor-pointer max-w-[125px] sm:max-w-[180px] ${
                assigneeFilter === f.key
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-xs"
                  : "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white/80 dark:bg-zinc-900/40"
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
          <span className="text-zinc-400 dark:text-zinc-500 text-[10px] sm:text-[11px] font-medium uppercase hidden sm:inline">
            Calendar:
          </span>
          <span
            suppressHydrationWarning
            className="font-medium text-xs text-zinc-800 dark:text-zinc-200 bg-zinc-100/80 dark:bg-zinc-900/80 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800"
          >
            {formattedDate}
          </span>
        </div>

        {/* Freeze Day Quick Toggle */}
        <button
          type="button"
          onClick={toggleFreezeDay}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium transition cursor-pointer ${
            isFreezeDay
              ? "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400"
              : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 bg-white/80 dark:bg-zinc-900/40"
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
