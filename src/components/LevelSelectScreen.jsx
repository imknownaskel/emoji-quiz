function LevelSelectScreen({ profile, onBack, onLevelSelect }) {
  const completedLevels = Array.isArray(profile?.completed_levels)
    ? profile.completed_levels
        .map((level) => Number(level))
        .filter((level) => Number.isInteger(level) && level >= 1 && level <= 10)
    : [1]

  const highestUnlockedLevel = Math.min(
    Math.max(Number(profile?.highest_unlocked_level ?? profile?.level ?? 1) || 1, 1),
    10,
  )

  return (
    <div className="screen">
      <header className="topbar">
        <div>
          <p className="eyebrow">Adventure</p>
          <h2>Level Select</h2>
        </div>
        <button type="button" className="secondary-button" onClick={onBack}>
          Back
        </button>
      </header>

      <div className="panel level-select-panel">
        <div className="level-grid">
          {Array.from({ length: 10 }, (_, index) => {
            const levelNumber = index + 1
            const isUnlocked = levelNumber <= highestUnlockedLevel
            const isCompleted = completedLevels.includes(levelNumber)

            return (
              <button
                key={levelNumber}
                type="button"
                className={`level-tile ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`}
                onClick={() => isUnlocked && onLevelSelect(levelNumber)}
                disabled={!isUnlocked}
              >
                <span className="level-label">Level</span>
                <strong>{levelNumber}</strong>
                <small>{isCompleted ? 'Cleared' : isUnlocked ? 'Ready' : 'Locked'}</small>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default LevelSelectScreen
