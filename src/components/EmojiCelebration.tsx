"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Flame, Check } from "lucide-react";

interface EmojiCelebrationProps {
  message: string;
  type?: "task" | "perfect";
  onDismiss?: () => void;
}

export function EmojiCelebration({
  message,
  type = "task",
  onDismiss,
}: EmojiCelebrationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="apple-card bg-zinc-900/90 dark:bg-zinc-800/90 text-white border border-white/10 rounded-2xl px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.36)] flex items-center gap-2.5 backdrop-blur-2xl">
        {type === "perfect" ? (
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
        ) : (
          <Sparkles className="w-4 h-4 text-emerald-400" />
        )}
        <span className="font-semibold text-xs tracking-tight">
          {message}
        </span>
      </div>
    </div>
  );
}
