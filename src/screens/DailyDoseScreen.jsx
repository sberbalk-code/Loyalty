import { useMemo, useState } from 'react'
import { colors, fonts } from '../theme'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { Button } from '../components/Button'
import { ProgressBar } from '../components/ProgressBar'
import { CorkBadge } from '../components/CorkBadge'
import { EyebrowLabel } from '../components/EyebrowLabel'
import { WineGlassIcon } from '../components/icons/WineGlassIcon'
import { CORK_IMG } from '../assets/cork'
import { shuffle } from '../utils/shuffle'
import { REGIONEN_Q, REBSORTEN_Q, FOOD_Q, DEGUSTATION_Q } from '../data/quiz'
import { getTier, getStreakBonus } from '../data/tiers'
import { DAILY_DOSE } from '../data/rewards'

const NUM_QUESTIONS = DAILY_DOSE.questions
const CORKS_PER_CORRECT = DAILY_DOSE.perCorrect
const COMPLETION_BONUS = DAILY_DOSE.completionBonus

/**
 * Daily Dose — 10 mixed questions.
 *
 * Bug fix: streak can no longer be farmed by repeated completion. The
 * `useDailyStreak` hook (passed via `streak`/`canCompleteToday` props) is
 * the source of truth: bonuses only fire on the FIRST completion of the day.
 */
export function DailyDoseScreen({
  corks,
  corks12m,
  streak,
  canCompleteToday,
  onAddCorks,
  onCompleteDailyDose,
  onBack,
}) {
  const tier = getTier(corks12m)

  const questions = useMemo(
    () =>
      shuffle([...REGIONEN_Q, ...REBSORTEN_Q, ...FOOD_Q, ...DEGUSTATION_Q])
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
  const [done, setDone] = useState(false)
  const [bonusInfo, setBonusInfo] = useState(null)

  const current = questions[index]
  const hasAnswered = selected !== null

  function handleSelect(i) {
    if (hasAnswered) return
    setSelected(i)
    if (i === current.correctIndex) {
      setScore((s) => s + 1)
      onAddCorks(CORKS_PER_CORRECT)
    }
  }

  function handleNext() {
    if (index + 1 >= questions.length) {
      setDone(true)

      // Only award completion bonuses if today's dose is still open.
      // Reopening the screen on the same day shows the result without re-paying.
      if (canCompleteToday) {
        onAddCorks(COMPLETION_BONUS)
        const newStreak = onCompleteDailyDose() // returns the new streak length
        const milestone = newStreak ? getStreakBonus(newStreak) : null
        if (milestone) onAddCorks(milestone.bonus)
        setBonusInfo({ newStreak, milestone })
      } else {
        setBonusInfo({ newStreak: streak, milestone: null, alreadyCompleted: true })
      }
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
    }
  }

  if (done) {
    const milestoneBonus = bonusInfo?.milestone?.bonus || 0
    const totalBonus = bonusInfo?.alreadyCompleted
      ? score * CORKS_PER_CORRECT
      : score * CORKS_PER_CORRECT + COMPLETION_BONUS + milestoneBonus

    return (
      <Screen>
        <TopBar onBack={onBack} right={<CorkBadge count={corks} small />} />
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
          <WineGlassIcon size={52} color={tier.color} />
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 24,
              color: colors.black,
              fontWeight: 700,
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            Daily Dose abgeschlossen.
          </div>
          <div
            style={{
              fontSize: 14,
              color: colors.grayMid,
              fontFamily: fonts.body,
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            {score} von {questions.length} richtig
            <br />
            Streak:{' '}
            <span style={{ color: tier.color, fontWeight: 600 }}>
              {bonusInfo?.newStreak ?? streak} Tage
            </span>
            {bonusInfo?.milestone && (
              <>
                <br />
                <span style={{ color: colors.gold, fontWeight: 600 }}>
                  Meilenstein: +{bonusInfo.milestone.bonus} Bonus-Korken!
                </span>
              </>
            )}
            {bonusInfo?.alreadyCompleted && (
              <>
                <br />
                <span style={{ color: colors.grayMid, fontStyle: 'italic' }}>
                  Heute schon abgeschlossen — Bonus bereits kassiert.
                </span>
              </>
            )}
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
            <span
              style={{
                fontFamily: fonts.display,
                fontSize: 22,
                color: colors.gold,
                fontWeight: 700,
              }}
            >
              +{totalBonus}
            </span>
            <span style={{ fontSize: 12, color: colors.grayMid, fontFamily: fonts.body }}>
              {bonusInfo?.alreadyCompleted ? 'nur Quiz-Korken' : 'inkl. Tagesbonus'}
            </span>
          </div>
          <Button onClick={onBack}>Zurück</Button>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <TopBar
        onBack={onBack}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <WineGlassIcon size={16} color={tier.color} />
            <span
              style={{
                fontSize: 12,
                color: tier.color,
                fontWeight: 600,
                fontFamily: fonts.body,
              }}
            >
              {streak}
            </span>
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
          padding: '16px 22px',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <EyebrowLabel>Daily Dose</EyebrowLabel>
          <div style={{ fontSize: 10, color: colors.grayLight, fontFamily: fonts.body }}>
            {index + 1} / {questions.length}
          </div>
        </div>

        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 18,
            color: colors.black,
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: 20,
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
                  padding: '12px 16px',
                  borderRadius: 4,
                  background,
                  border,
                  color: textColor,
                  fontSize: 12,
                  fontFamily: fonts.body,
                  textAlign: 'left',
                  cursor: hasAnswered ? 'default' : 'pointer',
                  transition: 'all 0.18s',
                }}
              >
                {option}
              </button>
            )
          })}
        </div>

        {hasAnswered && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                padding: '10px 14px',
                background:
                  selected === current.correctIndex
                    ? colors.feedback.successBg
                    : colors.feedback.errorBg,
                borderRadius: 4,
                marginBottom: 10,
                fontSize: 13,
                color: selected === current.correctIndex ? colors.green : colors.red,
                fontFamily: fonts.body,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {selected === current.correctIndex ? (
                <>
                  <span>Richtig.</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <img
                      src={CORK_IMG}
                      alt=""
                      aria-hidden="true"
                      style={{ width: 14, height: 9 }}
                    />
                    <span style={{ fontWeight: 700 }}>+{CORKS_PER_CORRECT}</span>
                  </div>
                </>
              ) : (
                `Richtig: ${current.options[current.correctIndex]}`
              )}
            </div>
            <Button onClick={handleNext}>
              {index + 1 >= questions.length ? 'Abschließen' : 'Weiter'}
            </Button>
          </div>
        )}
      </div>
    </Screen>
  )
}
