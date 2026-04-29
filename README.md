# HAWESKO Sommelier

Refaktorierte Version der App. Mehr als 200 Quizfragen über drei Schwierigkeitsstufen, neu balancierte Korken-Ökonomie, Tap-zum-Drehen auf den Wein-Karten mit direktem HAWESKO-Kaufen-Button.

## Entwicklung

```bash
npm install
npm run dev
```

## Was diese Version neu hat

### Schwierigkeitsstufen für jedes Quiz
Jede Quizfrage hat jetzt einen Level: **1 Einsteiger · 2 Entdecker · 3 Experte**. Pro Kategorie sind mindestens 50 Fragen verfügbar (Regionen 51, Rebsorten 51, Food Pairing 50, Degustation 50 — insgesamt 202). Vor dem Start eines Themen-Quiz wählst du die Schwierigkeit, oder spielst alle Stufen gemischt.

### Neu balancierte Korken-Ökonomie
Die alte Belohnung war zu großzügig und alle Fragen zahlten gleich. Jetzt:

| Aktion                         | Korken                          |
|--------------------------------|---------------------------------|
| Quiz Level 1 (Einsteiger)      | 1 pro richtige Antwort          |
| Quiz Level 2 (Entdecker)       | 3 pro richtige Antwort          |
| Quiz Level 3 (Experte)         | 6 pro richtige Antwort          |
| Vokabel-Karte                  | 1–4 (level-abhängig)            |
| Daily Dose                     | 2 pro Frage + 10 Abschlussbonus |
| Streak-Meilensteine            | 7d=10, 14d=25, 30d=75, 60d=150, 90d=300 |
| Winzer-Etikett                 | 10 (einmalig pro Etikett)       |
| Wissens-Check (Onboarding)     | 5 / 10 / 15 nach Trefferquote   |
| Taste DNA Like / Super-Like    | 1 / 2                           |

**Tageslimit Lernportal: 30 Korken.** Vokabeln und Themen-Quiz teilen sich diesen Cap — es lässt sich also nicht mehr beliebig farmen. Daily Dose, Streak-Boni und Winzer-Etiketten zählen NICHT auf den Cap, weil sie natürlich rate-limitiert sind (einmal pro Tag bzw. selten).

### Tap-zum-Drehen auf Wein-Karten
In `Discover` und `Taste DNA` kannst du jetzt jede Karte antippen, um sie zu drehen. Auf der Rückseite stehen Pairing, Trinktemperatur, Lagerpotential, Preis — und ein **„Bei HAWESKO kaufen →"-Button**, der direkt zur HAWESKO-Suchseite führt. Swipen funktioniert weiter wie zuvor (rechts = vormerken, links = nein, hoch = sehr gerne); der Tap wird sauber von der Geste unterschieden.

## Projektstruktur

```
src/
├── App.jsx                       # Root: state, persistence, screen routing
├── main.jsx                      # ReactDOM entry
├── index.css                     # Global reset + CSS tokens
├── theme.js                      # JS design tokens (colors, fonts, layout)
│
├── assets/
│   ├── backgrounds.js            # Embedded base64 wine-color backgrounds
│   └── cork.js                   # Embedded base64 cork icon
│
├── data/
│   ├── wineTypes.js              # WINE_TYPE constants (single source of truth)
│   ├── wines.js                  # HAWESKO_WINES catalog + DNA_WINES subset
│   ├── winzer.js                 # WINZER_DATA + getPairingsForWine()
│   ├── tiers.js                  # TIERS + getTier (re-exports streak from rewards)
│   ├── rewards.js                # Cork economy: levels, daily cap, streaks
│   ├── quiz.js                   # 202 questions across 4 categories × 3 levels
│   ├── vocab.js                  # VOCAB flashcards
│   └── communities.js            # COMMUNITIES seed data
│
├── hooks/
│   ├── usePersistedState.js      # Drop-in useState that persists to localStorage
│   ├── useDailyStreak.js         # Per-day-tracked streak (cannot be farmed)
│   ├── useDailyLearnCap.js       # Per-day cap on free Lernportal corks
│   └── useSafeFileReader.js      # FileReader that no-ops if unmounted
│
├── utils/
│   ├── shuffle.js                # Pure Fisher–Yates
│   └── date.js                   # ISO + German date helpers
│
├── components/                   # Reusable UI primitives
│   ├── Screen.jsx                # Phone-shaped frame
│   ├── TopBar.jsx                # Header w/ back button or logo
│   ├── Logo.jsx
│   ├── Button.jsx                # Variants: red, gold, ghost, dark
│   ├── CorkBadge.jsx
│   ├── ProgressBar.jsx
│   ├── EyebrowLabel.jsx          # The repeated uppercase-tracked label
│   ├── CategoryTag.jsx           # Vocab category pill
│   ├── BottomSheet.jsx           # Reusable modal
│   ├── SwipeCard.jsx             # Tinder-style card with tap-to-flip details
│   ├── SwipeButtons.jsx          # Fallback action row
│   ├── QuizEngine.jsx            # Multi-question quiz runner
│   └── icons/
│       ├── WineGlassIcon.jsx
│       └── BottleSilhouette.jsx
│
└── screens/                      # One file per app screen
    ├── WelcomeScreen.jsx
    ├── WissensCheckScreen.jsx
    ├── QuizResultScreen.jsx
    ├── TasteDNAScreen.jsx
    ├── DNAResultScreen.jsx
    ├── HomeScreen.jsx
    ├── DailyDoseScreen.jsx
    ├── LearnScreen.jsx
    ├── DiscoverScreen.jsx
    ├── WinzerCollectionScreen.jsx
    ├── WeinkellerScreen.jsx
    ├── StatusScreen.jsx
    └── CommunityScreen.jsx
```

