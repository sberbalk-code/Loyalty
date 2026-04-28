import { useRef, useState } from 'react'
import { colors, fonts } from '../theme'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { CorkBadge } from '../components/CorkBadge'
import { EyebrowLabel } from '../components/EyebrowLabel'
import { BottleSilhouette } from '../components/icons/BottleSilhouette'
import { useSafeFileReader } from '../hooks/useSafeFileReader'
import { WINZER_DATA, getPairingsForWine } from '../data/winzer'

const CORKS_PER_LABEL = 10

/**
 * Winzer Collection — collect bottle photos to fill out a winzer's wines.
 *
 * Bug fixes vs. original:
 * - File input value is reset after each read so the user can re-upload the
 *   same file (browsers dedupe identical change events).
 * - FileReader callback is gated on a "still mounted" ref to avoid setState
 *   on unmounted component if the user navigates away mid-read.
 * - Pairings now derive from `wine.type` instead of fragile string-matching.
 */
export function WinzerCollectionScreen({ collected, onCollect, onAddCorks, onBack }) {
  const [activeWinzerId, setActiveWinzerId] = useState(null)
  const [selectedWine, setSelectedWine] = useState(null)
  const fileInputRef = useRef(null)
  const { readFileAsDataURL } = useSafeFileReader()

  function getCount(winzerId) {
    const winzer = WINZER_DATA.find((w) => w.id === winzerId)
    if (!winzer) return 0
    return winzer.wines.filter((w) => collected[`${winzerId}-${w.id}`]).length
  }

  function getTotal(winzerId) {
    return WINZER_DATA.find((w) => w.id === winzerId)?.wines.length || 0
  }

  function isComplete(winzerId) {
    return getCount(winzerId) === getTotal(winzerId)
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    // Reset value immediately so the same file can be re-selected later.
    e.target.value = ''

    if (!file || !selectedWine) return

    readFileAsDataURL(file, (dataUrl) => {
      const key = `${activeWinzerId}-${selectedWine.id}`
      const isNew = !collected[key]
      onCollect(key, {
        photo: dataUrl,
        name: selectedWine.name,
        date: new Date().toLocaleDateString('de-DE'),
      })
      if (isNew) onAddCorks(CORKS_PER_LABEL)
      setSelectedWine(null)
    })
  }

  // ─── List view ─────────────────────────────────────────────────────────
  if (!activeWinzerId) {
    return (
      <Screen bg={colors.cream}>
        <TopBar
          onBack={onBack}
          right={<CorkBadge count={Object.keys(collected).length * CORKS_PER_LABEL} small />}
        />
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 36px' }}>
          <EyebrowLabel style={{ marginBottom: 4 }}>Winzer Collection</EyebrowLabel>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 22,
              color: colors.black,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Sammle Etiketten.
          </div>
          <div
            style={{
              fontSize: 13,
              color: colors.grayMid,
              fontFamily: fonts.body,
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            Trink einen Wein — wo auch immer — und lade ein Foto des Etiketts hoch.
            Vollständige Kollektionen werden mit exklusiven Prämien belohnt.
          </div>

          {WINZER_DATA.map((winzer) => (
            <WinzerCard
              key={winzer.id}
              winzer={winzer}
              count={getCount(winzer.id)}
              total={getTotal(winzer.id)}
              complete={isComplete(winzer.id)}
              collected={collected}
              onClick={() => setActiveWinzerId(winzer.id)}
            />
          ))}

          <div
            style={{
              background: colors.dark,
              borderRadius: 4,
              padding: '14px 18px',
              border: '1px solid rgba(196,150,42,0.2)',
              marginTop: 4,
            }}
          >
            <EyebrowLabel color={colors.gold} style={{ marginBottom: 5 }}>
              Coming Soon
            </EyebrowLabel>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 14,
                color: colors.white,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Automatische Label-Erkennung
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.38)',
                fontFamily: fonts.body,
                lineHeight: 1.65,
              }}
            >
              Halte einfach die Kamera auf ein Etikett — die App erkennt den Wein automatisch
              und trägt ihn in deine Kollektion ein.
            </div>
          </div>
        </div>
      </Screen>
    )
  }

  // ─── Detail view ───────────────────────────────────────────────────────
  const winzer = WINZER_DATA.find((w) => w.id === activeWinzerId)
  const count = getCount(activeWinzerId)
  const total = getTotal(activeWinzerId)
  const complete = isComplete(activeWinzerId)

  return (
    <Screen bg={colors.cream}>
      <div
        style={{
          padding: '52px 22px 14px',
          background: colors.white,
          borderBottom: `1px solid ${colors.grayLine}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => setActiveWinzerId(null)}
          aria-label="Zurück zur Winzer-Liste"
          style={{
            fontSize: 24,
            cursor: 'pointer',
            color: colors.black,
            background: 'none',
            border: 'none',
            lineHeight: 1,
          }}
        >
          ‹
        </button>
        <CorkBadge count={Object.keys(collected).length * CORKS_PER_LABEL} small />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 36px' }}>
        <div style={{ marginBottom: 20 }}>
          <EyebrowLabel style={{ marginBottom: 4 }}>{winzer.region}</EyebrowLabel>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 22,
              color: colors.black,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {winzer.name}
          </div>
          <div
            style={{
              fontSize: 13,
              color: colors.grayMid,
              fontFamily: fonts.body,
              lineHeight: 1.7,
              marginBottom: 14,
            }}
          >
            {winzer.desc}
          </div>

          <div
            style={{
              background: colors.white,
              borderRadius: 4,
              padding: '14px 16px',
              border: `1px solid ${complete ? colors.gold : colors.grayLine}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 13, fontFamily: fonts.body, fontWeight: 600, color: colors.black }}>
                Kollektion
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: complete ? colors.gold : colors.grayDark,
                  fontFamily: fonts.body,
                }}
              >
                {count} / {total}
              </span>
            </div>
            <div style={{ height: 6, background: colors.grayLine, borderRadius: 3 }}>
              <div
                style={{
                  height: '100%',
                  width: `${(count / total) * 100}%`,
                  background: complete
                    ? `linear-gradient(90deg,${colors.gold},${colors.goldLight})`
                    : colors.red,
                  borderRadius: 3,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        </div>

        {complete && (
          <div
            style={{
              background: `linear-gradient(135deg,${colors.gold},${colors.goldLight})`,
              borderRadius: 4,
              padding: '16px 18px',
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: fonts.body,
                color: 'rgba(26,26,26,0.6)',
                marginBottom: 6,
              }}
            >
              Kollektion vollständig
            </div>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 16,
                color: colors.black,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              {winzer.reward}
            </div>
            <button
              style={{
                background: 'rgba(0,0,0,0.15)',
                borderRadius: 3,
                padding: '8px 16px',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                color: colors.black,
                fontFamily: fonts.body,
                fontWeight: 600,
                letterSpacing: '0.06em',
              }}
            >
              PRÄMIE EINLÖSEN
            </button>
          </div>
        )}

        <div
          style={{
            fontSize: 9,
            color: colors.grayLight,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontFamily: fonts.body,
            marginBottom: 12,
          }}
        >
          Weine ({total})
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {winzer.wines.map((wine) => (
            <WineCard
              key={wine.id}
              wine={wine}
              winzer={winzer}
              activeWinzerId={activeWinzerId}
              collected={collected}
              isFlipped={selectedWine?.id === wine.id}
              onFlip={() => setSelectedWine(selectedWine?.id === wine.id ? null : wine)}
              onClose={() => setSelectedWine(null)}
              onUpload={() => {
                // Set the wine first, then trigger the input. The 50ms delay
                // gives React a chance to commit the state update.
                setSelectedWine(wine)
                setTimeout(() => fileInputRef.current?.click(), 50)
              }}
            />
          ))}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        aria-label="Etikett-Foto hochladen"
      />
    </Screen>
  )
}

// ─── Sub-components ─────────────────────────────────────────────────────

function WinzerCard({ winzer, count, total, complete, collected, onClick }) {
  const progress = Math.round((count / total) * 100)

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: colors.white,
        borderRadius: 4,
        padding: '18px',
        marginBottom: 12,
        border: `1.5px solid ${complete ? colors.gold : colors.grayLine}`,
        textAlign: 'left',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {complete && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg,${colors.gold},${colors.goldLight})`,
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 10,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 17,
              color: colors.black,
              fontWeight: 700,
              marginBottom: 2,
            }}
          >
            {winzer.name}
          </div>
          <div style={{ fontSize: 11, color: colors.grayMid, fontFamily: fonts.body }}>
            {winzer.region}
          </div>
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: complete ? colors.gold : colors.grayDark,
            fontFamily: fonts.body,
            whiteSpace: 'nowrap',
            marginLeft: 12,
          }}
        >
          {count}/{total}
        </span>
      </div>

      <div style={{ height: 4, background: colors.grayLine, borderRadius: 2, marginBottom: 8 }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: complete
              ? `linear-gradient(90deg,${colors.gold},${colors.goldLight})`
              : colors.red,
            borderRadius: 2,
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {winzer.wines.slice(0, 6).map((wine) => {
          const photo = collected[`${winzer.id}-${wine.id}`]?.photo
          return (
            <div
              key={wine.id}
              style={{
                width: 28,
                height: 46,
                borderRadius: 3,
                background: photo ? colors.dark : colors.grayBg,
                overflow: 'hidden',
                position: 'relative',
                border: `1px solid ${colors.grayLine}`,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {photo ? (
                <img
                  src={photo}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <BottleSilhouette size={38} color={colors.grayLight} opacity={0.5} />
              )}
            </div>
          )
        })}
        {winzer.wines.length > 6 && (
          <div
            style={{
              width: 28,
              height: 46,
              borderRadius: 3,
              background: colors.grayBg,
              border: `1px solid ${colors.grayLine}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 10, color: colors.grayMid, fontFamily: fonts.body }}>
              +{winzer.wines.length - 6}
            </span>
          </div>
        )}
      </div>

      {complete ? (
        <div
          style={{
            background: `linear-gradient(135deg,${colors.gold},${colors.goldLight})`,
            borderRadius: 3,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 12, fontFamily: fonts.body, fontWeight: 600, color: colors.black }}>
            Prämie einlösen
          </span>
          <span
            style={{
              fontSize: 11,
              color: 'rgba(26,26,26,0.6)',
              fontFamily: fonts.body,
              flex: 1,
            }}
          >
            {winzer.reward.split('+')[0].trim()}
          </span>
          <span style={{ fontSize: 14, color: colors.dark }}>›</span>
        </div>
      ) : (
        <div
          style={{
            fontSize: 12,
            color: colors.grayMid,
            fontFamily: fonts.body,
            fontStyle: 'italic',
          }}
        >
          {winzer.desc.slice(0, 80)}…
        </div>
      )}
    </button>
  )
}

