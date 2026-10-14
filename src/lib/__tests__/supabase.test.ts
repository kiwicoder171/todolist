import { describe, it, expect } from "vitest";
import { isSupabaseConfigured, supabase, subscribeToTable } from "../supabase";
import fs from "fs";
import path from "path";

describe("Supabase Persistence & Fallback (Seam: Ticket 07 Realtime & PWA)", () => {
  it("defaults to mock/local fallback when environment variables are omitted", () => {
    // In test environment, no real supabase env is provided
    expect(isSupabaseConfigured()).toBe(false);
    expect(supabase).toBeNull();
  });

  it("subscribeToTable returns a safe no-op unsubscribe function in fallback mode", () => {
    const unsubscribe = subscribeToTable({
      table: "routines",
      onInsert: () => {},
      onUpdate: () => {},
      onDelete: () => {},
    });

    expect(typeof unsubscribe).toBe("function");
    // Executing the no-op shouldn't throw
    expect(() => unsubscribe()).not.toThrow();
  });

  it("verifies the PWA manifest contains required standalone fields and valid icons", () => {
    const manifestPath = path.resolve(process.cwd(), "public/manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifestContent.name).toBe("Couple Task Hub");
    expect(manifestContent.display).toBe("standalone");
    expect(manifestContent.icons.length).toBeGreaterThanOrEqual(2);

    // Verify icons exist on disk
    manifestContent.icons.forEach((icon: { src: string }) => {
      const iconPath = path.resolve(process.cwd(), "public", icon.src.replace(/^\//, ""));
      expect(fs.existsSync(iconPath)).toBe(true);
    });
  });

  it("verifies the service worker script exists on disk with offline caching logic", () => {
    const swPath = path.resolve(process.cwd(), "public/sw.js");
    expect(fs.existsSync(swPath)).toBe(true);

    const swContent = fs.readFileSync(swPath, "utf-8");
    expect(swContent).toContain("CACHE_NAME");
    expect(swContent).toContain("addEventListener(\"install\"");
    expect(swContent).toContain("addEventListener(\"fetch\"");
  });

  it("verifies the Supabase PostgreSQL migration file exists with RLS policies", () => {
    const migrationPath = path.resolve(
      process.cwd(),
      "supabase/migrations/20261014000000_couple_task_hub_schema.sql"
    );
    expect(fs.existsSync(migrationPath)).toBe(true);

    const migrationSql = fs.readFileSync(migrationPath, "utf-8");
    expect(migrationSql).toContain("create table if not exists public.households");
    expect(migrationSql).toContain("create table if not exists public.daily_tasks");
    expect(migrationSql).toContain("create table if not exists public.kanban_cards");
    expect(migrationSql).toContain("enable row level security");
    expect(migrationSql).toContain("alter publication supabase_realtime add table");
  });
});
