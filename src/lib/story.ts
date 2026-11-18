/**
 * EJ's life story. The researched chapters live in the shared database (kind 'story'),
 * never in this public repo, so the family can edit them and add their own.
 */
export type Era = 'sd' | 'mt' | 'ca' | 'us'
export type StorySource = { label: string; url?: string }
export type StoryChapter = {
  /** 'YYYY-MM-DD', 'YYYY-MM' or 'YYYY' */
  date: string
  /** date is a best guess */
  approx?: boolean
  era: Era
  emoji: string
  title: string
  text: string
  place?: string
  /** private storage paths (pedigree/… or app media) */
  photos?: string[]
  video?: string
  sources?: StorySource[]
  /** private documents to open, e.g. the sale agreement (storage path) */
  docs?: { label: string; path: string }[]
  /** written by us in the app, not from research */
  ours?: boolean
}
/** Things nobody has told us yet: questions for the seller. */
export type StoryQuestion = { q: string; why: string; answer?: string }

export const ERAS: Record<Era, { emoji: string; title: string; years: string; place: string }> = {
  sd: { emoji: '🌾', title: 'Born in South Dakota', years: '2014 – 2017', place: 'Eljomar Arabians, Aberdeen, SD' },
  mt: { emoji: '🏔️', title: 'Growing up in Montana', years: '2018 – 2019', place: 'Majik Arabians, Bitterroot Valley, MT' },
  ca: { emoji: '🌉', title: 'Coming to California', years: '2019 – 2026', place: 'Northern California' },
  us: { emoji: '💛', title: 'With Sofía', years: '2026 –', place: 'Gilroy Hills & Lone Oak, San Martin, CA' },
}
export const ERA_ORDER: Era[] = ['sd', 'mt', 'ca', 'us']

/** Homes on his journey (approximate map positions), in order. */
export const STOPS = [
  { name: 'Aberdeen, SD', lat: 45.46, lon: -98.49, year: '2014' },
  { name: 'Corvallis, MT', lat: 46.31, lon: -114.11, year: '2018' },
  { name: 'Placer County, CA', lat: 38.79, lon: -121.24, year: '2019' },
  { name: 'San Martin, CA', lat: 37.08, lon: -121.61, year: '2026' },
]

/** Straight-line distance in miles (the trailer drove further!). */
export function milesBetween(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const r = (d: number) => (d * Math.PI) / 180
  const dLat = r(b.lat - a.lat)
  const dLon = r(b.lon - a.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLon / 2) ** 2
  return Math.round(3958.8 * 2 * Math.asin(Math.sqrt(h)))
}

/** Sort key that puts 'YYYY' and 'YYYY-MM' at the start of their year/month. */
export function sortKey(date: string) {
  return (date + '-01-01').slice(0, 10)
}

/** "May 9, 2014", "May 2014" or "2014" depending on how exact the date is. */
export function storyDate(date: string, approx?: boolean) {
  const [y, m, d] = date.split('-').map(Number)
  let s: string
  if (d) s = new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  else if (m) s = new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  else s = String(y)
  return (approx ? 'About ' : '') + s
}

/** His age on a date, in words: "2 days old", "8 months old", "3 years old". */
export function ageAt(birth: string, date: string) {
  const b = new Date(sortKey(birth) + 'T12:00:00')
  const t = new Date(sortKey(date) + 'T12:00:00')
  const days = Math.round((t.getTime() - b.getTime()) / 86_400_000)
  if (days < 0) return 'before he was born'
  if (days === 0) return 'his birthday!'
  if (days < 31) return `${days} day${days === 1 ? '' : 's'} old`
  let months = (t.getFullYear() - b.getFullYear()) * 12 + (t.getMonth() - b.getMonth())
  if (t.getDate() < b.getDate()) months--
  if (months < 24) return `${months} month${months === 1 ? '' : 's'} old`
  return `${Math.floor(months / 12)} years old`
}

/** "12 years, 6 months and 8 days" */
export function exactAge(birth: string, now: string) {
  const b = new Date(birth + 'T12:00:00')
  const n = new Date(now + 'T12:00:00')
  let y = n.getFullYear() - b.getFullYear()
  let m = n.getMonth() - b.getMonth()
  let d = n.getDate() - b.getDate()
  if (d < 0) {
    m--
    d += new Date(n.getFullYear(), n.getMonth(), 0).getDate()
  }
  if (m < 0) {
    y--
    m += 12
  }
  const part = (v: number, w: string) => `${v} ${w}${v === 1 ? '' : 's'}`
  return `${part(y, 'year')}, ${part(m, 'month')} and ${part(d, 'day')}`
}
