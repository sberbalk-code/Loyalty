import { useMemo, useState } from 'react'
import { colors, fonts } from '../theme'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { Button } from '../components/Button'
import { ProgressBar } from '../components/ProgressBar'
import { EyebrowLabel } from '../components/EyebrowLabel'
import { shuffle } from '../utils/shuffle'
import { REGIONEN_Q, REBSORTEN_Q } from '../data/quiz'

const NUM_QUESTIONS = 6
const KENNER_THRESHOLD = 70
const ENTDECKER_THRESHOLD = 40

/**
 * Initial knowledge check. Routes the user to one of three difficulty
 * tracks (einsteiger / entdecker / kenner) based on their score.
 */
export function WissensCheckScreen({ onComplete }) {
  const questions = useMemo(
    () =>
      shuffle([...REGIONEN_Q, ...REBSORTEN_Q])
        .slice(0, NUM_QUESTIONS)
        .map((q) => {
          const options = shuffle([q.correct, ...q.wrong])
          return { ...q, options, correctIndex: options.indexOf(q.correct) }
        }),
    [],
  )

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)

  const current = questions[index]
  const hasAnswered = selected !== null

  function handleSelect(i) {
    if (hasAnswered) return
    setSelected(i)
    if (i === current.correctIndex) setScore((s) => s + 1)
  }

  function handleNext() {
    // Compute next-score synchronously so the final classification doesn't
    // race React's state update.
    const newScore = score + (selected === current.correctIndex ? 1 : 0)

    if (index + 1 >= questions.length) {
      const pct = Math.round((newScore / questions.length) * 100)
      const level =
        pct >= KENNER_THRESHOLD ? 'kenner'
        : pct >= ENTDECKER_THRESHOLD ? 'entdecker'
        : 'einsteiger'
      onComplete(level, pct)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
    }
  }

  return (
    <Screen>
      <TopBar
        right={
          <div style={{ fontSize: 12, color: colors.grayMid, fontFamily: fonts.body }}>
            {index + 1}/{questions.length}
          </div>
        }
      />

      <div style={{ padding: '0 22px 8px' }}>
        <ProgressBar value={(index / questions.length) * 100} />
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '18px 22px',
          overflowY: 'auto',
        }}
      >
        <EyebrowLabel style={{ marginBottom: 14 }}>Wissens · Check</EyebrowLabel>

        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 20,
            color: colors.black,
            fontWeight: 600,
            lineHeight: 1.38,
            marginBottom: 24,
          }}
        >
          {current.q}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
          {current.options.map((option, i) => {
            const isCorrect = i === current.correctIndex
            const isSelected = selected === i

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
                key={i}
                onClick={() => handleSelect(i)}
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
          })}
        </div>

        {hasAnswered && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                padding: '10px 14px',
                background: selected === current.correctIndex ? colors.feedback.successBg : colors.feedback.errorBg,
                borderRadius: 4,
                marginBottom: 10,
                fontSize: 13,
                color: selected === current.correctIndex ? colors.green : colors.red,
                fontFamily: fonts.body,
              }}
            >
              {selected === current.correctIndex
                ? 'Richtig.'
                : `Richtig: ${current.options[current.correctIndex]}`}
            </div>
            <Button onClick={handleNext}>
              {index + 1 >= questions.length ? 'Auswertung' : 'Weiter'}
            </Button>
          </div>
        )}
      </div>
    </Screen>
  )
}
