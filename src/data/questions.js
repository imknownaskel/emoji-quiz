export const GAME_SETTINGS = {
  totalQuestions: 10,
  timerSeconds: 8,
}

export const emojiSets = ['easy', 'medium', 'hard']

export const questionTiers = {
  easy: [
    { emojis: ['🍕', '🍔', '🌮', '🍜'], correct: 'Food', options: ['Food', 'Sports', 'Animals', 'Travel'] },
    { emojis: ['🐶', '🐱', '🐰', '🦊'], correct: 'Animals', options: ['Animals', 'Food', 'Music', 'Weather'] },
    { emojis: ['⚽', '🏀', '🎾', '🏈'], correct: 'Sports', options: ['Sports', 'Science', 'Jobs', 'Nature'] },
    { emojis: ['✈️', '🚂', '🚗', '🛳️'], correct: 'Travel', options: ['Travel', 'Kitchen', 'Gaming', 'School'] },
    { emojis: ['🌊', '🌧️', '☀️', '❄️'], correct: 'Weather', options: ['Weather', 'Music', 'Tools', 'Books'] },
    { emojis: ['📚', '✏️', '📝', '🧠'], correct: 'School', options: ['School', 'Food', 'Animals', 'Furniture'] },
    { emojis: ['🎵', '🎸', '🎧', '🎹'], correct: 'Music', options: ['Music', 'Space', 'Travel', 'Garden'] },
    { emojis: ['🌳', '🌼', '🌵', '🌿'], correct: 'Nature', options: ['Nature', 'Fashion', 'Technology', 'Office'] },
    { emojis: ['🧰', '🔧', '🪚', '🔨'], correct: 'Tools', options: ['Tools', 'Animals', 'Food', 'Sports'] },
    { emojis: ['🚀', '🪐', '🌙', '⭐'], correct: 'Space', options: ['Space', 'Fashion', 'Weather', 'School'] },
  ],
  medium: [
    { emojis: ['🧊', '🔥', '💧', '🌬️'], correct: 'Elements', options: ['Elements', 'Transport', 'Furniture', 'Body Parts'] },
    { emojis: ['🦁', '🐘', '🦒', '🦏'], correct: 'Mammals', options: ['Mammals', 'Birds', 'Fish', 'Reptiles'] },
    { emojis: ['🍎', '🍌', '🍇', '🥭'], correct: 'Fruit', options: ['Fruit', 'Vegetables', 'Desserts', 'Drinks'] },
    { emojis: ['🧣', '🧥', '👟', '👕'], correct: 'Clothes', options: ['Clothes', 'Electronics', 'Office', 'Plants'] },
    { emojis: ['🖥️', '📱', '💻', '🖱️'], correct: 'Technology', options: ['Technology', 'Art', 'Cooking', 'Surgery'] },
    { emojis: ['🎨', '🖌️', '🖼️', '🎭'], correct: 'Art', options: ['Art', 'Music', 'Science', 'Garden'] },
    { emojis: ['🦅', '🐦', '🦆', '🕊️'], correct: 'Birds', options: ['Birds', 'Mammals', 'Fish', 'Insects'] },
    { emojis: ['🦀', '🐠', '🐡', '🐬'], correct: 'Fish', options: ['Fish', 'Reptiles', 'Mammals', 'Amphibians'] },
    { emojis: ['🧱', '🛋️', '🪑', '🛏️'], correct: 'Furniture', options: ['Furniture', 'Food', 'Sports', 'Jobs'] },
    { emojis: ['🍷', '☕', '🍺', '🥤'], correct: 'Drinks', options: ['Drinks', 'Fruit', 'Desserts', 'Plants'] },
    { emojis: ['🌾', '🥕', '🥬', '🌽'], correct: 'Vegetables', options: ['Vegetables', 'Fruit', 'Desserts', 'Tools'] },
    { emojis: ['🧲', '🔌', '🔋', '📡'], correct: 'Electronics', options: ['Electronics', 'Furniture', 'Office', 'Animals'] },
  ],
  hard: [
    { emojis: ['🐍', '🦎', '🐢', '🦖'], correct: 'Reptiles', options: ['Reptiles', 'Amphibians', 'Insects', 'Fish'] },
    { emojis: ['🦋', '🐝', '🕷️', '🐜'], correct: 'Insects', options: ['Insects', 'Reptiles', 'Birds', 'Mammals'] },
    { emojis: ['🦇', '🐈', '🦉', '🦔'], correct: 'Animals', options: ['Animals', 'Plants', 'Tools', 'Vehicles'] },
    { emojis: ['🍓', '🍑', '🥝', '🍋'], correct: 'Fruit', options: ['Fruit', 'Vegetables', 'Berries', 'Dairy'] },
    { emojis: ['🚗', '🚕', '🚌', '🚎'], correct: 'Vehicles', options: ['Vehicles', 'Tools', 'Sports', 'Music'] },
    { emojis: ['🌾', '🥕', '🥬', '🌽'], correct: 'Vegetables', options: ['Vegetables', 'Fruits', 'Desserts', 'Drinks'] },
    { emojis: ['🎻', '🎼', '🎺', '🎷'], correct: 'Music Instruments', options: ['Music Instruments', 'Sports Equipment', 'Kitchen Tools', 'Office Items'] },
    { emojis: ['🦴', '🫀', '🧠', '🫁'], correct: 'Body Parts', options: ['Body Parts', 'Weather', 'Animals', 'Plants'] },
    { emojis: ['🌴', '🌺', '🌵', '🌾'], correct: 'Plants', options: ['Plants', 'Animals', 'Furniture', 'Tech'] },
    { emojis: ['💼', '📊', '🧾', '📁'], correct: 'Office', options: ['Office', 'Travel', 'Science', 'Food'] },
    { emojis: ['🦭', '🐧', '🐳', '🐠'], correct: 'Sea Life', options: ['Sea Life', 'Birds', 'Mammals', 'Reptiles'] },
    { emojis: ['🔬', '🧪', '🧬', '⚗️'], correct: 'Science', options: ['Science', 'Art', 'Travel', 'Music'] },
  ],
}

function shuffleArray(items) {
  const nextItems = [...items]

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[nextItems[index], nextItems[randomIndex]] = [nextItems[randomIndex], nextItems[index]]
  }

  return nextItems
}

export function getEmojiSetForLevel(level) {
  const tierIndex = Math.min(Math.max((level || 1) - 1, 0), emojiSets.length - 1)
  return emojiSets[tierIndex]
}

export function getQuestionsForLevel(level, total = GAME_SETTINGS.totalQuestions) {
  const tier = getEmojiSetForLevel(level)
  const pool = questionTiers[tier]
  const selected = []

  for (let i = 0; i < total; i += 1) {
    const question = pool[i % pool.length]
    selected.push({
      ...question,
      options: shuffleArray(question.options),
    })
  }

  return selected
}

export function getXPGainForLevel(level) {
  const baseXP = 10 + level * 2
  return baseXP
}
