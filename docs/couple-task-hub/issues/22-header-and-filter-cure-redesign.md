> 🧠 **Obsidian Hub**: [[_Brain/Projects/Todo-List|Todo-List]] · [[Antigravity/Todo-List/CONTEXT|Todo-List/CONTEXT.md]]

# 22: Header & Global Navigation Cure Minimalist Refactor

**What to build:**
Refactor the top navigation bar and filter controls from neo-brutalism to cure minimalism:
- Replace `border-2 border-black` and hard offset drop shadows (`shadow-[2px_2px_0_0_#000]`) with elegant hairline borders (`border-zinc-200 dark:border-zinc-800/80`).
- Use translucent backdrop blur (`bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md`).
- Simplify header density by organizing secondary actions into a clean "More" dropdown.
- Provide smooth tactile hover/active states without harsh cartoon jumps.

**Blocked by:** 21: System-Aware Cure Minimalist Theme Engine

**Status:** resolved

- [x] Soften borders, drop shadows, and backgrounds in `Header.tsx`
- [x] Refactor `FilterBar.tsx` to match cure minimalist aesthetic
- [x] Theme-responsive typography and badge styling
