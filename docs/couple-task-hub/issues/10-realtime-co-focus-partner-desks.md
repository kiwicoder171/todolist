> 🧠 **Obsidian Hub**: [[_Brain/Projects/Todo-List|Todo-List]] · [[Antigravity/Todo-List/CONTEXT|Todo-List/CONTEXT.md]]

# 10: Realtime Co-Focus & Partner Desks

**What to build:**
Adapt YPT's signature group study room into an intimate 2-partner co-focus presence system over Supabase Realtime:
- Broadcast live focus session state (`partner`, `isFocusing`, `taskTitle`, `startedAt`, `mode`, `secondsElapsed`) on timer state changes.
- Minimalist Partner Co-Focus Desks component in the header / Day View: displays Alex & Sam side-by-side with live ticking counter and pulsing ambient glow.
- Realtime cheer interaction: send quick encouragement reactions (❤️, 👏, ☕, ⚡) directly to the focusing partner.
- Graceful offline and mock fallback when Supabase keys are not present.

**Blocked by:** 09: Focus Timer Engine & Docked Floating Focus Pill

**Status:** resolved

- [x] Supabase Realtime channel integration for co-focus presence broadcast
- [x] Partner Desks UI component showing live focusing partner and task
- [x] Instant cheer reaction trigger on partner's active focus session
- [x] Integration tests verifying live co-focus synchronization and cheer delivery
