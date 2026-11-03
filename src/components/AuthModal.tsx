"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "./Logo";
import { X, Lock, Mail, User, AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultMode?: "login" | "register";
}

export function AuthModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
  defaultMode: propDefaultMode,
}: AuthModalProps = {}) {
  const {
    login,
    register,
    signInWithGoogle,
    isConfigured,
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
  } = useAuth();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isAuthModalOpen;
  const onClose = propOnClose || closeAuthModal;
  const [mode, setMode] = useState<"login" | "register">(propDefaultMode || authModalMode || "login");

  React.useEffect(() => {
    if (propDefaultMode) {
      setMode(propDefaultMode);
    } else if (authModalMode) {
      setMode(authModalMode);
    }
  }, [propDefaultMode, authModalMode, isOpen]);

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.warn("Google sign in warning:", err);
      let msg = err.message || "Failed to sign in with Google.";
      if (err.code === "auth/popup-closed-by-user") {
        msg = "Google sign-in was closed before completion.";
      } else if (err.code === "auth/unauthorized-domain") {
        msg = "This domain is not authorized in Firebase Console > Authentication > Settings > Authorized Domains.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(username, email, password);
      onClose();
    } catch (err: any) {
      console.warn("Registration warning:", err);
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
      console.warn("Login warning:", err);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in duration-200">
      <div className="w-full max-w-md bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.12] rounded-3xl p-6 sm:p-7 shadow-2xl relative animate-scale-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl border border-black/[0.06] dark:border-white/[0.08] text-zinc-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition flex items-center justify-center cursor-pointer apple-press"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center border border-black/[0.08] dark:border-white/[0.12] shadow-xs p-1.5 shrink-0">
            <Logo size={28} inverted />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>Couple Task Hub</span>
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Multi-device sync across phone, laptop & tablet
            </p>
          </div>
        </div>

        {/* 1-Click Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] font-semibold text-xs text-zinc-800 dark:text-zinc-200 transition flex items-center justify-center gap-2.5 apple-press cursor-pointer mb-4"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex py-1 items-center mb-4">
          <div className="flex-grow border-t border-black/[0.05] dark:border-white/[0.08]"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-semibold text-zinc-400">
            Or with Username & Password
          </span>
          <div className="flex-grow border-t border-black/[0.05] dark:border-white/[0.08]"></div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 apple-segmented-track rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-xl apple-press transition ${
              mode === "login"
                ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
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
            className={`py-2 text-xs font-semibold rounded-xl apple-press transition ${
              mode === "register"
                ? "bg-white dark:bg-[#2c2c2e] text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Register (Gmail)
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/[0.08] dark:bg-rose-500/[0.15] border border-rose-500/20 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2.5 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <p className="leading-snug flex-1">{error}</p>
          </div>
        )}

        {/* Login Form */}
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-zinc-700 dark:text-zinc-300">
                Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. alex_smith or alex@gmail.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] text-sm bg-black/[0.02] dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] text-sm bg-black/[0.02] dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 font-semibold text-sm uppercase transition flex items-center justify-center gap-2 apple-press shadow-2xs disabled:opacity-60 cursor-pointer"
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
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-zinc-700 dark:text-zinc-300">
                Choose a Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. alex_smith"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] text-sm bg-black/[0.02] dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">You will use this username to log in on other devices.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-zinc-700 dark:text-zinc-300">
                Gmail or Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] text-sm bg-black/[0.02] dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] text-sm bg-black/[0.02] dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 font-semibold text-sm uppercase transition flex items-center justify-center gap-2 apple-press shadow-2xs disabled:opacity-60 cursor-pointer"
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

        <div className="mt-5 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline apple-press transition"
          >
            Continue as Guest / Explore Demo
          </button>
        </div>
      </div>
    </div>
  );
}
