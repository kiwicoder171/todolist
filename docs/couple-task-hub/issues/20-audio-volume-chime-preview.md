> 🧠 **Obsidian Hub**: [[_Brain/Projects/Todo-List|Todo-List]] · [[Antigravity/Todo-List/CONTEXT|Todo-List/CONTEXT.md]]

# 20: Audio Volume Feedback & Chime Preview

**What to build:**
Provide instantaneous audio feedback when users interact with the audio settings:
- Play a short, subtle harmonic tick/ping when moving the ambient volume slider.
- Play a brief chime preview when enabling/unmuting chimes.
- Debounced sound execution to avoid audio stutter.

**Blocked by:** 13: Pomodoro Completion Chimes & Web Audio Cues

**Status:** resolved

- [x] Volume preview ping in `focusAudio.ts`
- [x] Debounced audio trigger on slider input in `FloatingFocusPill.tsx`
- [x] Tests for preview audio execution
