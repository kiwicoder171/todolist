"use client";

import React, { useState } from "react";
import { useNotifications, NotificationType } from "@/context/NotificationContext";
import { useHousehold } from "@/context/HouseholdContext";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Heart,
  Flame,
  CheckSquare,
  Sparkles,
  Volume2,
} from "lucide-react";

export function NotificationDrawer() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    sendCheer,
    browserPermission,
    requestBrowserPermission,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useNotifications();

  const { partnerNames, activePartner, spaceMode } = useHousehold();
  const [cheerMsg, setCheerMsg] = useState("");
  const [cheerSent, setCheerSent] = useState(false);

  if (!isDrawerOpen) return null;

  const currentUserName = partnerNames[activePartner] || "You";

  const handleSendCheer = (e: React.FormEvent) => {
    e.preventDefault();
    const otherPartner = activePartner === "alex" ? "sam" : "alex";
    sendCheer(currentUserName, cheerMsg.trim() || undefined, otherPartner);
    setCheerMsg("");
    setCheerSent(true);
    setTimeout(() => setCheerSent(false), 2000);
  };

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case "cheer":
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case "streak_alert":
        return <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />;
      case "task_completed":
      case "routine_completed":
        return <CheckSquare className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-md animate-fade-in duration-200">
      <div className="w-full max-w-md bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-3xl h-full border-l border-black/[0.08] dark:border-white/[0.12] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-black/[0.05] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shadow-2xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-base uppercase tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-mono font-bold shadow-xs">
                    {unreadCount} NEW
                  </span>
                )}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="w-8 h-8 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] flex items-center justify-center transition apple-press cursor-pointer"
            aria-label="Close notification drawer"
          >
            <X className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>
        </div>

        {/* Action Subbar */}
        <div className="px-4 py-2.5 bg-black/[0.01] dark:bg-white/[0.02] border-b border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs font-semibold">
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`flex items-center gap-1 transition cursor-pointer apple-press ${
              unreadCount > 0 ? "text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white" : "text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>

          <button
            type="button"
            onClick={clearAll}
            disabled={notifications.length === 0}
            className={`flex items-center gap-1 transition cursor-pointer apple-press ${
              notifications.length > 0 ? "text-zinc-500 hover:text-red-600" : "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear all</span>
          </button>
        </div>

        {/* Scrollable Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Web Notification Banner */}
          {browserPermission !== "granted" && (
            <div className="p-3.5 rounded-2xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="font-semibold text-xs uppercase block text-blue-700 dark:text-blue-300">
                  Desktop &amp; Mobile Alerts
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium leading-tight">
                  Enable device push to get instant cheers &amp; task updates.
                </p>
              </div>
              <button
                type="button"
                onClick={requestBrowserPermission}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold text-[10px] uppercase shadow-xs shrink-0 cursor-pointer apple-press"
              >
                Enable
              </button>
            </div>
          )}

          {/* Quick Cheer Box */}
          <div className="p-3.5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03]">
            <span className="font-semibold text-xs uppercase block text-zinc-800 dark:text-zinc-200 mb-1.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>
                {spaceMode === "solo"
                  ? "Self-Motivation Cheer"
                  : spaceMode === "friends"
                  ? "Cheer Your Crew"
                  : spaceMode === "family"
                  ? "Cheer the Family"
                  : "Send Partner a Cheer"}
              </span>
            </span>
            <form onSubmit={handleSendCheer} className="flex gap-2">
              <input
                type="text"
                placeholder={
                  spaceMode === "solo"
                    ? "Add a positive note to self..."
                    : "Proud of you! Keep going ❤️"
                }
                value={cheerMsg}
                onChange={(e) => setCheerMsg(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs font-medium border border-black/[0.08] dark:border-white/[0.1] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-black/[0.02] dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs uppercase apple-press cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                {cheerSent ? <Check className="w-3.5 h-3.5" /> : <span>Cheer</span>}
              </button>
            </form>
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] mx-auto flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="font-semibold text-sm uppercase text-zinc-800 dark:text-zinc-200">
                All Caught Up!
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium max-w-xs mx-auto">
                No new notifications right now. Check back when tasks are completed or streaks update.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer relative ${
                  notif.read
                    ? "bg-black/[0.01] dark:bg-white/[0.02] border-black/[0.04] dark:border-white/[0.06]"
                    : "bg-white/80 dark:bg-zinc-800/80 border-black/[0.08] dark:border-white/[0.1] shadow-xs"
                }`}
              >
                {!notif.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                )}
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.05] shrink-0 mt-0.5">
                    {getIconForType(notif.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 pr-3">
                      <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                        {notif.title}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-0.5 leading-snug">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-zinc-400 font-mono mt-1.5 block">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-black/[0.05] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.03] text-center">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 font-semibold text-xs uppercase transition apple-press shadow-2xs cursor-pointer"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
