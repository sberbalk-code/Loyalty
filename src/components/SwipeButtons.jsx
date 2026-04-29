import { colors, fonts } from '../theme'

/**
 * The three action buttons under a swipe card. Mirrors the gesture options:
 * left = nope, center = super-like, right = like.
 *
 * Useful as a fallback for users on desktop or with motor impairments.
 */
export function SwipeButtons({ onLeft, onSuper, onRight }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '0 14px' }}>
      <ActionButton onClick={onLeft} ariaLabel="Nein, gefällt mir nicht"
                    flex={1}
                    bg="rgba(0,0,0,0.4)"
                    border="rgba(255,255,255,0.1)"
                    iconColor="#FF7B7B"
                    icon="✕"
                    label="Nein" />

      <ActionButton onClick={onSuper} ariaLabel="Sehr gerne — Super-Like"
                    flex={1.45}
                    bg="rgba(196,150,42,0.88)"
                    border="rgba(196,150,42,0.5)"
                    iconColor={colors.black}
                    icon="★"
                    label="Sehr gerne"
                    primary />

      <ActionButton onClick={onRight} ariaLabel="Mag ich"
                    flex={1}
                    bg="rgba(42,107,69,0.4)"
                    border="rgba(42,107,69,0.38)"
                    iconColor="#7BD48B"
                    icon="✓"
                    label="Ja" />
    </div>
  )
}

function ActionButton({ onClick, ariaLabel, flex, bg, border, iconColor, icon, label, primary = false }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        flex,
        padding: primary ? '15px 0' : '13px 0',
        borderRadius: 30,
        background: bg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${border}`,
        color: primary ? colors.black : colors.white,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        boxShadow: primary ? '0 6px 24px rgba(196,150,42,0.38)' : 'none',
      }}
    >
      <span style={{ fontSize: primary ? 21 : 19, lineHeight: 1, color: iconColor }}>{icon}</span>
      <span
        style={{
          fontSize: 8.5,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: fonts.body,
          color: primary ? colors.black : 'rgba(255,255,255,0.4)',
          fontWeight: primary ? 700 : 400,
        }}
      >
        {label}
      </span>
    </button>
  )
}
