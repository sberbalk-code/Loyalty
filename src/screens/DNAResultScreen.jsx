import { colors, fonts } from '../theme'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { Button } from '../components/Button'
import { EyebrowLabel } from '../components/EyebrowLabel'
import { HAWESKO_WINES } from '../data/wines'
import { WINE_TYPE } from '../data/wineTypes'

const PROFILES = {
  rotwein: {
    label: 'Der Rotwein-Liebhaber',
    desc: 'Kräftig, komplex, charakterstark.',
    type: WINE_TYPE.ROT,
  },
  weisswein: {
    label: 'Der Weißwein-Enthusiast',
    desc: 'Frisch, aromatisch, mineralisch.',
    type: WINE_TYPE.WEISS,
  },
  rose: {
    label: 'Der Rosé-Connaisseur',
    desc: 'Verspielt, frisch, mediterran.',
    type: WINE_TYPE.ROSE,
  },
  champagner: {
    label: 'Der Prestige-Genießer',
    desc: 'Nur das Beste. Perlage, Tiefe, Komplexität.',
    type: WINE_TYPE.CHAMPAGNER,
  },
}

const MAX_RECS = 3

export function DNAResultScreen({ dna, liked, supers, onNext }) {
  const profile = PROFILES[dna] || PROFILES.weisswein
  const recommendations = HAWESKO_WINES.filter((w) => w.type === profile.type).slice(0, MAX_RECS)

  return (
    <Screen bg={colors.cream}>
      <TopBar />

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 40px' }}>
        <EyebrowLabel style={{ marginBottom: 16 }}>◆ Deine Wein-DNA</EyebrowLabel>

        <div
          style={{
            background: colors.white,
            borderRadius: 4,
            padding: '20px',
            marginBottom: 12,
            borderLeft: `4px solid ${colors.red}`,
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ fontFamily: fonts.display, fontSize: 21, color: colors.black, fontWeight: 700, marginBottom: 8 }}>
            {profile.label}
          </div>
          <div
            style={{
              fontSize: 14,
              color: colors.grayMid,
              fontFamily: fonts.body,
              lineHeight: 1.7,
              marginBottom: 12,
            }}
          >
            {profile.desc}
          </div>
          <div
            style={{
              paddingTop: 10,
              borderTop: `1px solid ${colors.grayLine}`,
              display: 'flex',
              gap: 16,
            }}
          >
            <div style={{ fontSize: 12, color: colors.grayMid, fontFamily: fonts.body }}>
              <span style={{ color: colors.black, fontWeight: 600 }}>{liked.length}</span> Weine gemocht
            </div>
            {supers.length > 0 && (
              <div style={{ fontSize: 12, color: colors.grayMid, fontFamily: fonts.body }}>
                <span style={{ color: colors.gold, fontWeight: 600 }}>★ {supers.length}</span> Super-Likes
              </div>
            )}
          </div>
        </div>

        {supers.length > 0 && (
          <>
            <EyebrowLabel color={colors.gold} style={{ marginBottom: 8 }}>
              ★ Super-Likes
            </EyebrowLabel>
            {supers.map((w) => (
              <WineRow key={w.id} wine={w} highlighted />
            ))}
          </>
        )}

        <EyebrowLabel color={colors.grayMid} style={{ marginBottom: 8, marginTop: 4, letterSpacing: '0.12em' }}>
          Empfehlungen für dich
        </EyebrowLabel>
        {recommendations.map((w) => (
          <WineRow key={w.id} wine={w} showPrice />
        ))}

        <div style={{ marginTop: 18 }}>
          <Button onClick={onNext}>Zum Lernbereich</Button>
        </div>
      </div>
    </Screen>
  )
}

function WineRow({ wine, highlighted = false, showPrice = false }) {
  return (
    <div
      style={{
        background: colors.white,
        borderRadius: 4,
        padding: '11px 14px',
        marginBottom: 7,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        border: highlighted ? '1px solid rgba(196,150,42,0.22)' : `1px solid ${colors.grayLine}`,
      }}
    >
      <img
        src={wine.img}
        alt=""
        style={{ width: 28, height: 50, objectFit: 'contain', flexShrink: 0 }}
        onError={(e) => (e.target.style.display = 'none')}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, color: colors.grayMid, fontFamily: fonts.body }}>
          {wine.year} · {wine.region}
        </div>
        <div style={{ fontFamily: fonts.display, fontSize: 13, color: colors.black, fontWeight: 600 }}>
          {wine.name}
        </div>
        {showPrice && wine.price && (
          <div
            style={{
              fontSize: 12,
              color: colors.red,
              fontWeight: 700,
              fontFamily: fonts.body,
              marginTop: 2,
            }}
          >
            {wine.price}
          </div>
        )}
      </div>
    </div>
  )
}
