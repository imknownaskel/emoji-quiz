import { useEffect, useState } from 'react'
import { getLeaderboard } from '../lib/auth.js'

function LeaderboardScreen({ currentUserId, onBack }) {
  const [board, setBoard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(board.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const visibleBoard = board.slice(startIndex, startIndex + itemsPerPage)

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

  useEffect(() => {
    if (board.length === 0) {
      setCurrentPage(1)
      return
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [board.length, currentPage, totalPages])

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {board.length === 0 ? (
            <p className="muted-text">No scores yet — be the first!</p>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                <span className="muted-text" style={{ fontSize: '0.85rem' }}>
                  Page {safeCurrentPage} of {totalPages}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={safeCurrentPage === 1}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={safeCurrentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>

              {visibleBoard.map((entry, index) => {
                const globalIndex = startIndex + index
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
                        #{globalIndex + 1}
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
                        {Number(entry.xp ?? 0)} XP
                      </span>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default LeaderboardScreen