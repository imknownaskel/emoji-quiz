import { useState } from 'react'

const initialState = { username: '', email: '', password: '', confirmPassword: '' }

function AuthScreen({ onSubmit }) {
  const [isSignup, setIsSignup] = useState(false)
  const [form, setForm] = useState(initialState)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const username = form.username.trim()
    const email = form.email.trim()
    const password = form.password.trim()
    const confirmPassword = form.confirmPassword.trim()

    if (isSignup) {
      if (!username || !email || !password || !confirmPassword) {
        setError('All sign-up fields are required.')
        return
      }

      if (!email.includes('@') || !email.includes('.')) {
        setError('Please enter a valid email address.')
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    } else if (!username || !password) {
      setError('Username and password are required.')
      return
    }

    setError('')
    const result = onSubmit({ username, email, password, confirmPassword, isSignup })

    if (result && !result.ok) {
      setError(result.message)
    }
  }

  return (
    <div className="screen auth-screen">
      <div className="auth-card">
        <div className="auth-toggle" aria-label="Authentication mode">
          <button
            type="button"
            className={isSignup ? '' : 'active'}
            onClick={() => setIsSignup(false)}
          >
            Login
          </button>
          <button
            type="button"
            className={isSignup ? 'active' : ''}
            onClick={() => setIsSignup(true)}
          >
            Sign Up
          </button>
        </div>

        <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="muted-text">
          {isSignup ? 'Set up your profile to begin.' : 'Log in to continue your streak.'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
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

          {isSignup ? (
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
          ) : null}

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

          <button type="submit" className="primary-button full-width">
            {isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthScreen
