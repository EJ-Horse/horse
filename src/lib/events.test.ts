import { describe, expect, it } from 'vitest'
import { closedOn, closuresSoon, countdown, upcoming } from './events'

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

describe('barn closures', () => {
  const thanksgiving = { data: { title: 'Barn closed', date: '2026-11-25', endDate: '2026-11-26', kind: 'closed' as const } }
  const winter = { data: { title: 'Winter break', date: '2026-12-21', endDate: '2027-01-03', kind: 'closed' as const } }
  it('only shows closures starting within 30 days', () => {
    expect(closuresSoon([thanksgiving, winter], '2026-11-14').map((e) => e.data.title)).toEqual(['Barn closed'])
    expect(closuresSoon([thanksgiving, winter], '2026-11-21').map((e) => e.data.title)).toEqual(['Barn closed', 'Winter break'])
  })
  it('keeps showing a closure while it is happening', () => {
    expect(closuresSoon([winter], '2026-12-28')).toHaveLength(1)
    expect(closuresSoon([winter], '2027-01-04')).toHaveLength(0)
  })
  it('knows which days are closed', () => {
    expect(closedOn([thanksgiving], '2026-11-26')).toBe(true)
    expect(closedOn([thanksgiving], '2026-11-27')).toBe(false)
  })
})
