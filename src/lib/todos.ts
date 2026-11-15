import { addDays, monthKey, parseDate, toISODate, weekStart } from './dates'
import type { Repeat, Todo } from './types'

export const REPEAT_LABEL: Record<Repeat, string> = {
  weekly: 'Weekly',
  biweekly: 'Every 2 weeks',
  monthly: 'Monthly',
  quarterly: 'Every 3 months',
  once: 'Just once',
  days: 'Every … days',
}

export function repeatOf(t: Todo): Repeat {
  return t.repeat ?? (t.oneOff ? 'once' : 'weekly')
}

/** When the task was last ticked (older entries only stored the week). */
export function lastDoneOf(t: Todo): string | undefined {
  return t.lastDone ?? t.doneWeek
}

export function repeatLabel(t: Todo): string {
  const r = repeatOf(t)
  if (r === 'days') return t.everyDays === 1 ? 'Daily' : `Every ${t.everyDays ?? 7} days`
  return REPEAT_LABEL[r]
}

function addMonths(date: string, n: number) {
  const d = parseDate(date)
  d.setMonth(d.getMonth() + n, 1)
  return toISODate(d)
}

/**
 * done: ticked for the current period. nextDue: when it comes back (undefined for once).
 * Weekly resets every Monday, monthly on the 1st; the others count days from when it was done.
 */
export function todoStatus(t: Todo, today: string): { done: boolean; nextDue?: string } {
  const last = lastDoneOf(t)
  const r = repeatOf(t)
  if (!last) return { done: false }
  switch (r) {
    case 'once':
      return { done: true }
    case 'weekly': {
      const next = addDays(weekStart(last), 7)
      return { done: today < next, nextDue: next }
    }
    case 'monthly': {
      const next = addMonths(monthKey(last) + '-01', 1)
      return { done: today < next, nextDue: next }
    }
    default: {
      const days = r === 'biweekly' ? 14 : r === 'quarterly' ? 91 : Math.max(1, t.everyDays ?? 7)
      const next = addDays(last, days)
      return { done: today < next, nextDue: next }
    }
  }
}

/** Tasks to show: everything except one-off tasks finished before this week. */
export function visibleTodos<T extends { data: Todo }>(list: T[], today: string): T[] {
  return list.filter((x) => {
    if (repeatOf(x.data) !== 'once') return true
    const last = lastDoneOf(x.data)
    return !last || last >= weekStart(today)
  })
}
