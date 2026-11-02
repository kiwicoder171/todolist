> 🧠 **Obsidian Hub**: [[_Brain/Projects/Todo-List|Todo-List]] · [[Antigravity/Todo-List/CONTEXT|Todo-List/CONTEXT.md]]

# 09: Focus Timer Engine & Docked Floating Focus Pill

**What to build:**
Implement the core focus timer engine inspired by YPT's stopwatch and Pomodoro tracking:
- `FocusTimerContext` providing drift-free timer calculations using timestamp deltas (`Date.now() - startTime + accumulatedMs`) persisted in `localStorage`.
- Stopwatch and Pomodoro modes with Break interval tracking (e.g. 25m focus / 5m break or continuous stopwatch).
- Direct linkage to active items: tap `▶` on any Routine, Daily Task, or Kanban card to start timing that item immediately.
- Docked Floating Focus Pill component (pinned above mobile navigation bar and desktop bottom-center) with play, pause, break switch, and elapsed time counter.

**Blocked by:** 08: Cure Minimalist Aesthetic Redesign & Design System Tokens

**Status:** resolved

- [x] Create `FocusTimerContext` with timestamp delta calculation and `localStorage` persistence
- [x] Add one-click focus launch trigger (`▶`) across Routines, Daily Tasks, and Kanban cards
- [x] Build docked floating focus pill with live counter, pause/resume, break state, and finish session modal
- [x] Unit tests for focus timer drift resilience, state persistence, and item linkage
