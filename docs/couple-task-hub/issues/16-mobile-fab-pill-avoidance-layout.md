> 🧠 **Obsidian Hub**: [[_Brain/Projects/Todo-List|Todo-List]] · [[Antigravity/Todo-List/CONTEXT|Todo-List/CONTEXT.md]]

# 16: Mobile FAB & Floating Focus Pill Ergonomic Layout

**What to build:**
Resolve mobile touch collision between the Quick Add Floating Action Button (`＋`) and the `FloatingFocusPill`:
- When a focus session is active, dynamically position the mobile FAB at `bottom-36` with a fluid CSS transition.
- When no focus session is active, the FAB smoothly returns to `bottom-20`.
- Maintain full tap target accessibility across all mobile viewports (375px+).

**Blocked by:** 09: Focus Timer Engine & Docked Floating Focus Pill

**Status:** resolved

- [x] Dynamic FAB bottom positioning in `MobileShell.tsx` based on `useFocusTimer().activeSession`
- [x] CSS transition for smooth repositioning without layout jump
- [x] Mobile touch target test verification
