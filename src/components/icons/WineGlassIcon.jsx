export function WineGlassIcon({ size = 22, color = '#9B1B30', opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }} aria-hidden="true">
      <path
        d="M7.5 3h9L15 11.2c-.4 2.2-2.2 3.8-4.5 3.8s-4.1-1.6-4.5-3.8L7.5 3z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="10.5" y1="15" x2="10.5" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7.5" y1="21" x2="16.5" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
