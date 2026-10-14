"use client";

import React from "react";
import { useHousehold } from "@/context/HouseholdContext";

export interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistModal({ isOpen, onClose }: WishlistModalProps) {
  const { activePartner, scores, updateScore } = useHousehold();
  const currentScore = scores[activePartner];

  if (!isOpen) return null;

  const rewards = [
    { title: "Cook Favorite Dinner 🍝", desc: "Partner cooks whatever meal you choose", cost: 10 },
    { title: "30 Min Back Massage 💆", desc: "Relaxing massage after a busy week", cost: 15 },
    { title: "Pick Movie & Snacks 🍿", desc: "Total veto power over Friday movie night", cost: 5 },
    { title: "Breakfast in Bed ☕🥐", desc: "Weekend morning coffee & pancakes", cost: 20 },
  ];

  const handleRedeem = (title: string, cost: number) => {
    updateScore(activePartner, -cost);
    alert(`🎉 Redeemed "${title}"!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black rounded-3xl w-full max-w-md p-6 shadow-[8px_8px_0_0_#000] space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-black">
          <div>
            <h3 className="font-heading font-black text-sm uppercase tracking-wide text-black">
              Couple Wishlist Shop
            </h3>
            <p className="text-xs text-zinc-500 font-medium">
              Balance:{" "}
              <strong className="font-heading font-extrabold text-black">
                {currentScore.points} PTS
              </strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-black flex items-center justify-center font-bold text-sm hover:bg-black hover:text-white transition"
          >
            &times;
          </button>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {rewards.map((r) => (
            <div
              key={r.title}
              className="border-2 border-black rounded-2xl p-3 flex items-center justify-between bg-zinc-50 squircle-card"
            >
              <div>
                <h4 className="font-heading font-bold text-xs text-black">{r.title}</h4>
                <p className="text-[11px] text-zinc-500">{r.desc}</p>
              </div>
              <button
                onClick={() => handleRedeem(r.title, r.cost)}
                className="bg-black text-white text-xs font-heading font-extrabold px-3.5 py-1.5 rounded-full hover:bg-zinc-800 transition"
              >
                {r.cost} PTS
              </button>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center text-[11px] text-zinc-400 font-medium">
          Points can drop into negative numbers! Earn +1 for 100% daily routines.
        </div>
      </div>
    </div>
  );
}
