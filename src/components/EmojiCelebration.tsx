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
    <div className="fixed bottom-6 right-6 z-50 animate-bounce pointer-events-none">
      <div className="bg-black text-white border-2 border-black rounded-2xl px-4 py-2.5 shadow-[4px_4px_0_0_#fff] flex items-center gap-2.5">
        {type === "perfect" ? (
          <Flame className="w-5 h-5 text-white animate-pulse" />
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
        <span className="font-heading font-extrabold text-xs uppercase tracking-wide">
          {message}
        </span>
      </div>
    </div>
  );
}
