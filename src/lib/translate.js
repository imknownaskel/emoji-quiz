const LANGUAGE_MAP = {
  English: 'en',
  French: 'fr',
  Spanish: 'es',
  Pidgin: 'en',
}

export const defaultLabels = {
  level: 'Level',
  score: 'Score',
  prompt: 'Which category fits these emojis?',
  pause: 'Pause',
  resume: 'Resume',
  paused: 'Game paused',
  pauseHint: 'Answers and the timer are paused.',
  cancel: 'Cancel session',
  preview: 'Welcome to Emoji Quiz',
  languagePreview: 'Language preview',
}

export function getLanguageFromLocale(locale) {
  const normalized = String(locale || '').toLowerCase()

  if (normalized.startsWith('fr')) return 'French'
  if (normalized.startsWith('es')) return 'Spanish'
  if (normalized.startsWith('en')) return 'English'

  return 'English'
}

export function getDefaultLanguage() {
  if (typeof navigator === 'undefined') return 'English'
  return getLanguageFromLocale(navigator.language)
}

export function getLanguageCode(label) {
  return LANGUAGE_MAP[label] || 'en'
}

export function getDefaultLabel(key) {
  return defaultLabels[key] || key
}

export async function translateLabels(language, keys = []) {
  const languageCode = getLanguageCode(language || 'English')

  if (!keys.length) return {}

  const labelMap = {}
  const values = keys.map((key) => defaultLabels[key] || key)

  if (languageCode === 'en') {
    keys.forEach((key, index) => {
      labelMap[key] = values[index]
    })
    return labelMap
  }

  const translatedValues = await Promise.all(
    values.map((value) => translateText(value, languageCode))
  )

  keys.forEach((key, index) => {
    labelMap[key] = translatedValues[index] || values[index]
  })

  return labelMap
}

export async function translateText(text, targetLanguage) {
  const value = String(text ?? '').trim()
  const code = getLanguageCode(targetLanguage || 'English')

  if (!value) return ''

  const url = new URL('https://translate.googleapis.com/translate_a/single')
  url.searchParams.set('client', 'gtx')
  url.searchParams.set('sl', 'en')
  url.searchParams.set('tl', code)
  url.searchParams.set('dt', 't')
  url.searchParams.set('q', value)

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`Translation failed: ${response.status}`)
  }

  const payload = await response.json()

  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    return value
  }

  return payload[0].map(([translatedText]) => translatedText || '').join('')
}
