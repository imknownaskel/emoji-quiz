import { useEffect, useState } from 'react'

const EMOJI_POOL = [
  '🍕','🍔','🌮','🍜','🍣','🍩','🍦','🍎','🍇','🍉',
  '⚽','🏀','🏈','🎾','🏐','🥊','🏆','🎯','🎳','🏓',
  '🐶','🐱','🦁','🐘','🦒','🐬','🦋','🐝','🦊','🐼',
  '🌍','🗼','🗽','🏰','🎡','🌋','🏔️','🏝️','🌵','🌴',
  '🎸','🎹','🎺','🥁','🎻','🎤','🎧','🎬','🎭','🎨',
  '🚀','🌙','⭐','🪐','☄️','🌈','⚡','❄️','☀️','🌊',
  '😂','😍','🤔','😎','🥳','😱','🔥','💯','✨','🎉',
  '📱','💻','⌚','📷','🎮','🕹️','💡','🔑','🎁','💎',
]

function randomEmoji() {
  return EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)]
}

const COLS = 10
const ROWS = 14
const SWAP_COUNT_PER_TICK = 10
const TICK_MS = 1000

function LandingPage({ onGetStarted }) {
  const [grid, setGrid] = useState(() =>
    Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => randomEmoji())
    )
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid((prev) => {
        const next = prev.map((row) => [...row])
        for (let i = 0; i < SWAP_COUNT_PER_TICK; i += 1) {
          const row = Math.floor(Math.random() * ROWS)
          const col = Math.floor(Math.random() * COLS)
          let newEmoji = randomEmoji()
          while (newEmoji === next[row][col]) {
            newEmoji = randomEmoji()
          }
          next[row][col] = newEmoji
        }
        return next
      })
    }, TICK_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="landing-page">
      <div className="landing-emoji-bg" aria-hidden="true">
        <div className="landing-emoji-grid">
          {grid.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`landing-emoji-row ${rowIndex % 2 === 0 ? 'scroll-right' : 'scroll-left'}`}
            >
              <div className="landing-emoji-track">
                {[...row, ...row].map((emoji, cellIndex) => (
                  <span key={cellIndex} className="landing-emoji-cell">
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="landing-content">
        <div className="landing-box landing-hero">
          <div className="landing-logo">Emoji<span>Quiz</span></div>
          <h1>Guess the word. Beat the clock.</h1>
          <p>Decode emoji clues, race the timer, and climb the leaderboard.</p>
          <button type="button" className="primary-button landing-cta" onClick={onGetStarted}>
            Play Now →
          </button>
        </div>

        <div className="landing-features">
          <div className="landing-box landing-feature">
            <span className="landing-feature-icon">🎯</span>
            <h3>Quick rounds</h3>
            <p>10 questions, seconds on the clock. Fast, addictive gameplay.</p>
          </div>
          <div className="landing-box landing-feature">
            <span className="landing-feature-icon">📈</span>
            <h3>Level up</h3>
            <p>Earn XP with every correct guess and unlock harder puzzles.</p>
          </div>
          <div className="landing-box landing-feature">
            <span className="landing-feature-icon">🏆</span>
            <h3>Global leaderboard</h3>
            <p>Compete with players everywhere and climb the ranks.</p>
          </div>
        </div>

        <div className="landing-box landing-footer">
          <p>No spam, no ads — just emoji puzzles.</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage