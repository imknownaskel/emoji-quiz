import LevelDisplay from './LevelDisplay'

function HomeScreen({ user, onPlay, onSettings }) {
  const questionCount = 10
  const timerSeconds = 8

  return (
    <div className="screen">
      <header className="topbar">
        <div>
          <p className="eyebrow">Player</p>
          <h2>{user.username}</h2>
        </div>
        <button type="button" className="secondary-button" onClick={onSettings}>
          Settings
        </button>
      </header>

      <div className="panel">
        <LevelDisplay level={user.level || 1} xp={user.xp || 0} />

        <div className="stats-grid">
          <div className="stat-card">
            <span>High Score</span>
            <strong>{user.high_score || 0}</strong>
          </div>
          <div className="stat-card">
            <span>Questions</span>
            <strong>{questionCount}</strong>
          </div>
          <div className="stat-card">
            <span>Timer</span>
            <strong>{timerSeconds}s</strong>
          </div>
          <div className="stat-card">
            <span>Language</span>
            <strong>{user.language || 'English'}</strong>
          </div>
        </div>
      </div>

      <button type="button" className="primary-button large" onClick={onPlay}>
        Play
      </button>
    </div>
  )
}

export default HomeScreen