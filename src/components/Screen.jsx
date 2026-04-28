import { colors, layout } from '../theme'

/**
 * The fixed-size phone-shaped frame every screen renders into.
 *
 * Centers itself, caps at a phone width on desktop, and shows a subtle
 * shadow so the design feels app-like even in browsers.
 */
export function Screen({ children, bg = colors.white, style }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: layout.screenMaxWidth,
        height: '100dvh',
        maxHeight: layout.screenMaxHeight,
        background: bg,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 80px rgba(0,0,0,0.3)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
