> 🧠 **Obsidian Hub**: [[_Brain/Projects/Todo-List|Todo-List]] · [[Antigravity/Todo-List/CONTEXT|Todo-List/CONTEXT.md]]

# 1. Next.js with Supabase Realtime for Multi-Device Household Sync

We decided to build the app using Next.js App Router and Supabase (PostgreSQL with Realtime subscriptions) deployed on Vercel. Because two partners use the app simultaneously across mobile phones and laptops, local-only storage or manual page reloads would cause out-of-sync lists and duplicate effort. Supabase gives instant live synchronization of task completions, Postgres row-level security scoped to the household, and push/realtime updates with minimal operational overhead.
