import { useMemo, useState } from 'react'
import { colors, fonts } from '../theme'
import { Screen } from '../components/Screen'
import { Button } from '../components/Button'
import { CorkBadge } from '../components/CorkBadge'
import { BottomSheet } from '../components/BottomSheet'
import { EyebrowLabel } from '../components/EyebrowLabel'
import { COMMUNITIES } from '../data/communities'

/**
 * Wine communities — list, detail and create-private flows.
 *
 * Local-only state (joined, custom communities, locally-posted messages) is
 * deliberately kept inside this screen — these are session-scoped UX
 * affordances, not persistent user data.
 */
export function CommunityScreen({ corks, onBack }) {
  const [view, setView] = useState('list')
  const [activeCommunityId, setActiveCommunityId] = useState(null)
  const [joined, setJoined] = useState({})
  const [newMsg, setNewMsg] = useState('')
  const [localPosts, setLocalPosts] = useState({})
  const [showCreate, setShowCreate] = useState(false)
  const [newComm, setNewComm] = useState({ name: '', desc: '', type: 'rebsorte' })
  const [customComms, setCustomComms] = useState([])

  const allCommunities = useMemo(() => [...COMMUNITIES, ...customComms], [customComms])
  const activeCommunity = allCommunities.find((c) => c.id === activeCommunityId)
  const posts = activeCommunity
    ? [...(localPosts[activeCommunity.id] || []), ...activeCommunity.posts]
    : []

  function sendMessage() {
    if (!newMsg.trim() || !activeCommunity) return
    const msg = {
      id: Date.now(),
      user: 'Du',
      avatar: 'D',
      time: 'gerade eben',
      text: newMsg.trim(),
      likes: 0,
      replies: 0,
      isOwn: true,
    }
    setLocalPosts((p) => ({
      ...p,
      [activeCommunity.id]: [msg, ...(p[activeCommunity.id] || [])],
    }))
    setNewMsg('')
  }

  function createCommunity() {
    if (!newComm.name.trim()) return
    const community = {
      id: `custom-${Date.now()}`,
      title: newComm.name,
      type: newComm.type,
      members: 1,
      tag: 'Privat',
      tagColor: colors.grayDark,
      joined: true,
      private: true,
      desc: newComm.desc || 'Deine private Community.',
      posts: [],
      reward: '',
    }
    setCustomComms((p) => [...p, community])
    setJoined((j) => ({ ...j, [community.id]: true }))
    setShowCreate(false)
    setNewComm({ name: '', desc: '', type: 'rebsorte' })
  }

  function openCommunity(id) {
    setActiveCommunityId(id)
    setView('detail')
  }

  // ─── List view ─────────────────────────────────────────────────────────
  if (view === 'list') {
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
            onClick={onBack}
            aria-label="Zurück"
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
          <CorkBadge count={corks} small />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 36px' }}>
          <EyebrowLabel style={{ marginBottom: 4 }}>Communities</EyebrowLabel>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 6,
            }}
          >
            <div style={{ fontFamily: fonts.display, fontSize: 22, color: colors.black, fontWeight: 600 }}>
              Wein-Communities.
            </div>
          </div>
          <div
            style={{
              fontSize: 13,
              color: colors.grayMid,
              fontFamily: fonts.body,
              lineHeight: 1.7,
              marginBottom: 20,
            }}
          >
            Tausche dich mit anderen Weinliebhabern aus — nach Region, Rebsorte oder Thema.
          </div>

          <button
            onClick={() => setShowCreate(true)}
            style={{
              width: '100%',
              background: colors.black,
              borderRadius: 4,
              padding: '14px 18px',
              marginBottom: 16,
              border: '1px solid rgba(196,150,42,0.25)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 3,
                background: 'rgba(196,150,42,0.15)',
                border: '1px solid rgba(196,150,42,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 20,
                color: colors.gold,
              }}
            >
              +
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fonts.display, fontSize: 15, color: colors.white, fontWeight: 600 }}>
                Private Community erstellen
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.38)',
                  fontFamily: fonts.body,
                  marginTop: 1,
                }}
              >
                Nur für eingeladene Mitglieder · deine Regeln
              </div>
            </div>
            <span
              style={{
                fontSize: 9,
                background: 'rgba(196,150,42,0.2)',
                color: colors.gold,
                borderRadius: 2,
                padding: '3px 8px',
                fontFamily: fonts.body,
                fontWeight: 600,
              }}
            >
              NEU
            </span>
          </button>

          {customComms.map((c) => (
            <div
              key={c.id}
              style={{
                background: colors.white,
                borderRadius: 4,
                padding: '16px',
                marginBottom: 10,
                border: `1px solid ${colors.grayLine}`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: colors.grayDark,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 8,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        background: 'rgba(61,61,61,0.1)',
                        color: colors.grayDark,
                        borderRadius: 2,
                        padding: '2px 7px',
                        fontFamily: fonts.body,
                      }}
                    >
                      PRIVAT
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 16,
                      color: colors.black,
                      fontWeight: 600,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: colors.grayMid,
                      fontFamily: fonts.body,
                      marginTop: 2,
                    }}
                  >
                    {c.desc}
                  </div>
                </div>
              </div>
              <button
                onClick={() => openCommunity(c.id)}
                style={{
                  width: '100%',
                  background: colors.grayBg,
                  border: `1px solid ${colors.grayLine}`,
                  borderRadius: 3,
                  padding: '8px',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: colors.grayDark,
                  fontFamily: fonts.body,
                  fontWeight: 600,
                }}
              >
                Öffnen
              </button>
            </div>
          ))}

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
            Öffentliche Communities
          </div>
          {COMMUNITIES.map((c) => (
            <CommunityListItem
              key={c.id}
              community={c}
              isJoined={joined[c.id]}
              onOpen={() => openCommunity(c.id)}
              onToggleJoin={() => setJoined((j) => ({ ...j, [c.id]: !j[c.id] }))}
            />
          ))}
        </div>

        {showCreate && (
          <BottomSheet title="Private Community" onClose={() => setShowCreate(false)}>
            <div style={{ padding: '22px 20px 40px' }}>
              <div
                style={{
                  fontSize: 9,
                  color: colors.grayMid,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: fonts.body,
                  marginBottom: 6,
                }}
              >
                Name
              </div>
              <input
                value={newComm.name}
                onChange={(e) => setNewComm((p) => ({ ...p, name: e.target.value }))}
                placeholder="z.B. Riesling-Freunde Hamburg"
                style={{
                  width: '100%',
                  border: `1.5px solid ${colors.grayLine}`,
                  borderRadius: 4,
                  padding: '12px',
                  fontFamily: fonts.body,
                  fontSize: 13,
                  color: colors.black,
                  outline: 'none',
                  marginBottom: 12,
                  boxSizing: 'border-box',
                }}
              />

              <div
                style={{
                  fontSize: 9,
                  color: colors.grayMid,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: fonts.body,
                  marginBottom: 6,
                }}
              >
                Beschreibung (optional)
              </div>
              <input
                value={newComm.desc}
                onChange={(e) => setNewComm((p) => ({ ...p, desc: e.target.value }))}
                placeholder="Worum geht es in eurer Community?"
                style={{
                  width: '100%',
                  border: `1.5px solid ${colors.grayLine}`,
                  borderRadius: 4,
                  padding: '12px',
                  fontFamily: fonts.body,
                  fontSize: 13,
                  color: colors.black,
                  outline: 'none',
                  marginBottom: 16,
                  boxSizing: 'border-box',
                }}
              />

              <div
                style={{
                  background: colors.feedback.successBg,
                  borderRadius: 4,
                  padding: '10px 14px',
                  marginBottom: 16,
                  display: 'flex',
                  gap: 8,
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ color: colors.green, fontSize: 14, flexShrink: 0 }} aria-hidden="true">
                  🔒
                </span>
                <div
                  style={{
                    fontSize: 12,
                    color: colors.grayDark,
                    fontFamily: fonts.body,
                    lineHeight: 1.6,
                  }}
                >
                  Private Communities sind nur für eingeladene Mitglieder sichtbar. Du kannst Freunde per
                  Link einladen.
                </div>
              </div>

              <Button onClick={createCommunity} disabled={!newComm.name.trim()}>
                Community erstellen
              </Button>
            </div>
          </BottomSheet>
        )}
      </Screen>
    )
  }

  // ─── Detail / feed view ───────────────────────────────────────────────
  if (!activeCommunity) return null

  return (
    <Screen bg={colors.cream}>
      <div
        style={{
          padding: '52px 18px 0',
          background: colors.white,
          borderBottom: `1px solid ${colors.grayLine}`,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: activeCommunity.tagColor,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <button
            onClick={() => setView('list')}
            aria-label="Zurück zur Community-Liste"
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
          <CorkBadge count={corks} small />
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              background: activeCommunity.tagColor + '18',
              color: activeCommunity.tagColor,
              borderRadius: 2,
              padding: '2px 7px',
              fontFamily: fonts.body,
            }}
          >
            {activeCommunity.tag}
          </span>
          <span style={{ fontSize: 10, color: colors.grayLight, fontFamily: fonts.body }}>
            {(activeCommunity.members + (joined[activeCommunity.id] ? 1 : 0)).toLocaleString('de-DE')} Mitglieder
          </span>
        </div>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 19,
            color: colors.black,
            fontWeight: 700,
            marginBottom: 3,
          }}
        >
          {activeCommunity.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: colors.grayMid,
            fontFamily: fonts.body,
            lineHeight: 1.55,
            marginBottom: 12,
          }}
        >
          {activeCommunity.desc}
        </div>
        <div style={{ display: 'flex', gap: 8, paddingBottom: 12 }}>
          <button
            onClick={() =>
              setJoined((j) => ({ ...j, [activeCommunity.id]: !j[activeCommunity.id] }))
            }
            style={{
              background: joined[activeCommunity.id] ? colors.grayBg : activeCommunity.tagColor,
              color: joined[activeCommunity.id] ? colors.grayDark : colors.white,
              border: joined[activeCommunity.id] ? `1px solid ${colors.grayLine}` : 'none',
              borderRadius: 3,
              padding: '8px 18px',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: fonts.body,
              fontWeight: 600,
            }}
          >
            {joined[activeCommunity.id] ? 'Beigetreten ✓' : 'Community beitreten'}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 80px' }}>
        {posts.map((post) => (
          <FeedPost key={post.id} post={post} accent={activeCommunity.tagColor} />
        ))}
      </div>

      {/* Message input */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: colors.white,
          borderTop: `1px solid ${colors.grayLine}`,
          padding: '10px 14px 24px',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            flex: 1,
            background: colors.grayBg,
            borderRadius: 22,
            padding: '10px 16px',
            border: `1px solid ${colors.grayLine}`,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Schreib etwas…"
            aria-label="Nachricht eingeben"
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              fontFamily: fonts.body,
              fontSize: 13,
              color: colors.black,
              width: '100%',
            }}
          />
        </div>
        <button
          onClick={sendMessage}
          aria-label="Nachricht senden"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: newMsg.trim() ? activeCommunity.tagColor : colors.grayLine,
            border: 'none',
            cursor: newMsg.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <line
              x1="22"
              y1="2"
              x2="11"
              y2="13"
              stroke={colors.white}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <polygon
              points="22 2 15 22 11 13 2 9 22 2"
              stroke={colors.white}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </Screen>
  )
}

