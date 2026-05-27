import { useCallback, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

// ─── useDailyReset ────────────────────────────────────────────────────────
// Calls onReset() whenever the calendar date changes.
// Works two ways:
//   1. App comes to foreground — compares today's date to the last known date.
//      Covers: user opens app the next morning, phone wakes from sleep, etc.
//   2. Midnight timer — fires exactly at 00:00 if the app is open all night.
//      Covers: edge case where app stays active across midnight.
//
// Usage:
//   useDailyReset(() => refetchTodayNutrition());

export const useDailyReset = (onReset: () => void) => {
  const lastDateRef = useRef<string>(getTodayString());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onResetRef = useRef(onReset);

  // Keep callback ref fresh so hook doesn't need onReset in deps
  useEffect(() => {
    onResetRef.current = onReset;
  }, [onReset]);

  // ── Check if date has changed ────────────────────────────────────────
  const checkDateChange = useCallback(() => {
    const today = getTodayString();
    if (today !== lastDateRef.current) {
      lastDateRef.current = today;
      onResetRef.current();
    }
  }, []);

  // ── Midnight timer — fires at exactly 00:00 ──────────────────────────
  const scheduleMidnightTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 5, 0); // 00:00:05 — 5s buffer to be safe

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    timerRef.current = setTimeout(() => {
      lastDateRef.current = getTodayString();
      onResetRef.current();
      // Reschedule for the next midnight
      scheduleMidnightTimer();
    }, msUntilMidnight);
  }, []);

  // ── AppState listener — fires when app comes to foreground ───────────
  useEffect(() => {
    scheduleMidnightTimer();

    const subscription = AppState.addEventListener(
      "change",
      (state: AppStateStatus) => {
        if (state === "active") {
          checkDateChange();
          // Reschedule timer in case phone was asleep across midnight
          scheduleMidnightTimer();
        }
      },
    );

    return () => {
      subscription.remove();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [checkDateChange, scheduleMidnightTimer]);
};

// ─── Helper ───────────────────────────────────────────────────────────────
const getTodayString = (): string => new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
