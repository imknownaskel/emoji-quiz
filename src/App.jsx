import { useEffect, useState } from 'react';
import './App.css';
import { auth } from './lib/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { getProfile, updateProfile, signOut } from './lib/auth.js';
import AuthScreen    from './components/AuthScreen.jsx';
import HomeScreen    from './components/HomeScreen.jsx';
import GameScreen    from './components/GameScreen.jsx';
import ProfileScreen from './components/ProfileScreen.jsx';
import ResultScreen  from './components/ResultScreen.jsx';

export default function App() {
  const [screen,        setScreen]        = useState('auth');
  const [authUser,      setAuthUser]      = useState(null);
  const [profile,       setProfile]       = useState(null);
  const [resultSummary, setResultSummary] = useState({ score: 0, xpGained: 0 });

  const loadProfile = async (user) => {
    const { profile: fetchedProfile, error } = await getProfile(user.uid, user);
    if (error) {
      console.error('Failed to load profile:', error);
      return;
    }

    setAuthUser(user);
    setProfile(fetchedProfile);
    setScreen('home');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        await loadProfile(user);
      } else if (user) {
        setAuthUser(user);
        setProfile(null);
        setScreen('auth');
      } else {
        setAuthUser(null);
        setProfile(null);
        setScreen('auth');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async (user) => {
    await loadProfile(user);
  };

  const handleProfileSave = async ({ username, language }) => {
    if (!authUser) return;
    const { error } = await updateProfile(authUser.uid, { username, language });
    if (error) {
      console.error('Failed to update profile:', error);
      return;
    }
    setProfile(prev => ({ ...prev, username, language }));
    setScreen('home');
  };

  const handleGameFinish = async (score, xpGained) => {
    if (!authUser || !profile) return;
    const nextXp        = (profile.xp         || 0) + xpGained;
    const nextLevel     = Math.floor(nextXp / 100) + 1;
    const nextHighScore = Math.max(profile.high_score || 0, score);

    const { error } = await updateProfile(authUser.uid, {
      xp:         nextXp,
      level:      nextLevel,
      high_score: nextHighScore,
    });

    if (error) console.error('Failed to save game result:', error);

    setProfile(prev => ({
      ...prev,
      xp:         nextXp,
      level:      nextLevel,
      high_score: nextHighScore,
    }));

    setResultSummary({ score, xpGained });
    setScreen('result');
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="app-shell">
      {screen === 'auth' && (
        <AuthScreen onAuth={handleAuth} />
      )}
      {screen === 'home' && profile && (
        <HomeScreen
          user={profile}
          onPlay={() => setScreen('game')}
          onSettings={() => setScreen('profile')}
        />
      )}
      {screen === 'profile' && profile && (
        <ProfileScreen
          user={profile}
          onBack={() => setScreen('home')}
          onSave={handleProfileSave}
          onLogout={handleLogout}
        />
      )}
      {screen === 'game' && profile && (
        <GameScreen
          user={profile}
          onFinish={handleGameFinish}
          onCancel={() => setScreen('home')}
        />
      )}
      {screen === 'result' && profile && (
        <ResultScreen
          score={resultSummary.score}
          totalQuestions={10}
          xpGained={resultSummary.xpGained}
          user={profile}
          onPlayAgain={() => setScreen('home')}
        />
      )}
    </div>
  );
}