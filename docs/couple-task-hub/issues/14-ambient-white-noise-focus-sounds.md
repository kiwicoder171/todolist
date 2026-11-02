> 🧠 **Obsidian Hub**: [[_Brain/Projects/Todo-List|Todo-List]] · [[Antigravity/Todo-List/CONTEXT|Todo-List/CONTEXT.md]]

# 14: Ambient White Noise & Focus Sound Generator

**What to build:**
Replicate YPT's "Music / Noise" feature using synthetic procedural Web Audio noise generators:
- Multiple ambient focus modes: "Gentle Rain", "Brown Noise", "White Noise", and "Zen Stream".
- Procedural buffer generation (zero large audio file downloads, instant startup, works completely offline).
- Play/pause toggle and volume slider inside the Floating Focus Pill and expanded focus controls.
- Automatic silence when focus timer pauses or stops.

**Blocked by:** 13: Pomodoro Completion Chimes & Web Audio Cues

**Status:** resolved

- [x] Procedural audio noise nodes (Pink/Brown noise filter generator)
- [x] Sound selection menu (Off, Rain, Brown Noise, White Noise)
- [x] Floating Focus Pill audio controls (volume & quick ambient switch)
- [x] Unit & lifecycle tests for audio start/stop/volume changes
