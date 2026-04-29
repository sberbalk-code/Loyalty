import { colors } from '../theme'

// ─── TIER CONFIGURATION ─────────────────────────────────────────────────────

export const TIERS = [
  {
    id: 1,
    roman: 'I',
    name: 'Weinliebhaber',
    color: colors.green,
    min12m: 0,
    max12m: 299,
    tagline: 'Der Beginn einer Reise.',
    benefits: [
      'Vollständiger Zugang zum Lernportal',
      'Persönliches Wein-DNA Profil',
      'Wöchentliche Weinempfehlungen',
      'Daily Dose & Streaks',
    ],
  },
  {
    id: 2,
    roman: 'II',
    name: 'Weinentdecker',
    color: colors.blue,
    min12m: 300,
    max12m: 2499,
    tagline: 'Du weißt was du willst.',
    benefits: [
      'Alles aus Level I',
      'Gratis Versand auf die erste Bestellung des Jahres',
      'Digitaler HAWESKO Weinkalender',
      'Einladung zu 1 regionalen Weinabend pro Jahr',
    ],
  },
  {
    id: 3,
    roman: 'III',
    name: 'Weinkenner',
    color: colors.gold,
    min12m: 2500,
    max12m: 7499,
    tagline: 'Ein Kenner. Kein Zufall.',
    benefits: [
      'Alles aus Level I & II',
      'Dauerhaft versandkostenfrei ab 49 €',
      'Einladungen zu exklusiven HAWESKO Verkostungsabenden',
      'Geburtstagsüberraschung: Probierflasche nach Hause',
      'Priority Kundenservice',
      '2 Winzer-Event Einladungen pro Jahr',
    ],
  },
  {
    id: 4,
    roman: 'IV',
    name: 'HAWESKO Sommelier',
    color: colors.red,
    min12m: 7500,
    max12m: Infinity,
    tagline: 'Die Creme de la Creme.',
    benefits: [
      'Alles aus Level I, II & III',
      'Persönliche 1:1 Sommelierberatung (jährlich)',
      'VIP-Einladungen zu Winzerreisen & exklusiven Tastings',
      'Vorab-Zugang zu limitierten Editionen',
      'Lebenslang versandkostenfrei',
      'Jährliches Weinabo nach Sommelierauswahl',
      'Namensnennung als HAWESKO Sommelier-Partner',
    ],
  },
]

// Streak bonuses are owned by `rewards.js` (single source of truth for the
// cork economy). Re-exported here to keep historical imports working.
export { STREAK_BONUSES, getStreakBonus } from './rewards'

const MAX_TIER_ID = TIERS.length

// ─── TIER QUERIES ───────────────────────────────────────────────────────────

/** Returns the tier object that matches the given 12-month cork count. */
export function getTier(corks12m) {
  return TIERS.find(t => corks12m >= t.min12m && corks12m <= t.max12m) || TIERS[0]
}

/** Returns the next tier object, or null if already at top. */
export function getNextTier(corks12m) {
  const current = getTier(corks12m)
  return current.id < MAX_TIER_ID ? TIERS[current.id] : null
}

/** Progress within the current tier as a 0–100 integer. */
export function getTierProgress(corks12m) {
  const current = getTier(corks12m)
  if (current.id === MAX_TIER_ID) return 100
  const span = current.max12m - current.min12m + 1
  const progress = ((corks12m - current.min12m) / span) * 100
  return Math.min(100, Math.max(0, Math.round(progress)))
}
