import { useRef, useState } from 'react'
import { colors, fonts } from '../theme'
import { BACKGROUNDS } from '../assets/backgrounds'

const SWIPE_THRESHOLD_X = 75
const SWIPE_THRESHOLD_Y = 80
const ROTATION_FACTOR = 0.035
// Anything moved less than this in either axis between pointer-down and -up
// counts as a tap, not a drag. Keeps tap-to-flip from triggering on swipes.
const TAP_DRIFT_TOLERANCE = 6

/**
 * Tinder-style swipe card for wines, with tap-to-flip details on the back.
 *
 * Drag interactions:
 *   - Drag right → "Mag ich"  (calls onSwipe('right', wine))
 *   - Drag left  → "Nein"     (calls onSwipe('left', wine))
 *   - Drag up    → "Sehr gerne" (calls onSwipe('super', wine))
 *   - Below threshold the card snaps back.
 *
 * Tap (no significant drag): flips the card to show details — pairing,
 * Trinktemperatur, Lagerpotential, plus a "Bei HAWESKO kaufen" button that
 * opens the HAWESKO search page for this wine.
 *
 * The flip persists across re-renders within a single card lifetime; the
 * parent's wine queue advancement creates a fresh SwipeCard, which resets
 * naturally to the front side.
 */
export function SwipeCard({ wine, onSwipe, showPrice = false }) {
  const startX = useRef(null)
  const startY = useRef(null)
  // Track total movement during a single press; on release we use this to
  // decide tap vs. swipe rather than the live drag state.
  const moved = useRef(false)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [exitDirection, setExitDirection] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [flipped, setFlipped] = useState(false)

  function commitSwipe(direction) {
    if (exitDirection) return
    setExitDirection(direction)
    setTimeout(() => onSwipe(direction, wine), 300)
  }

  function handleStart(clientX, clientY) {
    startX.current = clientX
    startY.current = clientY
    moved.current = false
    setIsDragging(true)
  }

  function handleMove(clientX, clientY) {
    if (startX.current == null) return
    const dx = clientX - startX.current
    const dy = clientY - startY.current
    if (Math.abs(dx) > TAP_DRIFT_TOLERANCE || Math.abs(dy) > TAP_DRIFT_TOLERANCE) {
      moved.current = true
    }
    // While the back is showing, ignore drag-as-swipe so the user can read
    // without accidentally swiping. They can still tap to flip back.
    if (flipped) return
    setDrag({ x: dx, y: dy })
  }

  function handleEnd() {
    setIsDragging(false)
    const wasTap = !moved.current
    startX.current = null
    startY.current = null

    if (wasTap) {
      setFlipped((f) => !f)
      setDrag({ x: 0, y: 0 })
      return
    }

    if (flipped) {
      // Drag while flipped — don't commit a swipe; reset.
      setDrag({ x: 0, y: 0 })
      return
    }

    const { x, y } = drag
    if (y < -SWIPE_THRESHOLD_Y && Math.abs(x) < 70) commitSwipe('super')
    else if (x > SWIPE_THRESHOLD_X) commitSwipe('right')
    else if (x < -SWIPE_THRESHOLD_X) commitSwipe('left')
    else setDrag({ x: 0, y: 0 })
  }

  // Indicator opacities — only show on the front face during an active drag.
  const likeOpacity  = !flipped ? Math.min(1, Math.max(0,  drag.x / SWIPE_THRESHOLD_X)) : 0
  const nopeOpacity  = !flipped ? Math.min(1, Math.max(0, -drag.x / SWIPE_THRESHOLD_X)) : 0
  const superOpacity = !flipped ? Math.min(1, Math.max(0, -drag.y / SWIPE_THRESHOLD_X)) : 0

  const dragTransform =
    exitDirection === 'left'  ? 'translateX(-135%) rotate(-18deg)'
    : exitDirection === 'right' ? 'translateX(135%) rotate(18deg)'
    : exitDirection === 'super' ? 'translateY(-130%) scale(0.95)'
    : `translateX(${drag.x}px) translateY(${Math.min(0, drag.y)}px) rotate(${drag.x * ROTATION_FACTOR}deg)`

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '9/14',
        perspective: 1400,
        transform: dragTransform,
        transition:
          isDragging || exitDirection
            ? 'none'
            : 'transform 0.32s cubic-bezier(0.25,0.46,0.45,0.94)',
        opacity: exitDirection ? 0 : 1,
        userSelect: 'none',
        touchAction: 'pan-y',
      }}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => isDragging && handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={() => isDragging && handleEnd()}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <CardFront
          wine={wine}
          showPrice={showPrice}
          likeOpacity={likeOpacity}
          nopeOpacity={nopeOpacity}
          superOpacity={superOpacity}
        />
        <CardBack wine={wine} />
      </div>
    </div>
  )
}

