import { hasSupabaseConfig, supabase } from './supabase.js'

const USERS_KEY = 'emojiQuizUsers'
const SESSION_KEY = 'emojiQuizSession'

function readLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
  } catch (error) {
    console.error('Failed to read local users:', error)
    return {}
  }
}

function writeLocalUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function findUserByLocalId(userId) {
  const users = readLocalUsers()
  return Object.values(users).find((user) => user.id === userId) || null
}

function findUserByLocalEmail(email) {
  const users = readLocalUsers()
  const trimmedEmail = String(email || '').trim().toLowerCase()
  return Object.values(users).find((user) => String(user.email || '').trim().toLowerCase() === trimmedEmail) || null
}

function buildLocalUser({ email, username, password }) {
  return {
    id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    email: String(email || '').trim().toLowerCase(),
    username: String(username || '').trim(),
    password,
    xp: 0,
    level: 1,
    high_score: 0,
    language: 'English',
  }
}

function persistLocalSession(userId) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }))
}

export async function signUp(email, password, username) {
  if (!hasSupabaseConfig || !supabase) {
    const users = readLocalUsers()
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const userExists = Object.values(users).some((user) => String(user.email || '').trim().toLowerCase() === normalizedEmail)

    if (userExists) {
      return { user: null, error: 'An account with that email already exists.' }
    }

    const nextUser = buildLocalUser({ email: normalizedEmail, username, password })
    users[nextUser.id] = nextUser
    writeLocalUsers(users)
    persistLocalSession(nextUser.id)

    return {
      user: {
        id: nextUser.id,
        email: nextUser.email,
        username: nextUser.username,
      },
      error: null,
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  })

  if (error) return { user: null, error: error.message }

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username,
      xp: 0,
      level: 1,
      high_score: 0,
      language: 'English',
    })

    if (profileError) return { user: null, error: profileError.message }
  }

  return { user: data.user, error: null }
}

export async function signIn(email, password) {
  if (!hasSupabaseConfig || !supabase) {
    const user = findUserByLocalEmail(email)

    if (!user || user.password !== password) {
      return { user: null, error: 'Incorrect email or password.' }
    }

    persistLocalSession(user.id)
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      error: null,
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { user: null, error: error.message }
  return { user: data.user, error: null }
}

export async function signOut() {
  if (!hasSupabaseConfig || !supabase) {
    localStorage.removeItem(SESSION_KEY)
    return { error: null }
  }

  const { error } = await supabase.auth.signOut()
  return { error: error?.message ?? null }
}

export async function getSession() {
  if (!hasSupabaseConfig || !supabase) {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
      if (!session?.userId) return null
      return findUserByLocalId(session.userId)
    } catch (error) {
      console.error('Failed to read local session:', error)
      return null
    }
  }

  const { data } = await supabase.auth.getSession()
  return data.session?.user ?? null
}

export async function getProfile(userId) {
  if (!hasSupabaseConfig || !supabase) {
    const profile = findUserByLocalId(userId)
    if (!profile) return { profile: null, error: 'Profile not found.' }

    return {
      profile: {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        xp: profile.xp,
        level: profile.level,
        high_score: profile.high_score,
        language: profile.language,
      },
      error: null,
    }
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

  if (error) return { profile: null, error: error.message }
  return { profile: data, error: null }
}

export async function updateProfile(userId, fields) {
  if (!hasSupabaseConfig || !supabase) {
    const users = readLocalUsers()
    const current = users[userId]
    if (!current) return { error: 'Profile not found.' }

    users[userId] = { ...current, ...fields }
    writeLocalUsers(users)
    return { error: null }
  }

  const { error } = await supabase.from('profiles').update(fields).eq('id', userId)
  return { error: error?.message ?? null }
}

export async function verifyOtp(email, token) {
  if (!hasSupabaseConfig || !supabase) {
    const trimmedEmail = String(email || '').trim().toLowerCase()
    const sanitizedToken = String(token || '').trim()

    if (sanitizedToken.length !== 6 || !/^\d+$/.test(sanitizedToken)) {
      return { user: null, error: 'Enter the 6-digit code from your email.' }
    }

    const user = findUserByLocalEmail(trimmedEmail)
    if (!user) {
      return { user: null, error: 'We could not find that pending account.' }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      error: null,
    }
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  })

  if (error) return { user: null, error: error.message }
  return { user: data.user, error: null }
}

export async function getLeaderboard() {
  if (!hasSupabaseConfig || !supabase) {
    const users = Object.values(readLocalUsers())
    return {
      board: users
        .map((user) => ({
          id: user.id,
          username: user.username,
          high_score: user.high_score,
        }))
        .sort((a, b) => (b.high_score || 0) - (a.high_score || 0))
        .slice(0, 50),
      error: null,
    }
  }

  const { data, error } = await supabase.from('leaderboard').select('*')

  if (error) return { board: [], error: error.message }
  return { board: data, error: null }
}
