import type { Cost } from './types'

export function totalsByCategory(costs: Cost[]) {
  const map = new Map<string, number>()
  for (const c of costs) map.set(c.category, (map.get(c.category) ?? 0) + c.amount)
  return [...map.entries()].map(([category, total]) => ({ category, total: round(total) })).sort((a, b) => b.total - a.total)
}

export function totalsByMonth(costs: Cost[]) {
  const map = new Map<string, number>()
  for (const c of costs) map.set(c.date.slice(0, 7), (map.get(c.date.slice(0, 7)) ?? 0) + c.amount)
  return [...map.entries()].map(([month, total]) => ({ month, total: round(total) })).sort((a, b) => a.month.localeCompare(b.month))
}

function round(n: number) {
  return Math.round(n * 100) / 100
}
