import { daysBetween, formatDate } from './dates'
import type { Injury, InjuryCheck } from './types'

export const LAMENESS_LABEL = ['Sound', 'Barely noticeable', 'Mild', 'Obvious', 'Severe', 'Won’t bear weight']
export const LEG_LABEL = { LF: 'Left front', RF: 'Right front', LH: 'Left hind', RH: 'Right hind' } as const

export function sortedChecks(i: Injury): InjuryCheck[] {
  return [...i.checks].sort((a, b) => a.date.localeCompare(b.date))
}

export function latestCheck(i: Injury): InjuryCheck | undefined {
  return sortedChecks(i).at(-1)
}

/** Day 1 is the day it started. */
export function injuryDay(i: Injury, today: string) {
  return daysBetween(i.startDate, i.status === 'healed' && i.healedOn ? i.healedOn : today) + 1
}

export type Trend = 'better' | 'worse' | 'same' | 'new'

/** Compares the last check with the one before (lameness first, then swelling and heat). */
export function trend(i: Injury): Trend {
  const c = sortedChecks(i)
  if (c.length < 2) return 'new'
  const score = (x: InjuryCheck) =>
    x.lameness * 10 + ['none', 'mild', 'moderate', 'severe'].indexOf(x.swelling) * 2 + ['none', 'warm', 'hot'].indexOf(x.heat)
  const d = score(c[c.length - 1]) - score(c[c.length - 2])
  return d < 0 ? 'better' : d > 0 ? 'worse' : 'same'
}

/** Lameness 3+, a hot leg or severe swelling: worth calling the vet. */
export function needsVet(c: InjuryCheck | undefined) {
  return !!c && (c.lameness >= 3 || c.heat === 'hot' || c.swelling === 'severe')
}

/** Plain-text history to send to the vet. */
export function vetSummary(i: Injury, horse = 'EJ', today: string): string {
  const where = [i.leg ? LEG_LABEL[i.leg] : '', i.part ?? ''].filter(Boolean).join(', ')
  const lines = [
    `${horse}: ${i.title}${where ? ` (${where})` : ''}`,
    `Started ${formatDate(i.startDate)} · day ${injuryDay(i, today)}${i.status === 'healed' && i.healedOn ? ` · healed ${formatDate(i.healedOn)}` : ''}`,
    '',
  ]
  for (const c of sortedChecks(i)) {
    const parts = [`lameness ${c.lameness}/5 (${LAMENESS_LABEL[c.lameness].toLowerCase()})`, `heat: ${c.heat}`, `swelling: ${c.swelling}`]
    lines.push(`${formatDate(c.date)}: ${parts.join(', ')}`)
    if (c.treatment) lines.push(`  Treatment: ${c.treatment}`)
    if (c.note) lines.push(`  Note: ${c.note}`)
  }
  return lines.join('\n')
}
