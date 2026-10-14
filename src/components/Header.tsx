"use client";

import React, { useState } from "react";
import { useHousehold, Partner } from "@/context/HouseholdContext";
import { Flame, Users } from "lucide-react";
import { CircleInviteModal } from "./CircleInviteModal";
import { Logo } from "./Logo";

export interface HeaderProps {
  viewMode?: "desktop" | "mobile";
  onViewModeChange?: (mode: "desktop" | "mobile") => void;
  dashboardFocus: "all" | "kanban" | "day";
  onDashboardFocusChange: (focus: "all" | "kanban" | "day") => void;
  onOpenWishlist: () => void;
}

export function Header({
  dashboardFocus,
  onDashboardFocusChange,
  onOpenWishlist,
}: HeaderProps) {
  const { activePartner, setActivePartner, scores, partnerNames, circle } = useHousehold();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const currentScore = scores[activePartner] || { points: 0, streak: 0 };

  return (
    <>
      <header className="border-b-2 border-black bg-white sticky top-0 z-40 px-3 sm:px-5 py-2.5 sm:py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 shadow-[0_2px_0_0_rgba(0,0,0,0.05)] w-full max-w-full">
        {/* Brand / Household */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000] p-1.5 transition-transform hover:scale-105 shrink-0">
              <Logo size={24} inverted />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-heading font-extrabold text-sm sm:text-base tracking-tight text-black uppercase truncate">
                  Couple Task Hub
                </h1>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-black bg-[#f4f4f5] text-black shrink-0">
                  v0.5
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-500 font-medium truncate">
                {circle?.name || `${partnerNames.alex} & ${partnerNames.sam}'s Space`}
              </p>
            </div>
          </div>

          {/* Mobile Invite Button */}
          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="sm:hidden px-2.5 py-1 rounded-full border-2 border-black bg-zinc-100 hover:bg-black hover:text-white transition text-[11px] font-heading font-extrabold flex items-center gap-1 shadow-[1.5px_1.5px_0_0_#000] shrink-0 cursor-pointer"
            title="Circle Details & Invite Partner"
          >
            <Users className="w-3 h-3" />
            <span>{circle?.joinCode || "Invite"}</span>
          </button>
        </div>

        {/* Center: View Focus Switcher */}
        <div className="hidden lg:flex items-center bg-[#f4f4f5] p-1 rounded-2xl border border-zinc-200 text-xs font-heading font-bold shrink-0">
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
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 flex-wrap">
          {/* Active Partner Switcher */}
          <div className="flex items-center bg-[#f4f4f5] p-0.5 sm:p-1 rounded-2xl border border-zinc-200 text-xs shrink-0">
            <span className="text-zinc-400 px-1.5 text-[10px] font-bold uppercase font-heading">
              User:
            </span>
            <button
              onClick={() => setActivePartner("alex")}
              className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl font-bold font-heading text-xs transition-all flex items-center gap-1 ${
                activePartner === "alex"
                  ? "bg-black text-white shadow-sm"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activePartner === "alex" ? "bg-white" : "bg-zinc-400"
                }`}
              />
              {partnerNames.alex}
            </button>
            <button
              onClick={() => setActivePartner("sam")}
              className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl font-bold font-heading text-xs transition-all flex items-center gap-1 ${
                activePartner === "sam"
                  ? "bg-black text-white shadow-sm"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activePartner === "sam" ? "bg-white" : "bg-zinc-400"
                }`}
              />
              {partnerNames.sam}
            </button>
          </div>

          {/* Streaks & Points Pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-3 py-1 rounded-full border-2 border-black text-xs font-heading font-bold shadow-[2px_2px_0_0_#000] shrink-0">
            <div className="flex items-center gap-1 border-r border-zinc-200 pr-1.5 text-[11px] sm:text-xs">
              <Flame className="w-3 h-3 text-black" />
              <span>{currentScore.streak} DAYS</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs">
              <span>{currentScore.points} PTS</span>
            </div>
            <button
              onClick={onOpenWishlist}
              className="ml-0.5 bg-black text-white text-[9px] sm:text-[10px] uppercase font-bold px-2 py-0.5 rounded-full hover:bg-zinc-800 transition"
            >
              Wishlist
            </button>
          </div>

          {/* Desktop Invite Code Pill */}
          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="hidden sm:flex px-3 py-1.5 rounded-full border-2 border-black bg-zinc-100 hover:bg-black hover:text-white transition text-xs font-heading font-extrabold items-center gap-1.5 shadow-[2px_2px_0_0_#000] shrink-0 cursor-pointer"
            title="Circle Details & Invite Partner"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{circle?.joinCode || "Invite"}</span>
          </button>
        </div>
      </header>

      <CircleInviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </>
  );
}
