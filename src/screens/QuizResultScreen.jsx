import { colors, fonts } from '../theme'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { Button } from '../components/Button'
import { CorkBadge } from '../components/CorkBadge'
import { EyebrowLabel } from '../components/EyebrowLabel'

const LEVEL_DESCRIPTIONS = {
  einsteiger: {
    label: 'Weineinsteiger',
    desc: 'Du startest mit den Grundlagen — jede Lektion bringt dich weiter.',
    accent: colors.green,
  },
  entdecker: {
    label: 'Weinentdecker',
    desc: 'Du weißt bereits einiges. Regionen und Rebsorten als nächstes.',
    accent: colors.blue,
  },
  kenner: {
    label: 'Weinkenner',
    desc: 'Beeindruckend. Du startest direkt bei Vinifikation und Degustation.',
    accent: colors.red,
  },
}

const NEXT_STEPS = (corksEarned) => [
  `+${corksEarned} Korken für den Wissens-Check erhalten`,
  'Taste DNA ermitteln — welche Weine passen zu dir?',
  'Lernportal & Winzer Collection freischalten',
]

export function QuizResultScreen({ level, pct, corks, onNext }) {
  const info = LEVEL_DESCRIPTIONS[level] || LEVEL_DESCRIPTIONS.einsteiger

  return (
    <Screen bg={colors.cream}>
      <TopBar right={<CorkBadge count={corks} small />} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <EyebrowLabel color={colors.grayMid} style={{ marginBottom: 18 }}>
            Dein Ergebnis
          </EyebrowLabel>

          <div
            style={{
              width: 94,
              height: 94,
              borderRadius: '50%',
              background: colors.white,
              border: `3px solid ${info.accent}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: info.accent,
                fontFamily: fonts.display,
                lineHeight: 1,
              }}
            >
              {pct}%
            </div>
            <div
              style={{
                fontSize: 9,
                color: colors.grayLight,
                fontFamily: fonts.body,
                marginTop: 2,
                letterSpacing: '0.1em',
              }}
            >
              RICHTIG
            </div>
          </div>

          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 22,
              color: colors.black,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            {info.label}
          </div>
          <div
            style={{
              fontSize: 14,
              color: colors.grayMid,
              fontFamily: fonts.body,
              lineHeight: 1.7,
              maxWidth: 268,
              margin: '0 auto',
            }}
          >
            {info.desc}
          </div>
        </div>

        <div
          style={{
            background: colors.white,
            borderRadius: 4,
            padding: '14px 18px',
            marginBottom: 20,
            border: `1px solid ${colors.grayLine}`,
          }}
        >
          {NEXT_STEPS(corks).map((text, i, arr) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: i < arr.length - 1 ? 8 : 0,
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: 7, color: colors.red, marginTop: 4, flexShrink: 0 }} aria-hidden="true">
                ◆
              </span>
              <span style={{ fontSize: 13, color: colors.grayDark, fontFamily: fonts.body }}>{text}</span>
            </div>
          ))}
        </div>

        <Button onClick={onNext}>Taste DNA ermitteln</Button>
      </div>
    </Screen>
  )
}
