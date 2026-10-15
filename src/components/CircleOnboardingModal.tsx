"use client";

import React, { useState, useEffect } from "react";
import { useHousehold } from "@/context/HouseholdContext";
import { useAuth } from "@/context/AuthContext";
import { Heart, Users, Copy, Check, ArrowRight, Sparkles, X } from "lucide-react";
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
        <div className="bg-white border-2 border-black rounded-3xl p-5 sm:p-7 w-[calc(100vw-28px)] max-w-sm sm:max-w-md shadow-[4px_4px_0_0_#000] sm:shadow-[6px_6px_0_0_#000] relative my-auto box-border text-center">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-black flex items-center justify-center bg-white hover:bg-zinc-100 transition cursor-pointer z-20 shadow-xs"
            aria-label="Close modal"
          >
            <X className="w-3.5 h-3.5 text-black" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000] p-2 mx-auto mb-4">
            <Logo size={28} inverted />
          </div>

          <h2 className="font-heading font-black text-base sm:text-lg uppercase tracking-wide text-black mb-2 flex items-center justify-center gap-1.5">
            <span>Account Required</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </h2>
          <p className="text-xs text-zinc-600 font-medium mb-6 leading-relaxed">
            Please log in or register first. Having an account ensures your couple circle and tasks stay in sync across all your phones and laptops.
          </p>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                handleClose();
                openAuthModal("register");
              }}
              className="w-full py-3 px-4 rounded-xl border-2 border-black bg-black text-white hover:bg-zinc-800 font-heading font-extrabold text-xs sm:text-sm uppercase transition shadow-[3px_3px_0_0_#000] flex items-center justify-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
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
              className="w-full py-2.5 px-4 rounded-xl border-2 border-black bg-zinc-100 hover:bg-zinc-200 font-heading font-bold text-xs uppercase transition flex items-center justify-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>Log In with Username</span>
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-zinc-500 hover:text-black font-medium underline underline-offset-2 transition cursor-pointer"
            >
              Back to dashboard
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
    const code = createCircle(userName, circleName);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border-2 border-black rounded-3xl p-5 sm:p-7 w-[calc(100vw-28px)] max-w-sm sm:max-w-md shadow-[4px_4px_0_0_#000] sm:shadow-[6px_6px_0_0_#000] relative my-auto box-border">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-black flex items-center justify-center bg-white hover:bg-zinc-100 transition cursor-pointer z-20 shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-3.5 h-3.5 text-black" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000] p-1.5 shrink-0">
            <Logo size={24} inverted />
          </div>
          <div className="min-w-0">
            <h2 className="font-heading font-black text-base sm:text-lg uppercase tracking-wide text-black flex items-center gap-1.5 truncate">
              <span>Couple Task Hub</span>
              <Heart className="w-3.5 h-3.5 fill-black text-black shrink-0" />
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-500 font-medium truncate">
              A shared space for you &amp; your partner
            </p>
          </div>
        </div>

        {createdCode ? (
          /* Step 2: Show created circle code & share options */
          <div className="space-y-5 animate-in zoom-in-95 duration-200">
            <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-dashed border-black text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[11px] font-heading font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Circle Ready!</span>
              </div>
              <p className="text-xs text-zinc-600 font-medium">
                Share this invite code with your partner so they can join your space:
              </p>
              <div className="py-2.5 px-4 bg-white border-2 border-black rounded-xl font-heading font-black text-2xl tracking-widest text-black select-all">
                {createdCode}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => copyInvite(createdCode)}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-black bg-zinc-100 hover:bg-zinc-200 font-heading font-bold text-xs uppercase transition flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied Code to Clipboard!" : "Copy Circle Code"}</span>
              </button>

              {inviteUrl && (
                <button
                  type="button"
                  onClick={() => copyInvite(inviteUrl)}
                  className="w-full py-2.5 px-4 rounded-xl border-2 border-black bg-zinc-100 hover:bg-zinc-200 font-heading font-bold text-xs uppercase transition flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Copy Direct Invite Link</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 px-4 rounded-xl border-2 border-black bg-black text-white hover:bg-zinc-800 font-heading font-extrabold text-sm uppercase transition shadow-[2px_2px_0_0_#000] flex items-center justify-center gap-2"
            >
              <span>Enter Our Space</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Step 1: Mode tabs & form */
          <div>
            {/* Mode Tabs */}
            <div className="flex items-center gap-2 p-1 bg-zinc-100 border-2 border-black rounded-2xl mb-5 text-xs font-heading font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode("create");
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-xl transition text-center ${
                  mode === "create"
                    ? "bg-black text-white shadow-xs"
                    : "text-zinc-600 hover:text-black"
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
                className={`flex-1 py-2 rounded-xl transition text-center ${
                  mode === "join"
                    ? "bg-black text-white shadow-xs"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                Join Existing
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 border-2 border-red-500 rounded-xl text-red-600 font-heading font-bold text-xs">
                {error}
              </div>
            )}

            {mode === "create" ? (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase mb-1.5 text-zinc-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Taylor"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase mb-1.5 text-zinc-700">
                    Circle / Household Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Our Cozy Space"
                    value={circleName}
                    onChange={(e) => setCircleName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 rounded-xl border-2 border-black bg-black text-white hover:bg-zinc-800 font-heading font-extrabold text-sm uppercase transition shadow-[3px_3px_0_0_#000] flex items-center justify-center gap-2"
                >
                  <span>Create Our Space</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase mb-1.5 text-zinc-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan"
                    value={joinUserName}
                    onChange={(e) => setJoinUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase mb-1.5 text-zinc-700">
                    Partner&apos;s 6-Letter Invite Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="e.g. CUP-892"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 border-2 border-black rounded-xl text-sm font-heading font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 rounded-xl border-2 border-black bg-black text-white hover:bg-zinc-800 font-heading font-extrabold text-sm uppercase transition shadow-[3px_3px_0_0_#000] flex items-center justify-center gap-2"
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
