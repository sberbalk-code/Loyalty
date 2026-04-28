import { useState } from 'react'
import { colors, fonts } from '../theme'
import { Screen } from '../components/Screen'
import { Logo } from '../components/Logo'
import { SwipeCard } from '../components/SwipeCard'
import { SwipeButtons } from '../components/SwipeButtons'
import { DNA_WINES } from '../data/wines'
import { WINE_TYPE } from '../data/wineTypes'

// Type → DNA profile key
const TYPE_TO_PROFILE = {
  [WINE_TYPE.ROT]:        'rotwein',
  [WINE_TYPE.WEISS]:      'weisswein',
  [WINE_TYPE.ROSE]:       'rose',
  [WINE_TYPE.CHAMPAGNER]: 'champagner',
}

/**
 * Determine DNA profile from a list of "liked" wines.
 *
 * Rule: pick the type with the highest like-count. If no wine was liked,
 * default to weisswein. Tie-break order: rot > weiss > rose > champagner
 * (most populous categories win, less specialty profiles).
 */
function determineDNA(likedWines) {
  if (likedWines.length === 0) return 'weisswein'

  const counts = {
    [WINE_TYPE.ROT]: 0,
    [WINE_TYPE.WEISS]: 0,
    [WINE_TYPE.ROSE]: 0,
    [WINE_TYPE.CHAMPAGNER]: 0,
  }
  for (const wine of likedWines) {
    if (counts[wine.type] !== undefined) counts[wine.type]++
  }

  const tiebreakOrder = [WINE_TYPE.ROT, WINE_TYPE.WEISS, WINE_TYPE.ROSE, WINE_TYPE.CHAMPAGNER]
  const max = Math.max(...Object.values(counts))
  const winningType = tiebreakOrder.find((t) => counts[t] === max)

  return TYPE_TO_PROFILE[winningType]
}

export function TasteDNAScreen({ onComplete }) {
  const [index, setIndex] = useState(0)
  const [liked, setLiked] = useState([])
  const [supers, setSupers] = useState([])

  function handleSwipe(direction, wine) {
    // Compute next-state synchronously so the final classification doesn't
    // race React's state batching.
    const isLast = index + 1 >= DNA_WINES.length
    const nextLiked = direction !== 'left' ? [...liked, wine] : liked
    const nextSupers = direction === 'super' ? [...supers, wine] : supers

    setLiked(nextLiked)
    setSupers(nextSupers)

    if (isLast) {
      onComplete(determineDNA(nextLiked), nextLiked, nextSupers)
    } else {
      setIndex((i) => i + 1)
    }
  }

  const wine = DNA_WINES[index]

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
        <Logo inverted />
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: fonts.body }}>
          {index + 1} · {DNA_WINES.length}
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
            width: `${(index / DNA_WINES.length) * 100}%`,
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
        <div
          style={{
            fontSize: 9,
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: fonts.body,
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          Taste DNA
        </div>
        <SwipeCard wine={wine} onSwipe={handleSwipe} />
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
          ← swipe · ↑ sehr gerne · →
        </span>
      </div>
    </Screen>
  )
}
