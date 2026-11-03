> 🧠 **Obsidian Hub**: [[_Brain/Projects/Todo-List|Todo-List]] · [[Antigravity/Todo-List/CONTEXT|Todo-List/CONTEXT.md]]

# Spec: Couple Task Hub

## Problem Statement

Couples who want to coordinate their lives face a dilemma between simple single-user todo apps (like Apple Notes or Google Tasks) and heavy team project management software (like Jira or ClickUp). Simple apps lack shared real-time accountability, multi-device synchronization, habit scoring, and structured kanban planning for future goals. Meanwhile, enterprise tools feel bureaucratic, cluttered, and clinical. Furthermore, individuals often lose track of daily recurring habits when mixing them with urgent ad-hoc chores and long-term project tasks, while unfinished daily tasks get forgotten in past calendar dates without rollover.

## Solution

Couple Task Hub is an intimate, real-time collaborative productivity web application tailored specifically for two Partners sharing a Household. It presents a unified Day View combining three distinct task boards:
1. **Routines**: Recurring habit checklists with Apple Notes-style speed and day-of-week scheduling.
2. **Daily Tasks**: Immediate, unexpected one-off tasks with automatic rollover and origin date badges.
3. **Kanban Board**: Long-term workflow stages with customizable categories and two-way synchronization into the Day View.

A persistent Calendar Panel enables rapid date navigation with completion glance indicators and a Freeze Day mode. To foster playful accountability, a Partner Score system rewards 100% routine completion (+1 point & streak increment), enforces tiered missed-day penalties (-1 for 2 days, -2 for 3 days, capped at -3 for 4+ days), permits negative point balances, and allows redeeming points for couple perks in a custom Reward Wishlist.

## User Stories

### Workspace & Household
1. As a Partner, I want to log in to my individual account linked to our shared Household, so that the app automatically recognizes my identity and personalizes my view.
2. As a Partner, I want changes made by my partner to sync instantly in real time without refreshing, so that we never duplicate effort or see conflicting states.
3. As a Partner, I want to filter the dashboard by "Mine", "Partner's", or "All", so that I can focus on my own responsibilities or see everything we are doing together.
4. As a Partner, I want to install the web app on my phone's home screen as a PWA, so that I can open and use it like a native mobile app.

### Board 1: Daily Routines
5. As a Partner, I want to view my scheduled Routines on the Day View, so that I know exactly what habits I need to complete today.
6. As a Partner, I want to add new Routine items quickly using the keyboard (Enter for next line, Backspace to remove empty lines), so that building my routine feels as effortless as Apple Notes.
7. As a Partner, I want to drag and drop Routine items to reorder them, so that I can organize them in chronological order of my day.
8. As a Partner, I want to configure a Routine's frequency (Every Day vs specific weekdays like Mon/Wed/Fri), so that weekday-only habits do not clutter my weekend checklist.
9. As a Partner, I want checking off a Routine to record its completion strictly for the selected calendar date, so that browsing past or future dates maintains an accurate historical record.
10. As a Partner, I want to see a tactile strike-through and fade animation when I check off a Routine, so that completing a habit feels satisfying.
11. As a Partner, I want to assign a Routine to myself, my partner, or Both, so that shared habits (like "walk the dog") can be shared while individual habits stay separate.

### Board 2: Daily Tasks (Unexpected & Urgent)
12. As a Partner, I want to quickly add an unexpected Daily Task on today's view, so that I can capture immediate to-dos as they happen.
13. As a Partner, I want unfinished Daily Tasks from yesterday to automatically roll forward to today's active list, so that forgotten tasks don't get lost in past calendar dates.
14. As a Partner, I want rolled-over tasks to display a subtle badge indicating their Origin Date, so that I am aware of how long a task has been pending.
15. As a Partner, I want viewing past calendar dates to preserve the original record of Daily Tasks created on that day, so that our historical log remains intact.
16. As a Partner, I want to click any Daily Task to open a clean detail drawer, so that I can add supplementary notes, links, or sub-checklist items without cluttering the main list.
17. As a Partner, I want to delete or edit a Daily Task with quick actions, so that my list remains accurate and tidy.

### Board 3: Kanban Board & Workflow
18. As a Partner, I want a single persistent Kanban Board organized by stages (Backlog, To Do, In Progress, Done), so that we can track long-term chores and projects together.
19. As a Partner, I want to assign custom Categories (e.g., "Home", "Travel", "Groceries") to Kanban Cards, so that we can organize different areas of life within one unified board.
20. As a Partner, I want to filter the Kanban Board by a specific Category or view "All", so that I can focus on a specific project or view all our active initiatives.
21. As a Partner, I want to drag and drop Kanban Cards between stages, so that our project status is visually and physically intuitive.
22. As a Partner, I want to schedule a Kanban Card for a specific date or flag it "Do Today", so that it automatically surfaces in Board 2 (Daily Tasks) on that day.
23. As a Partner, I want checking off a scheduled Kanban Card in the Daily Tasks view to automatically transition that card to "Done" on the Kanban Board, so that I don't have to manually update both places.

