"use client";

import React, { useState, useEffect } from "react";
import { X, User as UserIcon, Check, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useHousehold, Partner } from "@/context/HouseholdContext";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateUsername } = useAuth();
  const { partnerNames, updatePartnerName, activePartner, circle } = useHousehold();

  const [usernameInput, setUsernameInput] = useState(user?.username || "");
  const [partnerNameInput, setPartnerNameInput] = useState(
    partnerNames[activePartner] || ""
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUsernameInput(user?.username || "");
      setPartnerNameInput(partnerNames[activePartner] || "");
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, user?.username, partnerNames, activePartner]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const cleanUsername = usernameInput.trim().toLowerCase();
      const cleanPartnerName = partnerNameInput.trim();

      if (!cleanPartnerName) {
        throw new Error("Display name cannot be empty.");
      }

      // Update username if changed and authenticated
      if (user && cleanUsername !== user.username.toLowerCase()) {
        await updateUsername(cleanUsername);
      }

      // Update partner display name in circle
      updatePartnerName(activePartner, cleanPartnerName);

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setError(err?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-2 border-black rounded-3xl p-5 sm:p-7 w-[calc(100vw-28px)] max-w-sm sm:max-w-md shadow-[4px_4px_0_0_#000] sm:shadow-[6px_6px_0_0_#000] relative box-border">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-black flex items-center justify-center bg-white hover:bg-zinc-100 transition cursor-pointer z-20 shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000] shrink-0">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-heading font-extrabold uppercase tracking-tight text-black flex items-center gap-1.5">
              <span>Edit Profile</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-500 font-medium">
              Update your username &amp; how you appear in your circle
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-2.5 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-emerald-700 text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          {/* Username Field */}
          {user && (
            <div>
              <label className="block text-xs font-heading font-extrabold text-black uppercase mb-1">
                Account Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-400 font-bold text-sm">@</span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  placeholder="e.g. guyver"
                  maxLength={18}
                  className="w-full pl-7 pr-3 py-2 border-2 border-black rounded-xl font-heading text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">
                Used to log in and identify your account. Must be unique.
              </p>
            </div>
          )}

          {/* Circle Display Name Field */}
          <div>
            <label className="block text-xs font-heading font-extrabold text-black uppercase mb-1">
              Circle Display Name
            </label>
            <input
              type="text"
              value={partnerNameInput}
              onChange={(e) => setPartnerNameInput(e.target.value)}
              placeholder="e.g. Guyver or Honey"
              maxLength={20}
              className="w-full px-3 py-2 border-2 border-black rounded-xl font-heading text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-[10px] text-zinc-400 mt-1">
              The name shown to your partner on task cards, routines, and filters.
            </p>
          </div>

          {circle && (
            <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-[11px] text-zinc-600 space-y-0.5">
              <p className="font-heading font-bold text-zinc-800">
                Active Circle: <span className="text-black font-extrabold">{circle.name || "Our Shared Space"}</span>
              </p>
              <p className="text-[10px] text-zinc-500">
                Code: <span className="font-mono font-bold text-black">{circle.joinCode}</span>
              </p>
            </div>
          )}

          <div className="pt-1 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 sm:py-2.5 border-2 border-zinc-300 hover:border-black rounded-xl font-heading font-bold text-xs uppercase transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 sm:py-2.5 bg-black hover:bg-zinc-800 text-white border-2 border-black rounded-xl font-heading font-bold text-xs uppercase shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
