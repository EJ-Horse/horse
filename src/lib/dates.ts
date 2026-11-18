/** Dates are stored as 'YYYY-MM-DD' strings in local time. */

export function today(): string {
  return toISODate(new Date())
}

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function addDays(s: string, days: number): string {
  const d = parseDate(s)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

/** Whole days from `from` to `to` (negative when `to` is earlier). */
export function daysBetween(from: string, to: string): number {
  return Math.round((parseDate(to).getTime() - parseDate(from).getTime()) / 86_400_000)
}

export type DueState = 'overdue' | 'soon' | 'ok' | 'unknown'

/** 'soon' means within the next `soonDays` days. */
export function dueState(due: string | undefined, now = today(), soonDays = 14): DueState {
  if (!due) return 'unknown'
  const left = daysBetween(now, due)
  if (left < 0) return 'overdue'
  if (left <= soonDays) return 'soon'
  return 'ok'
}

export function dueLabel(due: string | undefined, now = today()): string {
  if (!due) return 'No date set'
  const left = daysBetween(now, due)
  if (left < -1) return `${-left} days overdue`
  if (left === -1) return 'Overdue since yesterday'
  if (left === 0) return 'Due today'
  if (left === 1) return 'Due tomorrow'
  if (left < 60) return `Due in ${left} days`
  return `Due ${formatDate(due)}`
}

export function formatDate(s: string | undefined): string {
  if (!s) return ''
  return parseDate(s).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Monday of the week containing `s`. Weekly to-dos reset every Monday so Sunday is the last day to finish them. */
export function weekStart(s: string): string {
  const d = parseDate(s)
  const dow = (d.getDay() + 6) % 7 // Monday = 0
  d.setDate(d.getDate() - dow)
  return toISODate(d)
}

/** Age in years (with one decimal under 2 years) from a birth date. */
export function ageFrom(birth: string | undefined, now = today()): string {
  if (!birth) return ''
  const b = parseDate(birth)
  const n = parseDate(now)
  let years = n.getFullYear() - b.getFullYear()
  if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) years--
  return years === 1 ? '1 year' : `${years} years`
}

/** The next birthday on or after `now`: its date, days to go and the age he turns. */
export function nextBirthday(birth: string, now = today()) {
  const b = parseDate(birth)
  const n = parseDate(now)
  let year = n.getFullYear()
  let d = toISODate(new Date(year, b.getMonth(), b.getDate()))
  if (d < now) d = toISODate(new Date(++year, b.getMonth(), b.getDate()))
  return { date: d, days: daysBetween(now, d), turning: year - b.getFullYear() }
}

/** 1 → 1st, 2 → 2nd, 13 → 13th, 22 → 22nd */
export function ordinal(n: number) {
  const s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : (['th', 'st', 'nd', 'rd'][n % 10] ?? 'th')
  return n + s
}

export function monthKey(s: string): string {
  return s.slice(0, 7)
}

export function monthLabel(key: string): string {
  return parseDate(key + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
