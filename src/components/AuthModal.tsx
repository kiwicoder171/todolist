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
      console.error("Google sign in error:", err);
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

        {/* 1-Click Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl border-2 border-black bg-white hover:bg-zinc-50 font-heading font-extrabold text-xs uppercase transition flex items-center justify-center gap-2.5 shadow-[3px_3px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] cursor-pointer mb-4.5"
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

        <div className="relative flex py-1.5 items-center mb-4">
          <div className="flex-grow border-t border-zinc-200"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-zinc-400 font-heading">
            Or with Username & Password
          </span>
          <div className="flex-grow border-t border-zinc-200"></div>
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
