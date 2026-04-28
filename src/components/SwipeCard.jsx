import { useRef, useState } from 'react'
import { colors, fonts } from '../theme'
import { BACKGROUNDS } from '../assets/backgrounds'

const SWIPE_THRESHOLD_X = 75
const SWIPE_THRESHOLD_Y = 80
const ROTATION_FACTOR = 0.035

/**
 * Tinder-style swipe card for wines.
 *
 * - Drag right → "Mag ich"  (calls onSwipe('right', wine))
 * - Drag left → "Nein"      (calls onSwipe('left', wine))
 * - Drag up → "Sehr gerne"  (calls onSwipe('super', wine))
 * - Below threshold the card snaps back.
 *
 * Pure presentational — parent owns the wine queue.
 */
export function SwipeCard({ wine, onSwipe, showPrice = false }) {
  const startX = useRef(null)
  const startY = useRef(null)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [exitDirection, setExitDirection] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  function commitSwipe(direction) {
    if (exitDirection) return
    setExitDirection(direction)
    // 300ms matches the CSS transition; let it finish before notifying parent.
    setTimeout(() => onSwipe(direction, wine), 300)
  }

  function handleStart(clientX, clientY) {
    startX.current = clientX
    startY.current = clientY
    setIsDragging(true)
  }

  function handleMove(clientX, clientY) {
    if (startX.current == null) return
    setDrag({ x: clientX - startX.current, y: clientY - startY.current })
  }

  function handleEnd() {
    setIsDragging(false)
    const { x, y } = drag

    if (y < -SWIPE_THRESHOLD_Y && Math.abs(x) < 70) commitSwipe('super')
    else if (x > SWIPE_THRESHOLD_X) commitSwipe('right')
    else if (x < -SWIPE_THRESHOLD_X) commitSwipe('left')
    else setDrag({ x: 0, y: 0 })

    startX.current = null
    startY.current = null
  }

  // Indicator opacities, clamped 0..1.
  const likeOpacity  = Math.min(1, Math.max(0,  drag.x / SWIPE_THRESHOLD_X))
  const nopeOpacity  = Math.min(1, Math.max(0, -drag.x / SWIPE_THRESHOLD_X))
  const superOpacity = Math.min(1, Math.max(0, -drag.y / SWIPE_THRESHOLD_X))

  const transform =
    exitDirection === 'left'  ? 'translateX(-135%) rotate(-18deg)'
    : exitDirection === 'right' ? 'translateX(135%) rotate(18deg)'
    : exitDirection === 'super' ? 'translateY(-130%) scale(0.95)'
    : `translateX(${drag.x}px) translateY(${Math.min(0, drag.y)}px) rotate(${drag.x * ROTATION_FACTOR}deg)`

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        width: '100%',
        aspectRatio: '9/14',
        transform,
        transition: isDragging || exitDirection ? 'none' : 'transform 0.32s cubic-bezier(0.25,0.46,0.45,0.94)',
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

      {/* Drag indicators */}
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
