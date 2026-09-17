import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GAME_SETTINGS, getQuestionsForLevel, getXPGainForLevel } from '../data/questions'

function GameScreen({ user, onFinish, onCancel }) {
  const questionSet = useMemo(() => getQuestionsForLevel(user.level || 1, GAME_SETTINGS.totalQuestions), [user.level])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(GAME_SETTINGS.timerSeconds)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [xpGained, setXpGained] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const timerRef = useRef(null)
  const advanceRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (advanceRef.current) {
        clearTimeout(advanceRef.current)
      }
    }
  }, [])

  const currentQuestion = questionSet[questionIndex]

  const handleCancel = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    if (advanceRef.current) {
      clearTimeout(advanceRef.current)
    }
    onCancel()
  }, [onCancel])

  const finishRound = useCallback((nextScore, nextXp) => {
    if (questionIndex >= GAME_SETTINGS.totalQuestions - 1) {
      onFinish(nextScore, nextXp)
      return
    }

    setQuestionIndex((previous) => previous + 1)
    setTimer(GAME_SETTINGS.timerSeconds)
    setSelectedAnswer(null)
  }, [onFinish, questionIndex])

  const handleAnswer = useCallback((option, timedOut = false) => {
    if (!currentQuestion || isPaused || selectedAnswer !== null) {
      return
    }

    const isCorrect = !timedOut && option === currentQuestion.correct
    const gain = isCorrect ? getXPGainForLevel(user.level || 1) : 0
    const nextScore = score + (isCorrect ? 1 : 0)
    const nextXp = xpGained + gain

    setSelectedAnswer(option ?? 'timeout')
    setScore(nextScore)
    setXpGained(nextXp)

    if (advanceRef.current) {
      clearTimeout(advanceRef.current)
    }

    advanceRef.current = setTimeout(() => {
      finishRound(nextScore, nextXp)
    }, 1000)
  }, [currentQuestion, finishRound, isPaused, score, selectedAnswer, user.level, xpGained])

  useEffect(() => {
    if (!currentQuestion || isPaused || selectedAnswer !== null) {
      return undefined
    }

    timerRef.current = setInterval(() => {
      setTimer((previous) => {
        if (previous <= 1) {
          clearInterval(timerRef.current)
          handleAnswer(null, true)
          return 0
        }

        return previous - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [currentQuestion, handleAnswer, isPaused, selectedAnswer])

  if (!currentQuestion) {
    return <div className="screen">Loading question...</div>
  }

  return (
    <div className="screen game-screen">
      <div className="game-topbar">
        <div>
          <p className="eyebrow">Question</p>
          <strong>
            {questionIndex + 1} / {GAME_SETTINGS.totalQuestions}
          </strong>
        </div>

        <div className="timer-badge">{timer}s</div>
        <div className="score-badge">Score {score}</div>
        <div className="game-controls">
          <button
            type="button"
            className="secondary-button game-control-button"
            onClick={() => setIsPaused((previous) => !previous)}
            aria-label={isPaused ? 'Resume game' : 'Pause game'}
          >
            {isPaused ? '▶ Resume' : 'Ⅱ Pause'}
          </button>
          <button
            type="button"
            className="danger-button game-control-button cancel-button"
            onClick={handleCancel}
            aria-label="Cancel game session"
          >
            ×
          </button>
        </div>
      </div>

      <div className="question-panel panel">
        <p className="game-label">Which category fits these emojis?</p>
        <div className="emoji-grid" aria-label="Emoji clue">
          {currentQuestion.emojis.map((emoji, index) => (
            <span key={`${emoji}-${index}`} className="emoji-item">
              {emoji}
            </span>
          ))}
        </div>

        <div className="option-grid">
          {currentQuestion.options.map((option) => {
            const isCorrect = option === currentQuestion.correct
            const isSelected = selectedAnswer === option
            const isTimedOut = selectedAnswer === 'timeout' && option === currentQuestion.correct

            let className = 'option-button'
            if (selectedAnswer !== null) {
              if (isCorrect) {
                className += ' correct'
              } else if (isSelected) {
                className += ' wrong'
              } else if (isTimedOut) {
                className += ' correct'
              } else {
                className += ' muted'
              }
            }

            return (
              <button
                key={option}
                type="button"
                className={className}
                onClick={() => handleAnswer(option, false)}
                disabled={selectedAnswer !== null || isPaused}
              >
                {option}
              </button>
            )
          })}
        </div>

        {isPaused ? (
          <div className="pause-overlay" role="dialog" aria-modal="true" aria-label="Game paused">
            <strong>Game paused</strong>
            <span>Answers and the timer are paused.</span>
            <button type="button" className="danger-button" onClick={handleCancel}>
              × Cancel session
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default GameScreen