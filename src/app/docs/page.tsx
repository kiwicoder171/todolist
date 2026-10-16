"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Calendar,
  Flame,
  Users,
  Layout,
  Smartphone,
  ShieldCheck,
  Tag,
  Gift,
  LogIn,
  ExternalLink,
  ChevronRight,
  Clock,
  Heart,
  Check,
} from "lucide-react";
import { Logo } from "@/components/Logo";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"guide" | "changelog">("guide");

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#18181b] flex flex-col font-sans selection:bg-black selection:text-white">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white border-b-2 border-black px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-[0_2px_0_0_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000] p-1.5 transition-transform hover:scale-105 shrink-0"
            title="Return to App"
          >
            <Logo size={24} inverted />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-base tracking-tight text-black uppercase">
                Couple Task Hub
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-black bg-amber-300 text-black">
                Docs &amp; Guide
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium">User Manual &amp; Version History</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Guide / Changelog Switcher */}
          <div className="flex items-center bg-[#f4f4f5] p-1 rounded-2xl border border-zinc-200 text-xs font-heading font-bold">
            <button
              onClick={() => setActiveTab("guide")}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === "guide"
                  ? "bg-black text-white shadow-sm"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              Feature Guide
            </button>
            <button
              onClick={() => setActiveTab("changelog")}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "changelog"
                  ? "bg-black text-white shadow-sm"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              <span>Changelog</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </button>
          </div>

          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-full border-2 border-black bg-white hover:bg-black hover:text-white transition text-xs font-heading font-extrabold flex items-center gap-1.5 shadow-[2px_2px_0_0_#000] cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Task Hub</span>
            <span className="sm:hidden">App</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {activeTab === "guide" ? (
          /* ============================================================
             FEATURE GUIDE
             ============================================================ */
          <div className="space-y-12 animate-in fade-in duration-200">
            {/* Hero Banner */}
            <div className="p-6 sm:p-8 rounded-3xl border-3 border-black bg-white shadow-[6px_6px_0_0_#000] relative overflow-hidden">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-black bg-amber-100 text-black text-xs font-heading font-bold mb-3 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  <span>The Collaborative Operating System for Couples</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-black uppercase mb-3">
                  Welcome to Couple Task Hub
                </h1>
                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-medium mb-5">
                  Couple Task Hub is designed from the ground up for two partners sharing a life. It replaces disjointed note apps and scattered to-do lists with a single neo-brutalist dashboard featuring 3 unified boards, real-time cloud sync, and playful gamification.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-heading font-extrabold">
                  <a
                    href="#pairing"
                    className="px-3 py-1.5 rounded-xl border-2 border-black bg-zinc-100 hover:bg-black hover:text-white transition shadow-[2px_2px_0_0_#000]"
                  >
                    1. Pairing Space
                  </a>
                  <a
                    href="#board1"
                    className="px-3 py-1.5 rounded-xl border-2 border-black bg-zinc-100 hover:bg-black hover:text-white transition shadow-[2px_2px_0_0_#000]"
                  >
                    2. Daily Routines
                  </a>
                  <a
                    href="#board2"
                    className="px-3 py-1.5 rounded-xl border-2 border-black bg-zinc-100 hover:bg-black hover:text-white transition shadow-[2px_2px_0_0_#000]"
                  >
                    3. Daily Tasks
                  </a>
                  <a
                    href="#board3"
                    className="px-3 py-1.5 rounded-xl border-2 border-black bg-zinc-100 hover:bg-black hover:text-white transition shadow-[2px_2px_0_0_#000]"
                  >
                    4. 3-Col Kanban
                  </a>
                  <a
                    href="#gamification"
                    className="px-3 py-1.5 rounded-xl border-2 border-black bg-zinc-100 hover:bg-black hover:text-white transition shadow-[2px_2px_0_0_#000]"
                  >
                    5. Points &amp; Wishlist
                  </a>
                  <a
                    href="#accounts"
                    className="px-3 py-1.5 rounded-xl border-2 border-black bg-amber-300 hover:bg-amber-400 transition shadow-[2px_2px_0_0_#000]"
                  >
                    6. Multi-Device Accounts
                  </a>
                </div>
              </div>
            </div>

            {/* Desktop Dashboard Preview Screenshot */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-sm uppercase text-zinc-500 tracking-wider">
                  Live Interface Preview
                </h3>
                <span className="text-xs text-zinc-400 font-medium">3-Column Unified Architecture</span>
              </div>
              <div className="rounded-3xl border-3 border-black overflow-hidden shadow-[6px_6px_0_0_#000] bg-white">
                <img
                  src="/docs/desktop-dashboard.png"
                  alt="Couple Task Hub Desktop Dashboard with Daily Routines, Daily Tasks, and Kanban"
                  className="w-full h-auto block"
                />
              </div>
            </div>

            {/* Section 1: Pairing & Setup */}
            <section id="pairing" className="p-6 sm:p-8 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 border-2 border-black flex items-center justify-center font-heading font-black text-sm shadow-[1.5px_1.5px_0_0_#000]">
                  01
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-extrabold uppercase tracking-tight text-black flex items-center gap-2">
                  <span>Circle Pairing &amp; Partner Linking</span>
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                In Couple Task Hub, you and your partner share a private collaborative space called a <strong>Circle</strong>. No complex setup or invitations required:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl border-2 border-black bg-[#fafafa] shadow-[2px_2px_0_0_#000]">
                  <h3 className="font-heading font-extrabold text-xs uppercase mb-1.5 flex items-center gap-1.5 text-black">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Option A: Create a New Space</span>
                  </h3>
                  <p className="text-xs text-zinc-600 font-medium">
                    Enter your name and pick a title for your home. You receive a unique 6-character code (e.g. <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono font-bold">CUP-XXXX</code>) and a 1-click shareable URL to text to your partner.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border-2 border-black bg-[#fafafa] shadow-[2px_2px_0_0_#000]">
                  <h3 className="font-heading font-extrabold text-xs uppercase mb-1.5 flex items-center gap-1.5 text-black">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Option B: Join Partner&apos;s Circle</span>
                  </h3>
                  <p className="text-xs text-zinc-600 font-medium">
                    If your partner already created the space, paste their <code className="bg-zinc-200 px-1 py-0.5 rounded font-mono font-bold">CUP-XXXX</code> code or open their invite link. You are instantly synced into the exact same dashboard.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Board 1 - Daily Routines & Streak Freeze */}
            <section id="board1" className="p-6 sm:p-8 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 border-2 border-black flex items-center justify-center font-heading font-black text-sm shadow-[1.5px_1.5px_0_0_#000]">
                  02
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-extrabold uppercase tracking-tight text-black flex items-center gap-2">
                  <span>Board 1: Daily Routines &amp; Habits</span>
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                Inspired by Apple Notes paper lists, this board tracks non-negotiable daily recurring rituals (e.g., watering plants, morning vitamins, 10k steps, or bedtime reading).
              </p>
              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-2xl border border-zinc-200 bg-[#fafafa] text-xs space-y-1.5">
                  <span className="font-heading font-extrabold text-black uppercase">Custom Cadence</span>
                  <p className="text-zinc-600 font-medium">
                    Configure habits to occur <strong>Daily</strong>, on <strong>Weekdays only</strong>, on <strong>Weekends only</strong>, or select custom days of the week (e.g. Mon/Wed/Fri gym sessions).
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl border border-zinc-200 bg-[#fafafa] text-xs space-y-1.5">
                  <span className="font-heading font-extrabold text-black uppercase flex items-center gap-1.5">
                    <span>Emergency Freeze Days</span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800 text-[10px] font-bold">Cold Weather / Sick</span>
                  </span>
                  <p className="text-zinc-600 font-medium">
                    Life happens. Toggle the <strong>Freeze Day</strong> button in the calendar bar when sick or traveling. Habits on freeze days are protected so your streak counter never breaks unfairly.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Board 2 - Daily Tasks & Auto-Rollover */}
            <section id="board2" className="p-6 sm:p-8 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border-2 border-black flex items-center justify-center font-heading font-black text-sm shadow-[1.5px_1.5px_0_0_#000]">
                  03
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-extrabold uppercase tracking-tight text-black">
                  Board 2: Daily Execution &amp; Auto-Rollover
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                Day-specific to-dos (e.g. groceries, plumber calls, dry cleaning pick-up) tied to the active calendar date.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl border-2 border-black bg-white shadow-[2px_2px_0_0_#000]">
                  <span className="font-heading font-extrabold text-xs uppercase block mb-1 text-black">
                    Auto-Rollover Engine
                  </span>
                  <p className="text-xs text-zinc-600 font-medium">
                    Unfinished tasks from yesterday or past dates are never lost. When viewing today, unfinished past tasks automatically roll over with an amber &ldquo;Rollover&rdquo; badge so you can tackle them today.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border-2 border-black bg-white shadow-[2px_2px_0_0_#000]">
                  <span className="font-heading font-extrabold text-xs uppercase block mb-1 text-black">
                    Assignee Filtering
                  </span>
                  <p className="text-xs text-zinc-600 font-medium">
                    Tag tasks as <strong>Mine</strong>, <strong>Partner</strong>, or <strong>Both</strong>. Use the top filter pill to isolate your tasks, view what your partner has claimed, or review everything at a glance.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Board 3 - 3-Column Kanban */}
            <section id="board3" className="p-6 sm:p-8 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 border-2 border-black flex items-center justify-center font-heading font-black text-sm shadow-[1.5px_1.5px_0_0_#000]">
                  04
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-extrabold uppercase tracking-tight text-black flex items-center gap-2">
                  <span>Board 3: 3-Column Vertical Kanban</span>
                  <Layout className="w-4 h-4 text-blue-600" />
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                For larger household projects that take multiple days or weeks (e.g., &ldquo;Plan anniversary trip&rdquo;, &ldquo;Reorganize garage&rdquo;, &ldquo;Tax filings&rdquo;):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3.5 rounded-2xl border-2 border-black bg-zinc-50 shadow-[2px_2px_0_0_#000]">
                  <span className="font-heading font-extrabold uppercase text-black block mb-1">
                    To Do
                  </span>
                  <p className="text-zinc-600 font-medium">Backlog of ideas and tasks queued for upcoming execution.</p>
                </div>
                <div className="p-3.5 rounded-2xl border-2 border-black bg-amber-50 shadow-[2px_2px_0_0_#000]">
                  <span className="font-heading font-extrabold uppercase text-black block mb-1">
                    In Progress
                  </span>
                  <p className="text-zinc-600 font-medium">Active projects currently being worked on by either partner.</p>
                </div>
                <div className="p-3.5 rounded-2xl border-2 border-black bg-emerald-50 shadow-[2px_2px_0_0_#000]">
                  <span className="font-heading font-extrabold uppercase text-black block mb-1">
                    Completed
                  </span>
                  <p className="text-zinc-600 font-medium">Finished milestones with celebration badges and reward points awarded.</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-zinc-200 bg-[#fafafa] text-xs space-y-1.5">
                <span className="font-heading font-extrabold text-black uppercase">Subtasks &amp; Category Filters</span>
                <p className="text-zinc-600 font-medium">
                  Every card supports subtask checklists with live completion progress bars, notes, and category filters (<code className="font-bold">Home</code>, <code className="font-bold">Finances</code>, <code className="font-bold">Date Nights</code>, <code className="font-bold">Shopping</code>, <code className="font-bold">Travel</code>).
                </p>
              </div>
            </section>

            {/* Mobile View Screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-black bg-zinc-100 text-black text-xs font-heading font-bold shadow-xs">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile-First Responsive Design</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold uppercase text-black">
                  Zero Horizontal Overflow on Any Screen
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                  On smartphones, the interface defaults directly to your Daily Routines with an ergonomic bottom navigation bar (<code className="font-bold">Habits &bull; Daily &bull; Kanban &bull; Stats</code>). The 3-column Kanban collapses into an intuitive segmented tab control (<code className="font-bold">To Do / In Progress / Done</code>) and full-height touch drawers. Header pills wrap cleanly so modals remain centered on 375px mobile screens.
                </p>
              </div>
              <div className="max-w-[280px] mx-auto rounded-3xl border-3 border-black overflow-hidden shadow-[6px_6px_0_0_#000] bg-white">
                <img
                  src="/docs/mobile-view.png"
                  alt="Couple Task Hub Mobile View on iPhone"
                  className="w-full h-auto block"
                />
              </div>
            </div>

            {/* Section 5: Gamification & Wishlist */}
            <section id="gamification" className="p-6 sm:p-8 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border-2 border-black flex items-center justify-center font-heading font-black text-sm shadow-[1.5px_1.5px_0_0_#000]">
                  05
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-extrabold uppercase tracking-tight text-black flex items-center gap-2">
                  <span>Gamification &amp; Real-World Wishlist</span>
                  <Gift className="w-4 h-4 text-amber-500" />
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                Turning household chores into a shared positive-sum game:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-4 rounded-2xl border-2 border-black bg-white shadow-[2px_2px_0_0_#000] flex flex-col justify-between">
                  <div>
                    <span className="font-heading font-extrabold uppercase text-black flex items-center gap-1.5 mb-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>Streaks</span>
                    </span>
                    <p className="text-zinc-600 font-medium">Counts consecutive days with completed routines. Protected by Freeze Days.</p>
                  </div>
                  <span className="mt-3 font-heading font-black text-base text-orange-600">Daily Multipliers</span>
                </div>
                <div className="p-4 rounded-2xl border-2 border-black bg-white shadow-[2px_2px_0_0_#000] flex flex-col justify-between">
                  <div>
                    <span className="font-heading font-extrabold uppercase text-black flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Points</span>
                    </span>
                    <p className="text-zinc-600 font-medium">Earn +3 pts for daily tasks and +2 pts for completed habits.</p>
                  </div>
                  <span className="mt-3 font-heading font-black text-base text-amber-600">+3 Pts / Task</span>
                </div>
                <div className="p-4 rounded-2xl border-2 border-black bg-white shadow-[2px_2px_0_0_#000] flex flex-col justify-between">
                  <div>
                    <span className="font-heading font-extrabold uppercase text-black flex items-center gap-1.5 mb-1">
                      <Gift className="w-3.5 h-3.5 text-purple-600" />
                      <span>Wishlist</span>
                    </span>
                    <p className="text-zinc-600 font-medium">Redeem points for couple rewards (dinner dates, movie night pick, foot massages).</p>
                  </div>
                  <span className="mt-3 font-heading font-black text-base text-purple-600">Custom Rewards</span>
                </div>
              </div>
            </section>

            {/* Section 6: Accounts & Multi-Device Sync */}
            <section id="accounts" className="p-6 sm:p-8 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 border-2 border-black flex items-center justify-center font-heading font-black text-sm shadow-[1.5px_1.5px_0_0_#000]">
                  06
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-extrabold uppercase tracking-tight text-black flex items-center gap-2">
                  <span>Multi-Device Accounts &amp; Cloud Sync</span>
                  <ShieldCheck className="w-4 h-4 text-cyan-600" />
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                To prevent data loss and ensure your space follows you everywhere:
              </p>
              <div className="space-y-3 pt-1 text-xs">
                <div className="p-3.5 rounded-2xl border border-zinc-200 bg-[#fafafa] space-y-1">
                  <span className="font-heading font-extrabold text-black uppercase flex items-center gap-1.5">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>1-Click Google Sign-In</span>
                  </span>
                  <p className="text-zinc-600 font-medium">
                    Log in instantly with your Google account. Your profile is automatically indexed in Firestore and links your active circle.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl border border-zinc-200 bg-[#fafafa] space-y-1">
                  <span className="font-heading font-extrabold text-black uppercase">
                    Username &amp; Gmail Registration
                  </span>
                  <p className="text-zinc-600 font-medium">
                    Choose a custom username (e.g. <code className="font-bold">@alex</code>) and Gmail. Once registered, you can log in on your phone with just your username and password!
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl border border-zinc-200 bg-[#fafafa] space-y-1">
                  <span className="font-heading font-extrabold text-black uppercase">
                    Clean Circle Leave &amp; Rejoin
                  </span>
                  <p className="text-zinc-600 font-medium">
                    If you ever need to reset or leave a circle, clicking <strong>Leave Circle</strong> detaches your profile in the cloud, resets local tasks cleanly, and immediately presents the Circle Setup modal.
                  </p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* ============================================================
             CHANGELOG & RELEASE HISTORY
             ============================================================ */
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-6 sm:p-8 rounded-3xl border-3 border-black bg-white shadow-[6px_6px_0_0_#000]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-black bg-emerald-100 text-black text-xs font-heading font-bold mb-3 shadow-xs">
                <Tag className="w-3.5 h-3.5 text-emerald-700" />
                <span>Version History</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-black uppercase mb-2">
                Release Notes &amp; Changelog
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 font-medium">
                Detailed record of all feature additions, UX iterations, and backend infrastructure improvements.
              </p>
            </div>

            {/* Timeline Item: v0.6.0 (Current Release) */}
            <article className="p-6 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border-2 border-black bg-black text-white font-heading font-black text-xs">
                    v0.6.0
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-black">
                    Multi-Mode Spaces, In-App &amp; Push Notifications, and Home Screen Widgets
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Current Release</span>
                </span>
              </div>
              <ul className="text-xs sm:text-sm text-zinc-600 space-y-2 list-disc list-inside font-medium pt-1">
                <li>
                  <strong>Multi-Mode Collaboration (&ldquo;Your Space, Your Way&rdquo;):</strong> Users can now choose whether to use the app <code className="font-bold">🧍 Solo</code>, <code className="font-bold">💕 With Partner (Duo)</code>, <code className="font-bold">🧑‍🤝‍🧑 With Friends</code>, or <code className="font-bold">🏡 With Family</code>. Switch modes anytime directly from the top navigation bar or circle settings with tailor-made title labels and tailored single- or multi-user profiles.
                </li>
                <li>
                  <strong>Real-Time Notifications &amp; Web Push:</strong> Integrated in-app neo-brutalist slide-out notification drawer with unread count badge, filter tabs (All, Cheers, Tasks, Streaks), native Web Notifications API browser push alerts, and 1-tap quick cheers. Routine and task completions instantly push live alerts.
                </li>
                <li>
                  <strong>Glanceable Home Screen Widgets:</strong> Interactive widget system supporting Small (2×2), Medium (4×2), and Large (4×4) sizes with live habit check toggles, 7-day consistency strip, flame streaks, and completion meters. Includes dedicated standalone <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono font-bold">/widget</code> route and step-by-step home screen installation guide for iOS (Safari), Android (Chrome), and Notion.
                </li>
                <li>
                  <strong>Vercel Privacy-Friendly Analytics:</strong> Zero-config analytics tracking integrated to monitor Core Web Vitals and app traffic.
                </li>
                <li>
                  <strong>Board Hover Elevation Polish:</strong> Added top headroom (<code className="bg-zinc-100 px-1 py-0.5 rounded font-mono font-bold">pt-1.5 pb-1</code>) to scroll containers in Daily Tasks and Daily Routines boards, eliminating top border clipping during hover animations on mobile and desktop.
                </li>
                <li>
                  <strong>Task Detail Drawer &amp; 2-Way Kanban Sync Badge:</strong> Enhanced <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono font-bold">TaskDetailDrawer</code> with accurate rollover detection keyed to the active calendar view date, and surfaced live 2-way Kanban sync status badges.
                </li>
              </ul>
            </article>

            {/* Roadmap: What's Next */}
            <article className="p-6 rounded-3xl border-2 border-dashed border-black bg-[#fff9db] shadow-[4px_4px_0_0_#000] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border-2 border-black bg-pink-300 text-black font-heading font-black text-xs">
                    NEXT UP
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-black">
                    Roadmap: What&apos;s Next
                  </h3>
                </div>
                <span className="text-xs text-zinc-500 font-medium">Future additions</span>
              </div>
              <ul className="text-xs sm:text-sm text-zinc-600 space-y-2 list-disc list-inside font-medium pt-1">
                <li>
                  <strong>Multi-Circle Architecture &amp; Unified Personal Sync:</strong> Join multiple circles simultaneously (e.g. Partner space, Roommates space, Family circle) with 1-click space switching. Tasks assigned to <code className="font-bold">Mine</code> automatically synchronize across all your circles so you only track personal to-dos once, while shared tasks marked <code className="font-bold">Both</code> remain strictly sandboxed and private to that specific circle.
                </li>
                <li>
                  <strong>Live Floating Notification Toasts (&ldquo;Momentum Floaters&rdquo;):</strong> Real-time dynamic floating toast pills that glide across the top of the screen when your partner checks off a task, hits a streak milestone, or sends love, complete with a 1-tap &ldquo;Cheer Back ❤️&rdquo; micro-reaction.
                </li>
                <li>
                  <strong>Polish Mobile UI:</strong> Refinements to mobile touch ergonomics, responsive flow, layout spacing, and gestures as further real-world device testing and feedback roll in.
                </li>
                <li>
                  <strong>Custom Partner Reward Scratch Cards:</strong> Gamified surprise vouchers and realistic scratch-off reward cards in the Wishlist.
                </li>
                <li>
                  <strong>Voice Task Dictation:</strong> 1-tap micro-dictation to quickly capture to-dos and habit reminders on the go.
                </li>
                <li>
                  <strong>Google &amp; Apple Calendar Sync:</strong> Two-way calendar synchronization for time-blocked routines and shared household deadlines.
                </li>
                <li>
                  <strong>AI Smart Habit Breakdown:</strong> Intelligent task breakdown and cadence recommendations for complex household chores.
                </li>
              </ul>
            </article>

            {/* Timeline Item: v0.5.5 */}
            <article className="p-6 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border-2 border-black bg-amber-300 text-black font-heading font-black text-xs">
                    v0.5.5
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-black">
                    7-Day Mobile Week Calendar Strip &amp; Navbar Focus Reordering
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-medium">Oct 15, 2026</span>
              </div>
              <ul className="text-xs sm:text-sm text-zinc-600 space-y-2 list-disc list-inside font-medium pt-1">
                <li>
                  <strong>Desktop Focus Switcher Sequence:</strong> Realigned the top navigation view switcher pills to <code className="font-bold">All Boards &rarr; Day &amp; Habits &rarr; Kanban Focus</code>, matching the natural 1-2-3 left-to-right board progression.
                </li>
                <li>
                  <strong>7-Day Pill Row (Mon&ndash;Sun):</strong> Added a dedicated horizontal week calendar directly above the Daily Routines and Daily Tasks boards on mobile screens. Displays day abbreviations (MON to SUN) and dates (12 to 18).
                </li>
                <li>
                  <strong>Real-Time Status Dots:</strong> Each day pill features a visual status indicator &mdash; green for 100% completion, amber for in-progress or partial completion, cyan for Freeze / Rest Days, and neutral zinc for upcoming/empty days.
                </li>
                <li>
                  <strong>Instant Day Filtering:</strong> Tapping any day pill immediately filters Daily Routines to habits scheduled for that day, and switches Daily Tasks to to-dos and rolled-over tasks for that specific date.
                </li>
                <li>
                  <strong>1-Tap &ldquo;Today&rdquo; Return &amp; Week Slider:</strong> Effortlessly slide forward or backward across weeks with <code className="font-bold">&lt;</code> <code className="font-bold">&gt;</code> controls, and snap back to the current day in a single click via the yellow &ldquo;Today&rdquo; pill.
                </li>
                <li>
                  <strong>Clean Mobile Hierarchy:</strong> Intelligently shown on Habits, Daily, and Progress tabs while kept off the Kanban board to maximize screen real estate for drag-and-drop workflow columns.
                </li>
              </ul>
            </article>

            {/* Timeline Item: v0.5.4 */}
            <article className="p-6 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border-2 border-black bg-amber-300 text-black font-heading font-black text-xs">
                    v0.5.4
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-black">
                    Mock Data Auto-Wipe, SSR Hydration &amp; Layout Stability
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-medium">Oct 15, 2026</span>
              </div>
              <ul className="text-xs sm:text-sm text-zinc-600 space-y-2 list-disc list-inside font-medium pt-1">
                <li>
                  <strong>Clean Household on Login:</strong> Authenticating via Google Sign-In or Username/Password now completely purges all pre-login mock routines, tasks, Kanban items, mock points/streaks, and the sample &ldquo;Alex &amp; Sam&rdquo; names, giving every authenticated pair a pristine, dedicated space.
                </li>
                <li>
                  <strong>Next.js SSR Hydration Stability:</strong> Resolved server/client text mismatches across the header space title and Wishlist reward modal by properly isolating client state and applying hydration guards.
                </li>
                <li>
                  <strong>Desktop Header Streamlining:</strong> Refined view focus switcher pills (&ldquo;All Boards&rdquo;, &ldquo;Kanban Focus&rdquo;, &ldquo;Day &amp; Habits&rdquo;) with responsive nowrap behavior, ensuring zero multi-line wrapping or clipping on 1280px–1440px desktop screens.
                </li>
                <li>
                  <strong>HMR &amp; Dev Environment Hardening:</strong> Resolved Webpack chunk manifest cache collisions between production builds and dev server runs, and suppressed blocking dev overlay popups on client-side form validation catches.
                </li>
              </ul>
            </article>

            {/* Timeline Item: v0.5.3 */}
            <article className="p-6 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border-2 border-black bg-amber-300 text-black font-heading font-black text-xs">
                    v0.5.3
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-black">
                    Pre-Login Mock Tasks &amp; Streak Showcase
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-medium">Oct 15, 2026</span>
              </div>
              <ul className="text-xs sm:text-sm text-zinc-600 space-y-2 list-disc list-inside font-medium pt-1">
                <li>
                  <strong>All 3 Boards Populated:</strong> Before logging in, visitors and new users immediately see vibrant interactive mock items across Daily Routines, Daily Tasks (with rollover indicator), and the 3-Column Kanban board.
                </li>
                <li>
                  <strong>Mock Streaks &amp; Points:</strong> Header and Stats sections showcase live gamification numbers (4-day streak with 12 PTS for Alex, and 2-day streak with 9 PTS for Sam) so visitors can explore partner switching and points feedback.
                </li>
                <li>
                  <strong>Zero Blank States:</strong> First-time visitors on both desktop and mobile experience the full product design without needing to register first.
                </li>
              </ul>
            </article>

            {/* Timeline Item: v0.5.2 */}
            <article className="p-6 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border-2 border-black bg-amber-300 text-black font-heading font-black text-xs">
                    v0.5.2
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-black">
                    Auth-First Onboarding &amp; Mobile Visit Flow
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-medium">Oct 15, 2026</span>
              </div>
              <ul className="text-xs sm:text-sm text-zinc-600 space-y-2 list-disc list-inside font-medium pt-1">
                <li>
                  <strong>Mobile Tab Ordering:</strong> Reordered the mobile bottom navigation bar to <code className="font-bold">Habits &rarr; Daily &rarr; Kanban &rarr; Stats</code>, setting Daily Routines as the default initial view on mobile screens.
                </li>
                <li>
                  <strong>Clean First Visit:</strong> Eliminated the premature Join Circle modal popup for unauthenticated visitors on both mobile and desktop screens.
                </li>
                <li>
                  <strong>Auth-Gated Circles:</strong> Joining or creating circles now mandates registering via Gmail or logging in with Username first, preventing isolated local circles and ensuring cloud multi-device sync works flawlessly.
                </li>
                <li>
                  <strong>Invite Link Stashing:</strong> Incoming <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono font-bold">?join=CODE</code> invitation links stash the code across registration/login and automatically open the join prompt once authenticated.
                </li>
                <li>
                  <strong>Smart Header Action:</strong> Clicking &ldquo;Join Circle&rdquo; when logged out directly opens the authentication dialog.
                </li>
              </ul>
            </article>

            {/* Timeline Item: v0.5.1 */}
            <article className="p-6 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border-2 border-black bg-amber-300 text-black font-heading font-black text-xs">
                    v0.5.1
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-black">
                    1-Click Google Sign-In &amp; Built-In Docs
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-medium">Oct 15, 2026</span>
              </div>
              <ul className="text-xs sm:text-sm text-zinc-600 space-y-2 list-disc list-inside font-medium pt-1">
                <li>
                  <strong>1-Click Google Sign-In:</strong> Added Google OAuth provider directly into the neo-brutalist authentication modal with automatic username generation and Firestore profile linking.
                </li>
                <li>
                  <strong>Comprehensive Documentation &amp; Changelog:</strong> Added dedicated <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono font-bold">/docs</code> portal featuring full walkthrough guides, architecture breakdowns, screenshots, and release notes.
                </li>
                <li>
                  <strong>Header Navigation:</strong> Added a direct &ldquo;Docs&rdquo; quick-link in the top navigation bar.
                </li>
              </ul>
            </article>

            {/* Timeline Item: v0.5.0 */}
            <article className="p-6 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border-2 border-black bg-amber-300 text-black font-heading font-black text-xs">
                    v0.5.0
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-black">
                    Multi-Device Authentication &amp; Leave Circle Overhaul
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-medium">Oct 14, 2026</span>
              </div>
              <ul className="text-xs sm:text-sm text-zinc-600 space-y-2 list-disc list-inside font-medium pt-1">
                <li>
                  <strong>Multi-Device Auth Context:</strong> Introduced <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono font-bold">AuthContext</code> supporting Gmail/Email registration and Username &amp; Password sign-in.
                </li>
                <li>
                  <strong>Cross-Device Space Loading:</strong> When signing in on a new device (laptop or smartphone), the user&apos;s active circle and tasks load automatically from Firestore without needing re-pairing.
                </li>
                <li>
                  <strong>Leave Circle Fix:</strong> Resolved an issue where clicking &ldquo;Leave Circle&rdquo; left stale tasks visible on screen. It now detaches cloud credentials, clears local storage, and immediately prompts the Circle Setup modal.
                </li>
                <li>
                  <strong>Account Pill:</strong> Header now displays the authenticated handle (e.g. <code className="font-bold">@username</code>) with instant Sign Out action.
                </li>
              </ul>
            </article>

            {/* Timeline Item: v0.4.0 */}
            <article className="p-6 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border-2 border-black bg-zinc-100 text-black font-heading font-black text-xs">
                    v0.4.0
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-black">
                    Firebase Cloud Firestore Real-Time Sync
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-medium">Oct 14, 2026</span>
              </div>
              <ul className="text-xs sm:text-sm text-zinc-600 space-y-2 list-disc list-inside font-medium pt-1">
                <li>
                  <strong>Backend Migration:</strong> Transitioned from Supabase free tier to Google Firebase Cloud Firestore for zero cold-start real-time collaboration.
                </li>
                <li>
                  <strong>Live Document Listeners:</strong> Implemented real-time <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono font-bold">onSnapshot</code> synchronization across circles, habits/routines, daily tasks, and kanban cards.
                </li>
                <li>
                  <strong>Vercel Deployment Readiness:</strong> Environment keys configured in <code className="font-mono">.env.local</code> and ready for automated Vercel CI/CD deployment.
                </li>
              </ul>
            </article>

            {/* Timeline Item: v0.3.0 */}
            <article className="p-6 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border-2 border-black bg-zinc-100 text-black font-heading font-black text-xs">
                    v0.3.0
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-black">
                    Official Logo: &ldquo;The Orbiting Hub&rdquo; (Variant 04)
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-medium">Oct 14, 2026</span>
              </div>
              <ul className="text-xs sm:text-sm text-zinc-600 space-y-2 list-disc list-inside font-medium pt-1">
                <li>
                  <strong>Logo Design &amp; Selection:</strong> Evaluated 18 concepts across minimal and playful aesthetics, finalizing on Variant 04 featuring partner hearts, a 45° snapped checkmark, and a dashed squircle orbit.
                </li>
                <li>
                  <strong>Full Asset Suite:</strong> Exported custom SVG icons, PWA manifests (<code className="font-mono">icon-192.png</code>, <code className="font-mono">icon-512.png</code>), and crisp browser favicons.
                </li>
                <li>
                  <strong>Brand Integration:</strong> Inlined SVG logo into headers, onboarding modals, and app shells.
                </li>
              </ul>
            </article>

            {/* Timeline Item: v0.2.0 */}
            <article className="p-6 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border-2 border-black bg-zinc-100 text-black font-heading font-black text-xs">
                    v0.2.0
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-black">
                    Mobile Responsiveness &amp; Overflow Elimination
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-medium">Oct 14, 2026</span>
              </div>
              <ul className="text-xs sm:text-sm text-zinc-600 space-y-2 list-disc list-inside font-medium pt-1">
                <li>
                  <strong>Viewport Clamping:</strong> Added <code className="font-mono">max-width: 100vw; overflow-x: hidden;</code> to prevent header pills from pushing iPhone screens horizontally.
                </li>
                <li>
                  <strong>Centered Modals:</strong> Fixed modal alignment on 375px screens by making top header items wrap dynamically.
                </li>
                <li>
                  <strong>Dismissible Onboarding:</strong> Added close &ldquo;X&rdquo; button and &ldquo;Explore Demo Space&rdquo; action to the circle onboarding modal.
                </li>
              </ul>
            </article>

            {/* Timeline Item: v0.1.0 */}
            <article className="p-6 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border-2 border-black bg-zinc-100 text-black font-heading font-black text-xs">
                    v0.1.0
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-black">
                    Initial Foundation &amp; 3-Board Architecture
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-medium">Oct 14, 2026</span>
              </div>
              <ul className="text-xs sm:text-sm text-zinc-600 space-y-2 list-disc list-inside font-medium pt-1">
                <li>
                  <strong>Core Boards:</strong> Built Board 1 (Daily Routines), Board 2 (Daily Tasks with Rollover), and Board 3 (3-Column Kanban).
                </li>
                <li>
                  <strong>Gamification Engine:</strong> Streaks, point accruals, and Wishlist reward modal.
                </li>
                <li>
                  <strong>Neo-Brutalist Visual Language:</strong> Bold 2px/3px black outlines, crisp drop shadows, and high-contrast typography.
                </li>
              </ul>
            </article>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-white px-4 sm:px-8 py-6 text-center text-xs text-zinc-500 font-medium">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <span className="font-heading font-bold text-black uppercase">Couple Task Hub</span>
            <span>&bull; Collaborative Home OS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-black font-bold underline transition">
              Back to App
            </Link>
            <a
              href="https://github.com/kiwicoder171/todolist"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black font-bold flex items-center gap-1 transition"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
