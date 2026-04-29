import { colors } from '../theme'

/**
 * Horizontal progress bar. `value` is 0–100. Use `thin` for header strips.
 */
export function ProgressBar({ value, color = colors.red, thin = false, style }) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        height: thin ? 2 : 3,
        background: colors.grayLine,
        borderRadius: 2,
        ...style,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${clamped}%`,
          background: color,
          borderRadius: 2,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  )
}
