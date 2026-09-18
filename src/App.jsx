import { useEffect, useState } from 'react';
import './App.css';
import { auth } from './lib/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { authGuard } from './lib/authGuard.js';
import { getDefaultLanguage } from './lib/translate.js';
import { GAME_SETTINGS, canUnlockNextLevel } from './data/questions.js';
import {
  getProfile,
  updateProfile,
  signOut,
  deleteAccount,
  resetAccountData,
} from './lib/auth.js';
import AuthScreen        from './components/AuthScreen.jsx';
import LandingPage       from './components/LandingPage.jsx';
import HomeScreen        from './components/HomeScreen.jsx';
import GameScreen        from './components/GameScreen.jsx';
import ProfileScreen     from './components/ProfileScreen.jsx';
import ResultScreen      from './components/ResultScreen.jsx';
import LeaderboardScreen from './components/LeaderboardScreen.jsx';
import LevelSelectScreen from './components/LevelSelectScreen.jsx';

const LEVEL_COUNT = 10;
const HELP_EMAIL = 'hello@emojiquiz.app';

function getTodayKey() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

function normalizeProfile(profile) {
  const safeProfile = profile ?? {};
  const todayKey = getTodayKey();
  const legacyLevel = Number(safeProfile.level ?? 1);
  const completedLevels = Array.isArray(safeProfile.completed_levels)
    ? safeProfile.completed_levels
        .map((level) => Number(level))
        .filter((level) => Number.isInteger(level) && level >= 1 && level <= LEVEL_COUNT)
        .sort((a, b) => a - b)
    : legacyLevel > 1
      ? Array.from({ length: Math.min(legacyLevel, LEVEL_COUNT) }, (_, index) => index + 1)
      : [];

  const highestUnlockedLevel = Math.min(
    Math.max(Number(safeProfile.highest_unlocked_level ?? legacyLevel ?? 1) || 1, 1),
    LEVEL_COUNT,
  );

  const shouldResetForNewDay = (safeProfile.last_daily_reset_date || '') !== todayKey;

  return {
    ...safeProfile,
    language: safeProfile.language || getDefaultLanguage(),
    completed_levels: shouldResetForNewDay ? [] : completedLevels,
    highest_unlocked_level: shouldResetForNewDay ? 1 : highestUnlockedLevel,
    level: shouldResetForNewDay ? 1 : Math.max(highestUnlockedLevel, completedLevels[completedLevels.length - 1] || 1),
    last_daily_reset_date: todayKey,
  };
}

function getNextPlayableLevel(profile, currentLevel) {
  const highestUnlockedLevel = Number(profile?.highest_unlocked_level ?? profile?.level ?? 1) || 1;
  const safeCurrentLevel = Math.min(Math.max(Number(currentLevel) || 1, 1), LEVEL_COUNT);
  const nextLevel = Math.min(safeCurrentLevel + 1, highestUnlockedLevel, LEVEL_COUNT);
  return nextLevel <= safeCurrentLevel ? safeCurrentLevel : nextLevel;
}

function HelpButton({ onOpen }) {
  return (
    <button type="button" className="help-button" onClick={onOpen} aria-label="Open help">
      ?
    </button>
  );
}

