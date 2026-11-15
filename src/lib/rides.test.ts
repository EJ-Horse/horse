import { describe, expect, it } from 'vitest'
import { DEFAULT_SCHEDULE, timeLabel, weekSlots } from './rides'

describe('ride schedule', () => {
  it('formats times', () => {
    expect(timeLabel('16:00')).toBe('4 PM')
    expect(timeLabel('10:30')).toBe('10:30 AM')
    expect(timeLabel('00:00')).toBe('12 AM')
  })
  it('places Thursday, Saturday and Sunday in the current week', () => {
    // Saturday Nov 14, 2026
    const w = weekSlots(DEFAULT_SCHEDULE, [], '2026-11-14')
    expect(w.map((s) => s.date)).toEqual(['2026-11-12', '2026-11-14', '2026-11-15'])
    expect(w.map((s) => s.state)).toEqual(['due', 'due', 'upcoming'])
  })
  it('marks a slot logged when a ride of that type exists that day', () => {
    const w = weekSlots(DEFAULT_SCHEDULE, [{ date: '2026-11-12', title: 'Lesson', type: 'lesson' }], '2026-11-14')
    expect(w[0].state).toBe('logged')
    expect(w[0].entryIndex).toBe(0)
  })
  it('treats old entries without a type as lessons', () => {
    const w = weekSlots(DEFAULT_SCHEDULE, [{ date: '2026-11-14', title: 'Class' }], '2026-11-14')
    expect(w[1].state).toBe('logged')
  })
  it('does not count a solo ride as the lesson', () => {
    const w = weekSlots(DEFAULT_SCHEDULE, [{ date: '2026-11-14', title: 'Ride', type: 'solo' }], '2026-11-14')
    expect(w[1].state).toBe('due')
  })
})
