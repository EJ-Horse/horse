import { describe, expect, it } from 'vitest'
import { TRICKS } from './tricks'

describe('tricks', () => {
  it('has unique keys', () => {
    expect(new Set(TRICKS.map((t) => t.key)).size).toBe(TRICKS.length)
  })
  it('only requires tricks that exist', () => {
    const keys = new Set(TRICKS.map((t) => t.key))
    for (const t of TRICKS) for (const n of t.needs ?? []) expect(keys.has(n), `${t.key} needs ${n}`).toBe(true)
  })
  it('has steps for every trick and safety notes for hard ones', () => {
    for (const t of TRICKS) expect(t.steps.length).toBeGreaterThan(2)
    for (const t of TRICKS.filter((x) => x.level === 'hard')) expect(t.safety, t.key).toBeTruthy()
  })
})