function HelpDialog({ open, topic, onClose, onSelectTopic }) {
  if (!open) return null;

  return (
    <div className="help-overlay" role="dialog" aria-modal="true" aria-label="Help dialog">
      <div className="help-card">
        <div className="help-header">
          <h3>Help</h3>
          <button type="button" className="secondary-button small-button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="help-action-row">
          <button
            type="button"
            className={`secondary-button ${topic === 'tutorial' ? 'active-help' : ''}`}
            onClick={() => onSelectTopic('tutorial')}
          >
            Tutorial?
          </button>
          <button
            type="button"
            className={`secondary-button ${topic === 'issues' ? 'active-help' : ''}`}
            onClick={() => onSelectTopic('issues')}
          >
            Functional issues?
          </button>
        </div>

        {topic === 'tutorial' ? (
          <div className="help-content">
            <p><strong>How to play:</strong></p>
            <ul>
              <li>Choose the best answer that matches the emoji clue.</li>
              <li>Answer before the timer ends to score correctly.</li>
              <li>Complete a level to unlock the next one.</li>
              <li>Replay cleared levels anytime from the level select screen.</li>
            </ul>
          </div>
        ) : (
          <div className="help-content">
            <p className="help-email">{HELP_EMAIL}</p>
            <p className="help-subtext">contact for inquiries and complaints</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resultSummary, setResultSummary] = useState({ score: 0, xpGained: 0, level: 1 });
  const [activeLevel, setActiveLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpTopic, setHelpTopic] = useState('tutorial');

  const loadProfile = async (user) => {
    const { profile: fetchedProfile, error } = await getProfile(user.uid, user);
    if (error) {
      console.error('Failed to load profile:', error);
      setLoading(false);
      return;
    }

    const normalizedProfile = normalizeProfile(fetchedProfile);
    const needsDailyReset = (fetchedProfile?.last_daily_reset_date || '') !== normalizedProfile.last_daily_reset_date;

    if (needsDailyReset) {
      await updateProfile(user.uid, {
        level: 1,
        highest_unlocked_level: 1,
        completed_levels: [],
        last_daily_reset_date: normalizedProfile.last_daily_reset_date,
      });
    }

    setAuthUser(user);
    setProfile(normalizedProfile);
    setActiveLevel(Math.min(Math.max(Number(normalizedProfile.level) || 1, 1), LEVEL_COUNT));
    setScreen('home');
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (authGuard.suppressed) return;

      if (user && user.emailVerified) {
        await loadProfile(user);
      } else if (user) {
        setAuthUser(user);
        setProfile(null);
        setScreen('auth');
        setLoading(false);
      } else {
        setAuthUser(null);
        setProfile(null);
        setScreen((prevScreen) => (prevScreen === 'landing' ? 'landing' : 'auth'));
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async (user) => {
    if (user.emailVerified) {
      await loadProfile(user);
    }
  };

  const handleProfileSave = async ({ username } = {}) => {
    if (!authUser) return;

    const nextUsername = String(username ?? profile?.username ?? '').trim();
    if (!nextUsername) return;

    const nextLanguage = profile?.language || getDefaultLanguage();
    const { error } = await updateProfile(authUser.uid, { username: nextUsername, language: nextLanguage });
    if (error) {
      console.error('Failed to update profile:', error);
      return;
    }
    setProfile((previous) => ({ ...previous, username: nextUsername, language: previous?.language || nextLanguage }));
    setScreen('home');
  };

  const handleGameFinish = async (score, xpGained, levelNumber = activeLevel) => {
    if (!authUser || !profile) return;

    const currentLevel = Math.min(Math.max(Number(levelNumber) || 1, 1), LEVEL_COUNT);
    const nextXp = (profile.xp || 0) + xpGained;
    const nextHighScore = Math.max(profile.high_score || 0, score);
    const accuracy = (score / GAME_SETTINGS.totalQuestions) * 100;
    const passedLevel = canUnlockNextLevel(score, GAME_SETTINGS.totalQuestions);
    const existingCompletedLevels = Array.isArray(profile.completed_levels)
      ? profile.completed_levels.map((level) => Number(level)).filter((level) => Number.isInteger(level) && level >= 1 && level <= LEVEL_COUNT)
      : [];
    const completedLevels = passedLevel
      ? Array.from(new Set([...existingCompletedLevels, currentLevel])).sort((a, b) => a - b)
      : existingCompletedLevels;
    const currentHighestUnlocked = Math.max(Number(profile.highest_unlocked_level ?? profile.level ?? 1) || 1, 1);
    const highestUnlockedLevel = passedLevel
      ? Math.min(Math.max(currentHighestUnlocked, currentLevel + 1), LEVEL_COUNT)
      : currentHighestUnlocked;

    const normalizedProfile = normalizeProfile({
      ...profile,
      xp: nextXp,
      completed_levels: completedLevels,
      highest_unlocked_level: highestUnlockedLevel,
      level: highestUnlockedLevel,
      high_score: nextHighScore,
    });

    const { error } = await updateProfile(authUser.uid, {
      xp: nextXp,
      level: highestUnlockedLevel,
      high_score: nextHighScore,
      completed_levels: completedLevels,
      highest_unlocked_level: highestUnlockedLevel,
    });

    if (error) console.error('Failed to save game result:', error);

    setProfile(normalizedProfile);
    setResultSummary({ score, xpGained, level: currentLevel, accuracy, passedLevel });
    setScreen('result');
  };

  const handleDeleteAccount = async (username) => {
    if (!authUser || !profile) return;
    if (username !== profile.username) return;

    const { error } = await deleteAccount(authUser.uid, username);
    if (error) {
      console.error('Failed to delete account:', error);
      return;
    }

    setScreen('landing');
    setProfile(null);
    setAuthUser(null);
  };

  const handleResetAccountData = async (username) => {
    if (!authUser || !profile) return;
    if (username !== profile.username) return;

    const { error } = await resetAccountData(authUser.uid, username);
    if (error) {
      console.error('Failed to reset account data:', error);
      return;
    }

    setProfile((previous) => ({
      ...previous,
      xp: 0,
      level: 1,
      high_score: 0,
      highest_unlocked_level: 1,
      completed_levels: [],
      language: previous.language || getDefaultLanguage(),
    }));
    setActiveLevel(1);
    setScreen('home');
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: '0.9rem' }}>
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <HelpButton onOpen={() => setHelpOpen(true)} />
      <HelpDialog
        open={helpOpen}
        topic={helpTopic}
        onClose={() => setHelpOpen(false)}
        onSelectTopic={(nextTopic) => setHelpTopic(nextTopic)}
      />

      {screen === 'landing' && (
        <LandingPage onGetStarted={() => setScreen('auth')} />
      )}
      {screen === 'auth' && (
        <AuthScreen onAuth={handleAuth} />
      )}
      {screen === 'home' && profile && (
        <HomeScreen
          user={profile}
          onPlay={() => setScreen('level-select')}
          onSettings={() => setScreen('profile')}
          onViewLeaderboard={() => setScreen('leaderboard')}
        />
      )}
      {screen === 'profile' && profile && (
        <ProfileScreen
          user={profile}
          onBack={() => setScreen('home')}
          onSave={handleProfileSave}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          onResetAccountData={handleResetAccountData}
        />
      )}
      {screen === 'level-select' && profile && (
        <LevelSelectScreen
          profile={profile}
          onBack={() => setScreen('home')}
          onLevelSelect={(level) => {
            setActiveLevel(level);
            setScreen('game');
          }}
        />
      )}
      {screen === 'game' && profile && (
        <GameScreen
          user={profile}
          levelNumber={activeLevel}
          helpOpen={helpOpen}
          onFinish={(score, xpGained) => handleGameFinish(score, xpGained, activeLevel)}
          onCancel={() => setScreen('home')}
        />
      )}
      {screen === 'result' && profile && (
        <ResultScreen
          score={resultSummary.score}
          totalQuestions={10}
          xpGained={resultSummary.xpGained}
          level={resultSummary.level}
          user={profile}
          onPlayAgain={() => {
            const nextLevel = getNextPlayableLevel(profile, resultSummary.level || activeLevel);
            setActiveLevel(nextLevel);
            setScreen('game');
          }}
          onBackHome={() => setScreen('home')}
          onViewLeaderboard={() => setScreen('leaderboard')}
        />
      )}
      {screen === 'leaderboard' && authUser && (
        <LeaderboardScreen
          currentUserId={authUser.uid}
          onBack={() => setScreen('home')}
        />
      )}
    </div>
  );
}