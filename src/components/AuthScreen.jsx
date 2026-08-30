import { useState } from 'react'
import { signUp, signIn, verifyOtp } from '../lib/auth.js'

const initialState = { username: '', email: '', password: '', confirmPassword: '' }

function AuthScreen({ onAuth }) {
  const [isSignup, setIsSignup] = useState(false)
  const [stage, setStage] = useState('auth')
  const [form, setForm] = useState(initialState)
  const [otp, setOtp] = useState('')
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

      const { user, error: signUpError } = await signUp(email, password, username)
      if (signUpError) {
        setError(signUpError)
        setLoading(false)
        return
      }

      setPendingEmail(email)
      setStage('otp')
      if (onAuth && user) {
        onAuth(user)
      }
      setLoading(false)
    } else {
      if (!email || !password) {
        setError('Email and password are required.')
        setLoading(false)
        return
      }

      const { user, error: signInError } = await signIn(email, password)
      if (signInError) {
        setError(signInError)
        setLoading(false)
        return
      }

      if (onAuth && user) {
        onAuth(user)
      }
      setLoading(false)
    }
  }

  const handleOtp = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    if (otp.length !== 6) {
      setError('Enter the 6-digit code from your email.')
      setLoading(false)
      return
    }

    const { user, error: otpError } = await verifyOtp(pendingEmail, otp)
    if (otpError) {
      setError(otpError)
      setLoading(false)
      return
    }

    if (onAuth && user) {
      onAuth(user)
    }

    setLoading(false)
  }

  if (stage === 'otp') {
    return (
      <div className="screen auth-screen">
        <div className="auth-card">
          <h1>Check your email</h1>
          <p className="muted-text">
            We sent a 6-digit code to <strong>{pendingEmail}</strong>
          </p>

          <form onSubmit={handleOtp} className="auth-form">
            <label>
              <span>Confirmation code</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                autoFocus
                required
              />
            </label>

            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit" className="primary-button full-width" disabled={loading || otp.length !== 6}>
              {loading ? 'Verifying…' : 'Confirm account'}
            </button>

            <button
              type="button"
              className="secondary-button full-width"
              onClick={() => { setStage('auth'); setOtp(''); setError('') }}
            >
              ← Back
            </button>
          </form>
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