"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const dow = d.getDay();
  const diff = dow === 0 ? -6 : 1 - dow; // 월요일 기준
  d.setDate(d.getDate() + diff);
  return toDateString(d);
}

function getTodayString(): string {
  return toDateString(new Date());
}

export default function WeekNavigator({
  currentDate,
  currentFilter,
  countsByDate,
}: {
  currentDate: string;
  currentFilter: string;
  countsByDate: Record<string, number>;
}) {
  const router = useRouter();
  const today = getTodayString();
  const [weekStart, setWeekStart] = useState(() => getWeekStart(currentDate));
  const weekDays = Array.from({ length: 7 }, (_, i) => shiftDate(weekStart, i));

  function selectDate(date: string) {
    router.push(`/todos?date=${date}&filter=${currentFilter}`);
  }

  return (
    <div className="bg-surface border border-border rounded-[16px] p-3 mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekStart(shiftDate(weekStart, -7))}
          aria-label="이전 주"
          className="w-9 h-9 flex items-center justify-center border border-border rounded-[6px] text-text-muted text-xl hover:bg-primary-bg hover:text-primary hover:border-primary transition-colors"
        >
          ‹
        </button>

        <div className="flex gap-1">
          {weekDays.map((date) => {
            const d = new Date(date + "T00:00:00");
            const isSelected = date === currentDate;
            const isToday = date === today;
            const count = countsByDate[date] ?? 0;

            return (
              <button
                key={date}
                onClick={() => selectDate(date)}
                className={`flex flex-col items-center w-10 py-1.5 rounded-[10px] transition-colors ${
                  isSelected
                    ? "bg-primary text-white"
                    : isToday
                      ? "bg-primary-bg text-primary"
                      : "text-text-muted hover:bg-primary-bg hover:text-primary"
                }`}
              >
                <span className="text-xs">{DAY_NAMES[d.getDay()]}</span>
                <span className="text-sm font-semibold">{d.getDate()}</span>
                <span className="text-xs opacity-80">{count}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setWeekStart(shiftDate(weekStart, 7))}
          aria-label="다음 주"
          className="w-9 h-9 flex items-center justify-center border border-border rounded-[6px] text-text-muted text-xl hover:bg-primary-bg hover:text-primary hover:border-primary transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
}
