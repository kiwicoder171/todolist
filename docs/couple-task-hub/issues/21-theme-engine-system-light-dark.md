> 🧠 **Obsidian Hub**: [[_Brain/Projects/Todo-List|Todo-List]] · [[Antigravity/Todo-List/CONTEXT|Todo-List/CONTEXT.md]]

# 21: System-Aware Cure Minimalist Theme Engine (Light & Dark)

**What to build:**
Unify the visual design across the entire application under the Cure Minimalist aesthetic with full Light & Dark mode support:
- Add a lightweight `ThemeContext` supporting `"system" | "light" | "dark"` with localStorage persistence and OS `prefers-color-scheme` synchronization.
- Configure Tailwind `darkMode: 'class'` in `tailwind.config.ts`.
- Insert a smooth Theme Toggle control into the Header / Profile settings.
- Prevent theme flicker on hydration with a lightweight script tag in `app/layout.tsx`.

**Blocked by:** 08: Cure Minimalist Aesthetic Redesign

**Status:** resolved

- [x] Tailwind `darkMode: 'class'` configuration
- [x] ThemeContext engine with `system`, `light`, and `dark` modes
- [x] Hydration anti-flash script in `layout.tsx`
- [x] Header theme switcher toggle