function WineCard({ wine, winzer, activeWinzerId, collected, isFlipped, onFlip, onClose, onUpload }) {
  const key = `${activeWinzerId}-${wine.id}`
  const isCollected = !!collected[key]
  const pairings = getPairingsForWine(wine)

  return (
    <div style={{ perspective: 1000, height: 220 }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <button
          onClick={onFlip}
          style={{
            position: 'absolute',
            inset: 0,
            background: colors.white,
            borderRadius: 6,
            padding: '12px',
            border: `1.5px solid ${isCollected ? colors.gold : colors.grayLine}`,
            cursor: 'pointer',
            textAlign: 'left',
            backfaceVisibility: 'hidden',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
          }}
        >
          {isCollected && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg,${colors.gold},${colors.goldLight})`,
              }}
            />
          )}
          <div
            style={{
              width: '100%',
              height: 102,
              borderRadius: 3,
              overflow: 'hidden',
              marginBottom: 8,
              background: isCollected ? colors.dark : colors.grayBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {isCollected ? (
              <img
                src={collected[key].photo}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <BottleSilhouette size={78} color={colors.grayLight} opacity={0.65} />
            )}
            {isCollected && (
              <div
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: colors.gold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 9, color: colors.white, fontWeight: 700 }}>✓</span>
              </div>
            )}
          </div>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 11,
              color: isCollected ? colors.black : colors.grayMid,
              fontWeight: 600,
              lineHeight: 1.3,
              marginBottom: 2,
            }}
          >
            {wine.name}
          </div>
          <div
            style={{
              fontSize: 9,
              color: colors.grayLight,
              fontFamily: fonts.body,
              marginBottom: isCollected ? 0 : 6,
            }}
          >
            {wine.year}
          </div>
          {!isCollected && (
            <div style={{ fontSize: 9, color: colors.red, fontFamily: fonts.body, fontWeight: 600 }}>
              Tippen für Details
            </div>
          )}
        </button>

        {/* Back */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: colors.black,
            borderRadius: 6,
            border: '1.5px solid #333',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
          }}
        >
          <button
            onClick={onClose}
            aria-label="Karte zuklappen"
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              cursor: 'pointer',
              color: colors.white,
              fontSize: 11,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            ✕
          </button>

          <div style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 11,
                color: colors.white,
                fontWeight: 700,
                lineHeight: 1.3,
                marginBottom: 4,
                paddingRight: 20,
              }}
            >
              {wine.name}
            </div>
            <div
              style={{
                fontSize: 9,
                color: 'rgba(255,255,255,0.4)',
                fontFamily: fonts.body,
                marginBottom: 8,
              }}
            >
              {wine.year} · {winzer.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                fontFamily: fonts.body,
                lineHeight: 1.6,
                marginBottom: 8,
              }}
            >
              {wine.desc}
            </div>

            <div
              style={{
                fontSize: 8,
                color: colors.gold,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: fonts.body,
                marginBottom: 5,
              }}
            >
              Pairing
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 10 }}>
              {pairings.map((p) => (
                <span
                  key={p}
                  style={{
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.6)',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 3,
                    padding: '2px 6px',
                    fontFamily: fonts.body,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '8px 10px 10px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {isCollected ? (
              <div
                style={{
                  background: 'rgba(42,107,69,0.2)',
                  borderRadius: 3,
                  padding: '6px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 9, color: colors.green, fontWeight: 700 }}>✓</span>
                <span
                  style={{ fontSize: 9, color: colors.green, fontFamily: fonts.body, fontWeight: 600 }}
                >
                  Etikett gesammelt
                </span>
              </div>
            ) : (
              <button
                onClick={onUpload}
                style={{
                  background: `linear-gradient(135deg,${colors.gold},${colors.goldLight})`,
                  border: 'none',
                  borderRadius: 3,
                  padding: '7px',
                  cursor: 'pointer',
                  fontSize: 9,
                  color: colors.black,
                  fontFamily: fonts.body,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  width: '100%',
                }}
              >
                Etikett hochladen · +{CORKS_PER_LABEL}
              </button>
            )}
            <a
              href={`https://www.hawesko.de/search?query=${encodeURIComponent(wine.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 3,
                padding: '6px',
                cursor: 'pointer',
                fontSize: 9,
                color: 'rgba(255,255,255,0.7)',
                fontFamily: fonts.body,
                fontWeight: 600,
                letterSpacing: '0.05em',
                width: '100%',
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              Bei HAWESKO kaufen →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
