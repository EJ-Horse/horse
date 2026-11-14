import { describe, expect, it } from 'vitest'
import { autoDifficulty, difficultyOf, fitsLength } from './beautify'
import { STARTER_STYLES } from './starter'

describe('hairstyles', () => {
  it('assigns difficulty from the number of steps', () => {
    expect(autoDifficulty('a\nb\nc')).toBe('easy')
    expect(autoDifficulty('a\nb\nc\nd\ne\nf')).toBe('medium')
    expect(autoDifficulty(Array(9).fill('x').join('\n'))).toBe('hard')
  })
  it('respects a chosen difficulty', () => {
    expect(difficultyOf({ name: 'x', area: 'mane', lengths: ['long'], difficulty: 'hard', steps: 'a' })).toBe('hard')
  })
  it('filters by mane length', () => {
    const running = STARTER_STYLES.find((s) => s.name === 'Running braid')!
    expect(fitsLength(running, 'long')).toBe(true)
    expect(fitsLength(running, 'short')).toBe(false)
  })
  it('has styles for every length', () => {
    for (const len of ['short', 'medium', 'long'] as const) {
      expect(STARTER_STYLES.some((s) => s.area === 'mane' && s.lengths.includes(len))).toBe(true)
    }
  })
})
