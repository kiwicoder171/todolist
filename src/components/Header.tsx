"use client";

import React from "react";
import { useHousehold, Partner } from "@/context/HouseholdContext";
import { Flame } from "lucide-react";

export interface HeaderProps {
  viewMode: "desktop" | "mobile";
  onViewModeChange: (mode: "desktop" | "mobile") => void;
  dashboardFocus: "all" | "kanban" | "day";
  onDashboardFocusChange: (focus: "all" | "kanban" | "day") => void;
  onOpenWishlist: () => void;
}

export function Header({
  viewMode,
  onViewModeChange,
  dashboardFocus,
  onDashboardFocusChange,
  onOpenWishlist,
}: HeaderProps) {
  const { activePartner, setActivePartner, scores } = useHousehold();
  const currentScore = scores[activePartner];

  return (
    <header className="border-b-2 border-black bg-white sticky top-0 z-40 px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-[0_2px_0_0_rgba(0,0,0,0.05)]">
      {/* Brand / Household */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-heading font-black text-lg tracking-tighter shadow-sm">
          2DO
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-base tracking-tight text-black uppercase">
              Couple Task Hub
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-black bg-[#f4f4f5] text-black">
              v0.5
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-medium">Alex &amp; Sam&apos;s Shared Space</p>
        </div>
      </div>

      {/* Center: View Focus Switcher */}
      <div className="hidden lg:flex items-center bg-[#f4f4f5] p-1 rounded-2xl border border-zinc-200 text-xs font-heading font-bold">
        <button
          onClick={() => onDashboardFocusChange("all")}
          className={`px-3.5 py-1.5 rounded-xl transition ${
            dashboardFocus === "all"
              ? "bg-black text-white shadow-sm"
              : "text-zinc-600 hover:text-black"
          }`}
        >
          Dashboard View (All)
        </button>
        <button
          onClick={() => onDashboardFocusChange("kanban")}
          className={`px-3.5 py-1.5 rounded-xl transition ${
            dashboardFocus === "kanban"
              ? "bg-black text-white shadow-sm"
              : "text-zinc-600 hover:text-black"
          }`}
        >
          3-Column Kanban Focus
        </button>
        <button
          onClick={() => onDashboardFocusChange("day")}
          className={`px-3.5 py-1.5 rounded-xl transition ${
            dashboardFocus === "day"
              ? "bg-black text-white shadow-sm"
              : "text-zinc-600 hover:text-black"
          }`}
        >
          Day &amp; Habits Focus
        </button>
      </div>

      {/* Partner Identity & Streaks */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Active Partner Switcher */}
        <div className="flex items-center bg-[#f4f4f5] p-1 rounded-2xl border border-zinc-200 text-xs">
          <span className="text-zinc-400 px-2 text-[11px] font-bold uppercase font-heading">
            User:
          </span>
          <button
            onClick={() => setActivePartner("alex")}
            className={`px-3 py-1 rounded-xl font-bold font-heading text-xs transition-all flex items-center gap-1.5 ${
              activePartner === "alex"
                ? "bg-black text-white shadow-sm"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activePartner === "alex" ? "bg-white" : "bg-zinc-400"
              }`}
            />
            Alex
          </button>
          <button
            onClick={() => setActivePartner("sam")}
            className={`px-3 py-1 rounded-xl font-bold font-heading text-xs transition-all flex items-center gap-1.5 ${
              activePartner === "sam"
                ? "bg-black text-white shadow-sm"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activePartner === "sam" ? "bg-white" : "bg-zinc-400"
              }`}
            />
            Sam
          </button>
        </div>

        {/* Streaks & Points Pill */}
        <div className="flex items-center gap-2.5 bg-white px-3.5 py-1 rounded-full border-2 border-black text-xs font-heading font-bold shadow-[2px_2px_0_0_#000]">
          <div className="flex items-center gap-1.5 border-r border-zinc-200 pr-2">
            <Flame className="w-3.5 h-3.5 text-black" />
            <span>{currentScore.streak} DAYS</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{currentScore.points} PTS</span>
          </div>
          <button
            onClick={onOpenWishlist}
            className="ml-1 bg-black text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full hover:bg-zinc-800 transition"
          >
            Wishlist
          </button>
        </div>

        {/* Desktop vs Mobile Preview Switcher */}
        <div className="flex items-center bg-[#f4f4f5] p-1 rounded-2xl border border-zinc-200 text-xs font-heading font-bold">
          <button
            onClick={() => onViewModeChange("desktop")}
            className={`px-3 py-1 rounded-xl transition ${
              viewMode === "desktop" ? "bg-black text-white" : "text-zinc-600 hover:text-black"
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => onViewModeChange("mobile")}
            className={`px-3 py-1 rounded-xl transition ${
              viewMode === "mobile" ? "bg-black text-white" : "text-zinc-600 hover:text-black"
            }`}
          >
            Mobile
          </button>
        </div>
      </div>
    </header>
  );
}
