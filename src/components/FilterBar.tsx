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
  } = useHousehold();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(selectedDate);

  const filters: { key: AssigneeFilter; label: string }[] = [
    { key: "all", label: "All Items" },
    { key: "mine", label: "Mine" },
    { key: "partner", label: "Sam's" },
  ];

  return (
    <div className="bg-white border-b-2 border-zinc-200 px-6 py-2.5 flex items-center justify-between text-xs flex-wrap gap-3">
      {/* Assignee Filter Pills */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-500 font-bold uppercase text-[11px] font-heading">
          Show:
        </span>
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setAssigneeFilter(f.key)}
              className={`px-3 py-1 rounded-full font-heading font-bold text-xs transition ${
                assigneeFilter === f.key
                  ? "border border-black bg-black text-white shadow-sm"
                  : "border border-zinc-300 text-zinc-600 hover:border-black hover:text-black"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Date Display & Freeze Day Button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-[11px] font-bold uppercase font-heading">
            Calendar:
          </span>
          <span className="font-heading font-extrabold text-black bg-[#f4f4f5] border border-black px-3 py-0.5 rounded-lg text-xs">
            {formattedDate}
          </span>
        </div>
        <button
          onClick={toggleFreezeDay}
          className="px-3 py-1 rounded-lg border-2 border-dashed border-zinc-400 hover:border-black text-zinc-700 font-heading font-bold text-[11px] uppercase transition flex items-center gap-1.5 bg-white"
        >
          <span
            className={`w-2 h-2 rounded-full border border-black ${
              isFreezeDay ? "bg-black" : "bg-white"
            }`}
          />
          <span>Freeze / Rest Day: {isFreezeDay ? "ON" : "Off"}</span>
        </button>
      </div>
    </div>
  );
}
