function ResultScreen({ score, totalQuestions, xpGained, user, onPlayAgain }) {
  const percentage = (score / totalQuestions) * 100
  let grade = '💪 Try Again'
  let gradeClass = 'grade-try-again'

  if (percentage >= 90) {
    grade = '🏆 Legendary'
    gradeClass = 'grade-legendary'
  } else if (percentage >= 75) {
    grade = '🌟 Excellent'
    gradeClass = 'grade-excellent'
  } else if (percentage >= 50) {
    grade = '👍 Good'
    gradeClass = 'grade-good'
  } else if (percentage >= 30) {
    grade = '😅 Keep Going'
    gradeClass = 'grade-keep-going'
  }

  return (
    <div className="screen result-screen">
      <div className="panel result-card">
        <p className="eyebrow">Round complete</p>
        <h2>{grade}</h2>

        <div className="result-score">
          <span>{score}</span>
          <small>/ {totalQuestions}</small>
        </div>

        <div className={`grade-badge ${gradeClass}`}>{grade}</div>

        <div className="result-stats">
          <div>
            <span>XP gained</span>
            <strong>{xpGained}</strong>
          </div>
          <div>
            <span>Level</span>
            <strong>{user.level}</strong>
          </div>
        </div>

        <button type="button" className="primary-button large" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  )
}

export default ResultScreen
