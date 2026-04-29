// ─── KORKEN-ÖKONOMIE ───────────────────────────────────────────────────────
//
// Zentrale Konfiguration aller Korken-Belohnungen. War vorher hartcodiert
// quer durch die Screens und zu großzügig — typisches Problem: 11 Multiple-
// Choice-Fragen pro Sitzung, gleiches Reward für triviale wie für
// Experten-Fragen.
//
// Neuer Ansatz:
//   1. Schwierigkeit zählt.        Level 1 → 1 Korken, 2 → 3, 3 → 6.
//   2. Daily Cap im Lernportal.   Max. 30 Korken / Tag aus Quiz und Vokabeln,
//                                 damit Sitzen-Bleiben nicht skaliert.
//   3. Daily Dose ist die Engagement-Schleife — exakt einmal pro Tag,
//                                 kein Cap, dafür kleinere Beträge.
//   4. Streak-Boni an festen Tagen, einmalig.
//
// Alle Werte hier zentralisiert, damit Balancing nur eine Datei braucht.

/** Grundbelohnung pro richtige Quiz-Antwort, abhängig vom Level. */
export const QUIZ_REWARDS = {
  1: 1, // Einsteiger
  2: 3, // Entdecker
  3: 6, // Experte
}

/** Belohnung pro gewusster Vokabel (Level wird aus card.level gelesen). */
export const VOCAB_REWARDS = {
  1: 1,
  2: 2,
  3: 4,
}

/**
 * Tageslimit für freie Lern-Modi (Vokabeln + Themen-Quizze).
 * Daily Dose und Winzer-Etiketten zählen NICHT auf diesen Cap —
 * das sind eigene Engagement-Schleifen.
 */
export const DAILY_LEARN_CAP = 30

/** Daily Dose: 10 Fragen quer durch alle Themen + festes Tagesgeschenk. */
export const DAILY_DOSE = {
  questions: 10,
  /** Korken pro richtiger Antwort (unabhängig von Level — Daily Dose ist gemischt). */
  perCorrect: 2,
  /** Bonus für Abschluss aller 10 Fragen, EINMAL pro Kalendertag. */
  completionBonus: 10,
}

/** Wissens-Check beim Onboarding — einmaliger Bonus auf Basis Trefferquote. */
export const QUIZ_RESULT_BONUS = {
  kenner: 15,    // ≥ 70 % richtig
  entdecker: 10, // ≥ 40 %
  einsteiger: 5,
}

/** Taste DNA: kleines Reward für Like/Super, motiviert ehrliche Auswahl. */
export const DNA_REWARDS = {
  perLike: 1,
  perSuper: 2,
}

/** Winzer Collection: pro neu gesammeltes Etikett (KEIN Cap — selten genug). */
export const WINZER_LABEL = 10

/** Streak-Meilensteine — einmalig je Tageszahl. */
export const STREAK_BONUSES = [
  { days: 7,  bonus: 10 },
  { days: 14, bonus: 25 },
  { days: 30, bonus: 75 },
  { days: 60, bonus: 150 },
  { days: 90, bonus: 300 },
]

/** Findet den Streak-Bonus für genau diese Tagesanzahl, oder null. */
export function getStreakBonus(days) {
  return STREAK_BONUSES.find((b) => b.days === days) || null
}

/** Helper: Korken-Wert einer Quizfrage anhand ihres Level-Felds. */
export function corksForQuestion(question) {
  return QUIZ_REWARDS[question?.level] || QUIZ_REWARDS[1]
}

/** Helper: Korken-Wert einer Vokabel anhand ihres Level-Felds. */
export function corksForVocab(card) {
  return VOCAB_REWARDS[card?.level] || VOCAB_REWARDS[1]
}
