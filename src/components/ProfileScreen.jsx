import { useEffect, useState } from 'react'

const languageOptions = ['English', 'French', 'Spanish', 'Pidgin']

function ProfileScreen({ user, onBack, onSave, onLogout }) {
  const [form, setForm] = useState({
    username: user?.username || '',
    language: user?.language || 'English',
  })

  useEffect(() => {
    setForm({
      username: user?.username || '',
      language: user?.language || 'English',
    })
  }, [user])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave(form)
  }

  return (
    <div className="screen">
      <header className="topbar">
        <div>
          <p className="eyebrow">Profile</p>
          <h2>Settings</h2>
        </div>
        <button type="button" className="secondary-button" onClick={onBack}>
          Back
        </button>
      </header>

      <form className="panel form-panel" onSubmit={handleSubmit}>
        <label>
          <span>Username</span>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
          />
        </label>

        <label>
          <span>Preferred language</span>
          <select name="language" value={form.language} onChange={handleChange}>
            {languageOptions.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </label>

        <div className="avatar-box">
          <div className="avatar-circle">Avatar coming soon</div>
        </div>

        <div className="button-stack">
          <button type="submit" className="primary-button full-width">
            Save changes
          </button>
          <button type="button" className="danger-button full-width" onClick={onLogout}>
            Logout
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileScreen
