import { colors, fonts } from '../theme'
import { CORK_IMG } from '../assets/cork'

/**
 * Cork count badge — golden pill with cork icon and number.
 * Tappable when `onClick` is provided.
 */
export function CorkBadge({ count, small = false, onClick }) {
  const isClickable = typeof onClick === 'function'
  const display = typeof count === 'number' ? count.toLocaleString('de-DE') : count

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick() : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: small ? 4 : 6,
        background: 'rgba(196,150,42,0.1)',
        borderRadius: 20,
        padding: small ? '3px 10px' : '5px 13px',
        border: '1px solid rgba(196,150,42,0.22)',
        cursor: isClickable ? 'pointer' : 'default',
      }}
    >
      <img
        src={CORK_IMG}
        alt=""
        aria-hidden="true"
        style={{
          width: small ? 15 : 19,
          height: small ? 9 : 12,
          objectFit: 'contain',
        }}
      />
      <span
        style={{
          fontSize: small ? 11 : 13,
          fontWeight: 600,
          color: colors.gold,
          fontFamily: fonts.body,
        }}
      >
        {display}
      </span>
    </div>
  )
}
