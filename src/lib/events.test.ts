import { describe, expect, it } from 'vitest'
import { countdown, upcoming } from './events'

const ev = (date: string, endDate?: string) => ({ data: { title: 'x', date, endDate } })

describe('events', () => {
  it('keeps only events that are not over, soonest first', () => {
    const list = [ev('2026-12-12'), ev('2026-10-24'), ev('2026-11-20')]
    expect(upcoming(list, '2026-11-14').map((e) => e.data.date)).toEqual(['2026-11-20', '2026-12-12'])
  })
  it('keeps a multi-day event until its last day', () => {
    expect(upcoming([ev('2026-11-13', '2026-11-15')], '2026-11-14')).toHaveLength(1)
    expect(upcoming([ev('2026-11-13', '2026-11-15')], '2026-11-16')).toHaveLength(0)
  })
  it('counts down', () => {
    expect(countdown({ title: '', date: '2026-11-14' }, '2026-11-14')).toBe('Today')
    expect(countdown({ title: '', date: '2026-11-15' }, '2026-11-14')).toBe('Tomorrow')
    expect(countdown({ title: '', date: '2026-11-20' }, '2026-11-14')).toBe('in 6 days')
    expect(countdown({ title: '', date: '2026-12-12' }, '2026-11-14')).toBe('in 4 weeks')
  })
})
