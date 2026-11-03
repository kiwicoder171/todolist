"use client";

import React, { useState, useEffect } from "react";
import { useHousehold, SpaceMode } from "@/context/HouseholdContext";
import { useAuth } from "@/context/AuthContext";
import { Heart, Users, Copy, Check, ArrowRight, Sparkles, X, User, Home, AlertCircle } from "lucide-react";
import { Logo } from "./Logo";

interface CircleOnboardingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function CircleOnboardingModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
}: CircleOnboardingModalProps = {}) {
  const { isConfigured, createCircle, joinCircle, isOnboardingOpen, setIsOnboardingOpen } = useHousehold();
  const { user, loading, openAuthModal } = useAuth();
  const [mode, setMode] = useState<"create" | "join">("create");
  const [selectedSpaceMode, setSelectedSpaceMode] = useState<SpaceMode>("partner");

  // Create form state
  const [userName, setUserName] = useState(user?.username || "");
  const [circleName, setCircleName] = useState("");
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Join form state
  const [joinUserName, setJoinUserName] = useState(user?.username || "");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Sync username if user logs in
  useEffect(() => {
    if (user?.username) {
      setUserName(user.username);
      setJoinUserName(user.username);
    }
  }, [user?.username]);

  // Check URL parameters for ?join=CODE
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const codeFromUrl = params.get("join");
      if (codeFromUrl) {
        const cleanCode = codeFromUrl.toUpperCase();
        setJoinCode(cleanCode);
        setMode("join");
        if (!user && !loading) {
          sessionStorage.setItem("couple_hub_pending_join", cleanCode);
          openAuthModal("register");
        } else if (user) {
          setIsOnboardingOpen(true);
        }
      }
    }
  }, [user, loading, openAuthModal, setIsOnboardingOpen]);

  // If user just logged in and had a pending join code from invite link, open modal with it
  useEffect(() => {
    if (user && typeof window !== "undefined") {
      const pendingCode = sessionStorage.getItem("couple_hub_pending_join");
      if (pendingCode && !isConfigured) {
        setJoinCode(pendingCode);
        setMode("join");
        setIsOnboardingOpen(true);
        sessionStorage.removeItem("couple_hub_pending_join");
      }
    }
  }, [user, isConfigured, setIsOnboardingOpen]);

  // Show modal on first visit ONLY if user IS authenticated, has no circle, and not previously dismissed
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (loading) return; // wait for Firebase auth to finish checking
      if (!user) return; // CRITICAL: NEVER auto-open if user has not logged in or signed up yet!
      const dismissed = sessionStorage.getItem("couple_hub_onboarding_dismissed");
      if (!isConfigured && !dismissed) {
        setIsOnboardingOpen(true);
      }
    }
  }, [user, loading, isConfigured, setIsOnboardingOpen]);

  const isOpen = propIsOpen !== undefined ? propIsOpen : isOnboardingOpen;

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      setIsOnboardingOpen(false);
    }
    if (typeof window !== "undefined") {
      sessionStorage.setItem("couple_hub_onboarding_dismissed", "true");
    }
  };

  if (!isOpen) return null;

  // If opened while not logged in, prompt to log in or register first
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
        <div className="apple-card bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.1] rounded-3xl p-5 sm:p-7 w-[calc(100vw-28px)] max-w-sm sm:max-w-md shadow-2xl relative my-auto box-border text-center text-zinc-900 dark:text-zinc-100 animate-scale-in">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition cursor-pointer z-20 apple-press"
            aria-label="Close modal"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center p-2 mx-auto mb-4 shadow-xs">
            <Logo size={28} inverted={false} />
          </div>

          <h2 className="font-semibold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-zinc-100 mb-2 flex items-center justify-center gap-1.5">
            <span>Account Required</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal mb-6 leading-relaxed">
            Please log in or register first. Having an account ensures your couple circle and tasks stay in sync across all your phones and laptops.
          </p>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                handleClose();
                openAuthModal("register");
              }}
              className="w-full py-3 px-4 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer apple-press shadow-xs"
            >
              <span>Register with Gmail</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                handleClose();
                openAuthModal("login");
              }}
              className="w-full py-2.5 px-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer apple-press shadow-xs"
            >
              <span>Log In with Username</span>
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleClose}
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 apple-press transition cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError("Please enter your name");
      return;
    }
    setError(null);
    const code = createCircle(userName, circleName, selectedSpaceMode);
    setCreatedCode(code);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinUserName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!joinCode.trim()) {
      setError("Please enter your 6-character circle code");
      return;
    }
    setError(null);
    joinCircle(joinUserName, joinCode);
    handleClose();
  };

  const copyInvite = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inviteUrl =
    typeof window !== "undefined" && createdCode
      ? `${window.location.origin}?join=${createdCode}`
      : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="apple-card bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.1] rounded-3xl p-5 sm:p-7 w-[calc(100vw-28px)] max-w-sm sm:max-w-md shadow-2xl relative my-auto box-border text-zinc-900 dark:text-zinc-100 animate-scale-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition cursor-pointer z-20 apple-press"
          aria-label="Close modal"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center p-1.5 shrink-0 shadow-xs">
            <Logo size={24} inverted={false} />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 truncate">
              <span>Couple Task Hub</span>
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0" />
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-normal truncate">
              Collaborative OS for couples, solo, friends &amp; family
            </p>
          </div>
        </div>

        {createdCode ? (
          /* Step 2: Show created circle code & share options */
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-dashed border-black/[0.08] dark:border-white/[0.1] text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {selectedSpaceMode === "solo"
                    ? "Solo Space Ready!"
                    : selectedSpaceMode === "friends"
                    ? "Friends Hub Ready!"
                    : selectedSpaceMode === "family"
                    ? "Family Space Ready!"
                    : "Circle Ready!"}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                {selectedSpaceMode === "solo"
                  ? "Your personal productivity space is initialized. You can invite partners or friends anytime later:"
                  : "Share this invite code so others can join your space:"}
              </p>
              <div className="py-2.5 px-4 bg-white dark:bg-zinc-900 border border-black/[0.06] dark:border-white/[0.08] rounded-2xl font-mono font-bold text-2xl tracking-widest text-zinc-900 dark:text-zinc-100 select-all shadow-xs">
                {createdCode}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => copyInvite(createdCode)}
                className="w-full py-2.5 px-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 font-semibold text-xs apple-press transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied Code to Clipboard!" : "Copy Circle Code"}</span>
              </button>

              {inviteUrl && (
                <button
                  type="button"
                  onClick={() => copyInvite(inviteUrl)}
                  className="w-full py-2.5 px-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 font-semibold text-xs apple-press transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Users className="w-4 h-4" />
                  <span>Copy Direct Invite Link</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 px-4 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 font-semibold text-sm apple-press transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Enter Our Space</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Step 1: Mode tabs & form */
          <div>
            {/* Mode Tabs */}
            <div className="apple-segmented-track p-1 rounded-2xl mb-5 flex items-center gap-1 text-xs font-semibold w-full">
              <button
                type="button"
                onClick={() => {
                  setMode("create");
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-xl transition text-center cursor-pointer apple-press ${
                  mode === "create"
                    ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Create Circle
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("join");
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-xl transition text-center cursor-pointer apple-press ${
                  mode === "join"
                    ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Join Existing
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/[0.08] dark:bg-rose-500/[0.15] border border-rose-500/20 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2.5 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span className="leading-snug flex-1">{error}</span>
              </div>
            )}

            {mode === "create" ? (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-500 dark:text-zinc-400">
                    How will you use the hub?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSpaceMode("solo")}
                      className={`p-2.5 rounded-2xl border transition cursor-pointer apple-press flex flex-col items-center justify-center text-center ${
                        selectedSpaceMode === "solo"
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                          : "bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
                      }`}
                    >
                      <span className="text-xl mb-1">🧍</span>
                      <span className="font-semibold text-xs">Solo</span>
                      <span className="text-[10px] opacity-70 font-normal leading-tight mt-0.5">Just me</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSpaceMode("partner")}
                      className={`p-2.5 rounded-2xl border transition cursor-pointer apple-press flex flex-col items-center justify-center text-center ${
                        selectedSpaceMode === "partner"
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                          : "bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
                      }`}
                    >
                      <span className="text-xl mb-1">💕</span>
                      <span className="font-semibold text-xs">With Partner</span>
                      <span className="text-[10px] opacity-70 font-normal leading-tight mt-0.5">Shared Home OS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSpaceMode("friends")}
                      className={`p-2.5 rounded-2xl border transition cursor-pointer apple-press flex flex-col items-center justify-center text-center ${
                        selectedSpaceMode === "friends"
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                          : "bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
                      }`}
                    >
                      <span className="text-xl mb-1">🧑‍🤝‍🧑</span>
                      <span className="font-semibold text-xs">With Friends</span>
                      <span className="text-[10px] opacity-70 font-normal leading-tight mt-0.5">Trips &amp; chores</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSpaceMode("family")}
                      className={`p-2.5 rounded-2xl border transition cursor-pointer apple-press flex flex-col items-center justify-center text-center ${
                        selectedSpaceMode === "family"
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                          : "bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
                      }`}
                    >
                      <span className="text-xl mb-1">🏡</span>
                      <span className="font-semibold text-xs">With Family</span>
                      <span className="text-[10px] opacity-70 font-normal leading-tight mt-0.5">Chores &amp; kids</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-zinc-500 dark:text-zinc-400">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Taylor"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white bg-black/[0.02] dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-zinc-500 dark:text-zinc-400">
                    Space Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder={
                      selectedSpaceMode === "solo"
                        ? "e.g. My Personal Space"
                        : selectedSpaceMode === "friends"
                        ? "e.g. Flatmates & Trips"
                        : selectedSpaceMode === "family"
                        ? "e.g. Our Family Hub"
                        : "e.g. Our Cozy Space"
                    }
                    value={circleName}
                    onChange={(e) => setCircleName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white bg-black/[0.02] dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer apple-press shadow-xs"
                >
                  <span>
                    {selectedSpaceMode === "solo"
                      ? "Create Solo Space"
                      : selectedSpaceMode === "friends"
                      ? "Create Friends Hub"
                      : selectedSpaceMode === "family"
                      ? "Create Family Space"
                      : "Create Couple Space"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-zinc-500 dark:text-zinc-400">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan"
                    value={joinUserName}
                    onChange={(e) => setJoinUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white bg-black/[0.02] dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-zinc-500 dark:text-zinc-400">
                    Partner&apos;s 6-Letter Invite Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="e.g. CUP-892"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl text-sm font-mono font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white bg-black/[0.02] dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer apple-press shadow-xs"
                >
                  <span>Join Partner&apos;s Space</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-zinc-500 hover:text-black font-medium underline underline-offset-2 transition cursor-pointer"
              >
                Skip for now &amp; explore demo space
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
