import { useState } from 'react'
import { colors, fonts } from '../theme'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { Button } from '../components/Button'
import { BottomSheet } from '../components/BottomSheet'
import { EyebrowLabel } from '../components/EyebrowLabel'
import { WineGlassIcon } from '../components/icons/WineGlassIcon'
import { HAWESKO_WINES } from '../data/wines'
import { germanDate } from '../utils/date'

/**
 * Personal wine cellar.
 *
 * Bug fix: `consumed` is now passed in from App-level state, so the "Getrunken"
 * history survives navigation away from this screen. Previously it lived in
 * local state and was lost as soon as the user opened a different tab.
 */
export function WeinkellerScreen({ keller, onUpdateKeller, consumed, onUpdateConsumed, onBack }) {
  const [showAdd, setShowAdd] = useState(false)
  const [noteWineId, setNoteWineId] = useState(null)
  const [noteText, setNoteText] = useState('')

  const totalBottles = keller.reduce((sum, k) => sum + k.quantity, 0)

  function addWine(wine) {
    const existing = keller.find((k) => k.wine.id === wine.id)
    if (existing) {
      onUpdateKeller(
        keller.map((k) =>
          k.wine.id === wine.id ? { ...k, quantity: k.quantity + 1 } : k,
        ),
      )
    } else {
      onUpdateKeller([
        ...keller,
        { wine, quantity: 1, note: '', addedDate: germanDate() },
      ])
    }
    setShowAdd(false)
  }

  function updateQuantity(wineId, delta) {
    const updated = keller
      .map((k) => {
        if (k.wine.id !== wineId) return k
        const newQty = k.quantity + delta
        if (newQty <= 0) {
          // Bottle drunk! Add to consumed list.
          onUpdateConsumed([...consumed, { ...k.wine, drunkDate: germanDate() }])
          return null
        }
        return { ...k, quantity: newQty }
      })
      .filter(Boolean)
    onUpdateKeller(updated)
  }

  function saveNote(wineId) {
    onUpdateKeller(
      keller.map((k) => (k.wine.id === wineId ? { ...k, note: noteText } : k)),
    )
    setNoteWineId(null)
  }

  return (
    <Screen bg={colors.cream}>
      <TopBar
        onBack={onBack}
        right={
          <div style={{ fontSize: 13, color: colors.grayMid, fontFamily: fonts.body }}>
            {totalBottles} {totalBottles === 1 ? 'Flasche' : 'Flaschen'}
          </div>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 36px' }}>
        <EyebrowLabel style={{ marginBottom: 4 }}>Mein HAWESKO Weinkeller</EyebrowLabel>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 6,
          }}
        >
          <div style={{ fontFamily: fonts.display, fontSize: 22, color: colors.black, fontWeight: 600 }}>
            Deine Sammlung.
          </div>
        </div>

        <SyncHint />

        {keller.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {keller.map((entry) => (
              <KellerEntry
                key={entry.wine.id}
                entry={entry}
                onIncrement={() => updateQuantity(entry.wine.id, 1)}
                onDecrement={() => updateQuantity(entry.wine.id, -1)}
                onEditNote={() => {
                  setNoteWineId(entry.wine.id)
                  setNoteText(entry.note || '')
                }}
              />
            ))}
          </div>
        )}

        <Button onClick={() => setShowAdd(true)} variant="ghost" style={{ marginBottom: 16 }}>
          + Wein hinzufügen
        </Button>

        {consumed.length > 0 && (
          <>
            <div
              style={{
                fontSize: 9,
                color: colors.grayLight,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontFamily: fonts.body,
                marginBottom: 10,
              }}
            >
              Getrunken
            </div>
            {consumed.map((wine, i) => (
              <div
                key={`${wine.id}-${i}`}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: colors.white,
                  borderRadius: 4,
                  marginBottom: 8,
                  border: `1px solid ${colors.grayLine}`,
                  opacity: 0.65,
                }}
              >
                <img
                  src={wine.img}
                  alt=""
                  style={{
                    width: 22,
                    height: 38,
                    objectFit: 'contain',
                    flexShrink: 0,
                    filter: 'grayscale(80%)',
                  }}
                  onError={(e) => (e.target.style.display = 'none')}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 13,
                      color: colors.black,
                      fontWeight: 600,
                    }}
                  >
                    {wine.name}
                  </div>
                  <div style={{ fontSize: 11, color: colors.grayLight, fontFamily: fonts.body }}>
                    Getrunken am {wine.drunkDate}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {showAdd && (
        <BottomSheet title="Wein hinzufügen" onClose={() => setShowAdd(false)}>
          <div style={{ overflowY: 'auto', padding: '12px 16px 32px' }}>
            {HAWESKO_WINES.filter((w) => !keller.find((k) => k.wine.id === w.id)).map((wine) => (
              <button
                key={wine.id}
                onClick={() => addWine(wine)}
                style={{
                  width: '100%',
                  background: colors.white,
                  borderRadius: 4,
                  padding: '12px 14px',
                  marginBottom: 8,
                  border: `1px solid ${colors.grayLine}`,
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <img
                  src={wine.img}
                  alt=""
                  style={{ width: 28, height: 48, objectFit: 'contain', flexShrink: 0 }}
                  onError={(e) => (e.target.style.display = 'none')}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 13,
                      color: colors.black,
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {wine.name}
                  </div>
                  <div style={{ fontSize: 11, color: colors.grayMid, fontFamily: fonts.body }}>
                    {wine.year} · {wine.price}
                  </div>
                </div>
              </button>
            ))}
            {keller.length === HAWESKO_WINES.length && (
              <div
                style={{
                  textAlign: 'center',
                  padding: 20,
                  color: colors.grayLight,
                  fontFamily: fonts.body,
                  fontSize: 13,
                }}
              >
                Alle verfügbaren Weine im Keller.
              </div>
            )}
          </div>
        </BottomSheet>
      )}

      {noteWineId && (
        <BottomSheet title="Persönliche Notiz" onClose={() => setNoteWineId(null)}>
          <div style={{ padding: '22px 20px 40px' }}>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Deine Tasting Notes, Erinnerungen, Anlass…"
              style={{
                width: '100%',
                height: 100,
                borderRadius: 4,
                border: `1.5px solid ${colors.grayLine}`,
                padding: '12px',
                fontFamily: fonts.body,
                fontSize: 13,
                color: colors.black,
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <Button onClick={() => setNoteWineId(null)} variant="ghost" style={{ flex: 1 }}>
                Abbrechen
              </Button>
              <Button onClick={() => saveNote(noteWineId)} style={{ flex: 1 }}>
                Speichern
              </Button>
            </div>
          </div>
        </BottomSheet>
      )}
    </Screen>
  )
}

// ─── Sub-components ─────────────────────────────────────────────────────

function SyncHint() {
  return (
    <div
      style={{
        background: colors.white,
        borderRadius: 4,
        padding: '12px 16px',
        marginBottom: 16,
        border: `1px solid ${colors.grayLine}`,
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        style={{ flexShrink: 0, marginTop: 1 }}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke={colors.blue} strokeWidth="1.5" />
        <line x1="12" y1="8" x2="12" y2="12" stroke={colors.blue} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="16" r="0.5" fill={colors.blue} stroke={colors.blue} />
      </svg>
      <div style={{ fontSize: 12, color: colors.grayDark, fontFamily: fonts.body, lineHeight: 1.65 }}>
        Jeder HAWESKO-Kauf wird automatisch hier hinzugefügt. Beim nächsten Checkout:{' '}
        <span style={{ fontWeight: 600 }}>"Zum Weinkeller hinzufügen"</span> auswählen.
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: colors.grayLight,
        fontFamily: fonts.body,
      }}
    >
      <WineGlassIcon size={40} color={colors.grayLight} opacity={0.3} />
      <div style={{ fontSize: 14, marginBottom: 6, marginTop: 12 }}>Dein Weinkeller ist noch leer.</div>
      <div style={{ fontSize: 12 }}>Füge deinen ersten Wein hinzu.</div>
    </div>
  )
}

function KellerEntry({ entry, onIncrement, onDecrement, onEditNote }) {
  const currentYear = new Date().getFullYear()
  const readyYear = parseInt(entry.wine.lagerpotential) || currentYear + 2
  const status =
    currentYear >= readyYear ? 'trinken'
    : currentYear >= readyYear - 1 ? 'bald'
    : 'lagern'

  const statusColors = { trinken: colors.green, bald: colors.gold, lagern: colors.blue }
  const statusLabels = {
    trinken: 'Jetzt trinken',
    bald: 'Bald optimal',
    lagern: `Lagern bis ${entry.wine.lagerpotential}`,
  }

  return (
    <div
      style={{
        background: colors.white,
        borderRadius: 6,
        border: `1px solid ${colors.grayLine}`,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', gap: 12, padding: '14px 16px', alignItems: 'center' }}>
        <img
          src={entry.wine.img}
          alt=""
          style={{ width: 36, height: 62, objectFit: 'contain', flexShrink: 0 }}
          onError={(e) => (e.target.style.display = 'none')}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center' }}>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                background: statusColors[status] + '22',
                color: statusColors[status],
                borderRadius: 2,
                padding: '2px 7px',
                fontFamily: fonts.body,
              }}
            >
              {statusLabels[status]}
            </span>
            <span style={{ fontSize: 9, color: colors.grayLight, fontFamily: fonts.body }}>
              {entry.wine.temp}
            </span>
          </div>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 14,
              color: colors.black,
              fontWeight: 600,
              lineHeight: 1.3,
              marginBottom: 2,
            }}
          >
            {entry.wine.name}
          </div>
          <div style={{ fontSize: 11, color: colors.grayMid, fontFamily: fonts.body }}>
            {entry.wine.year} · {entry.wine.region}
          </div>
          {entry.note && (
            <div
              style={{
                fontSize: 11,
                color: colors.grayDark,
                fontFamily: fonts.body,
                marginTop: 4,
                fontStyle: 'italic',
              }}
            >
              "{entry.note}"
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <button
            onClick={onIncrement}
            aria-label="Eine Flasche hinzufügen"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: colors.red,
              color: colors.white,
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            +
          </button>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 18,
              color: colors.black,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {entry.quantity}
          </div>
          <button
            onClick={onDecrement}
            aria-label="Eine Flasche entfernen"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: colors.grayBg,
              color: colors.grayDark,
              border: `1px solid ${colors.grayLine}`,
              cursor: 'pointer',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            −
          </button>
        </div>
      </div>

      <div
        style={{
          borderTop: `1px solid ${colors.grayLine}`,
          padding: '10px 16px',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 10, color: colors.grayLight, fontFamily: fonts.body }}>
            Pairing:{' '}
          </span>
          <span style={{ fontSize: 11, color: colors.grayMid, fontFamily: fonts.body }}>
            {entry.wine.pairing}
          </span>
        </div>
        <button
          onClick={onEditNote}
          style={{
            fontSize: 10,
            color: colors.blue,
            fontFamily: fonts.body,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {entry.note ? 'Notiz bearbeiten' : '+ Notiz'}
        </button>
      </div>
    </div>
  )
}
