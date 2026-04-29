import { useMemo, useState } from 'react'
import { colors, fonts } from '../theme'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { Button } from '../components/Button'
import { ProgressBar } from '../components/ProgressBar'
import { CorkBadge } from '../components/CorkBadge'
import { CategoryTag } from '../components/CategoryTag'
import { EyebrowLabel } from '../components/EyebrowLabel'
import { QuizEngine } from '../components/QuizEngine'
import { CORK_IMG } from '../assets/cork'
import { shuffle } from '../utils/shuffle'
import { REGIONEN_Q, REBSORTEN_Q, FOOD_Q, DEGUSTATION_Q } from '../data/quiz'
import { VOCAB } from '../data/vocab'
import { corksForVocab, DAILY_LEARN_CAP } from '../data/rewards'

const QUIZ_TOPICS = {
  regionen:    { questions: REGIONEN_Q,    title: 'Regionen der Welt' },
  rebsorten:   { questions: REBSORTEN_Q,   title: 'Rebsorten' },
  food:        { questions: FOOD_Q,        title: 'Food Pairing' },
  degustation: { questions: DEGUSTATION_Q, title: 'Degustation' },
}

const MENU_ITEMS = [
  { id: 'vocab',       roman: 'I',   title: 'Wein-Vokabeln',    sub: `${VOCAB.length} Begriffe · 1–4 Korken pro Karte (level-abhängig)` },
  { id: 'regionen',    roman: 'II',  title: 'Regionen der Welt', sub: `${REGIONEN_Q.length} Fragen über drei Schwierigkeitsstufen` },
  { id: 'rebsorten',   roman: 'III', title: 'Rebsorten',        sub: `${REBSORTEN_Q.length} Fragen über drei Schwierigkeitsstufen` },
  { id: 'food',        roman: 'IV',  title: 'Food Pairing',     sub: `${FOOD_Q.length} Fragen über drei Schwierigkeitsstufen` },
  { id: 'degustation', roman: 'V',   title: 'Degustation',      sub: `${DEGUSTATION_Q.length} Fragen über drei Schwierigkeitsstufen` },
]

const LEVEL_OPTIONS = [
  { id: 1,    label: 'Einsteiger', sub: '1 Korken pro richtiger Antwort',  color: colors.green },
  { id: 2,    label: 'Entdecker',  sub: '3 Korken pro richtiger Antwort',  color: colors.blue  },
  { id: 3,    label: 'Experte',    sub: '6 Korken pro richtiger Antwort',  color: colors.red   },
  { id: null, label: 'Alle Stufen', sub: 'Gemischter Schwierigkeitsgrad',  color: colors.gold  },
]

/**
 * LearnScreen — three-state machine
 *
 *   menu  → user picks a lesson type
 *           ├─ vocab        → vocab flashcards (no level pre-selection;
 *           │                  reward per card depends on card.level)
 *           └─ regionen | rebsorten | food | degustation
 *                          → first show difficulty picker
 *                          → then run QuizEngine with the chosen levelFilter
 *
 * The `awardCorks` prop comes from `useDailyLearnCap` in App.jsx and enforces
 * the daily cap automatically. If the cap is hit mid-session the QuizEngine
 * shows "(Tageslimit)" next to the cork count.
 */