// ─── Sub-components ─────────────────────────────────────────────────────

function CommunityListItem({ community, isJoined, onOpen, onToggleJoin }) {
  return (
    <div
      style={{
        background: colors.white,
        borderRadius: 4,
        padding: '16px',
        marginBottom: 10,
        border: `1px solid ${colors.grayLine}`,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: community.tagColor,
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 8,
        }}
      >
        <div style={{ flex: 1, paddingRight: 10 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 5 }}>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                background: community.tagColor + '18',
                color: community.tagColor,
                borderRadius: 2,
                padding: '2px 7px',
                fontFamily: fonts.body,
              }}
            >
              {community.tag}
            </span>
            <span style={{ fontSize: 10, color: colors.grayLight, fontFamily: fonts.body }}>
              {community.members.toLocaleString('de-DE')} Mitglieder
            </span>
          </div>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 16,
              color: colors.black,
              fontWeight: 600,
              marginBottom: 3,
            }}
          >
            {community.title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: colors.grayMid,
              fontFamily: fonts.body,
              lineHeight: 1.55,
            }}
          >
            {community.desc}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1, fontSize: 11, color: colors.grayLight, fontFamily: fonts.body }}>
          {community.posts[0] && `"${community.posts[0].text.slice(0, 45)}…"`}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleJoin()
          }}
          style={{
            background: isJoined ? colors.grayBg : community.tagColor,
            color: isJoined ? colors.grayDark : colors.white,
            border: isJoined ? `1px solid ${colors.grayLine}` : 'none',
            borderRadius: 3,
            padding: '7px 16px',
            cursor: 'pointer',
            fontSize: 12,
            fontFamily: fonts.body,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {isJoined ? 'Beigetreten' : 'Beitreten'}
        </button>
      </div>
    </div>
  )
}

