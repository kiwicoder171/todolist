"use client";

import React, { useState, useRef, useEffect } from "react";
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
  MoreHorizontal,
  ChevronDown,
  Sparkles,
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
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const currentScore = scores[activePartner] || { points: 0, streak: 0 };

  const spaceModeConfig = {
    solo: { label: "Solo", icon: "🧍", bg: "bg-amber-500/10 text-amber-900 dark:text-amber-300 border-amber-300/60 dark:border-amber-700/60" },
    partner: { label: "Duo", icon: "💕", bg: "bg-rose-500/10 text-rose-900 dark:text-rose-300 border-rose-300/60 dark:border-rose-700/60" },
    friends: { label: "Friends", icon: "🧑‍🤝‍🧑", bg: "bg-sky-500/10 text-sky-900 dark:text-sky-300 border-sky-300/60 dark:border-sky-700/60" },
    family: { label: "Family", icon: "🏡", bg: "bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/60" },
  };
  const modeInfo = spaceModeConfig[spaceMode || "partner"];

  // Close "more" popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full max-w-full overflow-x-clip px-3 sm:px-6 pt-3 pb-2 transition-all">
        {/* Floating Apple Island Command Bar */}
        <div className="apple-card rounded-3xl p-1.5 sm:p-2 sm:px-4 flex items-center justify-between gap-2 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-2xl">
          
          {/* SECTION 1: Brand & Space Identity */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center p-1.5 transition-transform hover:scale-105 active:scale-95 shrink-0 shadow-xs border border-black/5 dark:border-white/10"
              title="Couple Task Hub"
            >
              <Logo size={18} inverted={resolvedTheme !== "dark"} />
            </div>

            <div className="min-w-0 hidden sm:flex flex-col justify-center">
              <div className="flex items-center gap-1.5 flex-nowrap">
                <h1 className="font-semibold text-xs sm:text-sm tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                  Couple Task Hub
                </h1>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-400 shrink-0 font-medium">
                  v0.6.1
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (circle) setIsInviteOpen(true);
                    else if (user) setIsOnboardingOpen(true);
                  }}
                  className={`hidden lg:inline-flex text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full border ${modeInfo.bg} shrink-0 cursor-pointer hover:opacity-80 active:scale-95 transition`}
                  title="Active Space Mode (Click to Change)"
                >
                  {modeInfo.icon} {modeInfo.label}
                </button>
              </div>

              <p
                suppressHydrationWarning
                className="text-[10px] sm:text-[11px] text-zinc-400 dark:text-zinc-500 font-normal truncate max-w-[120px] sm:max-w-xs"
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

          {/* SECTION 2: Center iOS Segmented View Switcher (Desktop) */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-sm px-2">
            <div className="apple-segmented-track p-1 rounded-2xl flex items-center w-full text-xs font-semibold">
              <button
                type="button"
                onClick={() => onDashboardFocusChange("all")}
                className={`flex-1 py-1.5 px-3 rounded-xl text-center transition-all duration-150 cursor-pointer apple-press ${
                  dashboardFocus === "all"
                    ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                All Boards
              </button>
              <button
                type="button"
                onClick={() => onDashboardFocusChange("day")}
                className={`flex-1 py-1.5 px-3 rounded-xl text-center transition-all duration-150 cursor-pointer apple-press ${
                  dashboardFocus === "day"
                    ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Day &amp; Habits
              </button>
              <button
                type="button"
                onClick={() => onDashboardFocusChange("kanban")}
                className={`flex-1 py-1.5 px-3 rounded-xl text-center transition-all duration-150 cursor-pointer apple-press ${
                  dashboardFocus === "kanban"
                    ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Kanban Focus
              </button>
            </div>
          </div>

          {/* SECTION 3: Right Control Cluster (Partner Avatars + Streaks + Control Center) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Active Partner Switcher */}
            {spaceMode === "solo" ? (
              <div
                suppressHydrationWarning
                className="flex items-center bg-black/[0.04] dark:bg-white/[0.06] px-2.5 py-1 rounded-full text-xs font-semibold text-zinc-800 dark:text-zinc-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 shrink-0" />
                <span className="truncate max-w-[80px]">{partnerNames.alex || user?.username || "You"}</span>
              </div>
            ) : user && !circle ? (
              <div
                suppressHydrationWarning
                className="flex items-center bg-black/[0.04] dark:bg-white/[0.06] px-2.5 py-1 rounded-full text-xs font-semibold text-zinc-800 dark:text-zinc-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shrink-0" />
                <span className="truncate max-w-[85px]">@{user.username}</span>
              </div>
            ) : (
              <div
                suppressHydrationWarning
                className="apple-segmented-track p-0.5 rounded-2xl flex items-center text-xs font-medium"
              >
                <button
                  type="button"
                  onClick={() => setActivePartner("alex")}
                  className={`px-2 sm:px-2.5 py-1 rounded-xl transition-all duration-150 flex items-center gap-1 sm:gap-1.5 cursor-pointer apple-press ${
                    activePartner === "alex"
                      ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs font-semibold"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                  title={partnerNames.alex}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      activePartner === "alex" ? "bg-emerald-500 shadow-[0_0_6px_#10b981]" : "bg-zinc-400"
                    }`}
                  />
                  <span className="truncate max-w-[48px] sm:max-w-[85px]">{partnerNames.alex}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePartner("sam")}
                  className={`px-2 sm:px-2.5 py-1 rounded-xl transition-all duration-150 flex items-center gap-1 sm:gap-1.5 cursor-pointer apple-press ${
                    activePartner === "sam"
                      ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs font-semibold"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                  title={partnerNames.sam}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      activePartner === "sam" ? "bg-emerald-500 shadow-[0_0_6px_#10b981]" : "bg-zinc-400"
                    }`}
                  />
                  <span className="truncate max-w-[48px] sm:max-w-[85px]">{partnerNames.sam}</span>
                </button>
              </div>
            )}

            {/* BoardUI Streak & Points Metric Pill */}
            <div
              suppressHydrationWarning
              className="hidden xs:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.04] text-xs font-semibold"
            >
              <div className="flex items-center gap-1 border-r border-black/[0.06] dark:border-white/[0.08] pr-2 text-zinc-700 dark:text-zinc-300">
                <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-[11px] sm:text-xs">{currentScore.streak} DAYS</span>
              </div>
              <div className={`font-mono ${currentScore.points < 0 ? "text-rose-500" : "text-zinc-800 dark:text-zinc-200"}`}>
                <span className="text-[11px] sm:text-xs">{currentScore.points} PTS</span>
              </div>
              <button
                type="button"
                onClick={onOpenWishlist}
                className="ml-0.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-semibold px-2 py-0.5 rounded-lg hover:opacity-90 apple-press transition cursor-pointer shadow-2xs"
              >
                Wishlist
              </button>
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-black/[0.06] dark:border-white/[0.08] hidden sm:block mx-0.5" />

            {/* Action Tools Cluster (Theme, Alerts, More Popover) */}
            <div className="flex items-center gap-1">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                suppressHydrationWarning
                className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] apple-press transition cursor-pointer outline-none shrink-0"
                title={`Switch Theme (Current: ${theme})`}
                aria-label="Toggle Color Theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-zinc-600" />
                )}
              </button>

              {/* Notification Bell */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="relative w-8 h-8 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] apple-press transition cursor-pointer outline-none"
                title="Notifications & Cheers"
                aria-label="Open notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Circle / Space Join Button */}
              {circle ? (
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(true)}
                  aria-label="Circle Details"
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.06] text-zinc-800 dark:text-zinc-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-xs font-semibold apple-press transition"
                  title="Circle Details & Invite Members"
                >
                  <Users className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="font-mono text-[11px] truncate max-w-[70px]">{circle.joinCode || "Invite"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!user) openAuthModal("register");
                    else setIsOnboardingOpen(true);
                  }}
                  aria-label="Join Circle"
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.06] text-zinc-800 dark:text-zinc-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-xs font-semibold apple-press transition"
                  title={user ? "Join or Create a Space" : "Sign up or Log in to create or join a circle"}
                >
                  <Users className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Join</span>
                </button>
              )}

              {/* Control Center Popover (More Actions) */}
              <div className="relative" ref={moreMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer outline-none apple-press ${
                    isMoreMenuOpen
                      ? "bg-black/[0.08] dark:bg-white/[0.12] text-zinc-900 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.08]"
                  }`}
                  title="More actions & apps"
                  aria-label="More actions"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {/* Popover Menu */}
                {isMoreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.1] p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.6)] z-50 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsWidgetOpen(true);
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] flex items-center gap-2 transition apple-press"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Home Widgets</span>
                    </button>

                    <Link
                      href="/docs"
                      onClick={() => setIsMoreMenuOpen(false)}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] flex items-center gap-2 transition apple-press"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Documentation</span>
                    </Link>

                    {circle ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsInviteOpen(true);
                          setIsMoreMenuOpen(false);
                        }}
                        aria-label="Circle Details"
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] flex items-center justify-between transition apple-press"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Circle Invite</span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-400">{circle.joinCode}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          if (!user) openAuthModal("register");
                          else setIsOnboardingOpen(true);
                        }}
                        aria-label="Join Circle"
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] flex items-center gap-2 transition apple-press"
                      >
                        <Users className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Join Circle</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Profile or Login */}
              {user ? (
                <div className="flex items-center ml-0.5">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(true)}
                    className="w-8 h-8 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.06] flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition apple-press"
                    title={`Edit profile (@${user.username})`}
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 apple-press transition shadow-2xs cursor-pointer ml-0.5 sm:ml-1 shrink-0"
                  title="Sign In or Register"
                  aria-label="Log In"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Log In</span>
                </button>
              )}
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
