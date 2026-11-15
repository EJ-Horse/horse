import { addDays, weekStart } from './dates'
import type { CoachEntry, RideSlot } from './types'

export const DEFAULT_SCHEDULE: RideSlot[] = [
  { day: 3, time: '16:45', type: 'lesson' }, // Thursday 4:45 pm
  { day: 5, time: '10:00', type: 'lesson' }, // Saturday 10 am
  { day: 6, time: '10:00', type: 'solo' }, // Sunday 10 am
]

export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function rideType(e: CoachEntry) {
  return e.type ?? 'lesson'
}

export function timeLabel(t: string) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return m ? `${h12}:${String(m).padStart(2, '0')} ${ampm}` : `${h12} ${ampm}`
}

export type WeekSlot = RideSlot & { date: string; state: 'logged' | 'due' | 'upcoming' | 'closed'; entryIndex?: number }

/** This week's planned rides (Mon–Sun), each marked logged / due (today or past) / upcoming. */
export function weekSlots(slots: RideSlot[], entries: CoachEntry[], today: string, isClosed: (date: string) => boolean = () => false): WeekSlot[] {
  const monday = weekStart(today)
  return [...slots]
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
    .map((s) => {
      const date = addDays(monday, s.day)
      const entryIndex = entries.findIndex((e) => e.date === date && rideType(e) === s.type)
      const state = entryIndex >= 0 ? 'logged' : isClosed(date) ? 'closed' : date <= today ? 'due' : 'upcoming'
      return { ...s, date, state, entryIndex: entryIndex >= 0 ? entryIndex : undefined }
    })
}
