import { useEffect, useRef, useState } from 'react'

/**
 * Drop-in replacement for useState that persists to localStorage.
 * Survives reloads, but stays per-browser/device (no account, by design).
 *
 * - Reads once on mount; falls back to `initial` on parse errors or missing keys.
 * - Writes are debounced via React batching (no manual debounce needed).
 * - Storage failures (private mode, full quota) are swallowed, keeping the app usable.
 */
export function usePersistedState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return initial
      return JSON.parse(raw)
    } catch {
      return initial
    }
  })

  // Skip the very first effect run — we already initialized from storage.
  const isFirstRun = useRef(true)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* quota exceeded / private mode — ignore */
    }
  }, [key, value])

  return [value, setValue]
}
