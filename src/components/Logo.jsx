import { colors, fonts } from '../theme'

export function Logo({ inverted = false }) {
  return (
    <div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: inverted ? colors.white : colors.black,
          fontFamily: fonts.body,
          lineHeight: 1,
        }}
      >
        HAWESKO
      </div>
      <div
        style={{
          fontSize: 7,
          letterSpacing: '0.18em',
          color: inverted ? 'rgba(255,255,255,0.38)' : colors.grayLight,
          fontFamily: fonts.body,
          textTransform: 'uppercase',
          marginTop: 1.5,
        }}
      >
        JEDER WEIN EIN ERLEBNIS
      </div>
    </div>
  )
}
