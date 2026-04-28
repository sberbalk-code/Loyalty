import { fonts } from '../theme'

const CATEGORY_COLORS = {
  Grundlagen: ['#F0EAE0', '#7A5C3A'],
  Sensorik:   ['#F5EAE8', '#8B2035'],
  Ausbau:     ['#E8EDF5', '#1D4E89'],
  Anbau:      ['#E8F0EB', '#2A6B45'],
  Experten:   ['#F5F0E0', '#8B6914'],
}

export function CategoryTag({ category }) {
  const [bg, color] = CATEGORY_COLORS[category] || CATEGORY_COLORS.Grundlagen
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        background: bg,
        color,
        borderRadius: 2,
        padding: '3px 8px',
        fontFamily: fonts.body,
      }}
    >
      {category}
    </span>
  )
}