### Calendar Panel & Navigation
24. As a Partner, I want to click across different days in the Calendar Panel, so that I can review past accomplishments or plan upcoming days.
25. As a Partner, I want to see visual glance indicators (completion rings or colored dots) on each calendar date, so that I can easily spot which days were 100% completed or have pending tasks.
26. As a Partner, I want to toggle a "Freeze Day" on a selected calendar date, so that vacation, travel, or sick days do not count against our routine streaks or trigger penalties.

### Gamification: Partner Score & Streaks
27. As a Partner, I want to earn +1 point and increment my consecutive Streak counter whenever I achieve a Perfect Day (100% completion of my active Routines), so that I stay motivated.
28. As a Partner, I want a 1-day grace period when I miss completing my routines, so that an occasional busy day does not penalize my score.
29. As a Partner, I want missing 2 consecutive days to deduct 1 point, missing 3 consecutive days to deduct 2 points, and missing 4 or more consecutive days to cap at a maximum deduction of 3 points for that absence block, so that accountability is clear without becoming mathematically insurmountable.
30. As a Partner, I want my score to be able to drop into negative numbers, so that there are real, playful stakes when routines are neglected.
31. As a Partner, I want returning and achieving a Perfect Day to immediately reset the consecutive missed-day counter back to zero and resume normal streak tracking, so that recovery is always attainable.
32. As a Partner, I want my routine completion percentage to be calculated strictly from my own routines (`Mine`) plus shared routines (`Both`), so that my partner's personal checklist does not impact my score.
33. As a Partner, I want to redeem my points for custom couple perks in a Reward Wishlist (e.g., "Cook favorite meal = 10 pts"), so that our daily habits translate into real-life fun.
34. As a Partner, I want to send quick emoji reactions (❤️, 🎉, 👏) on my partner's completed tasks, so that we can celebrate each other's progress.

### Responsive Design & PWA
35. As a desktop user, I want a 3-pane dashboard displaying the Calendar & Routines, Daily Tasks, and the Kanban Board simultaneously, so that I have complete situational awareness on large screens.
36. As a mobile user, I want clean bottom navigation tabs (`Today`, `Kanban`, `Calendar`) with a prominent floating quick-add button, so that navigating and capturing tasks on my phone is effortless.
37. As a user on intermittent internet, I want optimistic UI updates, so that checking off items feels instantaneous and never blocks on network responses.

## Implementation Decisions

### Architectural Shape
- Next.js (App Router) frontend with Tailwind CSS styling and mobile-responsive viewport breakpoints.
- Supabase PostgreSQL for persistent database storage, coupled with Supabase Realtime for live websocket row-level change broadcasts to all active client sessions.
- Progressive Web App (PWA) manifest configuration for native home-screen installation on iOS and Android.
- Mock/Local Seed mode enabled by default when Supabase environment variables are unconfigured, allowing immediate zero-friction local execution (`npm run dev`).

### Modules & Boundaries
1. **Household & Auth Context**: Manages the current authenticated Partner, Household pairing token, active assignee filter (`Mine`, `Partner`, `All`), and real-time subscription channels.
2. **Day View Module**:
   - Encapsulates the active selected date.
   - Manages Board 1 (Routines) with per-date completion join records.
   - Manages Board 2 (Daily Tasks) with automatic rollover calculation for unfinished items from previous dates.
3. **Kanban Module**:
   - Manages Kanban Cards, customizable Stages, and Category filters.
   - Exposes scheduling hooks that sync with Board 2 when a card carries a due date matching the active Day View date.
4. **Calendar Navigation Module**:
   - Renders month/week views with aggregated status metadata per date cell (percentage of routines completed, pending daily tasks, Freeze Day status).
   - Handles date selection events that drive the Day View.
5. **Gamification & Scoring Engine**:
   - Pure domain calculation service.
   - Evaluates daily routine completion logs to determine Perfect Day status (+1 pt, +1 streak).
   - Computes consecutive missed days and applies the tiered penalty ladder (Day 1: 0, Day 2: -1, Day 3: -2, Day 4+: -3 cap).
   - Manages negative score balances and reward redemption transactions against the Reward Wishlist.

### Apple Notes Interaction Pattern
- Input list rows handle keydown events: `Enter` commits the current item and auto-focuses a newly created row below it; `Backspace` on an empty row deletes it and moves focus to the previous item.
- Checkboxes trigger an animated strike-through and 300ms transition before settling.
- Pointer drag handles support vertical reordering with optimistic visual placement.

