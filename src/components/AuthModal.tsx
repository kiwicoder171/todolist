"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "./Logo";
import { X, Lock, Mail, User, AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const { login, register, isConfigured } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(username, email, password);
      onClose();
    } catch (err: any) {
      console.error("Registration error:", err);
      let msg = err.message || "Failed to register.";
      if (err.code === "auth/email-already-in-use") {
        msg = "This email is already registered. Please log in instead.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      } else if (err.code === "auth/operation-not-allowed") {
        msg = "Email/Password sign-in is not enabled in Firebase Console > Authentication > Sign-in method.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(loginIdentifier, password);
      onClose();
    } catch (err: any) {
      console.error("Login error:", err);
      let msg = err.message || "Failed to sign in.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        msg = "Incorrect username/email or password. Please try again.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Please reset password or wait a moment.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border-4 border-black rounded-3xl p-6 sm:p-7 shadow-[8px_8px_0_0_#000] relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full border-2 border-black bg-zinc-100 hover:bg-black hover:text-white transition flex items-center justify-center cursor-pointer shadow-[2px_2px_0_0_#000]"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center border-2 border-black shadow-[3px_3px_0_0_#000] p-1.5 shrink-0">
            <Logo size={28} inverted />
          </div>
          <div>
            <h2 className="text-xl font-heading font-extrabold uppercase tracking-tight text-black flex items-center gap-1.5">
              <span>Couple Task Hub</span>
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            </h2>
            <p className="text-xs text-zinc-600 font-medium">
              Multi-device sync across phone, laptop & tablet
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-100 border-2 border-black rounded-2xl mb-5 shadow-[2px_2px_0_0_#000]">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`py-2 text-xs font-heading font-extrabold rounded-xl transition ${
              mode === "login"
                ? "bg-black text-white shadow-sm"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            Log In (Username)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            className={`py-2 text-xs font-heading font-extrabold rounded-xl transition ${
              mode === "register"
                ? "bg-black text-white shadow-sm"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            Register (Gmail)
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 rounded-xl text-red-700 text-xs font-medium flex items-start gap-2 shadow-[2px_2px_0_0_rgba(239,68,68,0.3)]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        {/* Login Form */}
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1.5 text-zinc-800">
                Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. alex_smith or alex@gmail.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl border-2 border-black text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0_0_#000]"
                />
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1.5 text-zinc-800">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl border-2 border-black text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0_0_#000]"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl border-2 border-black bg-black text-white hover:bg-zinc-800 font-heading font-extrabold text-sm uppercase transition flex items-center justify-center gap-2 shadow-[4px_4px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-zinc-800">
                Choose a Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. alex_smith"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2 pl-10 rounded-xl border-2 border-black text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0_0_#000]"
                />
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">You will use this username to log in on other devices.</p>
            </div>

            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-zinc-800">
                Gmail or Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 pl-10 rounded-xl border-2 border-black text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0_0_#000]"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-zinc-800">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 pl-10 rounded-xl border-2 border-black text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0_0_#000]"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl border-2 border-black bg-black text-white hover:bg-zinc-800 font-heading font-extrabold text-sm uppercase transition flex items-center justify-center gap-2 shadow-[4px_4px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-5 pt-4 border-t border-zinc-200 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-heading font-bold text-zinc-500 hover:text-black underline"
          >
            Continue as Guest / Explore Demo
          </button>
        </div>
      </div>
    </div>
  );
}
