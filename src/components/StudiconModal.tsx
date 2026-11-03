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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <h3 className="font-heading font-extrabold text-sm uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
              Select Desk Studicon
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white p-1 rounded-lg transition"
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
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition ${
                  isSelected
                    ? "bg-emerald-50 dark:bg-zinc-800 border-2 border-emerald-500 scale-105 shadow-xs"
                    : "bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-[9px] text-zinc-600 dark:text-zinc-400 truncate max-w-full font-medium">
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
