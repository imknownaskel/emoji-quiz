function LevelDisplay({ level, xp }) {
  const totalXp = Number.isFinite(xp) ? xp : 0
  const progress = ((totalXp % 100) / 100) * 100

  return (
    <div className="level-block">
      <div className="level-header">
        <span className="label">Level</span>
        <strong>{level}</strong>
      </div>

      <div className="xp-bar" aria-label="XP progress">
        <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="xp-meta">
        <span>{totalXp % 100} / 100 XP</span>
      </div>
    </div>
  )
}

export default LevelDisplay