import { colors, fonts } from '../theme'
import { Screen } from '../components/Screen'
import { Logo } from '../components/Logo'
import { Button } from '../components/Button'

const FEATURES = [
  'Taste DNA — dein persönliches Weinprofil',
  '35 Vokabeln + Regionen, Rebsorten, Pairing & Degustation',
  'Neue Weine entdecken — per Swipe',
  'Winzer Collection — Etiketten sammeln',
  'Mein HAWESKO Weinkeller — deine Flaschen tracken',
  'Korken sammeln → Status → exklusive Events & Prämien',
]

export function WelcomeScreen({ onStart }) {
  return (
    <Screen bg={colors.cream}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '52px 28px 40px' }}>
        <Logo />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 1.5, background: colors.red, marginBottom: 28 }} />

          <h1
            style={{
              fontFamily: fonts.display,
              fontSize: 34,
              color: colors.black,
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 18,
              letterSpacing: '-0.01em',
            }}
          >
            Entdecke die
            <br />
            <span style={{ color: colors.red }}>Welt des Weins.</span>
          </h1>

          <p
            style={{
              fontSize: 14,
              color: colors.grayMid,
              lineHeight: 1.8,
              fontFamily: fonts.body,
              marginBottom: 38,
              maxWidth: 285,
            }}
          >
            Finde deinen Geschmack. Lerne die Sprache des Weins. Sammle Korken und steige auf.
          </p>

          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 38, listStyle: 'none', padding: 0 }}>
            {FEATURES.map((text) => (
              <li
                key={text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '10px 16px',
                  background: colors.white,
                  borderRadius: 4,
                  border: `1px solid ${colors.grayLine}`,
                }}
              >
                <span style={{ fontSize: 7, color: colors.red, flexShrink: 0 }} aria-hidden="true">◆</span>
                <span style={{ fontSize: 12.5, color: colors.grayDark, fontFamily: fonts.body }}>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button onClick={onStart}>Jetzt starten</Button>
        <div
          style={{
            textAlign: 'center',
            marginTop: 10,
            fontSize: 11,
            color: colors.grayLight,
            fontFamily: fonts.body,
          }}
        >
          Kostenlos · Kein Account erforderlich
        </div>
      </div>
    </Screen>
  )
}
