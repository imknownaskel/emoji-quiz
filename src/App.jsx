import { useEffect, useState } from 'react'
import './App.css'
import AuthScreen from './components/AuthScreen'
import GameScreen from './components/GameScreen'
import HomeScreen from './components/HomeScreen'
import ProfileScreen from './components/ProfileScreen'
import ResultScreen from './components/ResultScreen'

const STORAGE_KEY = 'emojiQuizUsers'
const SESSION_KEY = 'emojiQuizSession'

function getInitialUser() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    if (session && session.username) {
      const profile = getUserProfile(session.username)
      return profile || null
    }
  } catch (error) {
    console.error('Failed to read session from localStorage', error)
  }

  return null
}

function getUserProfile(username) {
  try {
    const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return allUsers[username] || null
  } catch (error) {
    console.error('Failed to read profiles from localStorage', error)
    return null
  }
}

function saveUserProfile(username, profile) {
  const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  allUsers[username] = profile
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers))
}

function normalizeUsername(rawUsername) {
  return rawUsername.trim()
}

function App() {
  const [screen, setScreen] = useState('auth')
  const [currentUser, setCurrentUser] = useState(() => getInitialUser())
  const [resultSummary, setResultSummary] = useState({ score: 0, xpGained: 0 })

  const activeUser = currentUser || getInitialUser()

  useEffect(() => {
    if (!activeUser) {
      setScreen('auth')
      return
    }

    setScreen('home')
  }, [activeUser])

  useEffect(() => {
    if (!activeUser) {
      localStorage.removeItem(SESSION_KEY)
      return
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ username: activeUser.username }))
  }, [activeUser])

  const handleAuthSubmit = ({ username, email, password, confirmPassword, isSignup }) => {
    const cleanUsername = normalizeUsername(username)
    const cleanPassword = password.trim()

    if (!cleanUsername || !cleanPassword) {
      return { ok: false, message: 'Username and password are required.' }
    }

    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')

    if (isSignup) {
      const cleanEmail = email.trim()

      if (!cleanEmail || !cleanPassword || !confirmPassword.trim()) {
        return { ok: false, message: 'All sign-up fields are required.' }
      }

      if (password !== confirmPassword) {
        return { ok: false, message: 'Passwords do not match.' }
      }

      if (users[cleanUsername]) {
        return { ok: false, message: 'That username already exists.' }
      }

      const newProfile = {
        username: cleanUsername,
        email: cleanEmail,
        password: cleanPassword,
        xp: 0,
        level: 1,
        highScore: 0,
        language: 'English',
      }

      users[cleanUsername] = newProfile
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
      setCurrentUser(newProfile)
      setScreen('home')
      return { ok: true }
    }

    const savedUser = users[cleanUsername]
    if (!savedUser || savedUser.password !== cleanPassword) {
      return { ok: false, message: 'Incorrect username or password.' }
    }

    setCurrentUser(savedUser)
    setScreen('home')
    return { ok: true }
  }

  const handleProfileSave = ({ username, language }) => {
    const oldUsername = activeUser.username
    const cleanUsername = normalizeUsername(username)

    if (!cleanUsername) {
      return
    }

    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const existingProfile = users[cleanUsername]

    if (existingProfile && cleanUsername !== oldUsername) {
      return
    }

    const updated = {
      ...activeUser,
      username: cleanUsername,
      language,
    }

    delete users[oldUsername]
    users[cleanUsername] = updated
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))

    localStorage.setItem(SESSION_KEY, JSON.stringify({ username: cleanUsername }))
    setCurrentUser(updated)
    setScreen('home')
  }

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY)
    setCurrentUser(null)
    setScreen('auth')
  }

  const handleGameFinish = (score, xpGained) => {
    const updatedUser = { ...activeUser }
    const nextXp = (updatedUser.xp || 0) + xpGained
    const nextLevel = Math.floor(nextXp / 100) + 1

    updatedUser.xp = nextXp
    updatedUser.level = nextLevel
    updatedUser.highScore = Math.max(updatedUser.highScore || 0, score)

    saveUserProfile(activeUser.username, updatedUser)
    setCurrentUser(updatedUser)
    setResultSummary({ score, xpGained })
    setScreen('result')
  }

  const handlePlayAgain = () => {
    setScreen('home')
  }

  if (!activeUser && screen !== 'auth') {
    return null
  }

  return (
    <div className="app-shell">
      {screen === 'auth' && <AuthScreen onSubmit={handleAuthSubmit} />}
      {screen === 'home' && activeUser && (
        <HomeScreen
          user={activeUser}
          onPlay={() => setScreen('game')}
          onSettings={() => setScreen('profile')}
        />
      )}
      {screen === 'profile' && activeUser && (
        <ProfileScreen
          user={activeUser}
          onBack={() => setScreen('home')}
          onSave={handleProfileSave}
          onLogout={handleLogout}
        />
      )}
      {screen === 'game' && activeUser && (
        <GameScreen user={activeUser} onFinish={handleGameFinish} />
      )}
      {screen === 'result' && activeUser && (
        <ResultScreen
          score={resultSummary.score}
          totalQuestions={10}
          xpGained={resultSummary.xpGained}
          user={activeUser}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  )
}

export default App
