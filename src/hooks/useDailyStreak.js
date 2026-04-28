import { usePersistedState } from './usePersistedState'
import { todayISO, yesterdayISO } from '../utils/date'

/**
 * Daily streak that cannot be farmed.
 *
 * Rules:
 * - Streak only increments once per local calendar day.
 * - If the user skips a day, the streak resets to 1 on next completion.
 * - `canCompleteToday` reflects whether today's dose is still open.
 *
 * Persists across reloads via localStorage.
 */
export function useDailyStreak() {
  const [state, setState] = usePersistedState('hawesko.streak', {
    days: 0,
    lastCompletedDate: null,
  })

  const today = todayISO()
  const canCompleteToday = state.lastCompletedDate !== today

  /**
   * Mark today's dose complete. Returns the new streak length, or null
   * if today was already completed (so callers don't double-pay bonuses).
   */
  function completeToday() {
    if (state.lastCompletedDate === today) return null

    const yesterday = yesterdayISO()
    const isContinuation = state.lastCompletedDate === yesterday
    const newDays = isContinuation ? state.days + 1 : 1

    setState({ days: newDays, lastCompletedDate: today })
    return newDays
  }

  return {
    days: state.days,
    canCompleteToday,
    completeToday,
  }
}
