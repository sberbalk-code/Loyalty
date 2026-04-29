import { colors, fonts } from '../theme'

/**
 * The small uppercase tracking-wide label that sits above section titles.
 * E.g. "DEINE WEIN-DNA", "WINZER COLLECTION", "DAILY DOSE".
 * Centralized here because the original code repeated this style 30+ times.
 */
export function EyebrowLabel({ children, color = colors.red, style }) {
  return (
    <div
      style={{
        fontSize: 9,
        color,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        fontFamily: fonts.body,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
