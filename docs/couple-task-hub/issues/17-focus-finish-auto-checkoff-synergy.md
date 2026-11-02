> 🧠 **Obsidian Hub**: [[_Brain/Projects/Todo-List|Todo-List]] · [[Antigravity/Todo-List/CONTEXT|Todo-List/CONTEXT.md]]

# 17: Focus Finish & Item Auto-Checkoff Synergy

**What to build:**
Close the loop between focus time logging and habit completion:
- When a user finishes a focus session originating from a Routine (`target.type === 'routine'`), Daily Task (`'daily'`), or Kanban Card (`'kanban'`), provide a prominent one-tap "Finish & Mark Done ✓" option alongside "Finish Session Only".
- Automatically triggers `toggleCompletion(target.id, selectedDate)` for routines, `toggleDailyTask(target.id)` for daily tasks, or `moveCardStage(target.id, 'done')` for Kanban cards.
- Displays combined celebratory feedback toast (e.g. *"✨ Logged 25m & Completed Routine!"*).

**Blocked by:** 09: Focus Timer Engine & Docked Floating Focus Pill

**Status:** resolved

- [x] Add checkoff callback support or context hooks in `FloatingFocusPill`
- [x] Render "Finish & Mark Done ✓" button when `target.id` matches an active item
- [x] Unit & integration tests for auto-checkoff on finish
