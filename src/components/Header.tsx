"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useHousehold, Partner } from "@/context/HouseholdContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import {
  Flame,
  Users,
  LogIn,
  LogOut,
  User as UserIcon,
  BookOpen,
  Bell,
  Smartphone,
} from "lucide-react";
import { CircleInviteModal } from "./CircleInviteModal";
import { NotificationDrawer } from "./NotificationDrawer";
import { WidgetModal } from "./WidgetModal";
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
  const {
    activePartner,
    setActivePartner,
    scores,
    partnerNames,
    circle,
    setIsOnboardingOpen,
    spaceMode,
  } = useHousehold();
  const { user, logout, openAuthModal } = useAuth();
  const { unreadCount, setIsDrawerOpen } = useNotifications();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const currentScore = scores[activePartner] || { points: 0, streak: 0 };

  const spaceModeConfig = {
    solo: { label: "Solo", icon: "🧍", bg: "bg-[#FEF08A]" },
    partner: { label: "Duo", icon: "💕", bg: "bg-[#FBCFE8]" },
    friends: { label: "Friends", icon: "🧑‍🤝‍🧑", bg: "bg-[#BAE6FD]" },
    family: { label: "Family", icon: "🏡", bg: "bg-[#A7F3D0]" },
  };
  const modeInfo = spaceModeConfig[spaceMode || "partner"];

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
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
                <h1 className="font-heading font-extrabold text-sm sm:text-base tracking-tight text-black uppercase truncate">
                  Couple Task Hub
                </h1>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-black bg-[#f4f4f5] text-black shrink-0">
                  v0.6.0
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (circle) setIsInviteOpen(true);
                    else if (user) setIsOnboardingOpen(true);
                  }}
                  className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border border-black ${modeInfo.bg} text-black shrink-0 cursor-pointer shadow-xs hover:opacity-80 transition`}
                  title="Active Space Mode (Click to Change)"
                >
                  {modeInfo.icon} {modeInfo.label}
                </button>
              </div>
              <p
                suppressHydrationWarning
                className="text-[11px] sm:text-xs text-zinc-500 font-medium truncate"
              >
                {circle
                  ? circle.name ||
                    (spaceMode === "solo"
                      ? `${partnerNames.alex || "Solo"}'s Space`
                      : `${partnerNames.alex} & ${partnerNames.sam}'s Space`)
                  : user
                  ? `${user.username}'s Space`
                  : spaceMode === "solo"
                  ? `${partnerNames.alex || "Solo"}'s Space`
                  : `${partnerNames.alex} & ${partnerNames.sam}'s Space`}
              </p>
            </div>
          </div>

          {/* Mobile Right Actions: Notifications, Widgets, Circle, Docs, Log In */}
          <div className="flex items-center gap-1.5 sm:hidden shrink-0">
            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-1 rounded-full border-2 border-black bg-white hover:bg-zinc-100 transition text-xs font-heading font-extrabold flex items-center justify-center shadow-[1.5px_1.5px_0_0_#000] shrink-0 cursor-pointer"
              title="Notifications"
              aria-label="Open notifications"
            >
              <Bell className="w-3.5 h-3.5 text-black" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border border-black flex items-center justify-center text-[8px] font-black text-white">
                  {unreadCount > 9 ? "!" : unreadCount}
                </span>
              )}
            </button>

            {/* Widget Button */}
            <button
              type="button"
              onClick={() => setIsWidgetOpen(true)}
              className="p-1 rounded-full border-2 border-black bg-white hover:bg-zinc-100 transition text-xs font-heading font-extrabold flex items-center justify-center shadow-[1.5px_1.5px_0_0_#000] shrink-0 cursor-pointer"
              title="Home Screen Widgets"
              aria-label="Open widgets"
            >
              <Smartphone className="w-3.5 h-3.5 text-black" />
            </button>

            {/* Circle */}
            <button
              type="button"
              onClick={() => {
                if (circle) {
                  setIsInviteOpen(true);
                } else if (!user) {
                  openAuthModal("register");
                } else {
                  setIsOnboardingOpen(true);
                }
              }}
              className="px-2 py-1 rounded-full border-2 border-black bg-zinc-100 hover:bg-black hover:text-white transition text-[11px] font-heading font-extrabold flex items-center gap-1 shadow-[1.5px_1.5px_0_0_#000] shrink-0 cursor-pointer"
              title={circle ? "Circle Details & Invite Partner" : user ? "Join or Create a Circle" : "Sign up or Log in to join a circle"}
            >
              <Users className="w-3 h-3" />
              <span>{circle?.joinCode || "Circle"}</span>
            </button>

            <Link
              href="/docs"
              className="p-1 rounded-full border-2 border-black bg-white hover:bg-black hover:text-white transition text-xs font-heading font-extrabold flex items-center justify-center shadow-[1.5px_1.5px_0_0_#000] shrink-0"
              title="Documentation & Guide"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </Link>

            {user ? (
              <div className="flex items-center gap-1 bg-[#f4f4f5] px-2 py-0.5 rounded-full border border-zinc-300 text-[11px] shrink-0 font-heading">
                <span className="font-extrabold text-black max-w-[70px] truncate">
                  @{user.username}
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  title="Sign out of account"
                  className="text-zinc-400 hover:text-red-600 transition cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="px-2.5 py-1 rounded-full border-2 border-black bg-amber-300 hover:bg-amber-400 text-black text-[11px] font-heading font-extrabold flex items-center gap-1 shadow-[1.5px_1.5px_0_0_#000] shrink-0 cursor-pointer"
                title="Log In"
              >
                <LogIn className="w-3 h-3" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>

        {/* Center: View Focus Switcher */}
        <div className="hidden xl:flex items-center bg-[#f4f4f5] p-0.5 rounded-2xl border border-zinc-200 text-[11px] font-heading font-bold shrink-0">
          <button
            onClick={() => onDashboardFocusChange("all")}
            className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
              dashboardFocus === "all"
                ? "bg-black text-white shadow-sm"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            All Boards
          </button>
          <button
            onClick={() => onDashboardFocusChange("day")}
            className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
              dashboardFocus === "day"
                ? "bg-black text-white shadow-sm"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            Day &amp; Habits
          </button>
          <button
            onClick={() => onDashboardFocusChange("kanban")}
            className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
              dashboardFocus === "kanban"
                ? "bg-black text-white shadow-sm"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            Kanban Focus
          </button>
        </div>

        {/* Partner Identity, Widgets, Notifications, Streaks & Auth */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
          {/* Active Partner Switcher */}
          {spaceMode === "solo" ? (
            <div
              suppressHydrationWarning
              className="flex items-center bg-[#f4f4f5] px-2.5 py-1 rounded-2xl border border-zinc-200 text-xs shrink-0"
            >
              <span className="text-zinc-400 pr-1.5 text-[10px] font-bold uppercase font-heading">
                Solo:
              </span>
              <span className="font-bold font-heading text-xs text-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {partnerNames.alex || user?.username || "You"}
              </span>
            </div>
          ) : user && !circle ? (
            <div
              suppressHydrationWarning
              className="flex items-center bg-[#f4f4f5] px-2.5 py-1 rounded-2xl border border-zinc-200 text-xs shrink-0"
            >
              <span className="text-zinc-400 pr-1.5 text-[10px] font-bold uppercase font-heading">
                User:
              </span>
              <span className="font-bold font-heading text-xs text-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                @{user.username}
              </span>
            </div>
          ) : (
            <div
              suppressHydrationWarning
              className="flex items-center bg-[#f4f4f5] p-0.5 rounded-2xl border border-zinc-200 text-xs shrink-0"
            >
              <span className="text-zinc-400 px-1 text-[10px] font-bold uppercase font-heading">
                User:
              </span>
              <button
                onClick={() => setActivePartner("alex")}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-xl font-bold font-heading text-xs transition-all flex items-center gap-1 ${
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
                className={`px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-xl font-bold font-heading text-xs transition-all flex items-center gap-1 ${
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
          )}

          {/* Streaks & Points Pill */}
          <div
            suppressHydrationWarning
            className="flex items-center gap-1.5 bg-white px-2 sm:px-2.5 py-1 rounded-full border-2 border-black text-xs font-heading font-bold shadow-[1.5px_1.5px_0_0_#000] shrink-0"
          >
            <div className="flex items-center gap-1 border-r border-zinc-200 pr-1 text-[11px] sm:text-xs">
              <Flame className="w-3 h-3 text-black" />
              <span>{currentScore.streak} DAYS</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs">
              <span>{currentScore.points} PTS</span>
            </div>
            <button
              onClick={onOpenWishlist}
              className="ml-0.5 bg-black text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full hover:bg-zinc-800 transition cursor-pointer"
            >
              Wishlist
            </button>
          </div>

          {/* Notification Bell Button (Desktop) */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="hidden sm:flex relative px-2.5 py-1 rounded-full border-2 border-black bg-white hover:bg-zinc-100 transition text-xs font-heading font-extrabold items-center gap-1 shadow-[1.5px_1.5px_0_0_#000] shrink-0 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            title="Notifications & Cheers"
            aria-label="Open notifications"
          >
            <Bell className="w-3.5 h-3.5 text-black" />
            <span className="hidden md:inline">Alerts</span>
            {unreadCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border border-black shadow-xs">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Widgets Button (Desktop) */}
          <button
            type="button"
            onClick={() => setIsWidgetOpen(true)}
            className="hidden sm:flex px-2.5 py-1 rounded-full border-2 border-black bg-white hover:bg-zinc-100 transition text-xs font-heading font-extrabold items-center gap-1 shadow-[1.5px_1.5px_0_0_#000] shrink-0 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            title="Home Screen Widgets"
            aria-label="Open widgets"
          >
            <Smartphone className="w-3.5 h-3.5 text-black" />
            <span className="hidden md:inline">Widgets</span>
          </button>

          {/* Circle / Space Pill */}
          {circle ? (
            <button
              type="button"
              onClick={() => setIsInviteOpen(true)}
              className="hidden sm:flex px-2.5 py-1 rounded-full border-2 border-black bg-zinc-100 hover:bg-black hover:text-white transition text-xs font-heading font-extrabold items-center gap-1 shadow-[1.5px_1.5px_0_0_#000] shrink-0 cursor-pointer"
              title="Circle Details & Invite Members"
            >
              <Users className="w-3 h-3" />
              <span>{circle.joinCode || "Invite"}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  openAuthModal("register");
                } else {
                  setIsOnboardingOpen(true);
                }
              }}
              className="hidden sm:flex px-2.5 py-1 rounded-full border-2 border-black bg-white hover:bg-zinc-100 transition text-xs font-heading font-extrabold items-center gap-1 shadow-[1.5px_1.5px_0_0_#000] shrink-0 cursor-pointer text-zinc-900"
              title={user ? "Join or Create a Space" : "Sign up or Log in to create or join a circle"}
            >
              <Users className="w-3 h-3 text-zinc-500" />
              <span>Join Circle</span>
            </button>
          )}

          {/* Documentation & Changelog */}
          <Link
            href="/docs"
            className="hidden sm:flex px-2.5 py-1 rounded-full border-2 border-black bg-white hover:bg-black hover:text-white transition text-xs font-heading font-extrabold items-center gap-1 shadow-[1.5px_1.5px_0_0_#000] shrink-0 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            title="Read Guide & Version Changelog"
          >
            <BookOpen className="w-3 h-3" />
            <span className="hidden md:inline">Docs</span>
          </Link>

          {/* Account Profile or Log In */}
          {user ? (
            <div className="hidden sm:flex items-center gap-1 bg-[#f4f4f5] px-2 py-1 rounded-full border border-zinc-300 text-xs shrink-0 font-heading shadow-xs">
              <UserIcon className="w-3 h-3 text-zinc-700" />
              <span className="font-extrabold text-black max-w-[70px] sm:max-w-[100px] truncate">
                @{user.username}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                title="Sign out of account"
                className="text-zinc-400 hover:text-red-600 transition ml-0.5 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="hidden sm:flex px-2.5 py-1 rounded-full border-2 border-black bg-amber-300 hover:bg-amber-400 text-black text-xs font-heading font-extrabold items-center gap-1 shadow-[1.5px_1.5px_0_0_#000] shrink-0 cursor-pointer transition active:translate-x-0.5 active:translate-y-0.5"
              title="Sign in with Username or Register with Gmail"
            >
              <LogIn className="w-3 h-3" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </header>

      {/* Global Modals & Drawers */}
      <NotificationDrawer />
      {isWidgetOpen && (
        <WidgetModal
          isOpen={isWidgetOpen}
          onClose={() => setIsWidgetOpen(false)}
        />
      )}
      <CircleInviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </>
  );
}
