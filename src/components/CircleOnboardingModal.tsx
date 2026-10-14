"use client";

import React, { useState, useEffect } from "react";
import { useHousehold } from "@/context/HouseholdContext";
import { Heart, Users, Copy, Check, ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "./Logo";

export function CircleOnboardingModal() {
  const { isConfigured, createCircle, joinCircle } = useHousehold();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "join">("create");

  // Create form state
  const [userName, setUserName] = useState("");
  const [circleName, setCircleName] = useState("");
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Join form state
  const [joinUserName, setJoinUserName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Check URL parameters for ?join=CODE
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const codeFromUrl = params.get("join");
      if (codeFromUrl) {
        setJoinCode(codeFromUrl.toUpperCase());
        setMode("join");
      }
    }
  }, []);

  // Show modal if not configured
  useEffect(() => {
    if (!isConfigured) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isConfigured]);

  if (!isOpen) return null;

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
    setIsOpen(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[6px_6px_0_0_#000] relative">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000] p-1.5">
            <Logo size={28} inverted />
          </div>
          <div>
            <h2 className="font-heading font-black text-lg uppercase tracking-wide text-black flex items-center gap-1.5">
              <span>Couple Task Hub</span>
              <Heart className="w-4 h-4 fill-black text-black" />
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              A shared, hand-drawn space for you &amp; your partner
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
              onClick={() => setIsOpen(false)}
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
          </div>
        )}
      </div>
    </div>
  );
}
