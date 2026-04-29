import { useState } from 'react'
import { usePersistedState } from './hooks/usePersistedState'
import { useDailyStreak } from './hooks/useDailyStreak'
import { useDailyLearnCap } from './hooks/useDailyLearnCap'
import {
  DAILY_LEARN_CAP,
  QUIZ_RESULT_BONUS,
  DNA_REWARDS,
} from './data/rewards'

import { WelcomeScreen } from './screens/WelcomeScreen'
import { WissensCheckScreen } from './screens/WissensCheckScreen'
import { QuizResultScreen } from './screens/QuizResultScreen'
import { TasteDNAScreen } from './screens/TasteDNAScreen'
import { DNAResultScreen } from './screens/DNAResultScreen'
import { HomeScreen } from './screens/HomeScreen'
import { LearnScreen } from './screens/LearnScreen'
import { DailyDoseScreen } from './screens/DailyDoseScreen'
import { DiscoverScreen } from './screens/DiscoverScreen'
import { WinzerCollectionScreen } from './screens/WinzerCollectionScreen'
import { WeinkellerScreen } from './screens/WeinkellerScreen'
import { CommunityScreen } from './screens/CommunityScreen'
import { StatusScreen } from './screens/StatusScreen'

/**
 * ─── ROOT APP ─────────────────────────────────────────────────────────────
 *
 * Owns all state that needs to survive screen navigation:
 *   - Persistent data (corks, keller, collected, etc.) goes through
 *     `usePersistedState` so reloads don't reset the user's progress.
 *   - Streak goes through `useDailyStreak` which enforces "once per day".
 *   - Ephemeral UI state (current screen, status modal) stays local.
 *
 * Each screen is a leaf — it receives data and callbacks as props and is
 * unaware of routing or persistence concerns.
 */
export default function App() {
  // ─── Persisted user data ──────────────────────────────────────────────
  const [corks, setCorks] = usePersistedState('hawesko.corks', 0)
  const [corks12m, setCorks12m] = usePersistedState('hawesko.corks12m', 0)
  const [collected, setCollected] = usePersistedState('hawesko.collected', {})
  const [keller, setKeller] = usePersistedState('hawesko.keller', [])
  const [consumed, setConsumed] = usePersistedState('hawesko.consumed', [])

  // Onboarding results — persisted so the user lands on Home after refresh
  // instead of having to re-do the whole flow.
  const [level, setLevel] = usePersistedState('hawesko.level', null)
  const [pct, setPct] = usePersistedState('hawesko.pct', 0)
  const [dna, setDna] = usePersistedState('hawesko.dna', null)
  const [liked, setLiked] = usePersistedState('hawesko.liked', [])
  const [supers, setSupers] = usePersistedState('hawesko.supers', [])

  // Streak: per-day-tracked, cannot be farmed.
  const { days: streak, canCompleteToday, completeToday } = useDailyStreak()

  // Daily cap on free learning (vocab + topic quizzes). Daily Dose, streak
  // bonuses, and Winzer-Etiketten are intentionally outside this cap — they
  // have their own natural rate-limiting (once per day / scarce events).
  const learnCap = useDailyLearnCap(DAILY_LEARN_CAP)

  // ─── Ephemeral UI state ───────────────────────────────────────────────
  const [screen, setScreen] = useState(dna ? 'home' : 'welcome')
  const [showStatus, setShowStatus] = useState(false)

  // ─── Handlers ─────────────────────────────────────────────────────────
  function addCorks(n) {
    setCorks((c) => c + n)
    setCorks12m((c) => c + n)
  }

  /**
   * Cap-respecting variant for the Lernportal. Awards up to `n` corks,
   * truncated by the day's remaining cap. Returns the actually-awarded
   * amount so the caller can show transparent feedback.
   */
  function awardLearnCorks(n) {
    const awarded = learnCap.awardCorks(n)
    if (awarded > 0) addCorks(awarded)
    return awarded
  }

  function handleQuizComplete(newLevel, newPct) {
    setLevel(newLevel)
    setPct(newPct)
    const bonus =
      newPct >= 70 ? QUIZ_RESULT_BONUS.kenner
      : newPct >= 40 ? QUIZ_RESULT_BONUS.entdecker
      : QUIZ_RESULT_BONUS.einsteiger
    addCorks(bonus)
    setScreen('quiz-result')
  }

  function handleDNAComplete(newDna, newLiked, newSupers) {
    setDna(newDna)
    setLiked(newLiked)
    setSupers(newSupers)
    addCorks(newLiked.length * DNA_REWARDS.perLike + newSupers.length * DNA_REWARDS.perSuper)
    setScreen('dna-result')
  }

  // ─── Render ───────────────────────────────────────────────────────────
  // Status modal is rendered as an overlay above any other screen.
  if (showStatus) {
    return (
      <Frame>
        <StatusScreen
          corks={corks}
          corks12m={corks12m}
          streak={streak}
          onClose={() => setShowStatus(false)}
        />
      </Frame>
    )
  }

  const screens = {
    welcome: <WelcomeScreen onStart={() => setScreen('quiz')} />,

    quiz: <WissensCheckScreen onComplete={handleQuizComplete} />,

    'quiz-result': (
      <QuizResultScreen
        level={level}
        pct={pct}
        corks={corks}
        onNext={() => setScreen('dna')}
      />
    ),

    dna: <TasteDNAScreen onComplete={handleDNAComplete} />,

    'dna-result': (
      <DNAResultScreen
        dna={dna}
        liked={liked}
        supers={supers}
        onNext={() => setScreen('home')}
      />
    ),

    home: (
      <HomeScreen
        liked={liked}
        corks={corks}
        corks12m={corks12m}
        streak={streak}
        onNav={setScreen}
        onOpenStatus={() => setShowStatus(true)}
      />
    ),

    learn: (
      <LearnScreen
        corks={corks}
        awardCorks={awardLearnCorks}
        capRemaining={learnCap.remaining}
        onBack={() => setScreen('home')}
      />
    ),

    daily: (
      <DailyDoseScreen
        corks={corks}
        corks12m={corks12m}
        streak={streak}
        canCompleteToday={canCompleteToday}
        onAddCorks={addCorks}
        onCompleteDailyDose={completeToday}
        onBack={() => setScreen('home')}
      />
    ),

    discover: <DiscoverScreen corks={corks} onBack={() => setScreen('home')} />,

    winzer: (
      <WinzerCollectionScreen
        collected={collected}
        onCollect={(key, data) => setCollected((p) => ({ ...p, [key]: data }))}
        onAddCorks={addCorks}
        onBack={() => setScreen('home')}
      />
    ),

    keller: (
      <WeinkellerScreen
        keller={keller}
        onUpdateKeller={setKeller}
        consumed={consumed}
        onUpdateConsumed={setConsumed}
        onBack={() => setScreen('home')}
      />
    ),

    community: <CommunityScreen corks={corks} onBack={() => setScreen('home')} />,

    cert: (
      <StatusScreen
        corks={corks}
        corks12m={corks12m}
        streak={streak}
        onClose={() => setScreen('home')}
      />
    ),
  }

  return <Frame>{screens[screen] || screens.home}</Frame>
}

/** Outer wrapper that centers the phone-shaped Screen on a dark backdrop. */
function Frame({ children }) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0D0608',
      }}
    >
      {children}
    </div>
  )
}
