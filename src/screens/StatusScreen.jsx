import { colors, fonts } from '../theme'
import { Screen } from '../components/Screen'
import { Logo } from '../components/Logo'
import { CORK_IMG } from '../assets/cork'
import { WineGlassIcon } from '../components/icons/WineGlassIcon'
import { TIERS, STREAK_BONUSES, getTier, getNextTier, getTierProgress } from '../data/tiers'

const EARN_TABLE = [
  ['Richtige Quiz-Antwort',                       '+3'],
  ['Vokabel gelernt',                             '+2'],
  ['Daily Dose abgeschlossen',                    '+20'],
  ['Tagesbonus (aktiver Streak)',                 '+5'],
  ['7-Tage Streak',                               '+15'],
  ['14-Tage Streak',                              '+40'],
  ['30-Tage Streak',                              '+100'],
  ['Etikett in Winzer Collection gescannt',       '+10'],
  ['Winzer Collection vollständig',               '+50'],
  ['Erste Bestellung bei HAWESKO',                '+50 (bald)'],
  ['Jeder € Einkauf',                             '+1 (bald)'],
  ['Bewertung hinterlassen',                      '+10 (bald)'],
]

export function StatusScreen({ corks, corks12m, streak, onClose }) {
  const tier = getTier(corks12m)
  const next = getNextTier(corks12m)
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
        <button
          onClick={onClose}
          aria-label="Schließen"
          style={{
            fontSize: 22,
            color: colors.grayMid,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 36px' }}>
        <TierHero tier={tier} next={next} progress={progress} corks={corks} corks12m={corks12m} streak={streak} />

        <HowItWorksCard />

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
          Korken verdienen
        </div>
        <div
          style={{
            background: colors.white,
            borderRadius: 4,
            border: `1px solid ${colors.grayLine}`,
            overflow: 'hidden',
            marginBottom: 16,
          }}
        >
          {EARN_TABLE.map(([label, value], i) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 16px',
                borderBottom: i < EARN_TABLE.length - 1 ? `1px solid ${colors.grayLine}` : 'none',
              }}
            >
              <span style={{ fontSize: 13, color: colors.grayDark, fontFamily: fonts.body }}>
                {label}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: value.includes('bald') ? colors.grayLight : colors.gold,
                  fontWeight: 600,
                  fontFamily: fonts.body,
                  whiteSpace: 'nowrap',
                  marginLeft: 12,
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

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
          Alle Level & Vorteile
        </div>
        {TIERS.map((t) => (
          <TierCard key={t.id} tier={t} currentTierId={tier.id} corks12m={corks12m} />
        ))}

        <div
          style={{
            fontSize: 9,
            color: colors.grayLight,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontFamily: fonts.body,
            marginBottom: 10,
            marginTop: 4,
          }}
        >
          Streak-Meilensteine
        </div>
        <div
          style={{
            background: colors.white,
            borderRadius: 4,
            border: `1px solid ${colors.grayLine}`,
            overflow: 'hidden',
          }}
        >
          {STREAK_BONUSES.map((sb, i) => {
            const reached = streak >= sb.days
            return (
              <div
                key={sb.days}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  borderBottom: i < STREAK_BONUSES.length - 1 ? `1px solid ${colors.grayLine}` : 'none',
                  background: reached ? '#FAFAF8' : colors.white,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <WineGlassIcon size={16} color={reached ? colors.red : colors.grayLight} />
                  <span
                    style={{
                      fontSize: 13,
                      color: reached ? colors.black : colors.grayLight,
                      fontFamily: fonts.body,
                      fontWeight: reached ? 600 : 400,
                    }}
                  >
                    {sb.days} Tage
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {reached && <span style={{ fontSize: 10, color: colors.green }}>✓</span>}
                  <span
                    style={{
                      fontSize: 13,
                      color: reached ? colors.gold : colors.grayLight,
                      fontWeight: 600,
                      fontFamily: fonts.body,
                    }}
                  >
                    +{sb.bonus}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Screen>
  )
}

// ─── Sub-components ─────────────────────────────────────────────────────

function TierHero({ tier, next, progress, corks, corks12m, streak }) {
  return (
    <div
      style={{
        background: tier.color,
        borderRadius: 6,
        padding: '20px',
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
        }}
      />
      <div
        style={{
          fontSize: 9,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontFamily: fonts.body,
          marginBottom: 4,
        }}
      >
        Level {tier.roman}
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 23,
          color: colors.white,
          fontWeight: 700,
          marginBottom: 3,
        }}
      >
        {tier.name}
      </div>
      <div
        style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.55)',
          fontFamily: fonts.body,
          fontStyle: 'italic',
          marginBottom: 16,
        }}
      >
        {tier.tagline}
      </div>

      {next ? (
        <>
          <div
            style={{
              height: 4,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 2,
              marginBottom: 5,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: colors.white,
                borderRadius: 2,
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: fonts.body }}>
              {corks12m.toLocaleString('de-DE')} / {next.min12m.toLocaleString('de-DE')} Korken (12 Monate)
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: fonts.body }}>
              → {next.name}
            </div>
          </div>
        </>
      ) : (
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontFamily: fonts.body }}>
          Höchstes Level erreicht.
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: 20,
          marginTop: 16,
          paddingTop: 14,
          borderTop: '1px solid rgba(255,255,255,0.18)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <img src={CORK_IMG} alt="" aria-hidden="true" style={{ width: 18, height: 11 }} />
            <span
              style={{
                fontFamily: fonts.display,
                fontSize: 20,
                color: colors.white,
                fontWeight: 700,
              }}
            >
              {corks.toLocaleString('de-DE')}
            </span>
          </div>
          <div
            style={{
              fontSize: 9,
              color: 'rgba(255,255,255,0.4)',
              fontFamily: fonts.body,
              marginTop: 2,
              letterSpacing: '0.1em',
            }}
          >
            LIFETIME KORKEN
          </div>
        </div>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.18)' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <WineGlassIcon size={18} color={colors.white} />
            <span
              style={{
                fontFamily: fonts.display,
                fontSize: 20,
                color: colors.white,
                fontWeight: 700,
              }}
            >
              {streak}
            </span>
          </div>
          <div
            style={{
              fontSize: 9,
              color: 'rgba(255,255,255,0.4)',
              fontFamily: fonts.body,
              marginTop: 2,
              letterSpacing: '0.1em',
            }}
          >
            TAGE STREAK
          </div>
        </div>
      </div>
    </div>
  )
}

