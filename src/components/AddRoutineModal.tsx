"use client";

import React, { useState, useEffect } from "react";
import { useHousehold, Assignee } from "@/context/HouseholdContext";
import { useRoutines, RoutineFrequency } from "@/context/RoutinesContext";
import { X, Plus, Calendar, Check } from "lucide-react";

export interface AddRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
}

const DAYS_CONFIG = [
  { id: 1, label: "Mon", name: "Monday" },
  { id: 2, label: "Tue", name: "Tuesday" },
  { id: 3, label: "Wed", name: "Wednesday" },
  { id: 4, label: "Thu", name: "Thursday" },
  { id: 5, label: "Fri", name: "Friday" },
  { id: 6, label: "Sat", name: "Saturday" },
  { id: 0, label: "Sun", name: "Sunday" },
];

export function detectFrequency(selectedDays: number[]): {
  frequency: RoutineFrequency;
  label: string;
  badge: string;
} {
  const sorted = Array.from(new Set(selectedDays)).sort((a, b) => a - b);

  if (sorted.length === 0) {
    return {
      frequency: "daily",
      label: "No days selected",
      badge: "⚠️ Select at least 1 day",
    };
  }

  // All 7 days -> daily
  if (sorted.length === 7) {
    return {
      frequency: "daily",
      label: "Every single day",
      badge: "🔄 Daily (Everyday)",
    };
  }

  // Exactly 1, 2, 3, 4, 5 -> weekdays
  if (
    sorted.length === 5 &&
    sorted[0] === 1 &&
    sorted[1] === 2 &&
    sorted[2] === 3 &&
    sorted[3] === 4 &&
    sorted[4] === 5
  ) {
    return {
      frequency: "weekdays",
      label: "Monday through Friday",
      badge: "💼 Weekdays (Mon-Fri)",
    };
  }

  // Exactly 0 and 6 -> weekends
  if (sorted.length === 2 && sorted.includes(0) && sorted.includes(6)) {
    return {
      frequency: "weekends",
      label: "Saturday & Sunday",
      badge: "☕ Weekends (Sat-Sun)",
    };
  }

  // Custom days list (e.g. Mon, Fri)
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // Order to match user reading order: Mon..Sun
  const displayDays = [1, 2, 3, 4, 5, 6, 0]
    .filter((d) => sorted.includes(d))
    .map((d) => dayNames[d])
    .join(", ");

  return {
    frequency: sorted,
    label: `Every ${displayDays}`,
    badge: `🗓️ Custom (${displayDays})`,
  };
}

export function AddRoutineModal({
  isOpen,
  onClose,
  initialTitle = "",
}: AddRoutineModalProps) {
  const { activePartner } = useHousehold();
  const { addRoutine } = useRoutines();

  const partnerName = activePartner === "alex" ? "Sam" : "Alex";

  const [title, setTitle] = useState(initialTitle);
  const [assignee, setAssignee] = useState<Assignee>("both");
  // Default to everyday [1, 2, 3, 4, 5, 6, 0]
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 0]);

  // Sync initial title if passed
  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle);
    }
  }, [initialTitle]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleDay = (dayId: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const setPreset = (days: number[]) => {
    setSelectedDays(days);
  };

  const { frequency, label, badge } = detectFrequency(selectedDays);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedDays.length === 0) return;

    addRoutine(title.trim(), assignee, frequency);
    setTitle("");
    setSelectedDays([1, 2, 3, 4, 5, 6, 0]);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="routine-modal-title"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-black rounded-3xl p-6 shadow-[6px_6px_0_0_#000] w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="routine-modal-title"
                className="font-heading font-black text-sm uppercase tracking-wide text-black"
              >
                New Daily Routine
              </h3>
              <p className="text-[11px] text-zinc-500">
                Choose routine title and schedule days
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-black hover:bg-black hover:text-white flex items-center justify-center transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Routine Title */}
          <div>
            <label className="block font-heading font-bold uppercase text-[11px] text-black mb-1">
              Routine Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Clean my room, 15-min sync, Water plants..."
              className="w-full px-3 py-2 border-2 border-black rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-black placeholder-zinc-400"
              autoFocus
            />
          </div>

          {/* Assignee Selection */}
          <div>
            <label className="block font-heading font-bold uppercase text-[11px] text-black mb-1.5">
              Assigned To
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAssignee("mine")}
                className={`py-2 px-3 rounded-xl border-2 font-heading font-bold text-xs transition ${
                  assignee === "mine"
                    ? "border-black bg-black text-white shadow-xs"
                    : "border-zinc-300 text-zinc-700 hover:border-black bg-white"
                }`}
              >
                Me
              </button>
              <button
                type="button"
                onClick={() => setAssignee("partner")}
                className={`py-2 px-3 rounded-xl border-2 font-heading font-bold text-xs transition ${
                  assignee === "partner"
                    ? "border-black bg-black text-white shadow-xs"
                    : "border-zinc-300 text-zinc-700 hover:border-black bg-white"
                }`}
              >
                {partnerName}
              </button>
              <button
                type="button"
                onClick={() => setAssignee("both")}
                className={`py-2 px-3 rounded-xl border-2 font-heading font-bold text-xs transition ${
                  assignee === "both"
                    ? "border-black bg-black text-white shadow-xs"
                    : "border-zinc-300 text-zinc-700 hover:border-black bg-white"
                }`}
              >
                Both of Us
              </button>
            </div>
          </div>

          {/* Schedule Days Picker */}
          <div className="space-y-2 pt-1 border-t border-zinc-100">
            <div className="flex items-center justify-between">
              <label className="block font-heading font-bold uppercase text-[11px] text-black">
                Repeat On Days
              </label>
              {/* Quick Presets */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreset([1, 2, 3, 4, 5, 6, 0])}
                  className="text-[10px] font-heading font-bold px-2 py-0.5 rounded border border-zinc-300 hover:border-black hover:bg-zinc-100 transition"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setPreset([1, 2, 3, 4, 5])}
                  className="text-[10px] font-heading font-bold px-2 py-0.5 rounded border border-zinc-300 hover:border-black hover:bg-zinc-100 transition"
                >
                  Weekdays
                </button>
                <button
                  type="button"
                  onClick={() => setPreset([6, 0])}
                  className="text-[10px] font-heading font-bold px-2 py-0.5 rounded border border-zinc-300 hover:border-black hover:bg-zinc-100 transition"
                >
                  Weekends
                </button>
              </div>
            </div>

            {/* 7 Days Toggle Pills */}
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {DAYS_CONFIG.map((day) => {
                const isSelected = selectedDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    aria-label={day.name}
                    aria-pressed={isSelected}
                    className={`h-11 rounded-xl border-2 flex flex-col items-center justify-center transition font-heading ${
                      isSelected
                        ? "border-black bg-black text-white shadow-[2px_2px_0_0_#000]"
                        : "border-zinc-300 hover:border-black text-zinc-600 bg-white"
                    }`}
                  >
                    <span className="text-[11px] font-extrabold">{day.label}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Smart Auto-Detection Status Callout */}
            <div className="mt-2.5 p-2.5 rounded-xl border-2 border-black bg-zinc-50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-heading font-bold uppercase text-zinc-500">
                  Auto-Detected Frequency
                </span>
                <span className="text-xs font-heading font-bold text-black">
                  {label}
                </span>
              </div>
              <span className="text-[10px] font-heading font-extrabold uppercase px-2.5 py-1 rounded-full border border-black bg-white text-black shrink-0">
                {badge}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!title.trim() || selectedDays.length === 0}
              className="w-full py-2.5 bg-black text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-black rounded-xl font-heading font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#000] active:translate-y-0.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Routine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
