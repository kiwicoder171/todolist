"use client";

import React, { useState } from "react";
import { useHousehold } from "@/context/HouseholdContext";
import { DEFAULT_REWARDS, RewardItem } from "@/utils/gamification";
import { Plus, X, Sparkles, Check, Trash2 } from "lucide-react";

export interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistModal({ isOpen, onClose }: WishlistModalProps) {
  const { activePartner, scores, updateScore, partnerNames } = useHousehold();
  const currentScore = scores[activePartner] || { points: 0, streak: 0 };

  const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";
  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    if (isTest && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("couple_task_hub_wishlist");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return DEFAULT_REWARDS;
  });

  React.useEffect(() => {
    if (isTest || typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("couple_task_hub_wishlist");
      if (stored) {
        setRewards(JSON.parse(stored));
      }
    } catch {}
  }, [isTest]);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCost, setNewCost] = useState(10);
  const [redeemedNotice, setRedeemedNotice] = useState<string | null>(null);

  const saveRewards = (newItems: RewardItem[]) => {
    setRewards(newItems);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("couple_task_hub_wishlist", JSON.stringify(newItems));
      } catch {}
    }
  };

  const handleDeleteReward = (id: string) => {
    const next = rewards.filter((r) => r.id !== id);
    saveRewards(next);
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRedeem = (item: RewardItem) => {
    updateScore(activePartner, -item.cost);
    setRedeemedNotice(`🎉 Redeemed "${item.title}" for ${item.cost} PTS!`);
    setTimeout(() => {
      setRedeemedNotice(null);
    }, 2800);
  };

  const handleAddCustomReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReward: RewardItem = {
      id: `reward-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: newTitle.trim(),
      desc: newDesc.trim() || "Custom couple reward",
      cost: Number(newCost) || 5,
    };

    saveRewards([...rewards, newReward]);
    setNewTitle("");
    setNewDesc("");
    setNewCost(10);
    setIsAddingCustom(false);
  };

  const currentPartnerName = activePartner === "alex" ? partnerNames.alex : partnerNames.sam;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-modal-title"
      className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.12] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05] dark:border-white/[0.06]">
          <div>
            <h3
              id="wishlist-modal-title"
              className="font-semibold text-sm uppercase tracking-wide text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5"
            >
              <span>Couple Wishlist Shop</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {currentPartnerName}&apos;s Balance:{" "}
              <strong
                className={`font-mono font-bold ${
                  currentScore.points < 0 ? "text-red-500" : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {currentScore.points} PTS
              </strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-xl border border-black/[0.06] dark:border-white/[0.08] text-zinc-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] flex items-center justify-center apple-press transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {redeemedNotice && (
          <div className="p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-bounce backdrop-blur-xs">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{redeemedNotice}</span>
          </div>
        )}

        {/* Scroll list with top headroom so hover elevation (translateY(-2px)) never clips under border */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pt-1 pb-1.5 px-1 -mx-1">
          {rewards.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-400 font-medium">
              <p>No rewards yet in your wishlist.</p>
              <button
                type="button"
                onClick={() => saveRewards(DEFAULT_REWARDS)}
                className="mt-2 text-[11px] font-semibold underline text-zinc-900 dark:text-zinc-100 hover:opacity-70 cursor-pointer"
              >
                Restore default rewards
              </button>
            </div>
          ) : (
            rewards.map((r) => (
              <div
                key={r.id}
                className="border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-3 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition gap-2"
              >
                <div className="pr-1 min-w-0 flex-1">
                  <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                    {r.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{r.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRedeem(r)}
                    className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold px-3.5 py-1.5 rounded-full hover:opacity-90 apple-press transition shrink-0 cursor-pointer shadow-2xs"
                  >
                    {r.cost} PTS
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteReward(r.id)}
                    aria-label={`Delete ${r.title}`}
                    title="Delete reward"
                    className="w-7 h-7 rounded-full border border-black/[0.06] dark:border-white/[0.08] hover:border-red-500 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 flex items-center justify-center apple-press transition cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Custom Reward Creator */}
        {isAddingCustom ? (
          <form
            onSubmit={handleAddCustomReward}
            className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 bg-zinc-50 dark:bg-zinc-900/60"
          >
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase">
                New Custom Reward
              </span>
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 font-bold"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              id="wishlist-new-title"
              name="wishlistTitle"
              required
              placeholder="e.g. Foot massage 🦶"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                type="text"
                id="wishlist-new-desc"
                name="wishlistDesc"
                placeholder="Description / details"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="flex-1 px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
              <input
                type="number"
                id="wishlist-new-cost"
                name="wishlistCost"
                min="1"
                max="100"
                value={newCost}
                onChange={(e) => setNewCost(Number(e.target.value))}
                className="w-16 px-2 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-xs text-center font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none"
                placeholder="PTS"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-heading font-bold text-xs uppercase hover:opacity-90 transition shadow-xs"
            >
              Add Reward
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCustom(true)}
            className="w-full py-2 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-heading font-bold text-xs uppercase transition flex items-center justify-center gap-1.5 bg-zinc-50 dark:bg-zinc-900"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Couple Reward</span>
          </button>
        )}

        <div className="pt-2 text-center text-[11px] text-zinc-400 font-medium">
          Points can drop into negative numbers! Earn +1 for 100% daily routines.
        </div>
      </div>
    </div>
  );
}
