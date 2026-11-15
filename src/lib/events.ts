import { daysBetween } from './dates'
import type { HorseEvent } from './types'

/** Upcoming = not finished yet (multi-day events count until their last day). */
export function upcoming<T extends { data: HorseEvent }>(events: T[], today: string): T[] {
  return events
    .filter((e) => (e.data.endDate ?? e.data.date) >= today)
    .sort((a, b) => a.data.date.localeCompare(b.data.date) || (a.data.time ?? '').localeCompare(b.data.time ?? ''))
}

export function countdown(e: HorseEvent, today: string): string {
  const d = daysBetween(today, e.date)
  if (d < 0) return 'Happening now'
  if (d === 0) return 'Today'
  if (d === 1) return 'Tomorrow'
  if (d < 14) return `in ${d} days`
  if (d < 60) return `in ${Math.round(d / 7)} weeks`
  return `in ${Math.round(d / 30)} months`
}
