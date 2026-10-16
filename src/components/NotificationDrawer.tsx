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
    sendCheer(currentUserName, cheerMsg.trim() || undefined);
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full border-l-2 sm:border-l-3 border-black shadow-[-6px_0_0_0_#000] flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b-2 border-black bg-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shadow-[2px_2px_0_0_#000]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-black text-base uppercase tracking-tight text-black flex items-center gap-2">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-mono font-bold">
                    {unreadCount} NEW
                  </span>
                )}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="w-8 h-8 rounded-full border-2 border-black bg-white hover:bg-zinc-100 flex items-center justify-center transition shadow-xs cursor-pointer"
            aria-label="Close notification drawer"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Action Subbar */}
        <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-xs font-heading font-bold">
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`flex items-center gap-1 transition cursor-pointer ${
              unreadCount > 0 ? "text-zinc-700 hover:text-black" : "text-zinc-400 cursor-not-allowed"
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>

          <button
            type="button"
            onClick={clearAll}
            disabled={notifications.length === 0}
            className={`flex items-center gap-1 transition cursor-pointer ${
              notifications.length > 0 ? "text-zinc-500 hover:text-red-600" : "text-zinc-300 cursor-not-allowed"
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
            <div className="p-3.5 rounded-2xl border-2 border-black bg-cyan-100 shadow-[3px_3px_0_0_#000] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="font-heading font-black text-xs uppercase block text-black">
                  Desktop &amp; Mobile Alerts
                </span>
                <p className="text-[11px] text-zinc-700 font-medium leading-tight">
                  Enable device push to get instant cheers &amp; task updates.
                </p>
              </div>
              <button
                type="button"
                onClick={requestBrowserPermission}
                className="px-3 py-1.5 rounded-xl border-2 border-black bg-black text-white hover:bg-zinc-800 font-heading font-extrabold text-[10px] uppercase shadow-[1.5px_1.5px_0_0_#000] shrink-0 cursor-pointer"
              >
                Enable
              </button>
            </div>
          )}

          {/* Quick Cheer Box */}
          <div className="p-3.5 rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0_0_#000]">
            <span className="font-heading font-extrabold text-xs uppercase block text-black mb-1.5 flex items-center gap-1.5">
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
                className="flex-1 px-3 py-1.5 text-xs font-medium border-2 border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-black bg-[#fafafa]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl border-2 border-black bg-rose-300 hover:bg-rose-400 text-black font-heading font-extrabold text-xs uppercase shadow-[1.5px_1.5px_0_0_#000] cursor-pointer flex items-center gap-1"
              >
                {cheerSent ? <Check className="w-3.5 h-3.5" /> : <span>Cheer</span>}
              </button>
            </form>
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 border-2 border-dashed border-zinc-400 mx-auto flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="font-heading font-extrabold text-sm uppercase text-black">
                All Caught Up!
              </p>
              <p className="text-xs text-zinc-500 font-medium max-w-xs mx-auto">
                No new notifications right now. Check back when tasks are completed or streaks update.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-3.5 rounded-2xl border-2 border-black transition cursor-pointer relative ${
                  notif.read
                    ? "bg-[#fafafa] shadow-[2px_2px_0_0_#000]"
                    : "bg-white shadow-[4px_4px_0_0_#000] ring-1 ring-black"
                }`}
              >
                {!notif.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-500 border border-black" />
                )}
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-xl border border-black bg-zinc-100 shrink-0 mt-0.5">
                    {getIconForType(notif.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 pr-3">
                      <h3 className="font-heading font-extrabold text-xs uppercase text-black truncate">
                        {notif.title}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-600 font-medium mt-0.5 leading-snug">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-zinc-400 font-mono font-bold mt-1.5 block">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t-2 border-black bg-zinc-50 text-center">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="w-full py-2.5 px-4 rounded-xl border-2 border-black bg-black text-white hover:bg-zinc-800 font-heading font-extrabold text-xs uppercase transition shadow-[2px_2px_0_0_#000] cursor-pointer"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
