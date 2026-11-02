> 🧠 **Obsidian Hub**: [[_Brain/Projects/Todo-List|Todo-List]] · [[Antigravity/Todo-List/CONTEXT|Todo-List/CONTEXT.md]]

# 19: On-the-Fly Pomodoro Duration & Mode Switcher

**What to build:**
Enable rapid duration and mode adjustment directly inside the Floating Focus Pill:
- Clicking the mode badge (`Focus` / `Pomodoro`) opens a quick-switcher popover.
- Select from preset intervals: `15m`, `25m`, `45m`, `60m`, or switch to open-ended `Stopwatch` mode.
- Update active session target seconds seamlessly without resetting current elapsed time.

**Blocked by:** 09: Focus Timer Engine & Docked Floating Focus Pill

**Status:** resolved

- [x] Duration and mode update handler in `FocusTimerContext` (`updateActiveSessionMode`)
- [x] Mode selector dropdown / popover in `FloatingFocusPill`
- [x] Tests for live mode and duration switching