function FeedPost({ post, accent }) {
  return (
    <div
      style={{
        background: colors.white,
        borderRadius: 4,
        padding: '14px 16px',
        marginBottom: 10,
        border: `1px solid ${post.isOwn ? accent : colors.grayLine}`,
        borderLeft: post.isOwn ? `4px solid ${accent}` : `1px solid ${colors.grayLine}`,
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: post.isOwn ? accent : colors.grayBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: post.isOwn ? colors.white : colors.grayDark,
              fontFamily: fonts.body,
            }}
          >
            {post.avatar}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.black, fontFamily: fonts.body }}>
            {post.user}
          </div>
          <div style={{ fontSize: 10, color: colors.grayLight, fontFamily: fonts.body }}>
            {post.time}
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: 13,
          color: colors.grayDark,
          fontFamily: fonts.body,
          lineHeight: 1.7,
          marginBottom: 10,
        }}
      >
        {post.text}
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <button
          aria-label={`${post.likes} Likes`}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
              stroke={colors.grayLight}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: 11, color: colors.grayLight, fontFamily: fonts.body }}>
            {post.likes}
          </span>
        </button>
        <button
          aria-label={`${post.replies} Antworten`}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              stroke={colors.grayLight}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: 11, color: colors.grayLight, fontFamily: fonts.body }}>
            {post.replies} Antworten
          </span>
        </button>
      </div>
    </div>
  )
}
