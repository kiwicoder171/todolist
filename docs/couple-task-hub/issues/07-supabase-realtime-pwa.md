> 🧠 **Obsidian Hub**: [[_Brain/Projects/Todo-List|Todo-List]] · [[Antigravity/Todo-List/CONTEXT|Todo-List/CONTEXT.md]]

# 07: Supabase Realtime Persistence & PWA Configuration

**What to build:**
Supabase database migration schemas (Households, Partners, Routines, RoutineCompletions, DailyTasks, KanbanCards, Rewards) and Realtime subscription hooks for live multi-device pairing. Complete PWA manifest, service worker, and web app icons for home screen installation on iOS and Android.

**Blocked by:** 04: Board 3 — Unified Kanban Board & Two-Way Day View Sync, 06: Gamification — Partner Score, Streaks, Penalty Ladder & Reward Wishlist

**Status:** resolved

- [x] Supabase schema migrations and row-level security (RLS) policies scoped to Household
- [x] Realtime client hook listening to postgres changes
- [x] PWA manifest, icons, and service worker registration
- [x] Seamless fallback to local mock state when Supabase env vars are omitted
- [x] E2E multi-device sync test verification
