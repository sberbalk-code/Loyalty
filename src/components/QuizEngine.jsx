import { useMemo, useState } from 'react'
import { colors, fonts } from '../theme'
import { CORK_IMG } from '../assets/cork'
import { shuffle } from '../utils/shuffle'
import { Button } from './Button'
import { ProgressBar } from './ProgressBar'
import { EyebrowLabel } from './EyebrowLabel'
import { corksForQuestion } from '../data/rewards'

const MAX_QUESTIONS = 25

const LEVEL_INFO = {
  1: { label: 'Einsteiger', color: colors.green },
  2: { label: 'Entdecker',  color: colors.blue },
  3: { label: 'Experte',    color: colors.red  },
}

/**
 * Multi-question quiz engine.
 *
 * Belohnung pro richtiger Antwort kommt aus `question.level`
 * (`corksForQuestion`). Caller kann `awardCorks(n)` (Cap-respektierend)
 * ODER `onAddCorks(n)` (uncapped) übergeben — `awardCorks` gewinnt, falls
 * beide gesetzt sind, und gibt den tatsächlich vergebenen Betrag zurück.
 *
 * `levelFilter` filtert die Fragen optional auf einen Schwierigkeitsgrad
 * (1, 2 oder 3). Ohne Filter werden alle Levels gemischt.
 */
export function QuizEngine({
  questions,
  title,
  onDone,
  onAddCorks,
  awardCorks,
  levelFilter = null,
}) {
  const preparedQuestions = useMemo(() => {
    const filtered = levelFilter
      ? questions.filter((q) => q.level === levelFilter)
      : questions
    return shuffle(filtered)
      .slice(0, Math.min(filtered.length, MAX_QUESTIONS))
      .map((q) => {
        const options = shuffle([q.correct, ...q.wrong])
        return { ...q, options, correctIndex: options.indexOf(q.correct) }
      })
  }, [questions, levelFilter])

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [totalEarned, setTotalEarned] = useState(0)
  const [lastAward, setLastAward] = useState(null)

  if (preparedQuestions.length === 0) {
    return (
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
        <div style={{ fontFamily: fonts.display, fontSize: 18, color: colors.black, fontWeight: 600, marginBottom: 12 }}>
          Keine Fragen für diese Stufe.
        </div>
        <Button onClick={onDone} variant="ghost">Zurück</Button>
      </div>
    )
  }

  const current = preparedQuestions[index]
  const hasAnswered = selected !== null

  function handleSelect(optionIndex) {
    if (hasAnswered) return
    setSelected(optionIndex)
    if (optionIndex === current.correctIndex) {
      setScore((s) => s + 1)
      const corksValue = corksForQuestion(current)
      let awarded
      if (awardCorks) {
        awarded = awardCorks(corksValue)
      } else {
        onAddCorks(corksValue)
        awarded = corksValue
      }
      setTotalEarned((t) => t + awarded)
      setLastAward({ requested: corksValue, awarded })
    }
  }

  function handleNext() {
    if (index + 1 >= preparedQuestions.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
      setLastAward(null)
    }
  }

  if (done) {
    return (
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
          Abgeschlossen.
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
          {score} von {preparedQuestions.length} richtig
        </div>
        <RewardChip corks={totalEarned} />
        <Button onClick={onDone}>Zurück zur Auswahl</Button>
      </div>
    )
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        padding: '16px 22px',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <EyebrowLabel>{title}</EyebrowLabel>
          <LevelBadge level={current.level} />
        </div>
        <ProgressBar value={(index / preparedQuestions.length) * 100} thin />
        <div
          style={{
            fontSize: 10,
            color: colors.grayLight,
            fontFamily: fonts.body,
            marginTop: 5,
            textAlign: 'right',
          }}
        >
          {index + 1} / {preparedQuestions.length}
        </div>
      </div>

      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 19,
          color: colors.black,
          fontWeight: 600,
          lineHeight: 1.4,
          marginBottom: 20,
        }}
      >
        {current.q}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
        {current.options.map((option, i) => (
          <AnswerButton
            key={i}
            option={option}
            index={i}
            isCorrect={i === current.correctIndex}
            isSelected={selected === i}
            hasAnswered={hasAnswered}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {hasAnswered && (
        <div style={{ marginTop: 12 }}>
          <FeedbackBanner
            wasCorrect={selected === current.correctIndex}
            correctText={current.options[current.correctIndex]}
            lastAward={lastAward}
          />
          <Button onClick={handleNext}>
            {index + 1 >= preparedQuestions.length ? 'Abschließen' : 'Weiter'}
          </Button>
        </div>
      )}
    </div>
  )
}

function LevelBadge({ level }) {
  const info = LEVEL_INFO[level] || LEVEL_INFO[1]
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        background: info.color + '18',
        color: info.color,
        borderRadius: 2,
        padding: '2px 8px',
        fontFamily: fonts.body,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {info.label}
    </span>
  )
}

function AnswerButton({ option, index, isCorrect, isSelected, hasAnswered, onSelect }) {
  let background = colors.white
  let border = `1.5px solid ${colors.grayLine}`
  let textColor = colors.black

  if (hasAnswered) {
    if (isCorrect) {
      background = colors.feedback.successBg
      border = `2px solid ${colors.green}`
      textColor = colors.green
    } else if (isSelected) {
      background = colors.feedback.errorBg
      border = `2px solid ${colors.red}`
      textColor = colors.red
    }
  }

  return (
    <button
      onClick={() => onSelect(index)}
      disabled={hasAnswered}
      style={{
        padding: '13px 16px',
        borderRadius: 4,
        background,
        border,
        color: textColor,
        fontSize: 13,
        fontFamily: fonts.body,
        textAlign: 'left',
        cursor: hasAnswered ? 'default' : 'pointer',
        transition: 'all 0.18s',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span>{option}</span>
      {hasAnswered && isCorrect && <span style={{ fontWeight: 700 }}>✓</span>}
      {hasAnswered && isSelected && !isCorrect && <span style={{ fontWeight: 700 }}>✗</span>}
    </button>
  )
}

function FeedbackBanner({ wasCorrect, correctText, lastAward }) {
  if (!wasCorrect) {
    return (
      <div
        style={{
          padding: '10px 14px',
          background: colors.feedback.errorBg,
          borderRadius: 4,
          marginBottom: 10,
          fontSize: 13,
          color: colors.red,
          fontFamily: fonts.body,
        }}
      >
        Richtig: {correctText}
      </div>
    )
  }

  const cappedOut = lastAward && lastAward.awarded < lastAward.requested

  return (
    <div
      style={{
        padding: '10px 14px',
        background: colors.feedback.successBg,
        borderRadius: 4,
        marginBottom: 10,
        fontSize: 13,
        color: colors.green,
        fontFamily: fonts.body,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span>Richtig.</span>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
        <img src={CORK_IMG} alt="" aria-hidden="true" style={{ width: 14, height: 9 }} />
        <span style={{ fontWeight: 700 }}>+{lastAward?.awarded ?? 0}</span>
        {cappedOut && (
          <span style={{ fontSize: 10, color: colors.grayMid, marginLeft: 4 }}>(Tageslimit)</span>
        )}
      </div>
    </div>
  )
}

function RewardChip({ corks }) {
  return (
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
        +{corks}
      </span>
    </div>
  )
}
