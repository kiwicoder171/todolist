"use client";

import React, { useState } from "react";
import { useHousehold } from "@/context/HouseholdContext";
import { DEFAULT_REWARDS, RewardItem } from "@/utils/gamification";
import { Plus, X, Sparkles, Check } from "lucide-react";

export interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistModal({ isOpen, onClose }: WishlistModalProps) {
  const { activePartner, scores, updateScore } = useHousehold();
  const currentScore = scores[activePartner];

  const [rewards, setRewards] = useState<RewardItem[]>(DEFAULT_REWARDS);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCost, setNewCost] = useState(10);
  const [redeemedNotice, setRedeemedNotice] = useState<string | null>(null);

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

    setRewards((prev) => [...prev, newReward]);
    setNewTitle("");
    setNewDesc("");
    setNewCost(10);
    setIsAddingCustom(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-modal-title"
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-black rounded-3xl w-full max-w-md p-6 shadow-[8px_8px_0_0_#000] space-y-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-black">
          <div>
            <h3
              id="wishlist-modal-title"
              className="font-heading font-black text-sm uppercase tracking-wide text-black flex items-center gap-1.5"
            >
              <span>Couple Wishlist Shop</span>
              <Sparkles className="w-3.5 h-3.5" />
            </h3>
            <p className="text-xs text-zinc-500 font-medium">
              {activePartner === "alex" ? "Alex's" : "Sam's"} Balance:{" "}
              <strong
                className={`font-heading font-extrabold ${
                  currentScore.points < 0 ? "text-red-600" : "text-black"
                }`}
              >
                {currentScore.points} PTS
              </strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-black flex items-center justify-center font-bold text-sm hover:bg-black hover:text-white transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {redeemedNotice && (
          <div className="p-2.5 rounded-xl border-2 border-black bg-zinc-100 text-xs font-heading font-bold text-black flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{redeemedNotice}</span>
          </div>
        )}

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {rewards.map((r) => (
            <div
              key={r.id}
              className="border-2 border-black rounded-2xl p-3 flex items-center justify-between bg-zinc-50 squircle-card hover:border-black transition"
            >
              <div className="pr-2 min-w-0">
                <h4 className="font-heading font-bold text-xs text-black truncate">
                  {r.title}
                </h4>
                <p className="text-[11px] text-zinc-500">{r.desc}</p>
              </div>
              <button
                onClick={() => handleRedeem(r)}
                className="bg-black text-white text-xs font-heading font-extrabold px-3.5 py-1.5 rounded-full hover:bg-zinc-800 transition shrink-0"
              >
                {r.cost} PTS
              </button>
            </div>
          ))}
        </div>

        {/* Custom Reward Creator */}
        {isAddingCustom ? (
          <form
            onSubmit={handleAddCustomReward}
            className="p-3 border-2 border-dashed border-black rounded-2xl space-y-2 bg-zinc-50"
          >
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs text-black uppercase">
                New Custom Reward
              </span>
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="text-xs text-zinc-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. Foot massage 🦶"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-black rounded-lg text-xs"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Description / details"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="flex-1 px-2.5 py-1.5 border border-black rounded-lg text-xs"
              />
              <input
                type="number"
                min="1"
                max="100"
                value={newCost}
                onChange={(e) => setNewCost(Number(e.target.value))}
                className="w-16 px-2 py-1.5 border border-black rounded-lg text-xs text-center font-bold"
                placeholder="PTS"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 bg-black text-white rounded-lg font-heading font-bold text-xs uppercase"
            >
              Add Reward
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCustom(true)}
            className="w-full py-2 border-2 border-dashed border-zinc-400 hover:border-black rounded-xl text-zinc-600 hover:text-black font-heading font-bold text-xs uppercase transition flex items-center justify-center gap-1.5 bg-white"
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
