"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useHousehold, Partner } from "@/context/HouseholdContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Flame,
  Users,
  LogIn,
  LogOut,
  User as UserIcon,
  BookOpen,
  Bell,
  Smartphone,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { CircleInviteModal } from "./CircleInviteModal";
import { NotificationDrawer } from "./NotificationDrawer";
import { WidgetModal } from "./WidgetModal";
import { ProfileModal } from "./ProfileModal";
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
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const currentScore = scores[activePartner] || { points: 0, streak: 0 };

  const spaceModeConfig = {
    solo: { label: "Solo", icon: "🧍", bg: "bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800" },
    partner: { label: "Duo", icon: "💕", bg: "bg-rose-100 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-800" },
    friends: { label: "Friends", icon: "🧑‍🤝‍🧑", bg: "bg-sky-100 dark:bg-sky-950/40 text-sky-900 dark:text-sky-300 border-sky-300 dark:border-sky-800" },
    family: { label: "Family", icon: "🏡", bg: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800" },
  };
  const modeInfo = spaceModeConfig[spaceMode || "partner"];

  return (
    <>
      <header className="border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200 w-full max-w-full overflow-x-clip">
        {/* Tier 1: Brand Identity & Global Actions Dock */}
        <div className="px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 border-b border-zinc-100 dark:border-zinc-850">
          {/* Brand & Space Mode */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center p-1.5 transition-transform hover:scale-105 shrink-0 shadow-sm">
              <Logo size={18} inverted={resolvedTheme !== "dark"} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-nowrap">
                <h1 className="font-semibold text-xs sm:text-sm tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                  Couple Task Hub
                </h1>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 shrink-0">
                  v0.6.1
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (circle) setIsInviteOpen(true);
                    else if (user) setIsOnboardingOpen(true);
                  }}
                  className={`hidden sm:inline-flex text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full border ${modeInfo.bg} shrink-0 cursor-pointer hover:opacity-80 transition`}
                  title="Active Space Mode (Click to Change)"
                >
                  {modeInfo.icon} {modeInfo.label}
                </button>
              </div>
              <p
                suppressHydrationWarning
                className="text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-normal truncate max-w-[140px] sm:max-w-xs"
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

          {/* Quick Action Dock (Alerts, Widgets, Circle, Docs, Theme Switcher, Profile) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition text-xs font-medium flex items-center gap-1 shrink-0"
              title={`Switch Theme (Current: ${theme})`}
              aria-label="Toggle Color Theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-zinc-600" />
              )}
              <span className="hidden md:inline text-[11px] capitalize">{theme}</span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-1.5 sm:px-2.5 sm:py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition text-xs font-medium flex items-center gap-1 shrink-0"
              title="Notifications & Cheers"
              aria-label="Open notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Alerts</span>
              {unreadCount > 0 && (
                <span className="min-w-[16px] h-[16px] px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Widgets Preview */}
            <button
              type="button"
              onClick={() => setIsWidgetOpen(true)}
              className="hidden sm:flex p-1.5 sm:px-2.5 sm:py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition text-xs font-medium items-center gap-1 shrink-0"
              title="Home Screen Widgets"
              aria-label="Open widgets"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Widgets</span>
            </button>

            {/* Circle / Space Invite */}
            {circle ? (
              <button
                type="button"
                onClick={() => setIsInviteOpen(true)}
                className="p-1.5 sm:px-2.5 sm:py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition text-xs font-medium flex items-center gap-1 shrink-0 max-w-[85px] sm:max-w-none"
                title="Circle Details & Invite Members"
                aria-label="Circle Details"
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-mono truncate">{circle.joinCode || "Invite"}</span>
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
                className="px-2 sm:px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-xs font-medium flex items-center gap-1 shrink-0 text-zinc-800 dark:text-zinc-200"
                title={user ? "Join or Create a Space" : "Sign up or Log in to create or join a circle"}
                aria-label="Join Circle"
              >
                <Users className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-medium">Join</span>
              </button>
            )}

            {/* Docs & Changelog - Desktop only */}
            <Link
              href="/docs"
              className="hidden sm:flex p-1.5 sm:px-2.5 sm:py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition text-xs font-medium items-center gap-1 shrink-0"
              title="Documentation & Guide"
              aria-label="Documentation"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Docs</span>
            </Link>

            {/* Account Profile or Log In */}
            {user ? (
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-1 hover:text-amber-500 transition cursor-pointer"
                  title="Edit your username & circle display name"
                >
                  <UserIcon className="w-3 h-3 text-zinc-500 shrink-0" />
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 max-w-[55px] sm:max-w-[90px] truncate text-[10px] sm:text-[11px]">
                    @{user.username}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => logout()}
                  title="Sign out of account"
                  className="text-zinc-400 hover:text-rose-500 transition ml-0.5 cursor-pointer"
                  aria-label="Sign out"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="px-2.5 sm:px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-medium flex items-center gap-1 shrink-0 cursor-pointer transition"
                title="Sign In or Register"
                aria-label="Log In"
              >
                <LogIn className="w-3 h-3 shrink-0" />
                <span className="text-[10px] sm:text-[11px]">Log In</span>
              </button>
            )}
          </div>
        </div>

        {/* Tier 2: Workspace View & Context Controls Bar */}
        <div className="px-2.5 sm:px-5 py-1.5 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-center justify-between gap-1.5 sm:gap-2 border-t border-zinc-100 dark:border-zinc-850 w-full max-w-full overflow-hidden">
          {/* Left: Desktop Board Focus Selector */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0 overflow-x-auto py-0.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 shrink-0 mr-0.5 hidden xs:inline">
              View:
            </span>
            <div className="flex items-center bg-zinc-200/60 dark:bg-zinc-800/60 p-0.5 rounded-full border border-zinc-200 dark:border-zinc-700/60 text-[11px] font-medium">
              <button
                onClick={() => onDashboardFocusChange("all")}
                className={`px-3 py-1 rounded-full transition cursor-pointer ${
                  dashboardFocus === "all"
                    ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                All Boards
              </button>
              <button
                onClick={() => onDashboardFocusChange("day")}
                className={`px-3 py-1 rounded-full transition cursor-pointer ${
                  dashboardFocus === "day"
                    ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Day &amp; Habits
              </button>
              <button
                onClick={() => onDashboardFocusChange("kanban")}
                className={`px-3 py-1 rounded-full transition cursor-pointer ${
                  dashboardFocus === "kanban"
                    ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Kanban Focus
              </button>
            </div>
          </div>

          {/* Right on Desktop, Full Width Space-Between on Mobile: User Switcher & Streaks */}
          <div className="flex items-center justify-between md:justify-end gap-1.5 sm:gap-2 w-full md:w-auto min-w-0">
            {/* Active Partner Switcher */}
            {spaceMode === "solo" ? (
              <div
                suppressHydrationWarning
                className="flex items-center bg-white dark:bg-zinc-900 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs shrink min-w-0"
              >
                <span className="text-zinc-400 pr-1 text-[9px] sm:text-[10px] font-medium uppercase shrink-0">
                  Solo:
                </span>
                <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="truncate">{partnerNames.alex || user?.username || "You"}</span>
                </span>
              </div>
            ) : user && !circle ? (
              <div
                suppressHydrationWarning
                className="flex items-center bg-white dark:bg-zinc-900 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs shrink min-w-0"
              >
                <span className="text-zinc-400 pr-1 text-[9px] sm:text-[10px] font-medium uppercase shrink-0">
                  User:
                </span>
                <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">@{user.username}</span>
                </span>
              </div>
            ) : (
              <div
                suppressHydrationWarning
                className="flex items-center bg-zinc-200/60 dark:bg-zinc-800/60 p-0.5 rounded-full border border-zinc-200 dark:border-zinc-700/60 text-xs shrink min-w-0"
              >
                <span className="text-zinc-500 dark:text-zinc-400 px-1 text-[9px] sm:text-[10px] font-medium uppercase shrink-0">
                  User:
                </span>
                <button
                  onClick={() => setActivePartner("alex")}
                  className={`px-2 py-0.5 sm:px-3 sm:py-0.5 rounded-full font-medium text-[11px] sm:text-xs transition-all flex items-center gap-1 cursor-pointer min-w-0 max-w-[75px] xs:max-w-[95px] sm:max-w-[125px] ${
                    activePartner === "alex"
                      ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                  title={partnerNames.alex}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      activePartner === "alex" ? "bg-emerald-500" : "bg-zinc-400"
                    }`}
                  />
                  <span className="truncate">{partnerNames.alex}</span>
                </button>
                <button
                  onClick={() => setActivePartner("sam")}
                  className={`px-2 py-0.5 sm:px-3 sm:py-0.5 rounded-full font-medium text-[11px] sm:text-xs transition-all flex items-center gap-1 cursor-pointer min-w-0 max-w-[75px] xs:max-w-[95px] sm:max-w-[125px] ${
                    activePartner === "sam"
                      ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                  title={partnerNames.sam}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      activePartner === "sam" ? "bg-emerald-500" : "bg-zinc-400"
                    }`}
                  />
                  <span className="truncate">{partnerNames.sam}</span>
                </button>
              </div>
            )}

            {/* Streaks & Points Pill */}
            <div
              suppressHydrationWarning
              className="flex items-center gap-1 sm:gap-1.5 bg-white dark:bg-zinc-900 px-2 sm:px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-medium shrink-0"
            >
              <div className="flex items-center gap-0.5 sm:gap-1 border-r border-zinc-200 dark:border-zinc-800 pr-1.5 text-[10px] sm:text-xs text-zinc-700 dark:text-zinc-300">
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 shrink-0" />
                <span>{currentScore.streak} DAYS</span>
              </div>
              <div className={`flex items-center gap-0.5 text-[10px] sm:text-xs font-mono ${currentScore.points < 0 ? "text-rose-500 font-bold" : "text-zinc-700 dark:text-zinc-300"}`}>
                <span>{currentScore.points} PTS</span>
              </div>
              <button
                onClick={onOpenWishlist}
                className="ml-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-[8px] sm:text-[9px] uppercase font-bold px-2 py-0.5 rounded-full hover:opacity-85 transition cursor-pointer shrink-0"
              >
                Wishlist
              </button>
            </div>
          </div>
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
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
