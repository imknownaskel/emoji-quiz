import { useEffect, useState } from 'react'
import { getLeaderboard } from '../lib/auth.js'

function LeaderboardScreen({ currentUserId, onBack }) {
  const [board, setBoard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    getLeaderboard().then(({ board: fetchedBoard, error: fetchError }) => {
      if (!active) return
      if (fetchError) {
        setError(fetchError)
      } else {
        setBoard(fetchedBoard)
      }
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  return (
    <div className="screen">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Leaderboard</h1>
        <button type="button" className="secondary-button" onClick={onBack}>
          ← Back
        </button>
      </div>

      {loading ? <p className="muted-text">Loading rankings…</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {board.length === 0 ? (
            <p className="muted-text">No scores yet — be the first!</p>
          ) : (
            board.map((entry, index) => {
              const isYou = entry.id === currentUserId
              return (
                <div
                  key={entry.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: isYou ? 'rgba(124, 106, 247, 0.15)' : 'rgba(255,255,255,0.04)',
                    border: isYou ? '1px solid #7C6AF7' : '1px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, width: '2rem' }}>
                      #{index + 1}
                    </span>
                    <span style={{ fontWeight: isYou ? 700 : 500 }}>
                      {entry.username} {isYou ? '(you)' : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="muted-text" style={{ fontSize: '0.85rem' }}>
                      Lv.{entry.level}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                      {entry.high_score}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

export default LeaderboardScreen