## Testing Decisions

### What Makes a Good Test
- Tests must assert observable external behavior from the user's perspective, never private state or implementation details.
- User interactions (clicking checkboxes, typing in task lists, switching calendar dates, and filtering categories) should be simulated through the DOM testing library.

### Testing Seams & Coverage
1. **Domain Engine Seam (Unit Tests)**:
   - Scoring & Penalty Calculations: Test 100% completion (+1 pt, +1 streak), grace day (1 miss), 2-day miss (-1 pt), 3-day miss (-2 pts), 4+ day miss (-3 pt cap), negative balance handling, and recovery reset.
   - Freeze Day logic: Assert that Freeze Days do not break streaks or increment missed-day counters.
   - Rollover Engine: Assert that unfinished Daily Tasks correctly transfer to today's view with their original date tag while leaving the past date's record intact.
2. **Interactive UI Seam (Integration Tests via Vitest & React Testing Library)**:
   - Board 1 Checklist: Rapid keyboard entry, deletion, and strike-through checkoff state.
   - Board 2 & Kanban Two-Way Sync: Scheduling a Kanban card displays it in Daily Tasks; checking it off advances the Kanban card to "Done".
   - Assignee Filters: Filtering between "Mine", "Partner's", and "All" correctly hides and displays respective items.
   - Calendar Navigation: Selecting a date loads that specific day's routine completions and daily tasks.

## Out of Scope
- Native push notifications (APNs / Web Push) for v1.
- Multiple separate households or multi-tenant team management (strictly 1 couple household per deployment).
- Complex recurring rules beyond day-of-week selections (e.g., no "every 3rd Tuesday of every other month").
- Rich-text markdown WYSIWYG editors inside task titles (plain text with expandable notes drawer).

## Phase 2: YPT Focus Engine & Cure Minimalist Redesign

### Motivation & Visual Direction
Inspired by Yeolpumta (YPT), Phase 2 expands Couple Task Hub into an intimate, serene co-focus environment with a "cure / healing minimalist" design language (soft carbon surfaces, hairline borders, calm typography, and zero clutter).

### Phase 2 Tickets
- **Ticket 08**: Cure Minimalist Aesthetic Redesign & Design System Tokens (`08-cure-minimalist-aesthetic-redesign.md`)
- **Ticket 09**: Focus Timer Engine & Docked Floating Focus Pill (`09-focus-timer-engine-and-docked-pill.md`)
- **Ticket 10**: Realtime Co-Focus & Partner Desks (`10-realtime-co-focus-partner-desks.md`)
- **Ticket 11**: 24-Hour Visual Day Timeline & Attendance Consistency Matrix (`11-visual-day-timeline-and-consistency-matrix.md`)
- **Ticket 12**: Daily Focus Target & Circular Progress Ring Goal (`12-daily-focus-target-and-ring-goal.md`)
- **Ticket 13**: Pomodoro Completion Chimes & Web Audio Cues (`13-pomodoro-completion-chimes-and-audio.md`)
- **Ticket 14**: Ambient White Noise & Focus Sound Generator (`14-ambient-white-noise-focus-sounds.md`)
- **Ticket 15**: Custom Studicons & Couple Focus Avatars (`15-custom-studicons-and-couple-avatars.md`)
- **Ticket 16**: Mobile FAB & Floating Focus Pill Ergonomic Layout (`16-mobile-fab-pill-avoidance-layout.md`)
- **Ticket 17**: Focus Finish & Item Auto-Checkoff Synergy (`17-focus-finish-auto-checkoff-synergy.md`)
- **Ticket 18**: Daily Focus Goal Gamification & Bonus Point (`18-daily-focus-goal-bonus-gamification.md`)
- **Ticket 19**: On-the-Fly Pomodoro Duration & Mode Switcher (`19-pomodoro-duration-mode-switcher.md`)
- **Ticket 20**: Audio Volume Feedback & Chime Preview (`20-audio-volume-chime-preview.md`)
- **Ticket 21**: System-Aware Cure Minimalist Theme Engine (Light & Dark) (`21-theme-engine-system-light-dark.md`)
- **Ticket 22**: Header & Global Navigation Cure Minimalist Refactor (`22-header-and-filter-cure-redesign.md`)
- **Ticket 23**: Boards & Kanban Cure Minimalist Harmonization (`23-boards-kanban-cure-harmonization.md`)

## Further Notes
- Default categories for the Kanban Board: "Home", "Travel", "Groceries", "Wishlist".
- Default stages for the Kanban Board: "Backlog", "To Do", "In Progress", "Done".
- Default seed rewards in the Wishlist: "Cook Dinner (10 pts)", "Back Massage (15 pts)", "Pick Weekend Movie (5 pts)".
