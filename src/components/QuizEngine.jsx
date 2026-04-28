import { useMemo, useState } from 'react'
import { colors, fonts } from '../theme'
import { CORK_IMG } from '../assets/cork'
import { shuffle } from '../utils/shuffle'
import { Button } from './Button'
import { ProgressBar } from './ProgressBar'
import { EyebrowLabel } from './EyebrowLabel'

const MAX_QUESTIONS = 25
const CORKS_PER_CORRECT = 3

/**
 * Multi-question quiz engine. Pure presentational — caller supplies the
 * question pool and gets a callback when the user finishes.
 *
 * Bug fix: `useMemo` now depends on `questions`, so switching topic mid-flow
 * actually re-shuffles a fresh question set (previous version stayed stuck
 * on the first topic's questions).
 */
export function QuizEngine({ questions, title, onDone, onAddCorks }) {
  const preparedQuestions = useMemo(
    () =>
      shuffle(questions)
        .slice(0, Math.min(questions.length, MAX_QUESTIONS))
        .map((q) => {
          const options = shuffle([q.correct, ...q.wrong])
          return { ...q, options, correctIndex: options.indexOf(q.correct) }
        }),
    [questions],
  )

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const current = preparedQuestions[index]
  const hasAnswered = selected !== null

  function handleSelect(optionIndex) {
    if (hasAnswered) return
    setSelected(optionIndex)
    if (optionIndex === current.correctIndex) {
      setScore((s) => s + 1)
      onAddCorks(CORKS_PER_CORRECT)
    }
  }

  function handleNext() {
    if (index + 1 >= preparedQuestions.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
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
        <RewardChip corks={score * CORKS_PER_CORRECT} />
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
        <EyebrowLabel style={{ marginBottom: 8 }}>{title}</EyebrowLabel>
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
          />
          <Button onClick={handleNext}>
            {index + 1 >= preparedQuestions.length ? 'Abschließen' : 'Weiter'}
          </Button>
        </div>
      )}
    </div>
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

function FeedbackBanner({ wasCorrect, correctText }) {
  return (
    <div
      style={{
        padding: '10px 14px',
        background: wasCorrect ? colors.feedback.successBg : colors.feedback.errorBg,
        borderRadius: 4,
        marginBottom: 10,
        fontSize: 13,
        color: wasCorrect ? colors.green : colors.red,
        fontFamily: fonts.body,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {wasCorrect ? (
        <>
          <span>Richtig.</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <img src={CORK_IMG} alt="" aria-hidden="true" style={{ width: 14, height: 9 }} />
            <span style={{ fontWeight: 700 }}>+{CORKS_PER_CORRECT}</span>
          </div>
        </>
      ) : (
        `Richtig: ${correctText}`
      )}
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
