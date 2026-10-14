import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { AuthProvider, useAuth } from "../AuthContext";

describe("AuthContext (Multi-device authentication & Username sign-in)", () => {
  it("provides default state and methods", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(typeof result.current.login).toBe("function");
    expect(typeof result.current.register).toBe("function");
    expect(typeof result.current.logout).toBe("function");
  });

  it("validates input on register", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Too short username
    await expect(result.current.register("ab", "test@gmail.com", "password123")).rejects.toThrow(
      "Username must be at least 3 characters long."
    );

    // Invalid characters in username
    await expect(result.current.register("alex user!", "test@gmail.com", "password123")).rejects.toThrow(
      "Username can only contain letters, numbers, hyphens, and underscores."
    );

    // Invalid email
    await expect(result.current.register("alex_smith", "not-an-email", "password123")).rejects.toThrow(
      "Please provide a valid email address."
    );

    // Too short password
    await expect(result.current.register("alex_smith", "alex@gmail.com", "123")).rejects.toThrow(
      "Password must be at least 6 characters long."
    );
  });

  it("validates empty identifier on login", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(result.current.login("   ", "password123")).rejects.toThrow(
      "Please enter your username or email."
    );
  });
});
