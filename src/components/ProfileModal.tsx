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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md animate-fade-in duration-200">
      <div className="bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.12] rounded-3xl p-5 sm:p-7 w-[calc(100vw-28px)] max-w-sm sm:max-w-md shadow-2xl relative box-border animate-scale-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] apple-press transition cursor-pointer z-20"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center border border-black/[0.08] dark:border-white/[0.12] shadow-2xs shrink-0">
            <UserIcon className="w-5 h-5 text-current" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>Edit Profile</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Update your username &amp; how you appear in your circle
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/[0.08] dark:bg-rose-500/[0.15] border border-rose-500/20 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2.5 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span className="leading-snug flex-1">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/[0.08] dark:bg-emerald-500/[0.15] border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2.5 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
            <Check className="w-4 h-4 shrink-0 text-emerald-500" />
            <span className="leading-snug flex-1">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          {user && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Account Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-zinc-400 font-bold text-sm">@</span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  placeholder="e.g. guyver"
                  maxLength={18}
                  className="w-full pl-8 pr-3.5 py-2.5 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
                Used to log in and identify your account. Must be unique.
              </p>
            </div>
          )}

          {/* Circle Display Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Circle Display Name
            </label>
            <input
              type="text"
              value={partnerNameInput}
              onChange={(e) => setPartnerNameInput(e.target.value)}
              placeholder="e.g. Guyver or Honey"
              maxLength={20}
              className="w-full px-3.5 py-2.5 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
              The name shown to your partner on task cards, routines, and filters.
            </p>
          </div>

          {circle && (
            <div className="p-3 bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl text-[11px] text-zinc-600 dark:text-zinc-400 space-y-0.5">
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                Active Circle: <span className="text-zinc-900 dark:text-white font-bold">{circle.name || "Our Shared Space"}</span>
              </p>
              <p className="text-[10px] text-zinc-500">
                Code: <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{circle.joinCode}</span>
              </p>
            </div>
          )}

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl font-semibold text-xs uppercase text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] apple-press transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-semibold text-xs uppercase apple-press hover:opacity-90 transition cursor-pointer shadow-2xs disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
