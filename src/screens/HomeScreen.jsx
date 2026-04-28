import { colors, fonts } from '../theme'
import { Screen } from '../components/Screen'
import { Logo } from '../components/Logo'
import { CorkBadge } from '../components/CorkBadge'
import { EyebrowLabel } from '../components/EyebrowLabel'
import { WineGlassIcon } from '../components/icons/WineGlassIcon'
import { getTier, getNextTier, getTierProgress } from '../data/tiers'

const SECTIONS = [
  { key: 'learn',     roman: 'I',   title: 'Lernen',                  sub: 'Vokabeln · Regionen · Rebsorten · Pairing · Degustation' },
  { key: 'discover',  roman: 'II',  title: 'Weine entdecken',         sub: '11 HAWESKO-Weine per Swipe entdecken' },
  { key: 'winzer',    roman: 'III', title: 'Winzer Collection',      sub: 'Etiketten sammeln · Schneider · Metzger · Dreissigacker' },
  { key: 'keller',    roman: 'IV',  title: 'Mein HAWESKO Weinkeller', sub: 'Deine Flaschen tracken · Trinkfenster · Notizen' },
  { key: 'community', roman: 'V',   title: 'Wine Communities',        sub: 'Austauschen · Entdecken · 5 öffentliche Communities' },
  { key: 'cert',      roman: 'VI',  title: 'Status & Vorteile',       sub: 'Tier-Übersicht · Korken · Streak-Meilensteine' },
]

export function HomeScreen({ liked, corks, corks12m, streak, onNav, onOpenStatus }) {
  const tier = getTier(corks12m)
  const nextTier = getNextTier(corks12m)
  const progress = getTierProgress(corks12m)

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
        <Logo />
        <CorkBadge count={corks} onClick={onOpenStatus} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 24px' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: fonts.display, fontSize: 24, color: colors.black, fontWeight: 600 }}>
            Guten Tag.
          </div>
          <div style={{ fontSize: 13, color: colors.grayMid, fontFamily: fonts.body, marginTop: 3 }}>
            Dein Lernpfad wartet.
          </div>
        </div>

        {/* Tier card */}
        <button
          onClick={onOpenStatus}
          aria-label={`Status: Level ${tier.roman}, ${tier.name}. Details öffnen.`}
          style={{
            width: '100%',
            background: tier.color,
            borderRadius: 4,
            padding: '16px 18px',
            marginBottom: 11,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: 'none',
            textAlign: 'left',
          }}
        >
          <div style={{ flex: 1 }}>
            <EyebrowLabel color="rgba(255,255,255,0.5)" style={{ letterSpacing: '0.15em', marginBottom: 3 }}>
              Level {tier.roman}
            </EyebrowLabel>
            <div style={{ fontFamily: fonts.display, fontSize: 16, color: colors.white, fontWeight: 600, marginBottom: 8 }}>
              {tier.name}
            </div>
            {nextTier && (
              <>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2, marginBottom: 4, maxWidth: 180 }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: colors.white, borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: fonts.body }}>
                  {corks12m.toLocaleString('de-DE')} / {nextTier.min12m.toLocaleString('de-DE')} Korken
                </div>
              </>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginLeft: 16 }}>
            <WineGlassIcon size={24} color="rgba(255,255,255,0.85)" />
            <div style={{ fontFamily: fonts.display, fontSize: 22, color: colors.white, fontWeight: 700, lineHeight: 1 }}>
              {streak}
            </div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', fontFamily: fonts.body, letterSpacing: '0.1em' }}>
              TAGE
            </div>
          </div>
        </button>

        {/* Daily Dose */}
        <button
          onClick={() => onNav('daily')}
          style={{
            width: '100%',
            background: `linear-gradient(135deg,${colors.gold},${colors.goldLight})`,
            borderRadius: 4,
            padding: '14px 18px',
            marginBottom: 10,
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 3, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <WineGlassIcon size={20} color="rgba(26,26,26,0.65)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fonts.display, fontSize: 15, color: colors.black, fontWeight: 700 }}>
              Daily Dose
            </div>
            <div style={{ fontSize: 11, color: 'rgba(26,26,26,0.55)', fontFamily: fonts.body, marginTop: 1 }}>
              10 Fragen täglich · Streak aufbauen · +5 Tagesbonus
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <WineGlassIcon size={14} color={colors.black} />
            <span style={{ fontSize: 9, color: colors.black, fontFamily: fonts.body, fontWeight: 600 }}>
              {streak}
            </span>
          </div>
        </button>

        {/* Sections */}
        <EyebrowLabel color={colors.grayLight} style={{ marginBottom: 8 }}>Bereiche</EyebrowLabel>
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => onNav(s.key)}
            style={{
              width: '100%',
              background: colors.white,
              borderRadius: 4,
              padding: '13px 16px',
              marginBottom: 9,
              border: `1px solid ${colors.grayLine}`,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 3, background: colors.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontSize: 11, color: colors.red, fontWeight: 700, flexShrink: 0 }}>
              {s.roman}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fonts.display, fontSize: 14, color: colors.black, fontWeight: 600 }}>
                {s.title}
              </div>
              <div style={{ fontSize: 11, color: colors.grayMid, fontFamily: fonts.body, marginTop: 1 }}>
                {s.sub}
              </div>
            </div>
            <span style={{ fontSize: 18, color: colors.grayLight }} aria-hidden="true">›</span>
          </button>
        ))}

        {/* Coming soon */}
        <div style={{ background: colors.black, borderRadius: 4, padding: '14px 18px', border: '1px solid rgba(196,150,42,0.2)', marginTop: 2 }}>
          <EyebrowLabel color={colors.gold} style={{ marginBottom: 5 }}>Coming Soon</EyebrowLabel>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: fonts.display, fontSize: 15, color: colors.white, fontWeight: 600, marginBottom: 4 }}>
                Flasche scannen
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', fontFamily: fonts.body, lineHeight: 1.65, maxWidth: 220 }}>
                Scanne eine Flasche → Pairing-Empfehlungen & Tasting Notes → Korken kassieren.
              </div>
            </div>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.3 }} aria-hidden="true">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={colors.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="13" r="4" stroke={colors.gold} strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Liked wines preview */}
        {liked.length > 0 && (
          <>
            <EyebrowLabel color={colors.grayLight} style={{ marginBottom: 8, marginTop: 18 }}>
              Deine Auswahl
            </EyebrowLabel>
            <div style={{ display: 'flex', gap: 9, overflowX: 'auto', paddingBottom: 4 }}>
              {liked.slice(0, 5).map((w) => (
                <div key={w.id} style={{ background: colors.white, borderRadius: 4, padding: '11px 11px', minWidth: 112, border: `1px solid ${colors.grayLine}`, flexShrink: 0 }}>
                  <img src={w.img} alt="" style={{ width: '100%', height: 58, objectFit: 'contain', marginBottom: 7 }} onError={(e) => (e.target.style.display = 'none')} />
                  <div style={{ fontSize: 10, color: colors.grayMid, fontFamily: fonts.body }}>{w.year}</div>
                  <div style={{ fontFamily: fonts.display, fontSize: 11, color: colors.black, fontWeight: 600, lineHeight: 1.3 }}>
                    {w.name.split(' ').slice(0, 3).join(' ')}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Screen>
  )
}
