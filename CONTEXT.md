# Todo-List — Persistent Project Context
Part of [[_Brain/00-Master-Orchestrator-MOC|00-Master-Orchestrator-MOC]] · Hub Node: [[_Brain/Projects/Todo-List|Todo-List]]

## 1. Overview & Stack
- **Project**: Todo-List
- **Workspace**: `/Users/kiwi/Desktop/Developer/Antigravity/Todo-List`
- **Stack**: Next.js, Supabase Realtime, Gamified Couple Task Hub
- **Summary**: Couple routine checklist, rollover tasks, Kanban sync, and streak scoring.
- **Connected Guilds**: [[_Brain/Guilds/Guild-1-Frontend-UX|Guild-1-Frontend-UX]] · [[_Brain/Guilds/Guild-3-Engineering-Delivery|Guild-3-Engineering-Delivery]] · [[_Brain/Guilds/Guild-4-Fullstack-Backend|Guild-4-Fullstack-Backend]]

## 2. Project Knowledge Graph
- 21 linked docs → full index in [[_Brain/Projects/Todo-List|Todo-List hub]] (read on demand only)
- Code graph: `graphify-out/GRAPH_REPORT.md`


## 3. Working Memory & Recent Milestones
- Synchronized with Obsidian Second-Brain Graph using explicit Vault-Root `[[Wikilinks]]`, Zero-Token AST `auto-graphify`, Global Telemetry Badge, and Kanban Board Mod (2026-10-24).
- Implemented and wired automated daily routine missed penalty ladder (-1 pt on 2 consecutive missed days, -2 on 3, -3 cap) and streak resets in `HouseholdContext`, `gamification.ts`, and `DailyRoutinesBoard`, supporting negative scores and idempotent retroactive refunds (2026-10-24).
- Resolved runaway streak/point rendering loop: made streak and score reconciliations strictly idempotent, eliminated accumulation-per-render bug in `reconcileGamificationState`, removed the temporary `> 500 ? 1` clamp band-aid, and wrapped `DailyRoutinesBoard` reconciliation calls in an evaluation signature ref guard (2026-10-29).