function HowItWorksCard() {
  return (
    <div
      style={{
        background: colors.white,
        borderRadius: 4,
        padding: '14px 16px',
        marginBottom: 16,
        border: `1px solid ${colors.grayLine}`,
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: colors.grayMid,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontFamily: fonts.body,
          marginBottom: 8,
        }}
      >
        Wie funktioniert der Status?
      </div>
      <div style={{ fontSize: 13, color: colors.grayDark, fontFamily: fonts.body, lineHeight: 1.75 }}>
        Dein <span style={{ fontWeight: 600, color: colors.black }}>Level</span> basiert auf
        Korken der letzten 12 Monate. Bleib aktiv — nach 12 Monaten Inaktivität sinkt der Status um
        ein Level. <span style={{ fontWeight: 600, color: colors.black }}>Lifetime-Korken verfallen nie.</span>
      </div>
    </div>
  )
}

function TierCard({ tier, currentTierId, corks12m }) {
  const isCurrent = tier.id === currentTierId
  const isUnlocked = corks12m >= tier.min12m

  return (
    <div
      style={{
        background: colors.white,
        borderRadius: 4,
        padding: '16px 18px',
        marginBottom: 10,
        border: `1px solid ${isCurrent ? tier.color : colors.grayLine}`,
        borderLeft: isCurrent ? `4px solid ${tier.color}` : `1px solid ${colors.grayLine}`,
        opacity: tier.id > currentTierId + 1 ? 0.4 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isCurrent && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: tier.color,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 3,
              background: isCurrent ? tier.color : colors.cream,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fonts.display,
              fontSize: 12,
              color: isCurrent ? colors.white : isUnlocked ? tier.color : colors.grayLight,
              fontWeight: 700,
            }}
          >
            {tier.roman}
          </div>
          <div>
            <div style={{ fontFamily: fonts.display, fontSize: 16, color: colors.black, fontWeight: 600 }}>
              {tier.name}
            </div>
            <div style={{ fontSize: 11, color: colors.grayLight, fontFamily: fonts.body }}>
              ab {tier.min12m.toLocaleString('de-DE')} Korken / Jahr
            </div>
          </div>
        </div>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.1em',
            background: isCurrent ? tier.color : isUnlocked ? colors.green : colors.grayBg,
            color: isCurrent || isUnlocked ? colors.white : colors.grayLight,
            borderRadius: 2,
            padding: '3px 7px',
            fontFamily: fonts.body,
            whiteSpace: 'nowrap',
          }}
        >
          {isCurrent ? 'Aktiv' : isUnlocked ? 'Erreicht' : 'Gesperrt'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {tier.benefits.map((benefit, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span
              style={{
                fontSize: 7,
                color: isUnlocked ? tier.color : colors.grayLight,
                marginTop: 4,
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              ◆
            </span>
            <span
              style={{
                fontSize: 12,
                color: isUnlocked ? colors.grayDark : colors.grayLight,
                fontFamily: fonts.body,
                lineHeight: 1.6,
              }}
            >
              {benefit}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
