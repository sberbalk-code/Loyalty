import { colors, fonts } from '../theme'

const VARIANTS = {
  red: {
    background: colors.red,
    color: colors.white,
    border: 'none',
    boxShadow: '0 4px 16px rgba(155,27,48,0.25)',
  },
  gold: {
    background: `linear-gradient(135deg,${colors.gold},${colors.goldLight})`,
    color: colors.black,
    border: 'none',
    boxShadow: '0 4px 16px rgba(196,150,42,0.3)',
  },
  ghost: {
    background: 'transparent',
    color: colors.grayDark,
    border: `1.5px solid ${colors.grayLine}`,
    boxShadow: 'none',
  },
  dark: {
    background: colors.black,
    color: colors.white,
    border: 'none',
    boxShadow: 'none',
  },
}

/**
 * Primary action button. Use `variant="red"` for the strongest CTA,
 * `gold` for premium/reward actions, `ghost` for secondary, `dark` for inverse.
 */
export function Button({
  children,
  onClick,
  variant = 'red',
  style,
  disabled = false,
  type = 'button',
  ariaLabel,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        width: '100%',
        padding: '15px',
        borderRadius: 3,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontFamily: fonts.body,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        ...VARIANTS[variant],
        ...style,
      }}
    >
      {children}
    </button>
  )
}
