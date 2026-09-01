import { useState } from 'react'
import { signUp, signIn } from '../lib/auth.js'
import { supabase } from '../lib/supabase.js'

const initialState = { username: '', email: '', password: '', confirmPassword: '' }

function AuthScreen() {
  const [isSignup, setIsSignup] = useState(false)
  const [stage, setStage] = useState('auth')
  const [form, setForm] = useState(initialState)
  const [pendingEmail, setPendingEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const username = form.username.trim()
    const email = form.email.trim()
    const password = form.password.trim()
    const confirmPassword = form.confirmPassword.trim()

    if (isSignup) {
      if (!username || !email || !password || !confirmPassword) {
        setError('All sign-up fields are required.')
        setLoading(false)
        return
      }
      if (!email.includes('@') || !email.includes('.')) {
        setError('Please enter a valid email address.')
        setLoading(false)
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        setLoading(false)
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        setLoading(false)
        return
      }

      const { error: signUpError } = await signUp(email, password, username)
      if (signUpError) {
        setError(signUpError)
        setLoading(false)
        return
      }

      setPendingEmail(email)
      setStage('waiting')
      setLoading(false)
    } else {
      if (!email || !password) {
        setError('Email and password are required.')
        setLoading(false)
        return
      }

      const { error: signInError } = await signIn(email, password)
      if (signInError) {
        setError(signInError)
        setLoading(false)
        return
      }

      setLoading(false)
    }
  }

  const handleCheckAgain = async () => {
    setLoading(true)
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      setError('Not confirmed yet — click the link in your email first.')
    }
    setLoading(false)
  }

  if (stage === 'waiting') {
    return (
      <div className="screen auth-screen">
        <div className="auth-card">
          <h1>Check your email</h1>
          <p className="muted-text">
            We sent a confirmation link to <strong>{pendingEmail}</strong>. Click it to activate your account — this page updates automatically once confirmed.
          </p>

          {error ? <p className="error-text">{error}</p> : null}

          <button type="button" className="primary-button full-width" onClick={handleCheckAgain} disabled={loading}>
            {loading ? 'Checking…' : "I've confirmed — Continue"}
          </button>

          <button
            type="button"
            className="secondary-button full-width"
            onClick={() => { setStage('auth'); setError('') }}
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen auth-screen">
      <div className="auth-card">
        <div className="auth-toggle" aria-label="Authentication mode">
          <button
            type="button"
            className={isSignup ? '' : 'active'}
            onClick={() => { setIsSignup(false); setError('') }}
          >
            Login
          </button>
          <button
            type="button"
            className={isSignup ? 'active' : ''}
            onClick={() => { setIsSignup(true); setError('') }}
          >
            Sign Up
          </button>
        </div>

        <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="muted-text">
          {isSignup ? 'Set up your profile to begin.' : 'Log in to continue your streak.'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup ? (
            <label>
              <span>Username</span>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="emoji_master"
                required
              />
            </label>
          ) : null}

          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </label>

          {isSignup ? (
            <label>
              <span>Confirm Password</span>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </label>
          ) : null}

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit" className="primary-button full-width" disabled={loading}>
            {loading
              ? (isSignup ? 'Creating account…' : 'Logging in…')
              : (isSignup ? 'Create Account' : 'Login')
            }
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthScreen