// ─── WINE TYPE CONSTANTS ────────────────────────────────────────────────────
// Use these instead of string literals everywhere a wine type is checked.
// This makes refactors trivial and catches typos at import time.

export const WINE_TYPE = {
  WEISS: 'Weißwein',
  ROT: 'Rotwein',
  ROSE: 'Roséwein',
  CHAMPAGNER: 'Champagner',
}

export const BG_KEY = {
  WEISS: 'weiss',
  ROT: 'rot',
  ROSE: 'rose',
  CHAMPAGNER: 'champagner',
}
