"use client";

import { Calendar as AriaCalendar, RangeCalendar as AriaRangeCalendar } from "react-aria-components";
import type {
  CalendarProps as AriaCalendarProps,
  DateValue,
  RangeCalendarProps as AriaRangeCalendarProps,
} from "react-aria-components";
import { MonthPanel } from "@/components/base/date-picker/shared";
import { cx } from "@/utils/cx";

export interface DateCalendarProps<T extends DateValue>
  extends Omit<AriaCalendarProps<T>, "className" | "children" | "visibleDuration"> {
  showToday?: boolean;
  className?: string;
  renderDayExtra?: (date: DateValue) => React.ReactNode;
}

export function DateCalendar<T extends DateValue>({
  showToday = true,
  className,
  renderDayExtra,
  ...props
}: DateCalendarProps<T>) {
  return (
    <AriaCalendar {...props} className={cx("inline-flex outline-none", className)}>
      <MonthPanel offset={0} showPrev showNext showToday={showToday} renderDayExtra={renderDayExtra} />
    </AriaCalendar>
  );
}
