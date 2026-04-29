export function BottleSilhouette({ size = 60, color = '#C8C8C4', opacity = 1 }) {
  return (
    <svg
      width={size * 0.45}
      height={size}
      viewBox="0 0 45 100"
      fill="none"
      style={{ opacity }}
      aria-hidden="true"
    >
      <path
        d="M17 0h11v8c0 0 8 6 10 18v58c0 4-3 7-7 7H14c-4 0-7-3-7-7V26C7 14 17 8 17 8V0z"
        fill={color}
        opacity="0.25"
      />
      <path
        d="M17 0h11v8c0 0 8 6 10 18v58c0 4-3 7-7 7H14c-4 0-7-3-7-7V26C7 14 17 8 17 8V0z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <rect x="16" y="0" width="13" height="2" rx="1" fill={color} opacity="0.5" />
      <path d="M10 42h25" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <path d="M12 55h21" stroke={color} strokeWidth="0.8" opacity="0.2" />
    </svg>
  )
}
