import { colors } from '../theme'
import { Logo } from './Logo'

/**
 * Standard header. Shows either a back arrow (when `onBack` is provided) or
 * the brand logo on the left, and any `right` slot on the right.
 *
 * `ghost` = transparent, absolutely positioned (for screens that own the bg).
 */
export function TopBar({ right, onBack, inverted = false, ghost = false }) {
  return (
    <div
      style={{
        padding: '52px 22px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: ghost ? 'transparent' : colors.white,
        borderBottom: ghost ? 'none' : `1px solid ${colors.grayLine}`,
        position: ghost ? 'absolute' : 'relative',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
    >
      {onBack ? (
        <button
          onClick={onBack}
          aria-label="Zurück"
          style={{
            fontSize: 24,
            cursor: 'pointer',
            color: inverted ? 'rgba(255,255,255,0.75)' : colors.black,
            background: 'none',
            border: 'none',
            lineHeight: 1,
            padding: 0,
          }}
        >
          ‹
        </button>
      ) : (
        <Logo inverted={inverted} />
      )}
      {right}
    </div>
  )
}
