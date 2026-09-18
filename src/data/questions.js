export const GAME_SETTINGS = {
  totalQuestions: 10,
  timerSeconds: 8,
  passThreshold: 60,
}

const CATEGORY_LIBRARY = {
  Food: [['🍕', '🍔', '🌮', '🍜'], ['🍓', '🍇', '🍉', '🍋'], ['🥪', '🌮', '🍝', '🍣']],
  Animals: [['🐶', '🐱', '🐰', '🦊'], ['🐼', '🐵', '🦁', '🐸'], ['🦄', '🐢', '🐧', '🐼']],
  Sports: [['⚽', '🏀', '🎾', '🏈'], ['🏏', '🥊', '🏐', '🏓'], ['🚴', '🤸', '🏊', '⛳']],
  Travel: [['✈️', '🚂', '🚗', '🛳️'], ['🏖️', '🗺️', '🧳', '🚕'], ['🚆', '🚌', '🚢', '🚁']],
  Weather: [['🌊', '🌧️', '☀️', '❄️'], ['🌤️', '⛈️', '🌪️', '🌈'], ['🌙', '🌫️', '🌩️', '☁️']],
  School: [['📚', '✏️', '📝', '🧠'], ['🧮', '📐', '📏', '📖'], ['🎒', '🖊️', '📓', '🧾']],
  Music: [['🎵', '🎸', '🎧', '🎹'], ['🎻', '🎺', '🎷', '📻'], ['🎤', '🎼', '🥁', '🎹']],
  Nature: [['🌳', '🌼', '🌵', '🌿'], ['🌊', '🌾', '🌱', '🪴'], ['🏞️', '🌋', '🌄', '🌿']],
  Tools: [['🧰', '🔧', '🪚', '🔨'], ['🛠️', '🔩', '🧲', '🪓'], ['📐', '🧮', '🪛', '🔨']],
  Space: [['🚀', '🪐', '🌙', '⭐'], ['🛰️', '🌌', '☄️', '🌠'], ['🪐', '🌍', '🌑', '🚀']],
  Elements: [['🧊', '🔥', '💧', '🌬️'], ['🌍', '💨', '🧱', '⚡'], ['🌙', '❄️', '🏜️', '💧']],
  Mammals: [['🦁', '🐘', '🦒', '🦏'], ['🐼', '🐨', '🦊', '🐻'], ['🐆', '🐇', '🐬', '🐘']],
  Fruit: [['🍎', '🍌', '🍇', '🥭'], ['🍊', '🍏', '🍉', '🍍'], ['🍐', '🥝', '🍋', '🍑']],
  Clothes: [['🧣', '🧥', '👟', '👕'], ['👖', '🧢', '🧤', '👗'], ['🥾', '🧦', '🎽', '👔']],
  Technology: [['🖥️', '📱', '💻', '🖱️'], ['📡', '🔋', '🧠', '📼'], ['⌨️', '🖲️', '💾', '🧰']],
  Art: [['🎨', '🖌️', '🖼️', '🎭'], ['🧵', '🪡', '🧶', '🎨'], ['🖍️', '🪄', '🎬', '🎨']],
  Birds: [['🦅', '🐦', '🦆', '🕊️'], ['🦉', '🐤', '🦜', '🐧'], ['🐥', '🦩', '🦚', '🐦']],
  Fish: [['🦀', '🐠', '🐡', '🐬'], ['🐟', '🦐', '🦞', '🐳'], ['🐙', '🐠', '🦑', '🐡']],
  Furniture: [['🧱', '🛋️', '🪑', '🛏️'], ['🪴', '🧺', '🛁', '🧻'], ['📦', '🛏️', '🧸', '🪑']],
  Drinks: [['🍷', '☕', '🍺', '🥤'], ['🧃', '🥭', '🧉', '🍵'], ['🍋', '🥣', '🍊', '🧃']],
  Vegetables: [['🌾', '🥕', '🥬', '🌽'], ['🫑', '🍅', '🥒', '🌶️'], ['🥦', '🧄', '🫛', '🧅']],
  Electronics: [['🧲', '🔌', '🔋', '📡'], ['📱', '💻', '🎧', '⌚'], ['🖥️', '🖨️', '📷', '🔊']],
  Reptiles: [['🐍', '🦎', '🐢', '🦖'], ['🐲', '🦂', '🦎', '🦕'], ['🦆', '🦉', '🐍', '🦎']],
  Insects: [['🦋', '🐝', '🕷️', '🐜'], ['🪲', '🦟', '🐛', '🦗'], ['🦋', '🕸️', '🪲', '🐌']],
  Vehicles: [['🚗', '🚕', '🚌', '🚎'], ['🚑', '🚜', '🚙', '🚓'], ['🚚', '🛴', '🛵', '🚴']],
  Plants: [['🌴', '🌺', '🌵', '🌾'], ['🪴', '🌱', '🌿', '🌼'], ['🌷', '🌻', '🌳', '🌹']],
  Office: [['💼', '📊', '🧾', '📁'], ['🖇️', '📎', '🗂️', '📄'], ['🧾', '🖊️', '🧻', '📋']],
  Science: [['🔬', '🧪', '🧬', '⚗️'], ['🧫', '🧠', '🧬', '🔭'], ['⚙️', '💡', '📡', '🧪']],
  Home: [['🏠', '🛏️', '🪑', '🛁'], ['🪟', '🚿', '🧺', '🛁'], ['🕯️', '🛋️', '🧸', '🛏️']],
  Games: [['🎮', '🕹️', '🎲', '🧩'], ['♟️', '🎯', '🧩', '🎲'], ['🏓', '🎳', '♟️', '🧩']],
  Books: [['📚', '📔', '📖', '📝'], ['📓', '📗', '📘', '📕'], ['📒', '📜', '🧾', '📚']],
  Jobs: [['🧑‍🍳', '👩‍🏫', '🧑‍💼', '👩‍🚒'], ['🧑‍🔧', '👩‍⚕️', '👨‍🏭', '🧑‍✈️'], ['📐', '🧑‍🌾', '🧑‍🏫', '👩‍💻']],
}

const LEVEL_LIBRARY = {
  1: ['Food', 'Animals', 'Sports', 'Travel', 'Weather', 'School', 'Music', 'Nature', 'Tools', 'Space'],
  2: ['Elements', 'Mammals', 'Fruit', 'Clothes', 'Technology', 'Art', 'Birds', 'Fish', 'Furniture', 'Drinks'],
  3: ['Vegetables', 'Electronics', 'Reptiles', 'Insects', 'Animals', 'Fruit', 'Vehicles', 'Music', 'Plants', 'Tools'],
  4: ['Office', 'Science', 'Art', 'Technology', 'Nature', 'Travel', 'Home', 'Games', 'Books', 'Jobs'],
  5: ['Space', 'Weather', 'Plants', 'Tools', 'Books', 'Games', 'Nature', 'Food', 'Music', 'School'],
  6: ['Travel', 'Food', 'School', 'Technology', 'Office', 'Science', 'Nature', 'Weather', 'Music', 'Games'],
  7: ['Nature', 'Travel', 'Technology', 'Food', 'Weather', 'Music', 'School', 'Tools', 'Sports', 'Space'],
  8: ['Games', 'Tools', 'Food', 'Travel', 'Nature', 'Science', 'School', 'Weather', 'Music', 'Art'],
  9: ['Space', 'Technology', 'Nature', 'Science', 'Travel', 'Weather', 'Food', 'Music', 'School', 'Games'],
  10: ['Space', 'Technology', 'Science', 'Travel', 'Nature', 'Music', 'Food', 'Weather', 'Games', 'School'],
}

function createSeededRandom(seed) {
  let state = seed >>> 0

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

function shuffleArray(items, random) {
  const nextItems = [...items]

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1))
    ;[nextItems[index], nextItems[randomIndex]] = [nextItems[randomIndex], nextItems[index]]
  }

  return nextItems
}

export function getDailyQuestionSeed(level, referenceDate = new Date()) {
  const normalizedDate = new Date(referenceDate)
  normalizedDate.setHours(0, 0, 0, 0)
  const dateStamp = normalizedDate.toISOString().slice(0, 10)
  return `${level}-${dateStamp}`
}

export function getRoundAccuracy(score, total = GAME_SETTINGS.totalQuestions) {
  const safeTotal = Math.max(Number(total) || 0, 0)
  if (safeTotal === 0) return 0
  return Math.round((Number(score) / safeTotal) * 100)
}

export function canUnlockNextLevel(score, total = GAME_SETTINGS.totalQuestions) {
  return getRoundAccuracy(score, total) >= GAME_SETTINGS.passThreshold
}

export function getQuestionsForLevel(level, total = GAME_SETTINGS.totalQuestions, referenceDate = new Date()) {
  const normalizedLevel = Math.min(Math.max(Number(level) || 1, 1), 10)
  const categoryPool = LEVEL_LIBRARY[normalizedLevel] || LEVEL_LIBRARY[1]
  const seed = getDailyQuestionSeed(normalizedLevel, referenceDate)
  const random = createSeededRandom(Array.from(seed).reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0))
  const questions = []
  const usedKeys = new Set()

  while (questions.length < total) {
    const categoryIndex = Math.floor(random() * categoryPool.length)
    const category = categoryPool[categoryIndex]
    const emojiPatterns = CATEGORY_LIBRARY[category] || CATEGORY_LIBRARY.Food
    const emojiIndex = Math.floor(random() * emojiPatterns.length)
    const pattern = emojiPatterns[emojiIndex]
    const key = `${category}:${pattern.join('-')}`

    if (usedKeys.has(key)) {
      continue
    }

    const distractorPool = categoryPool.filter((entry) => entry !== category)
    const options = shuffleArray([
      category,
      ...distractorPool.slice(0, 3).sort(() => random() - 0.5),
    ], random)

    questions.push({
      emojis: pattern,
      correct: category,
      options,
    })

    usedKeys.add(key)
  }

  return questions
}

export function getXPGainForLevel(level) {
  const baseXP = 10 + (level || 1) * 2
  return baseXP
}
