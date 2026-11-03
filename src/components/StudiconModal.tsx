"use client";

import React from "react";
import { useHousehold } from "@/context/HouseholdContext";
import { X, Sparkles } from "lucide-react";

export interface StudiconOption {
  id: string;
  emoji: string;
  label: string;
}

export const STUDICON_OPTIONS: StudiconOption[] = [
  { id: "laptop", emoji: "💻", label: "Laptop Work" },
  { id: "scholar", emoji: "📚", label: "Reading & Study" },
  { id: "coffee", emoji: "☕", label: "Coffee & Break" },
  { id: "bonsai", emoji: "🌿", label: "Zen & Garden" },
  { id: "cat", emoji: "🐱", label: "Cozy Kitten" },
  { id: "artist", emoji: "🎨", label: "Creative Art" },
  { id: "runner", emoji: "🏃", label: "Fitness & Sport" },
  { id: "meditation", emoji: "🧘", label: "Mindfulness" },
  { id: "lofi", emoji: "🎧", label: "Lofi Beats" },
  { id: "night", emoji: "🌙", label: "Night Owl" },
  { id: "gamer", emoji: "🎮", label: "Play & Games" },
  { id: "sparkle", emoji: "✨", label: "Magic Focus" },
];

export interface StudiconModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StudiconModal({ isOpen, onClose }: StudiconModalProps) {
  const { activePartner, partnerAvatars, updatePartnerAvatar, partnerNames } = useHousehold();

  if (!isOpen) return null;

  const currentAvatar = partnerAvatars[activePartner] || "💻";
  const myName = partnerNames[activePartner] || (activePartner === "alex" ? "Alex" : "Sam");

  return (
    <div
      data-testid="studicon-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-3xl text-zinc-900 dark:text-zinc-100 border border-black/[0.08] dark:border-white/[0.12] rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.05] dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold text-sm uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
              Select Desk Studicon
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-xl border border-black/[0.06] dark:border-white/[0.08] text-zinc-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] flex items-center justify-center apple-press transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Choose a focus icon for <strong className="text-zinc-800 dark:text-zinc-200">{myName}</strong>. Your partner will see this avatar at your desk in real time.
        </p>

        {/* Grid of Avatars */}
        <div className="grid grid-cols-4 gap-2.5 pt-1">
          {STUDICON_OPTIONS.map((option) => {
            const isSelected = currentAvatar === option.emoji;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  updatePartnerAvatar(activePartner, option.emoji);
                  onClose();
                }}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition apple-press cursor-pointer ${
                  isSelected
                    ? "bg-emerald-500/15 dark:bg-emerald-500/25 border-2 border-emerald-500 shadow-xs"
                    : "bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.05] dark:hover:bg-white/[0.06]"
                }`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 truncate max-w-full font-medium">
                  {option.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
