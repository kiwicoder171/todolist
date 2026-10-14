import { describe, it, expect, beforeEach, vi } from "vitest";
import { getFirebaseConfig, isFirebaseConfigured } from "../firebase";

describe("Firebase Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it("returns null and false when env variables are missing", () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    delete process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

    expect(getFirebaseConfig()).toBeNull();
    expect(isFirebaseConfigured()).toBe(false);
  });

  it("parses individual environment variables correctly", () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "test-api-key";
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "couple-task-hub";
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "couple-task-hub.firebaseapp.com";

    const config = getFirebaseConfig();
    expect(config).not.toBeNull();
    expect(config?.apiKey).toBe("test-api-key");
    expect(config?.projectId).toBe("couple-task-hub");
    expect(config?.authDomain).toBe("couple-task-hub.firebaseapp.com");
    expect(isFirebaseConfigured()).toBe(true);
  });

  it("parses single JSON config string if provided", () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    process.env.NEXT_PUBLIC_FIREBASE_CONFIG = JSON.stringify({
      apiKey: "json-api-key",
      projectId: "json-project-id",
    });

    const config = getFirebaseConfig();
    expect(config).not.toBeNull();
    expect(config?.apiKey).toBe("json-api-key");
    expect(config?.projectId).toBe("json-project-id");
    expect(isFirebaseConfigured()).toBe(true);
  });
});