function CardFront({ wine, showPrice, likeOpacity, nopeOpacity, superOpacity }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 12,
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <img
        src={BACKGROUNDS[wine.bg]}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(5px) brightness(0.6)',
          transform: 'scale(1.1)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom,rgba(0,0,0,0.18) 0%,transparent 22%,transparent 52%,rgba(0,0,0,0.92) 100%)',
          zIndex: 1,
        }}
      />

      <SwipeIndicator label="MAG ICH" rotation={-9} side="left" opacity={likeOpacity} bgColor="42,107,69" />
      <SwipeIndicator label="NEIN" rotation={9} side="right" opacity={nopeOpacity} bgColor="155,27,48" />
      <SwipeIndicator label="★ SEHR GERNE" rotation={0} side="center" opacity={superOpacity} bgColor="196,150,42" inverted />

      {/* Wine name & region */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5, padding: '18px 20px 0' }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 16,
            color: colors.white,
            fontWeight: 700,
            lineHeight: 1.25,
            textShadow: '0 2px 12px rgba(0,0,0,0.7)',
          }}
        >
          {wine.name}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: fonts.body, marginTop: 3 }}>
          {wine.region}
        </div>
      </div>

      {/* Bottle image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 72,
          paddingBottom: 88,
        }}
      >
        <img
          src={wine.img}
          alt={wine.name}
          style={{
            maxHeight: '64%',
            maxWidth: '48%',
            objectFit: 'contain',
            filter:
              'drop-shadow(0 24px 48px rgba(0,0,0,0.8)) drop-shadow(0 6px 18px rgba(0,0,0,0.55))',
          }}
          onError={(e) => (e.target.style.display = 'none')}
        />
      </div>

      {/* Tap hint */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: 14,
          transform: 'translateY(-50%)',
          zIndex: 4,
          background: 'rgba(0,0,0,0.42)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: 18,
          padding: '6px 10px',
          fontSize: 9,
          color: 'rgba(255,255,255,0.85)',
          fontFamily: fonts.body,
          letterSpacing: '0.08em',
          fontWeight: 600,
          pointerEvents: 'none',
        }}
      >
        TIPPEN ↻
      </div>

      {/* Footer chips & price */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, padding: '0 18px 16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: showPrice && wine.price ? 6 : 0,
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            <Chip>{wine.type}</Chip>
            <Chip>{wine.year}</Chip>
          </div>
          {wine.badge && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.1em',
                background: wine.badgeColor || colors.red,
                color: colors.white,
                borderRadius: 3,
                padding: '3px 8px',
                fontFamily: fonts.body,
              }}
            >
              {wine.badge}
            </span>
          )}
        </div>
        {showPrice && wine.price && (
          <div style={{ fontFamily: fonts.display, fontSize: 19, color: colors.white, fontWeight: 700 }}>
            {wine.price}
          </div>
        )}
      </div>
    </div>
  )
}

function CardBack({ wine }) {
  // Build a HAWESKO search URL for this wine. Search is more robust than a
  // hard-coded product link — it survives slug changes on hawesko.de.
  const buyUrl = `https://www.hawesko.de/search?query=${encodeURIComponent(wine.name)}`

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 12,
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
        background: '#1A1012',
        color: colors.white,
        display: 'flex',
        flexDirection: 'column',
        padding: '22px 22px 18px',
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: colors.gold,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontFamily: fonts.body,
          marginBottom: 6,
        }}
      >
        Wein-Details
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 18,
          fontWeight: 700,
          lineHeight: 1.25,
          marginBottom: 4,
        }}
      >
        {wine.name}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: fonts.body, marginBottom: 18 }}>
        {wine.producer} · {wine.region}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 13, overflowY: 'auto', paddingRight: 4 }}>
        {wine.pairing && <DetailRow label="Passt zu" value={wine.pairing} />}
        {wine.temp && <DetailRow label="Trinktemperatur" value={wine.temp} />}
        {wine.lagerpotential && <DetailRow label="Lagerpotential" value={`bis ${wine.lagerpotential}`} />}
        <DetailRow label="Typ" value={wine.type} />
        <DetailRow label="Jahrgang" value={wine.year} />
      </div>

      {wine.price && (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            marginTop: 14,
            marginBottom: 10,
          }}
        >
          <span style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 700, color: colors.gold }}>
            {wine.price}
          </span>
          {wine.oldPrice && (
            <span
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'line-through',
                fontFamily: fonts.body,
              }}
            >
              {wine.oldPrice}
            </span>
          )}
        </div>
      )}

      <a
        href={buyUrl}
        target="_blank"
        rel="noopener noreferrer"
        // Prevent the parent's tap-to-flip from firing when the user taps the
        // button — it's a real navigation, not a card flip.
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        style={{
          background: colors.red,
          color: colors.white,
          border: 'none',
          borderRadius: 4,
          padding: '13px 14px',
          fontFamily: fonts.body,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textDecoration: 'none',
          textAlign: 'center',
          cursor: 'pointer',
          marginTop: 4,
        }}
      >
        Bei HAWESKO kaufen →
      </a>

      <div
        style={{
          fontSize: 9,
          color: 'rgba(255,255,255,0.35)',
          fontFamily: fonts.body,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginTop: 10,
          pointerEvents: 'none',
        }}
      >
        Tippen zum Zurückdrehen
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div>
      <div
        style={{
          fontSize: 9,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: fonts.body,
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13, color: colors.white, fontFamily: fonts.body, lineHeight: 1.5 }}>
        {value}
      </div>
    </div>
  )
}

function Chip({ children }) {
  return (
    <span
      style={{
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        border: '1px solid rgba(255,255,255,0.16)',
        borderRadius: 20,
        padding: '2px 9px',
        fontFamily: fonts.body,
      }}
    >
      {children}
    </span>
  )
}

function SwipeIndicator({ label, rotation, side, opacity, bgColor, inverted }) {
  const positions = {
    left:   { top: 22, left: 18 },
    right:  { top: 22, right: 18 },
    center: { top: '36%', left: '50%', transform: `translate(-50%,-50%) rotate(${rotation}deg)` },
  }
  const pos = positions[side]
  const transform = side === 'center' ? pos.transform : `rotate(${rotation}deg)`

  return (
    <div
      style={{
        position: 'absolute',
        ...pos,
        zIndex: 20,
        opacity,
        transform,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: `rgba(${bgColor},${inverted ? 0.96 : 0.94})`,
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderRadius: 6,
          padding: side === 'center' ? '8px 22px' : '7px 16px',
          color: inverted ? colors.black : colors.white,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: fonts.body,
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
    </div>
  )
}
