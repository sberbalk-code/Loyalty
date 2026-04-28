import { useState } from 'react'
import { colors, fonts } from '../theme'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { Button } from '../components/Button'
import { CorkBadge } from '../components/CorkBadge'
import { EyebrowLabel } from '../components/EyebrowLabel'
import { SwipeCard } from '../components/SwipeCard'
import { SwipeButtons } from '../components/SwipeButtons'
import { HAWESKO_WINES } from '../data/wines'

/**
 * Browse all HAWESKO wines via swipe.
 *
 * Bug fix: cork badge now shows actual `corks` (not `liked.length`).
 */
export function DiscoverScreen({ corks, onBack }) {
  const [index, setIndex] = useState(0)
  const [cart, setCart] = useState([])
  const [done, setDone] = useState(false)

  function handleSwipe(direction, wine) {
    if (direction === 'right' || direction === 'super') {
      setCart((c) => [...c, wine])
    }
    if (index + 1 >= HAWESKO_WINES.length) setDone(true)
    else setIndex((i) => i + 1)
  }

  if (done) {
    return (
      <Screen>
        <TopBar onBack={onBack} right={<CorkBadge count={corks} small />} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 40px' }}>
          <EyebrowLabel style={{ marginBottom: 4 }}>Deine Auswahl</EyebrowLabel>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 22,
              color: colors.black,
              fontWeight: 600,
              marginBottom: 18,
            }}
          >
            {cart.length} {cart.length === 1 ? 'Wein' : 'Weine'} vorgemerkt.
          </div>

          {cart.map((w) => (
            <div
              key={w.id}
              style={{
                background: colors.white,
                borderRadius: 4,
                padding: '12px 14px',
                marginBottom: 9,
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                border: `1px solid ${colors.grayLine}`,
              }}
            >
              <img
                src={w.img}
                alt=""
                style={{ width: 30, height: 52, objectFit: 'contain', flexShrink: 0 }}
                onError={(e) => (e.target.style.display = 'none')}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: colors.grayMid, fontFamily: fonts.body }}>
                  {w.year} · {w.region}
                </div>
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 13,
                    color: colors.black,
                    fontWeight: 600,
                  }}
                >
                  {w.name}
                </div>
                {w.price && (
                  <div
                    style={{
                      fontSize: 13,
                      color: colors.red,
                      fontWeight: 700,
                      fontFamily: fonts.body,
                      marginTop: 2,
                    }}
                  >
                    {w.price}
                  </div>
                )}
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: 40,
                color: colors.grayLight,
                fontFamily: fonts.body,
              }}
            >
              Kein Wein vorgemerkt
            </div>
          )}

          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
            <Button onClick={() => {}}>Im Shop bestellen →</Button>
            <Button onClick={onBack} variant="ghost">
              Zurück
            </Button>
          </div>
        </div>
      </Screen>
    )
  }

  const wine = HAWESKO_WINES[index]

  return (
    <Screen bg="#111">
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          padding: '52px 22px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button
          onClick={onBack}
          aria-label="Zurück"
          style={{
            fontSize: 24,
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.6)',
            background: 'none',
            border: 'none',
            lineHeight: 1,
          }}
        >
          ‹
        </button>
        <div style={{ textAlign: 'center' }}>
          <EyebrowLabel color={colors.gold}>HAWESKO Weine</EyebrowLabel>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 13,
              color: colors.white,
              fontWeight: 600,
            }}
          >
            Passend zu dir entdecken
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: fonts.body }}>
          {index + 1}/{HAWESKO_WINES.length}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 22,
          right: 22,
          zIndex: 20,
          height: 1,
          background: 'rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(index / HAWESKO_WINES.length) * 100}%`,
            background: colors.red,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '92px 14px 92px',
          justifyContent: 'center',
        }}
      >
        <SwipeCard wine={wine} onSwipe={handleSwipe} showPrice />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 14px 26px',
          zIndex: 20,
        }}
      >
        <SwipeButtons
          onLeft={() => handleSwipe('left', wine)}
          onSuper={() => handleSwipe('super', wine)}
          onRight={() => handleSwipe('right', wine)}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 92,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 15,
        }}
      >
        <span
          style={{
            fontSize: 8.5,
            color: 'rgba(255,255,255,0.14)',
            fontFamily: fonts.body,
            letterSpacing: '0.1em',
          }}
        >
          ← nein · ↑ sehr gerne · → vormerken
        </span>
      </div>
    </Screen>
  )
}
