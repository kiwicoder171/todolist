"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Sun,
  Moon,
  Timer,
  Layers,
  Compass,
  ListChecks,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/context/ThemeContext";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"guide" | "changelog">("guide");
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col font-sans selection:bg-[#0071e3] selection:text-white transition-colors duration-200">
      {/* Top Glass Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-black/[0.06] dark:border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center border border-black/10 dark:border-white/20 shadow-xs p-1.5 transition-transform hover:scale-105 shrink-0 apple-press"
            title="Return to App"
          >
            <Logo size={22} className="text-white dark:text-zinc-950" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base tracking-tight text-foreground">
                Couple Task Hub
              </span>
              <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-400/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                v0.7.0 Docs
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Feature Manual &amp; Version History
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Guide / Changelog Switcher */}
          <div className="flex items-center bg-black/[0.04] dark:bg-white/[0.08] p-1 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] text-xs font-heading font-medium">
            <button
              onClick={() => setActiveTab("guide")}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer apple-press ${
                activeTab === "guide"
                  ? "bg-white dark:bg-[#1c1c1e] text-foreground shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-foreground"
              }`}
            >
              Feature Guide
            </button>
            <button
              onClick={() => setActiveTab("changelog")}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 apple-press ${
                activeTab === "changelog"
                  ? "bg-white dark:bg-[#1c1c1e] text-foreground shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-foreground"
              }`}
            >
              <span>Changelog</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-black/[0.08] dark:border-white/[0.1] bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 transition-colors apple-press cursor-pointer shrink-0"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          {/* Back to App */}
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-foreground transition text-xs font-heading font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 apple-press"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Hub</span>
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
          <div className="space-y-10 animate-in fade-in duration-200">
            {/* Hero Banner */}
            <div className="apple-card p-6 sm:p-10 relative overflow-hidden">
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/15 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3 border border-blue-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Collaborative Operating System for Shared Life</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-heading font-bold tracking-tight text-foreground mb-3">
                  Welcome to Couple Task Hub
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal mb-6">
                  Couple Task Hub is designed from the ground up for partners sharing a life. It unifies scattered reminders and note apps into an Apple-minimalist, distraction-free workspace featuring 3 unified boards, real-time cloud sync, and playful shared gamification.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <a
                    href="#spaces"
                    className="px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white/60 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition apple-press"
                  >
                    1. Spaces &amp; Pairing
                  </a>
                  <a
                    href="#board1"
                    className="px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white/60 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition apple-press"
                  >
                    2. Daily Routines
                  </a>
                  <a
                    href="#board2"
                    className="px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white/60 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition apple-press"
                  >
                    3. Daily Tasks &amp; Rollover
                  </a>
                  <a
                    href="#board3"
                    className="px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white/60 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition apple-press"
                  >
                    4. Kanban &amp; Card Drawer
                  </a>
                  <a
                    href="#focus"
                    className="px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white/60 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition apple-press"
                  >
                    5. Co-Focus Desks
                  </a>
                  <a
                    href="#gamification"
                    className="px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white/60 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition apple-press"
                  >
                    6. Points &amp; Wishlist
                  </a>
                </div>
              </div>
            </div>

            {/* Desktop Dashboard Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Live Interface Preview
                </h3>
                <span className="text-xs text-neutral-400 font-normal">Apple Minimalist Unified Design</span>
              </div>
              <div className="apple-card overflow-hidden rounded-3xl p-2 sm:p-3">
                <img
                  src="/docs/desktop-dashboard.png"
                  alt="Couple Task Hub Desktop Dashboard with Daily Routines, Daily Tasks, and Kanban"
                  className="w-full h-auto block rounded-2xl border border-black/[0.06] dark:border-white/[0.08]"
                />
              </div>
            </div>

            {/* Section 1: Space Modes & Pairing */}
            <section id="spaces" className="apple-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-heading font-bold text-xs">
                  01
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>Circle Spaces &amp; Multi-Mode Pairing</span>
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                Couple Task Hub adapts to how you live. Choose between 4 tailored collaboration modes directly from your circle settings:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-center">
                  <span className="text-lg block mb-1">🧍</span>
                  <h4 className="text-xs font-semibold text-foreground">Solo Space</h4>
                  <p className="text-[11px] text-neutral-500 mt-1">Personal productivity &amp; focused habit mastery</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-pink-500/20 text-center">
                  <span className="text-lg block mb-1">💕</span>
                  <h4 className="text-xs font-semibold text-pink-600 dark:text-pink-400">Duo (Partner)</h4>
                  <p className="text-[11px] text-neutral-500 mt-1">Shared household, partner cheer &amp; couple wishlist</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-center">
                  <span className="text-lg block mb-1">🧑‍🤝‍🧑</span>
                  <h4 className="text-xs font-semibold text-foreground">Friends</h4>
                  <p className="text-[11px] text-neutral-500 mt-1">Roommates, co-living chores &amp; trip planning</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-center">
                  <span className="text-lg block mb-1">🏡</span>
                  <h4 className="text-xs font-semibold text-foreground">Family</h4>
                  <p className="text-[11px] text-neutral-500 mt-1">Multi-member household routines &amp; calendars</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
                  <h4 className="font-semibold text-xs mb-1.5 flex items-center gap-1.5 text-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Create a Space</span>
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-normal">
                    Give your home a name. You will receive a unique 6-character code (e.g. <code className="bg-black/[0.06] dark:bg-white/10 px-1 py-0.5 rounded font-mono font-semibold">CUP-XXXX</code>) and a 1-tap invitation link to share.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
                  <h4 className="font-semibold text-xs mb-1.5 flex items-center gap-1.5 text-foreground">
                    <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Join Partner&apos;s Space</span>
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-normal">
                    Paste the invite code or click your partner&apos;s invite link. You are instantly linked into the same real-time cloud synchronized hub.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Board 1 - Daily Routines & Streak Freeze */}
            <section id="board1" className="apple-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-heading font-bold text-xs">
                  02
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>Board 1: Daily Routines &amp; Habits</span>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                Inspired by Apple Notes paper lists, this board tracks daily recurring habits (e.g., watering plants, morning vitamins, 10k steps, or bedtime reading).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-xs space-y-1">
                  <span className="font-semibold text-foreground">Flexible Cadence</span>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-normal">
                    Schedule routines for <strong>Everyday</strong>, <strong>Weekdays only</strong>, <strong>Weekends only</strong>, or select custom days of the week (e.g. Mon / Wed / Fri gym sessions).
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-xs space-y-1">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <span>Emergency Freeze Days</span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 text-[10px] font-semibold">Travel / Sick</span>
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-normal">
                    Life happens. Toggle <strong>Freeze Day</strong> in the calendar bar when sick or traveling. Routines on freeze days are protected so your streak counter never breaks unfairly.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Board 2 - Daily Tasks & Auto-Rollover */}
            <section id="board2" className="apple-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-heading font-bold text-xs">
                  03
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-bold tracking-tight text-foreground">
                  Board 2: Daily Execution &amp; Auto-Rollover
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                Immediate day-specific errands and tasks (e.g., plumber appointments, groceries, picking up dry cleaning) anchored to the active calendar date.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
                  <span className="font-semibold text-xs block mb-1 text-foreground">
                    Automatic Rollover Engine
                  </span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-normal">
                    Unfinished tasks from yesterday or past days are never forgotten. When viewing today, uncompleted past items roll forward with an amber &ldquo;Rollover&rdquo; badge.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
                  <span className="font-semibold text-xs block mb-1 text-foreground">
                    Assignee Filtering
                  </span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-normal">
                    Tag tasks as <strong>Mine</strong>, <strong>Partner</strong>, or <strong>Both</strong>. Use the header filter pill to quickly isolate your assignments or review shared duties at a glance.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Board 3 - Kanban & Card Detail Drawer */}
            <section id="board3" className="apple-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-heading font-bold text-xs">
                  04
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>Board 3: Vertical Kanban &amp; Card Detail Drawer</span>
                  <Layout className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                For larger multi-day household projects (e.g. &ldquo;Plan anniversary trip&rdquo;, &ldquo;Reorganize garage&rdquo;, &ldquo;Tax filings&rdquo;), Kanban cards provide structured long-term tracking across <strong>To Do</strong>, <strong>In Progress</strong>, and <strong>Completed</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-blue-500/[0.06] border border-blue-500/20 space-y-2">
                <span className="font-semibold text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4" />
                  <span>Interactive Card Detail Slide-Over Drawer</span>
                </span>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-normal">
                  Clicking any card opens the deep-dive drawer without disrupting your board:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.06]">
                    <span className="font-medium text-foreground block mb-0.5">Subtask Checklists</span>
                    <span className="text-neutral-500 text-[11px]">Add sub-items with live visual progress meters.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.06]">
                    <span className="font-medium text-foreground block mb-0.5">Rich Project Notes</span>
                    <span className="text-neutral-500 text-[11px]">Full markdown notes for links, budgets, and instructions.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.06]">
                    <span className="font-medium text-foreground block mb-0.5">Emoji Categories</span>
                    <span className="text-neutral-500 text-[11px]">Tag with custom categories (Home, Finance, Travel, Date Night).</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Co-Focus Desks & Focus Timer */}
            <section id="focus" className="apple-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-heading font-bold text-xs">
                  05
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>Co-Focus Desks &amp; 24H Timeline</span>
                  <Timer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                Work alongside your partner even across different rooms or during remote workdays.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
                  <span className="font-semibold block mb-1 text-foreground">
                    Virtual Desks &amp; Status
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-normal">
                    See when your partner is active at their desk, in deep focus, or taking a break with live ambient status indicators.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
                  <span className="font-semibold block mb-1 text-foreground">
                    Integrated Pomodoro Timer
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-normal">
                    Launch focus sessions tied to specific Kanban tasks with ambient tick sounds and 24-hour visual progress timelines.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Gamification & Wishlist */}
            <section id="gamification" className="apple-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-heading font-bold text-xs">
                  06
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>Gamification &amp; Customizable Wishlist</span>
                  <Gift className="w-4 h-4 text-amber-500" />
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                Turning household chores into a positive-sum shared experience:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between">
                  <div>
                    <span className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>Streaks</span>
                    </span>
                    <p className="text-neutral-500 leading-normal">Counts consecutive completed routine days, protected by Freeze Days.</p>
                  </div>
                  <span className="mt-3 font-semibold text-sm text-orange-600 dark:text-orange-400">Daily Multipliers</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between">
                  <div>
                    <span className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Points</span>
                    </span>
                    <p className="text-neutral-500 leading-normal">Earn +3 pts for daily tasks and +2 pts for completed habits with instant sync.</p>
                  </div>
                  <span className="mt-3 font-semibold text-sm text-amber-600 dark:text-amber-400">+3 Pts / Task</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between">
                  <div>
                    <span className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                      <Gift className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Wishlist Shop</span>
                    </span>
                    <p className="text-neutral-500 leading-normal">Redeem points for real-world rewards. Delete or create custom rewards anytime.</p>
                  </div>
                  <span className="mt-3 font-semibold text-sm text-purple-600 dark:text-purple-400">Custom Rewards</span>
                </div>
              </div>
            </section>

            {/* Mobile View Section */}
            <div className="apple-card p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-foreground text-xs font-semibold">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile-First Experience</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                  Streamlined &amp; Clean Touch Ergonomics
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                  On mobile screens, the app defaults to Daily Routines with a tactile bottom dock (<code className="font-semibold">Habits &bull; Daily &bull; Kanban &bull; Stats</code>). Redundant buttons are hidden, input zoom is disabled, and control popovers mount in a clean root document portal with zero clipping.
                </p>
              </div>
              <div className="max-w-[260px] mx-auto overflow-hidden rounded-3xl border border-black/[0.06] dark:border-white/[0.08] shadow-sm bg-black">
                <img
                  src="/docs/mobile-view.png"
                  alt="Couple Task Hub Mobile View on iPhone"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================
             CHANGELOG & RELEASE HISTORY
             ============================================================ */
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Changelog Header */}
            <div className="apple-card p-6 sm:p-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3 border border-emerald-500/20">
                <Tag className="w-3.5 h-3.5" />
                <span>Version History</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground mb-2">
                Release Notes &amp; Changelog
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-normal">
                Structured record of design overhauls, feature releases, and cloud reliability milestones.
              </p>
            </div>

            {/* Version 0.7.0 (Current Release) */}
            <article className="apple-card p-6 sm:p-8 space-y-4 border-blue-500/20 dark:border-blue-400/20">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#0071e3] text-white font-heading font-bold text-xs shadow-xs">
                    v0.7.0
                  </span>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">
                    Apple Minimalist Redesign &amp; Kanban Deep-Dive
                  </h3>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1.5 bg-blue-500/10 px-2.5 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Current Release</span>
                </span>
              </div>
              <div className="space-y-3 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed">
                <div>
                  <h4 className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1 text-blue-600 dark:text-blue-400">
                    Design &amp; Aesthetics
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 pl-1">
                    <li>
                      <strong>Apple Minimalist Visual Overhaul:</strong> Transformed entire application from retro neo-brutalism to modern Apple minimalism featuring frosted glass cards (<code className="font-semibold">apple-card</code>), subtle border hairlines, dark mode elevation, and refined SF-style typography.
                    </li>
                    <li>
                      <strong>Translucent Control Bars:</strong> Implemented backdrop-filtered floating navigation bars and segmented view tracks for seamless light/dark mode adaptation.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1 text-blue-600 dark:text-blue-400">
                    Kanban Deep-Dive
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 pl-1">
                    <li>
                      <strong>Slide-Over Card Detail Drawer:</strong> Clicking any Kanban card opens an in-depth slide-over inspector for subtask checklists, markdown project notes, emoji category tagging, and assignee assignment.
                    </li>
                    <li>
                      <strong>Card Action Insulation:</strong> Quick buttons (<code className="font-semibold">Start</code>, <code className="font-semibold">Done</code>, <code className="font-semibold">Focus</code>, <code className="font-semibold">Delete</code>) execute with event propagation protection so card actions do not trigger the drawer unintentionally.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1 text-blue-600 dark:text-blue-400">
                    Ergonomics &amp; &ldquo;Less is More&rdquo; Decluttering
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 pl-1">
                    <li>
                      <strong>Mobile Button Pruning:</strong> Removed redundant routine quick-add buttons on mobile viewports since the persistent bottom-right floating action button already handles creation.
                    </li>
                    <li>
                      <strong>Concise Copy &amp; Placeholders:</strong> Streamlined task input placeholder text (<code className="font-semibold">What&apos;s gotta finish today?</code>) and eliminated noisy mobile container borders.
                    </li>
                    <li>
                      <strong>Portal-Mounted Control Center:</strong> Re-anchored the top header popover into a root document portal (<code className="font-semibold">createPortal</code>), permanently solving first-click dropdown clipping and stacking context collisions.
                    </li>
                  </ul>
                </div>
              </div>
            </article>

            {/* Version 0.6.2 */}
            <article className="apple-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/10 text-foreground font-heading font-bold text-xs">
                    v0.6.2
                  </span>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Multi-Mode Spaces, Dynamic Cheers &amp; Wishlist Polish
                  </h3>
                </div>
                <span className="text-xs text-neutral-400 font-medium">Late October 2026</span>
              </div>
              <ul className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 space-y-2 list-disc list-inside font-normal leading-relaxed pt-1">
                <li>
                  <strong>Space Modes (Solo, Duo, Friends, Family):</strong> Added flexible space configuration. Switching between modes automatically updates UI titles, avatar counters, and collaboration settings.
                </li>
                <li>
                  <strong>Mode-Adaptive Consistency Dials:</strong> Dials and Momentum Cheer banners dynamically reflect the active mode (e.g. &ldquo;Couple Momentum Cheer&rdquo; only appears in Duo mode; Solo spaces show personalized focus dials).
                </li>
                <li>
                  <strong>Penalty Ladder Display Fix:</strong> Resolved negative value formatting in penalty banners using <code className="font-semibold">Math.abs</code>, cleanly showing point deductions without double dashes.
                </li>
                <li>
                  <strong>Wishlist Shop Customization:</strong> Empowered users to delete existing rewards via a 1-tap trash action and added scroll headroom padding to prevent card hover clipping.
                </li>
              </ul>
            </article>

            {/* Version 0.6.1 */}
            <article className="apple-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/10 text-foreground font-heading font-bold text-xs">
                    v0.6.1
                  </span>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Real-Time Cloud Synchronization &amp; Gamification Engine
                  </h3>
                </div>
                <span className="text-xs text-neutral-400 font-medium">Mid October 2026</span>
              </div>
              <ul className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 space-y-2 list-disc list-inside font-normal leading-relaxed pt-1">
                <li>
                  <strong>Independent Partner Perfect Days:</strong> Introduced partner-specific domain evaluation (<code className="font-semibold">evaluatePartnerDay</code>), ensuring completing all personal routines immediately awards +1 point and maintains streak status even if the partner has remaining tasks.
                </li>
                <li>
                  <strong>Resilient Cloud State Persistence:</strong> Resolved task state reverting gaps across browser refreshes with recursive payload sanitization for Firestore <code className="font-semibold">setDoc</code> and resilient local-remote snapshot merging.
                </li>
                <li>
                  <strong>Live Partner Cheers &amp; Push Alerts:</strong> Subscribed notification drawers to Firestore subcollections (<code className="font-semibold">circles/&#123;id&#125;/notifications</code>) for instant delivery of partner cheers, task completions, and streaks.
                </li>
                <li>
                  <strong>Intent Resolution &amp; Filter Isolation:</strong> Fixed partner intent inversion so tasks marked &ldquo;Me&rdquo; accurately link to the creating partner regardless of active filter state.
                </li>
                <li>
                  <strong>Security Upgrade:</strong> Upgraded framework core to Next.js 15.2.9 with enhanced build validation.
                </li>
              </ul>
            </article>

            {/* Version 0.6.0 */}
            <article className="apple-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/10 text-foreground font-heading font-bold text-xs">
                    v0.6.0
                  </span>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Home Screen Widgets &amp; Multi-Device Accounts
                  </h3>
                </div>
                <span className="text-xs text-neutral-400 font-medium">October 16, 2026</span>
              </div>
              <ul className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 space-y-2 list-disc list-inside font-normal leading-relaxed pt-1">
                <li>
                  <strong>Glanceable Home Screen Widgets:</strong> Interactive Small (2×2), Medium (4×2), and Large (4×4) widgets with live habit check toggles, 7-day consistency strip, and standalone <code className="font-semibold">/widget</code> route for iOS and Android.
                </li>
                <li>
                  <strong>1-Click Google Sign-In &amp; Usernames:</strong> Instant authentication with Google OAuth or custom username &amp; password with profile linking in Cloud Firestore.
                </li>
                <li>
                  <strong>In-App Notification Center:</strong> Slide-out drawer with unread badges, filter tabs, and native Web Push notification support.
                </li>
              </ul>
            </article>

            {/* Version 0.5.x Milestones */}
            <article className="apple-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-neutral-500 font-heading font-bold text-xs">
                    v0.5.x
                  </span>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Calendar Navigation, Auth-First Onboarding &amp; Logo Design
                  </h3>
                </div>
                <span className="text-xs text-neutral-400 font-medium">October 14–15, 2026</span>
              </div>
              <ul className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 space-y-2 list-disc list-inside font-normal leading-relaxed pt-1">
                <li>
                  <strong>7-Day Week Calendar Strip:</strong> Added horizontal Mon–Sun day navigation strip on mobile with instant day filtering and real-time status dots.
                </li>
                <li>
                  <strong>Mock Data Auto-Wipe:</strong> Guaranteed that logging into an account cleanly clears demo items and displays fresh household state.
                </li>
                <li>
                  <strong>Official Brand Identity:</strong> Shipped &ldquo;The Orbiting Hub&rdquo; logo with SVG assets, favicons, and manifest icons.
                </li>
                <li>
                  <strong>Cloud Firestore Migration:</strong> Re-architected backend onto Google Firebase Cloud Firestore with zero cold-start latency.
                </li>
              </ul>
            </article>

            {/* Roadmap & Completed Milestones */}
            <article className="apple-card p-6 sm:p-8 space-y-6 border-dashed border-purple-500/30 bg-purple-500/[0.02]">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-heading font-bold text-xs border border-purple-500/20">
                    ROADMAP AUDIT
                  </span>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">
                    Roadmap &amp; Delivery Status
                  </h3>
                </div>
                <span className="text-xs text-neutral-400 font-medium">Tracking progress against product goals</span>
              </div>

              {/* Shipped from Roadmap */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    Already Shipped &amp; Delivered
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                        <span>Multi-Mode Spaces</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        v0.6.2
                      </span>
                    </div>
                    <p className="text-neutral-500 leading-normal">
                      &ldquo;Your space, your way&rdquo; with 4 modes (Solo, Duo, Friends, Family) and mode-adaptive Momentum Cheers.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                        <span>Home Screen Widgets</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        v0.6.0
                      </span>
                    </div>
                    <p className="text-neutral-500 leading-normal">
                      Small, Medium, and Large widgets with live routine check toggles and dedicated <code className="font-semibold">/widget</code> route for iOS/Android.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                        <span>Cloud Notifications &amp; Cheers</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        v0.6.1
                      </span>
                    </div>
                    <p className="text-neutral-500 leading-normal">
                      In-app notification drawer, Firestore circle subcollections, real-time partner cheer pings, and Web Push.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                        <span>Kanban Card Detail Drawer</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        v0.7.0
                      </span>
                    </div>
                    <p className="text-neutral-500 leading-normal">
                      Slide-over inspector for subtask checklists with live progress meters, project markdown notes, and emoji tags.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                        <span>Mobile &ldquo;Less is More&rdquo; Polish</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        v0.7.0
                      </span>
                    </div>
                    <p className="text-neutral-500 leading-normal">
                      Removed duplicate buttons, simplified placeholders, and portal-mounted dropdowns to prevent clipping.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                        <span>Co-Focus Desks &amp; Pomodoro</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        v0.6.2
                      </span>
                    </div>
                    <p className="text-neutral-500 leading-normal">
                      Live partner desk presence, focus timer with ambient sounds, daily goal ring, and 24h timeline rail.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upcoming Milestones */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-purple-600 dark:text-purple-400">
                    Next Up &amp; In Design
                  </h4>
                </div>
                <ul className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 space-y-2 list-disc list-inside font-normal leading-relaxed pl-1">
                  <li>
                    <strong>Multi-Circle Architecture &amp; Unified Personal Sync:</strong> Join multiple spaces simultaneously (e.g. Partner space + Family circle + Roommates) with 1-click space switching and unified personal tasks (<code className="font-semibold">Mine</code>) automatically synchronized across all circles.
                  </li>
                  <li>
                    <strong>Live Floating Toasts (&ldquo;Momentum Floaters&rdquo;):</strong> Real-time dynamic toast pills gliding across the screen when a partner completes a task, hits a streak, or sends love, with a 1-tap &ldquo;Cheer Back ❤️&rdquo; micro-reaction.
                  </li>
                  <li>
                    <strong>Partner Scratch Cards:</strong> Gamified surprise vouchers and scratch-off reward cards in the Wishlist Shop.
                  </li>
                  <li>
                    <strong>Two-Way Calendar Sync:</strong> Google Calendar &amp; Apple Calendar two-way synchronization for time-blocked routines and shared deadlines.
                  </li>
                  <li>
                    <strong>Voice Task Dictation:</strong> 1-tap micro-dictation to quickly capture to-dos and habit reminders on the go.
                  </li>
                </ul>
              </div>
            </article>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.08] bg-white/50 dark:bg-black/50 backdrop-blur-xl px-4 sm:px-8 py-6 text-center text-xs text-neutral-500 font-medium transition-colors">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Logo size={18} className="text-zinc-900 dark:text-zinc-100 shrink-0" />
            <span className="font-heading font-bold text-foreground">Couple Task Hub</span>
            <span>&bull; Collaborative Home OS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground font-semibold transition">
              Back to App
            </Link>
            <a
              href="https://github.com/kiwicoder171/todolist"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground font-semibold flex items-center gap-1 transition"
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
