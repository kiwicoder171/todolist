"use client";

import React, { useState } from "react";
import { useHousehold } from "@/context/HouseholdContext";
import { Users, Copy, Check, X, LogOut } from "lucide-react";

export interface CircleInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CircleInviteModal({ isOpen, onClose }: CircleInviteModalProps) {
  const { circle, partnerNames, leaveCircle, spaceMode, setSpaceMode } = useHousehold();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const joinCode = circle?.joinCode || "CUP-NEW";
  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}?join=${joinCode}`
      : "";

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="apple-card bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.1] rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative text-zinc-900 dark:text-zinc-100 animate-scale-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition cursor-pointer apple-press"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shadow-xs">
            <Users className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-base tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
              {circle?.name || "Our Space"}
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-normal truncate">
              {spaceMode === "solo"
                ? `Solo Space • ${partnerNames.alex}`
                : spaceMode === "friends"
                ? `Friends Hub • ${partnerNames.alex} & ${partnerNames.sam}`
                : spaceMode === "family"
                ? `Family Space • ${partnerNames.alex} & ${partnerNames.sam}`
                : `Partners: ${partnerNames.alex} & ${partnerNames.sam}`}
            </p>
          </div>
        </div>

        {/* Space Mode Switcher */}
        <div className="mb-4 p-1.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1 px-1">
            Space Mode
          </span>
          <div className="apple-segmented-track p-0.5 rounded-xl grid grid-cols-4 gap-1 w-full text-xs">
            <button
              type="button"
              onClick={() => setSpaceMode("solo")}
              className={`py-1 px-1 rounded-lg text-[10px] font-medium transition cursor-pointer apple-press ${
                spaceMode === "solo"
                  ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs font-semibold"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              🧍 Solo
            </button>
            <button
              type="button"
              onClick={() => setSpaceMode("partner")}
              className={`py-1 px-1 rounded-lg text-[10px] font-medium transition cursor-pointer apple-press ${
                spaceMode === "partner"
                  ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs font-semibold"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              💕 Partner
            </button>
            <button
              type="button"
              onClick={() => setSpaceMode("friends")}
              className={`py-1 px-1 rounded-lg text-[10px] font-medium transition cursor-pointer apple-press ${
                spaceMode === "friends"
                  ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs font-semibold"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              🧑‍🤝‍🧑 Friends
            </button>
            <button
              type="button"
              onClick={() => setSpaceMode("family")}
              className={`py-1 px-1 rounded-lg text-[10px] font-medium transition cursor-pointer apple-press ${
                spaceMode === "family"
                  ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs font-semibold"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              🏡 Family
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-dashed border-black/[0.08] dark:border-white/[0.1] text-center space-y-2 mb-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {spaceMode === "solo"
              ? "Share code to invite collaborators:"
              : "Invite Code for Members:"}
          </p>
          <div className="py-2.5 px-3 bg-white dark:bg-zinc-900 border border-black/[0.06] dark:border-white/[0.08] rounded-2xl font-mono font-bold text-xl tracking-widest text-zinc-900 dark:text-zinc-100 select-all shadow-xs">
            {joinCode}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <button
            type="button"
            onClick={() => copyText(joinCode)}
            className="w-full py-2.5 px-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 font-semibold text-xs apple-press transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied Code!" : "Copy Code"}</span>
          </button>

          <button
            type="button"
            onClick={() => copyText(inviteUrl)}
            className="w-full py-2.5 px-4 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 font-semibold text-xs apple-press transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Users className="w-4 h-4" />
            <span>Copy Direct Invite Link</span>
          </button>
        </div>

        <div className="border-t border-black/[0.06] dark:border-white/[0.08] pt-3.5 flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to leave or reset this circle?")) {
                leaveCircle();
                onClose();
              }
            }}
            className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold flex items-center gap-1.5 apple-press transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave Space</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] font-semibold text-zinc-700 dark:text-zinc-300 apple-press transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