export function LearnScreen({ corks, awardCorks, capRemaining, onBack }) {
  const [view, setView] = useState('menu')
  const [topicId, setTopicId] = useState(null)
  const [levelFilter, setLevelFilter] = useState(null)

  // Vocab flow
  if (view === 'vocab') {
    return (
      <VocabFlashcards
        corks={corks}
        awardCorks={awardCorks}
        onBack={() => setView('menu')}
        onFinish={onBack}
      />
    )
  }

  // Quiz flow — running questions
  if (view === 'quiz' && topicId && QUIZ_TOPICS[topicId]) {
    const topic = QUIZ_TOPICS[topicId]
    return (
      <Screen>
        <TopBar onBack={() => setView('level')} right={<CorkBadge count={corks} small />} />
        <QuizEngine
          questions={topic.questions}
          title={topic.title}
          levelFilter={levelFilter}
          awardCorks={awardCorks}
          onDone={() => {
            setView('menu')
            setTopicId(null)
            setLevelFilter(null)
          }}
        />
      </Screen>
    )
  }

  // Quiz flow — picking a difficulty
  if (view === 'level' && topicId && QUIZ_TOPICS[topicId]) {
    const topic = QUIZ_TOPICS[topicId]
    return (
      <Screen>
        <TopBar onBack={() => { setView('menu'); setTopicId(null) }} right={<CorkBadge count={corks} small />} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px' }}>
          <EyebrowLabel style={{ marginBottom: 4 }}>Schwierigkeit wählen</EyebrowLabel>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 22,
              color: colors.black,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            {topic.title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: colors.grayMid,
              fontFamily: fonts.body,
              marginBottom: 18,
              lineHeight: 1.6,
            }}
          >
            Höhere Stufen geben mehr Korken — aber die Fragen sitzen tiefer.
          </div>

          {LEVEL_OPTIONS.map((opt) => {
            const count = opt.id == null
              ? topic.questions.length
              : topic.questions.filter((q) => q.level === opt.id).length
            return (
              <button
                key={String(opt.id)}
                onClick={() => { setLevelFilter(opt.id); setView('quiz') }}
                disabled={count === 0}
                style={{
                  width: '100%',
                  background: colors.white,
                  borderRadius: 4,
                  padding: '14px 16px',
                  marginBottom: 9,
                  border: `1px solid ${colors.grayLine}`,
                  borderLeft: `4px solid ${opt.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: count === 0 ? 'not-allowed' : 'pointer',
                  opacity: count === 0 ? 0.45 : 1,
                  textAlign: 'left',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: fonts.display, fontSize: 15, color: colors.black, fontWeight: 600 }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 11, color: colors.grayMid, fontFamily: fonts.body, marginTop: 2 }}>
                    {opt.sub} · {count} {count === 1 ? 'Frage' : 'Fragen'}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 9,
                    background: opt.color,
                    color: colors.white,
                    borderRadius: 2,
                    padding: '3px 8px',
                    fontFamily: fonts.body,
                    fontWeight: 600,
                  }}
                >
                  Starten
                </span>
              </button>
            )
          })}
        </div>
      </Screen>
    )
  }

  // Menu (default)
  const capWarning = capRemaining === 0
    ? 'Tageslimit erreicht — neue Korken gibt es ab morgen wieder.'
    : capRemaining < 10
      ? `Heute noch ${capRemaining} Korken aus Lernportal möglich.`
      : null

  return (
    <Screen>
      <TopBar onBack={onBack} right={<CorkBadge count={corks} small />} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px' }}>
        <EyebrowLabel style={{ marginBottom: 4 }}>Lernen</EyebrowLabel>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 22,
            color: colors.black,
            fontWeight: 600,
            marginBottom: capWarning ? 8 : 20,
          }}
        >
          Wähle eine Lektion.
        </div>

        {capWarning && (
          <div
            style={{
              background: capRemaining === 0 ? colors.feedback.errorBg : colors.cream,
              border: `1px solid ${capRemaining === 0 ? 'rgba(155,27,48,0.25)' : 'rgba(196,150,42,0.30)'}`,
              borderRadius: 4,
              padding: '9px 12px',
              fontSize: 11,
              color: capRemaining === 0 ? colors.red : colors.grayDark,
              fontFamily: fonts.body,
              marginBottom: 16,
              lineHeight: 1.5,
            }}
          >
            {capWarning}
          </div>
        )}

        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'vocab') setView('vocab')
              else { setTopicId(item.id); setView('level') }
            }}
            style={{
              width: '100%',
              background: colors.white,
              borderRadius: 4,
              padding: '13px 16px',
              marginBottom: 9,
              border: `1px solid ${colors.grayLine}`,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 3,
                background: colors.cream,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fonts.display,
                fontSize: 11,
                color: colors.red,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {item.roman}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fonts.display, fontSize: 15, color: colors.black, fontWeight: 600 }}>
                {item.title}
              </div>
              <div style={{ fontSize: 11, color: colors.grayMid, fontFamily: fonts.body, marginTop: 1 }}>
                {item.sub}
              </div>
            </div>
            <span
              style={{
                fontSize: 9,
                background: colors.red,
                color: colors.white,
                borderRadius: 2,
                padding: '3px 8px',
                fontFamily: fonts.body,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              Starten
            </span>
          </button>
        ))}

        <div
          style={{
            marginTop: 18,
            fontSize: 10,
            color: colors.grayLight,
            fontFamily: fonts.body,
            lineHeight: 1.6,
          }}
        >
          Tageslimit Lernportal: {DAILY_LEARN_CAP} Korken. Daily Dose, Streaks und Winzer-Etiketten zählen separat.
        </div>
      </div>
    </Screen>
  )
}

// ─── VOCAB FLASHCARDS ──────────────────────────────────────────────────────

function VocabFlashcards({ corks, awardCorks, onBack, onFinish }) {
  const cards = useMemo(() => shuffle(VOCAB), [])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [answered, setAnswered] = useState(null)
  const [lastAward, setLastAward] = useState(0)
  const [totalEarned, setTotalEarned] = useState(0)

  const isDone = index >= cards.length

  function reset() {
    setIndex(0)
    setFlipped(false)
    setAnswered(null)
    setLastAward(0)
    setTotalEarned(0)
    onBack()
  }

  if (isDone) {
    return (
      <Screen>
        <TopBar onBack={reset} right={<CorkBadge count={corks} small />} />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '36px 28px',
            textAlign: 'center',
          }}
        >
          <div style={{ width: 1, height: 36, background: colors.red, margin: '0 auto 22px' }} />
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 24,
              color: colors.black,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Alle Vokabeln gelernt.
          </div>
          <div
            style={{
              fontSize: 13,
              color: colors.grayMid,
              fontFamily: fonts.body,
              marginBottom: 26,
              lineHeight: 1.7,
            }}
          >
            {cards.length} Karten durchgearbeitet
          </div>
          <div
            style={{
              background: colors.cream,
              border: '1px solid rgba(196,150,42,0.22)',
              borderRadius: 4,
              padding: '14px 32px',
              marginBottom: 26,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              justifyContent: 'center',
            }}
          >
            <img src={CORK_IMG} alt="" aria-hidden="true" style={{ width: 22, height: 13 }} />
            <span style={{ fontFamily: fonts.display, fontSize: 24, color: colors.gold, fontWeight: 700 }}>
              +{totalEarned}
            </span>
          </div>
          <Button onClick={onFinish}>Zurück zum Überblick</Button>
        </div>
      </Screen>
    )
  }

  const card = cards[index]
  const cardReward = corksForVocab(card)

  function handleNext() {
    if (index + 1 >= cards.length) {
      setIndex(cards.length)
    } else {
      setIndex((i) => i + 1)
      setFlipped(false)
      setAnswered(null)
      setLastAward(0)
    }
  }

  function handleCorrect() {
    const awarded = awardCorks(cardReward)
    setLastAward(awarded)
    setTotalEarned((t) => t + awarded)
    setAnswered('correct')
  }

  return (
    <Screen>
      <TopBar onBack={reset} right={<CorkBadge count={corks} small />} />
      <div style={{ padding: '0 22px 10px' }}>
        <ProgressBar value={(index / cards.length) * 100} thin />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px 20px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <CategoryTag category={card.cat} />
          <span style={{ fontSize: 10, color: colors.grayLight, fontFamily: fonts.body }}>
            {index + 1} / {cards.length}
          </span>
        </div>

        <div
          onClick={() => !answered && setFlipped((f) => !f)}
          role="button"
          tabIndex={0}
          aria-label={flipped ? 'Definition anzeigen' : 'Karte umdrehen'}
          onKeyDown={(e) => e.key === 'Enter' && !answered && setFlipped((f) => !f)}
          style={{
            flex: 1,
            maxHeight: 300,
            cursor: answered ? 'default' : 'pointer',
            perspective: 1000,
            position: 'relative',
            marginBottom: 14,
          }}
        >
          {/* Front */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: colors.white,
              border: `1px solid ${colors.grayLine}`,
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 26,
              textAlign: 'center',
              backfaceVisibility: 'hidden',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.42s ease',
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 28,
                color: colors.black,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              {card.word}
            </div>
            <div style={{ fontSize: 12, color: colors.grayMid, fontFamily: fonts.body }}>
              Level {card.level} · +{cardReward} Korken
            </div>
            {!flipped && (
              <div
                style={{
                  marginTop: 16,
                  fontSize: 11,
                  color: colors.grayLight,
                  fontFamily: fonts.body,
                  border: `1px dashed ${colors.grayLine}`,
                  borderRadius: 3,
                  padding: '5px 14px',
                  letterSpacing: '0.05em',
                }}
              >
                Tippen zum Aufdecken
              </div>
            )}
          </div>

          {/* Back */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: colors.white,
              border: `1px solid ${colors.grayLine}`,
              borderLeft: `4px solid ${colors.red}`,
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 22,
              backfaceVisibility: 'hidden',
              overflowY: 'auto',
              transform: flipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
              transition: 'transform 0.42s ease',
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            }}
          >
            <EyebrowLabel style={{ marginBottom: 8 }}>Definition</EyebrowLabel>
            <div
              style={{
                fontSize: 13,
                color: colors.black,
                lineHeight: 1.75,
                marginBottom: 14,
                fontFamily: fonts.body,
              }}
            >
              {card.def}
            </div>
            <div style={{ background: colors.cream, borderRadius: 3, padding: '10px 12px' }}>
              <div
                style={{
                  fontSize: 9,
                  color: colors.grayMid,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: 4,
                  fontFamily: fonts.body,
                }}
              >
                Beispiel
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: colors.grayDark,
                  fontStyle: 'italic',
                  lineHeight: 1.65,
                  fontFamily: fonts.body,
                }}
              >
                {card.example}
              </div>
            </div>
          </div>
        </div>

        {flipped && answered === null && (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              onClick={() => setAnswered('wrong')}
              variant="ghost"
              style={{ flex: 1, borderColor: 'rgba(155,27,48,0.25)', color: colors.red }}
            >
              ✗ Nochmal
            </Button>
            <Button onClick={handleCorrect} style={{ flex: 1 }}>
              ✓ Gewusst · +{cardReward}
            </Button>
          </div>
        )}

        {answered !== null && (
          <div>
            <div
              style={{
                padding: '10px 14px',
                background: answered === 'correct' ? colors.feedback.successBg : colors.feedback.errorBg,
                borderRadius: 4,
                marginBottom: 10,
                fontSize: 13,
                color: answered === 'correct' ? colors.green : colors.red,
                fontFamily: fonts.body,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {answered === 'correct' ? (
                <>
                  <span>Gewusst.</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <img src={CORK_IMG} alt="" aria-hidden="true" style={{ width: 14, height: 9 }} />
                    <span style={{ fontWeight: 700 }}>+{lastAward}</span>
                    {lastAward < cardReward && (
                      <span style={{ fontSize: 10, color: colors.grayMid, marginLeft: 4 }}>(Tageslimit)</span>
                    )}
                  </div>
                </>
              ) : (
                'Kommt in der nächsten Runde wieder.'
              )}
            </div>
            <Button onClick={handleNext}>
              {index + 1 >= cards.length ? 'Lektion abschließen' : 'Nächste Karte'}
            </Button>
          </div>
        )}
      </div>
    </Screen>
  )
}
