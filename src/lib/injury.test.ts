import { describe, expect, it } from 'vitest'
import { injuryDay, needsVet, trend, vetSummary } from './injury'
import type { Injury } from './types'

const base: Injury = {
  title: 'Swollen fetlock',
  leg: 'LH',
  startDate: '2026-11-10',
  status: 'active',
  checks: [
    { date: '2026-11-10', lameness: 3, heat: 'warm', swelling: 'moderate', treatment: 'Cold hosed 15 min' },
    { date: '2026-11-12', lameness: 2, heat: 'none', swelling: 'mild' },
  ],
}

describe('injury tracker', () => {
  it('counts days from the start (day 1 = first day)', () => {
    expect(injuryDay(base, '2026-11-14')).toBe(5)
  })
  it('sees improvement and getting worse', () => {
    expect(trend(base)).toBe('better')
    expect(trend({ ...base, checks: [...base.checks, { date: '2026-11-13', lameness: 4, heat: 'hot', swelling: 'severe' }] })).toBe('worse')
    expect(trend({ ...base, checks: [base.checks[0]] })).toBe('new')
  })
  it('flags when to call the vet', () => {
    expect(needsVet(base.checks[0])).toBe(true)
    expect(needsVet(base.checks[1])).toBe(false)
    expect(needsVet({ date: 'x', lameness: 1, heat: 'hot', swelling: 'none' })).toBe(true)
  })
  it('writes a summary for the vet', () => {
    const s = vetSummary(base, 'EJ', '2026-11-14')
    expect(s).toContain('EJ: Swollen fetlock (Left hind)')
    expect(s).toContain('day 5')
    expect(s).toContain('lameness 3/5 (obvious)')
    expect(s).toContain('Treatment: Cold hosed 15 min')
  })
})
