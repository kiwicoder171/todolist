"use client";

import React, { useState } from "react";
import { useHousehold } from "@/context/HouseholdContext";
import { Users, Copy, Check, X, LogOut } from "lucide-react";

export interface CircleInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CircleInviteModal({ isOpen, onClose }: CircleInviteModalProps) {
  const { circle, partnerNames, leaveCircle } = useHousehold();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-[6px_6px_0_0_#000] relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base uppercase tracking-wide text-black">
              {circle?.name || "Our Circle"}
            </h3>
            <p className="text-xs text-zinc-500 font-medium">
              Partners: {partnerNames.alex} &amp; {partnerNames.sam}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-dashed border-black text-center space-y-2 mb-4">
          <p className="text-xs text-zinc-600 font-medium">Invite Code for Partner:</p>
          <div className="py-2 px-3 bg-white border-2 border-black rounded-xl font-heading font-black text-xl tracking-widest text-black select-all">
            {joinCode}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <button
            type="button"
            onClick={() => copyText(joinCode)}
            className="w-full py-2.5 px-4 rounded-xl border-2 border-black bg-zinc-100 hover:bg-zinc-200 font-heading font-bold text-xs uppercase transition flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied Code!" : "Copy Code"}</span>
          </button>

          <button
            type="button"
            onClick={() => copyText(inviteUrl)}
            className="w-full py-2.5 px-4 rounded-xl border-2 border-black bg-black text-white hover:bg-zinc-800 font-heading font-bold text-xs uppercase transition flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Copy Direct Invite Link</span>
          </button>
        </div>

        <div className="border-t border-zinc-200 pt-3 flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to leave or reset this circle?")) {
                leaveCircle();
                onClose();
              }
            }}
            className="text-red-500 hover:text-red-700 font-heading font-bold flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave Circle</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 font-heading font-bold text-zinc-600 hover:text-black"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
