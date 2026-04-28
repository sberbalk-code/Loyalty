import { colors, fonts } from '../theme'

/**
 * Bottom-sheet modal (slides up from the bottom of the Screen).
 * Used for "Add wine", "Note", and "Create community". Centralized so all
 * modals share the same chrome and we avoid duplicating the close-button logic.
 *
 * `title` renders in the header. `onClose` is called when the user taps the X
 * or presses Escape. `maxHeight` defaults to 75vh so long lists can scroll.
 */
export function BottomSheet({ title, onClose, children, maxHeight = '75vh' }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.white,
          borderRadius: '16px 16px 0 0',
          width: '100%',
          maxHeight,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '18px 20px 12px',
            borderBottom: `1px solid ${colors.grayLine}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ fontFamily: fonts.display, fontSize: 17, color: colors.black, fontWeight: 600 }}>
            {title}
          </div>
          <button
            onClick={onClose}
            aria-label="Schließen"
            style={{
              fontSize: 20,
              color: colors.grayMid,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
