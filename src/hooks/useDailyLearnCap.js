import { usePersistedState } from './usePersistedState'
import { todayISO } from '../utils/date'

/**
 * Per-day cork cap on the free learning modes (vocab + topic quizzes).
 *
 * Why: Without a cap, a motivated user could grind 100+ correct answers in
 * an afternoon for triple-digit cork rewards — which devalues the rest of
 * the cork economy and breaks the tier curve. Daily Dose, streak bonuses,
 * and Winzer-Etikett rewards stay un-capped because they're either
 * once-per-day or genuinely scarce.
 *
 * The hook stores `{ date, earnedToday }` in localStorage. On a fresh
 * calendar day, `earnedToday` resets to 0 automatically.
 */
export function useDailyLearnCap(cap) {
  const [state, setState] = usePersistedState('hawesko.learnCap', {
    date: todayISO(),
    earnedToday: 0,
  })

  const today = todayISO()
  // Defensive: if the stored date is stale, treat earnedToday as 0.
  const earnedToday = state.date === today ? state.earnedToday : 0
  const remaining = Math.max(0, cap - earnedToday)
  const capReached = remaining === 0

  /**
   * Record `requested` corks worth of activity. Returns the actually-awarded
   * amount, which may be less than requested if the cap is hit mid-award.
   * Returning the awarded amount lets callers tell the user transparently
   * (e.g. "+3 (heute noch +1 möglich)").
   */
  function awardCorks(requested) {
    const currentEarned = state.date === today ? state.earnedToday : 0
    const remainingNow = Math.max(0, cap - currentEarned)
    const awarded = Math.min(requested, remainingNow)
    if (awarded > 0) {
      setState({ date: today, earnedToday: currentEarned + awarded })
    }
    return awarded
  }

  return { earnedToday, remaining, capReached, awardCorks }
}
