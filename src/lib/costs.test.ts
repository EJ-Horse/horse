import { describe, expect, it } from 'vitest'
import { totalsByCategory, totalsByMonth } from './costs'
import { nameFromUrl } from './shop'

describe('costs', () => {
  const costs = [
    { date: '2026-11-01', category: 'Stable', amount: 500 },
    { date: '2026-11-10', category: 'Vet', amount: 80.5 },
    { date: '2026-11-12', category: 'Vet', amount: 19.5 },
    { date: '2026-10-03', category: 'Stable', amount: 500 },
  ]
  it('sums by category, biggest first', () => {
    expect(totalsByCategory(costs)).toEqual([
      { category: 'Stable', total: 1000 },
      { category: 'Vet', total: 100 },
    ])
  })
  it('sums by month in order', () => {
    expect(totalsByMonth(costs)).toEqual([
      { month: '2026-10', total: 500 },
      { month: '2026-11', total: 600 },
    ])
  })
})

describe('shopping links', () => {
  it('reads the product name from an Amazon link', () => {
    expect(nameFromUrl('https://www.amazon.com/Horse-Grooming-Brush-Set/dp/B07XYZ1234?th=1')).toBe('Horse Grooming Brush Set')
  })
  it('returns nothing for short links', () => {
    expect(nameFromUrl('https://a.co/d/abc123')).toBe('')
  })
})

import { shortVetName } from '../components/Contacts'
describe('vet button label', () => {
  it('keeps only the last name', () => {
    expect(shortVetName('Dr. Douglas Novick')).toBe('Dr. Novick')
    expect(shortVetName('Douglas Novick')).toBe('Dr. Novick')
  })
})
