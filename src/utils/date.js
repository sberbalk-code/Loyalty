// ─── DATE UTILITIES ─────────────────────────────────────────────────────────

/** ISO date (YYYY-MM-DD) for "today" in local timezone. */
export function todayISO() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Returns the ISO date of yesterday relative to today. */
export function yesterdayISO() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Localized German short date for display, e.g. "28.04.2026". */
export function germanDate(date = new Date()) {
  return date.toLocaleDateString('de-DE')
}
