"use client";

import React, { useContext } from "react";
import {
  Button as RACButton,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarStateContext,
  RangeCalendarStateContext,
  useLocale,
} from "react-aria-components";
import type { CalendarCellRenderProps, DateValue } from "react-aria-components";
import { getLocalTimeZone } from "@internationalized/date";
import { cx } from "@/utils/cx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DayCell({
  date,
  formattedDate,
  isSelected,
  isSelectionStart,
  isSelectionEnd,
  isFocusVisible,
  isDisabled,
  isUnavailable,
  isHovered,
  showToday = true,
  renderDayExtra,
}: CalendarCellRenderProps & {
  showToday?: boolean;
  renderDayExtra?: (date: DateValue) => React.ReactNode;
}) {
  const isToday =
    showToday &&
    date.compare(
      new (date.constructor as any)(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
      )
    ) === 0;

  return (
    <div className="relative flex flex-col items-center justify-center w-9 h-9 sm:w-10 sm:h-10">
      <button
        type="button"
        aria-label={`Day ${date.day}`}
        className={cx(
          "relative flex flex-col items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-2xl outline-none cursor-pointer transition-all duration-150 apple-press",
          isSelected
            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold shadow-xs"
            : isToday
            ? "border border-blue-500/80 font-bold bg-blue-500/[0.04] text-blue-600 dark:text-blue-400"
            : isHovered
            ? "bg-black/[0.04] dark:bg-white/[0.08] text-zinc-900 dark:text-zinc-100"
            : "text-zinc-700 dark:text-zinc-300",
          (isDisabled || isUnavailable) && "text-zinc-400 dark:text-zinc-600 line-through opacity-50 cursor-not-allowed",
          isFocusVisible && "ring-2 ring-blue-500/50"
        )}
      >
        <span className="text-[11px] sm:text-xs leading-none font-semibold">{formattedDate}</span>
        {renderDayExtra && (
          <div className="h-2 flex items-center justify-center mt-0.5 pointer-events-none">
            {renderDayExtra(date)}
          </div>
        )}
      </button>
    </div>
  );
}

export function MonthPanel({
  offset = 0,
  showPrev = true,
  showNext = true,
  showToday = true,
  renderDayExtra,
}: {
  offset?: number;
  showPrev?: boolean;
  showNext?: boolean;
  showToday?: boolean;
  renderDayExtra?: (date: DateValue) => React.ReactNode;
}) {
  const { locale } = useLocale();
  const rangeState = useContext(RangeCalendarStateContext);
  const singleState = useContext(CalendarStateContext);
  const state = rangeState ?? singleState;
  const panelDate = state ? state.visibleRange.start.add({ months: offset }) : null;

  const title = panelDate
    ? new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
        panelDate.toDate(getLocalTimeZone())
      )
    : "";

  return (
    <div className="w-full flex flex-col">
      {/* Month & Nav Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-black/[0.05] dark:border-white/[0.06]">
        <span className="font-semibold text-sm tracking-wide text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
          {title}
        </span>
        <div className="flex items-center gap-1">
          {showPrev && (
            <RACButton
              slot="previous"
              aria-label="Previous month"
              className="w-7 h-7 rounded-xl border border-black/[0.06] dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-bold text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.08] apple-press transition cursor-pointer outline-none"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </RACButton>
          )}
          {showNext && (
            <RACButton
              slot="next"
              aria-label="Next month"
              className="w-7 h-7 rounded-xl border border-black/[0.06] dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-bold text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.08] apple-press transition cursor-pointer outline-none"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </RACButton>
          )}
        </div>
      </div>

      {/* Weekday headers */}
      <CalendarGrid
        offset={{ months: offset }}
        className="w-full border-separate outline-none"
        style={{ borderSpacing: "0px 4px" }}
      >
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className="text-center font-semibold text-[11px] text-zinc-400 dark:text-zinc-500 pb-2">
              {day.slice(0, 1)}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              aria-label={`Day ${date.day}`}
              className="p-0 outline-none flex items-center justify-center"
            >
              {(cellProps) => (
                <DayCell {...cellProps} showToday={showToday} renderDayExtra={renderDayExtra} />
              )}
            </CalendarCell>
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  );
}