## Was sich gegenüber der Original-`App.jsx` geändert hat

### Bugfixes

| Bug                                                     | Lokation                          | Fix                                                                                       |
| ------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------- |
| Streak konnte trivial gefarmt werden                    | `DailyDoseScreen`                 | `useDailyStreak` mit `lastCompletedDate`-Check. Bonus nur einmal pro Tag.                 |
| `useMemo` ohne richtige Deps in `QuizEngine`            | `QuizEngine`                      | Deps korrekt auf `[questions]` gesetzt — Topic-Wechsel re-shuffelt jetzt.                 |
| `consumed`-Liste verschwand bei Navigation              | `WeinkellerScreen`                | Auf App-Level gehoben (`usePersistedState`).                                              |
| File-Input feuerte bei gleicher Datei nicht             | `WinzerCollectionScreen`          | `e.target.value = ''` nach Read.                                                          |
| Cork-Badge zeigte `liked.length` statt `corks`          | `DiscoverScreen`                  | Korrekt auf `corks` umgestellt.                                                           |
| State ging bei Reload verloren                          | App-weit                          | Alles via `usePersistedState` (localStorage).                                             |
| FileReader-Race bei Unmount                             | `WinzerCollectionScreen`          | `useSafeFileReader` mit Mount-Ref.                                                        |
| Tippfehler `Hartäse`                                    | `wines.js` Wein #10               | → `Hartkäse`.                                                                             |
| Pairing via fragiler `name.includes(...)`-Heuristik     | `WinzerCollectionScreen`          | Jeder Wein hat jetzt `type`. `getPairingsForWine` mappt sauber.                           |
| `user-scalable=no` (WCAG-Verstoß)                       | `index.html`                      | Entfernt — Zoom wieder erlaubt.                                                           |

### Wartbarkeit

- **1641 Zeilen → ~25 Module.** Jede Datei hat eine Verantwortung.
- **Keine 600-Zeichen-Einzeiler mehr.** Prettier-konforme Formatierung durchgehend.
- **Design-Tokens an einer Stelle** (`theme.js`). Die `H`-Object-Konstante taucht nicht mehr in jedem Screen lokal auf.
- **`EyebrowLabel`-Komponente** ersetzt die ~30× kopierten `fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase'`-Style-Blöcke.
- **`BottomSheet`-Komponente** vereint die drei Modal-Implementierungen (Add Wine, Note, Create Community).
- **`useCallback`-Import entfernt** (war nirgends benutzt).
- **Tote CSS-Animationen entfernt** (`fade-up`, `fade-in`, `pop-in`, `slideUp`, `pulse` waren definiert, aber nirgends genutzt).

### Accessibility

- `aria-label` auf allen Icon-only Buttons (Back, Close, +/-, Like, Reply, etc.).
- Klickbare `<div>`s wurden zu `<button>`s oder bekamen `role="button"` + `tabIndex` + Keyboard-Handler.
- Focus-Ringe via `:focus-visible` (Tastatur-Navigation funktioniert).
- Native Mouse-Events auf `SwipeCard` zusätzlich zu Touch — die App ist jetzt auch auf Desktop voll bedienbar.

## Wo der Code noch besser werden könnte (für eine Zukunfts-Iteration)

- **Bundle-Größe:** Die Hintergrund-Bilder liegen als ~50 KB Base64 pro Datei in `assets/backgrounds.js`. Wenn man sie als echte JPEGs in `src/assets/img/` ablegt und importiert, hashed Vite sie automatisch und sie laden parallel statt das Main-Bundle aufzublähen. Habe sie hier bewusst gelassen, um den ursprünglichen "instant load, zero network"-Ansatz zu respektieren.
- **Inline-Styles:** Auch nach dem Refactor nutzt jeder Screen noch Inline-Styles. Für eine richtig große App wäre Tailwind oder CSS-Modules der nächste Schritt.
- **Tests:** Keine. `usePersistedState`, `useDailyStreak` und `getTier` wären die ersten Kandidaten für Vitest-Unit-Tests.
- **TypeScript:** Wäre für die `WINE_TYPE`-Constants und die Daten-Module ein klarer Gewinn.
