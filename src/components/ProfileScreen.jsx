import { useMemo, useState } from 'react'

const rankDefinitions = [
  { key: 'noob', label: 'Noob', minXp: 0, maxXp: 499, color: '#111111' },
  { key: 'rookie', label: 'Rookie', minXp: 500, maxXp: 1499, color: '#4a90e2' },
  { key: 'hero', label: 'Hero', minXp: 1500, maxXp: 3499, color: '#2ecc71' },
  { key: 'master', label: 'Master', minXp: 3500, maxXp: 9999, color: '#9b59b6' },
  { key: 'legend', label: 'Legend', minXp: 10000, maxXp: Infinity, color: '#f4c542' },
]

function ProfileScreen({ user, onBack, onSave, onLogout, onDeleteAccount, onResetAccountData }) {
  const [form, setForm] = useState({
    username: user?.username || '',
  })
  const [confirmation, setConfirmation] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [selectedRank, setSelectedRank] = useState(null)

  const currentRank = useMemo(() => {
    const xp = Number(user?.xp || 0)
    return rankDefinitions.find((rank) => xp >= rank.minXp && xp <= rank.maxXp) ?? rankDefinitions[0]
  }, [user?.xp])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave(form)
  }

  const confirmAction = () => {
    if (!pendingAction) return
    if (confirmation !== form.username) return

    if (pendingAction === 'delete') {
      onDeleteAccount(form.username)
    }

    if (pendingAction === 'reset') {
      onResetAccountData(form.username)
    }

    setPendingAction(null)
    setConfirmation('')
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

        <div className="avatar-box">
          <div className="avatar-circle">Avatar coming soon</div>
        </div>

        <div className="rank-panel">
          <div className="rank-row" aria-label="Rank selection">
            {rankDefinitions.map((rank) => {
              const isSelected = currentRank.key === rank.key
              return (
                <button
                  key={rank.key}
                  type="button"
                  className={`rank-badge ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedRank(rank)}
                  title={`${rank.label} (${rank.minXp} - ${rank.maxXp === Infinity ? '∞' : rank.maxXp} XP)`}
                  style={{ background: rank.color, color: rank.key === 'noob' ? '#ffffff' : '#111111' }}
                >
                  <span>{rank.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="button-stack">
          <button type="submit" className="primary-button full-width">
            Save changes
          </button>
          <button type="button" className="danger-button full-width" onClick={onLogout}>
            Logout
          </button>
          <button type="button" className="secondary-button full-width" onClick={() => setPendingAction('reset')}>
            Reset account data
          </button>
          <button type="button" className="secondary-button full-width danger-secondary" onClick={() => setPendingAction('delete')}>
            Delete account
          </button>
        </div>
      </form>

      {pendingAction && (
        <div className="confirmation-overlay" role="dialog" aria-modal="true" aria-label="Confirm action">
          <div className="confirmation-card">
            <h3>{pendingAction === 'delete' ? 'Delete account?' : 'Reset account data?'}</h3>
            <p>Are you sure? Type your username to continue.</p>
            <input
              type="text"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder={form.username}
            />
            <div className="confirmation-actions">
              <button type="button" className="secondary-button" onClick={() => { setPendingAction(null); setConfirmation('') }}>
                Cancel
              </button>
              <button
                type="button"
                className={pendingAction === 'delete' ? 'danger-button' : 'primary-button'}
                onClick={confirmAction}
                disabled={confirmation !== form.username}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedRank && (
        <div className="confirmation-overlay" role="dialog" aria-modal="true" aria-label="Rank details">
          <div className="confirmation-card">
            <h3>{selectedRank.label}</h3>
            <p>
              {selectedRank.minXp === 0 ? 'Up to' : `From ${selectedRank.minXp}`} to{' '}
              {selectedRank.maxXp === Infinity ? '∞ XP' : `${selectedRank.maxXp} XP`}
            </p>
            <div className="confirmation-actions">
              <button type="button" className="primary-button" onClick={() => setSelectedRank(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileScreen
