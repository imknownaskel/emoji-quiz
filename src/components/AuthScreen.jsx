import { useState } from 'react'
import { signUp, signIn, signInWithGoogle, resetPassword } from '../lib/auth.js'
import { auth } from '../lib/firebase.js'
import { reload } from 'firebase/auth'
import { getLanguageFromLocale } from '../lib/translate.js'

const initialState = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  language: getLanguageFromLocale(navigator.language),
}

function AuthScreen({ onAuth }) {
  const [isSignup, setIsSignup] = useState(false)
  const [authStep, setAuthStep] = useState('auth')
  const [form, setForm] = useState(initialState)
  const [pendingEmail, setPendingEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
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

      const { error: signUpError } = await signUp(email, password, username, form.language)
      if (signUpError) {
        setError(signUpError)
        setLoading(false)
        return
      }

      setPendingEmail(email)
      setAuthStep('waiting')
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

      if (user.emailVerified) {
        onAuth(user)
      } else {
        setPendingEmail(email)
        setAuthStep('waiting')
      }
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setSuccess('')
    setLoading(true)
    const { user, error: googleError } = await signInWithGoogle(isSignup)
    if (googleError) {
      setError(googleError)
      setLoading(false)
      return
    }
    onAuth(user)
    setLoading(false)
  }

  const handleCheckAgain = async () => {
    setLoading(true)
    setError('')
    await reload(auth.currentUser)
    if (auth.currentUser.emailVerified) {
      onAuth(auth.currentUser)
    } else {
      setError('Not verified yet — click the link in your email first.')
    }
    setLoading(false)
  }

  const handleForgotSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const email = form.email.trim()
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Enter the email address connected to your account.')
      return
    }

    setLoading(true)
    const { error: resetError } = await resetPassword(email)
    setLoading(false)

    if (resetError) {
      setError(resetError)
      return
    }

    setSuccess('If an account exists for that email, a password reset link has been sent. Check your inbox.')
  }

  if (authStep === 'waiting') {
    return (
      <div className="screen auth-screen">
        <div className="auth-card game-auth-card">
          <div className="auth-card-head">
            <span className="auth-badge">VERIFY EMAIL</span>
            <h1>Check your email</h1>
          </div>
          <p className="muted-text">
            We sent a verification link to <strong>{pendingEmail}</strong>. Click it to activate your account.
          </p>
          <p className="muted-text">
            Don't see it? Check your spam or junk folder — verification emails end up there sometimes.
          </p>

          {error ? <p className="error-text" role="alert">{error}</p> : null}

          <button type="button" className="primary-button full-width" onClick={handleCheckAgain} disabled={loading}>
            {loading ? 'Checking…' : "I've verified — Continue"}
          </button>

          <button
            type="button"
            className="secondary-button full-width"
            onClick={() => { setAuthStep('auth'); setError('') }}
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  if (authStep === 'forgot') {
    return (
      <div className="screen auth-screen">
        <div className="auth-card game-auth-card">
          <div className="auth-card-head">
            <span className="auth-badge">RECOVER ACCESS</span>
            <h1>Reset password</h1>
          </div>
          <p className="muted-text">
            Enter your email and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleForgotSubmit} className="auth-form">
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            {error ? <p className="error-text" role="alert">{error}</p> : null}
            {success ? <p className="success-text">{success}</p> : null}

            <button type="submit" className="primary-button full-width" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>

            <button
              type="button"
              className="secondary-button full-width"
              onClick={() => { setAuthStep('auth'); setError(''); setSuccess('') }}
            >
              ← Back to login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="screen auth-screen">
      <div className="auth-card game-auth-card">
        <div className="auth-toggle" aria-label="Authentication mode">
          <button
            type="button"
            className={isSignup ? '' : 'active'}
            onClick={() => { setIsSignup(false); setError(''); setSuccess('') }}
          >
            Login
          </button>
          <button
            type="button"
            className={isSignup ? 'active' : ''}
            onClick={() => { setIsSignup(true); setError(''); setSuccess('') }}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-heading-block">
          <span className="auth-badge">{isSignup ? 'PLAYER SIGNUP' : 'PLAYER LOGIN'}</span>
          <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p className="muted-text">
            {isSignup ? 'Set up your profile to begin.' : 'Log in to continue your streak.'}
          </p>
        </div>

        <div className="signup-guide">
          <span className="guide-spark">✦</span>
          <span>{isSignup ? 'Start a new profile for your first game run.' : 'New here? Choose Sign Up to create a profile first.'}</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup ? (
            <>
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

              <div className="panel" style={{ padding: '0.75rem 1rem', marginTop: '0.5rem' }}>
                <strong>Detected language</strong>
                <div style={{ marginTop: '0.35rem' }}>{form.language}</div>
              </div>
            </>
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
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="eye-button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {!isSignup && (
              <button
                type="button"
                className="text-button"
                onClick={() => { setAuthStep('forgot'); setError(''); setSuccess('') }}
              >
                Forgot password?
              </button>
            )}
          </label>

          {isSignup ? (
            <label>
              <span>Confirm Password</span>
              <div className="password-wrap">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="eye-button"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </label>
          ) : null}

          <button type="submit" className="primary-button full-width" disabled={loading}>
            {loading
              ? (isSignup ? 'Creating account…' : 'Logging in…')
              : (isSignup ? 'Create Account' : 'Login')
            }
          </button>
        </form>

        <div style={{ margin: '1rem 0', textAlign: 'center', color: 'var(--muted, #888)', fontSize: '0.85rem' }}>
          or
        </div>

        <button type="button" className="secondary-button full-width" onClick={handleGoogle} disabled={loading}>
          Continue with Google
        </button>

        {error ? <p className="error-text" role="alert">{error}</p> : null}
        {success ? <p className="success-text">{success}</p> : null}
      </div>
    </div>
  )
}

export default AuthScreen