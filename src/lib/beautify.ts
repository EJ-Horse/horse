import type { Difficulty, Hairstyle, Length } from './types'

/** Used when a style is set to "auto": more steps means harder. */
export function autoDifficulty(steps: string): Difficulty {
  const n = steps.split('\n').filter((l) => l.trim()).length
  if (n <= 4) return 'easy'
  if (n <= 7) return 'medium'
  return 'hard'
}

export function difficultyOf(h: Hairstyle): Difficulty {
  return h.difficulty === 'auto' ? autoDifficulty(h.steps) : h.difficulty
}

export function fitsLength(h: Hairstyle, mane?: Length, tail?: Length): boolean {
  if (h.area === 'mane') return !mane || h.lengths.includes(mane)
  if (h.area === 'tail') return !tail || h.lengths.includes(tail)
  return (!mane || h.lengths.includes(mane)) && (!tail || h.lengths.includes(tail))
}

export function youtubeSearch(q: string) {
  return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q)
}
