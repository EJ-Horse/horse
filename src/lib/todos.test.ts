import { describe, expect, it } from 'vitest'
import { repeatLabel, todoStatus, visibleTodos } from './todos'

const today = '2026-11-14' // Saturday

describe('task repeats', () => {
  it('weekly resets on Monday', () => {
    expect(todoStatus({ text: 'x', lastDone: '2026-11-10' }, today)).toEqual({ done: true, nextDue: '2026-11-16' })
    expect(todoStatus({ text: 'x', lastDone: '2026-11-08' }, today).done).toBe(false)
  })
  it('understands old weekly entries', () => {
    expect(todoStatus({ text: 'x', doneWeek: '2026-11-09' }, today).done).toBe(true)
  })
  it('monthly resets on the 1st', () => {
    expect(todoStatus({ text: 'x', repeat: 'monthly', lastDone: '2026-11-02' }, today)).toEqual({ done: true, nextDue: '2026-12-01' })
    expect(todoStatus({ text: 'x', repeat: 'monthly', lastDone: '2026-10-30' }, today).done).toBe(false)
  })
  it('every 2 weeks counts from the day it was done', () => {
    expect(todoStatus({ text: 'x', repeat: 'biweekly', lastDone: '2026-11-05' }, today)).toEqual({ done: true, nextDue: '2026-11-19' })
    expect(todoStatus({ text: 'x', repeat: 'biweekly', lastDone: '2026-10-30' }, today).done).toBe(false)
  })
  it('custom days', () => {
    expect(todoStatus({ text: 'x', repeat: 'days', everyDays: 3, lastDone: '2026-11-12' }, today)).toEqual({ done: true, nextDue: '2026-11-15' })
    expect(repeatLabel({ text: 'x', repeat: 'days', everyDays: 1 })).toBe('Daily')
    expect(repeatLabel({ text: 'x', repeat: 'days', everyDays: 10 })).toBe('Every 10 days')
  })
  it('one-off tasks stay done and disappear the next week', () => {
    const done = { data: { text: 'x', repeat: 'once' as const, lastDone: '2026-11-03' } }
    const thisWeek = { data: { text: 'y', repeat: 'once' as const, lastDone: '2026-11-12' } }
    expect(visibleTodos([done, thisWeek], today)).toEqual([thisWeek])
    expect(todoStatus(thisWeek.data, today).done).toBe(true)
  })
})
