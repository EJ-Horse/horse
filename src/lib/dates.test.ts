import { describe, expect, it } from 'vitest'
import { addDays, ageFrom, daysBetween, dueLabel, dueState, weekStart } from './dates'
import { buildIcs } from './ics'

describe('dates', () => {
  it('adds days across months', () => {
    expect(addDays('2026-01-30', 3)).toBe('2026-02-02')
  })
  it('counts days between', () => {
    expect(daysBetween('2026-11-14', '2026-11-20')).toBe(6)
    expect(daysBetween('2026-11-14', '2026-11-10')).toBe(-4)
  })
  it('classifies due dates', () => {
    expect(dueState('2026-11-10', '2026-11-14')).toBe('overdue')
    expect(dueState('2026-11-20', '2026-11-14')).toBe('soon')
    expect(dueState('2027-03-01', '2026-11-14')).toBe('ok')
    expect(dueState(undefined)).toBe('unknown')
  })
  it('labels due dates', () => {
    expect(dueLabel('2026-11-14', '2026-11-14')).toBe('Due today')
    expect(dueLabel('2026-11-15', '2026-11-14')).toBe('Due tomorrow')
    expect(dueLabel('2026-11-10', '2026-11-14')).toBe('4 days overdue')
  })
  it('starts weeks on Monday so Sunday closes the week', () => {
    expect(weekStart('2026-11-15')).toBe('2026-11-09') // Sunday
    expect(weekStart('2026-11-16')).toBe('2026-11-16') // Monday
  })
  it('computes age', () => {
    expect(ageFrom('2013-05-01', '2026-11-14')).toBe('13 years')
    expect(ageFrom('2013-12-01', '2026-11-14')).toBe('12 years')
  })
})

describe('calendar file', () => {
  it('has an all-day event and an alarm', () => {
    const ics = buildIcs('EJ: Flu vaccine', '2026-12-01', 'Call vet')
    expect(ics).toContain('DTSTART;VALUE=DATE:20261201')
    expect(ics).toContain('DTEND;VALUE=DATE:20261202')
    expect(ics).toContain('BEGIN:VALARM')
  })
})
