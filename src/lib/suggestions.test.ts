import { describe, expect, it } from 'vitest'
import { amazonSearch, inSeason, SUGGESTIONS, suggestionState } from './suggestions'

const find = (k: string) => SUGGESTIONS.find((s) => s.key === k)!

describe('shopping suggestions', () => {
  it('knows when something is already on the list (from the Amazon link name)', () => {
    const items = [{ url: 'https://www.amazon.com/Tough-1-Hoof-Pick-Brush/dp/B000HHN5SQ' }]
    expect(suggestionState(find('hoof-pick'), items, [])).toBe('listed')
    expect(suggestionState(find('helmet'), items, [])).toBe('open')
  })
  it('uses the note too, and notices bought items', () => {
    const items = [{ url: 'https://a.co/d/xyz', note: 'Fly spray for summer', bought: true }]
    expect(suggestionState(find('fly-spray'), items, [])).toBe('bought')
  })
  it('respects "already have it"', () => {
    expect(suggestionState(find('halter'), [], ['halter'])).toBe('have')
  })
  it('only suggests seasonal items in season', () => {
    expect(inSeason(find('winter-rug'), 11)).toBe(true)
    expect(inSeason(find('winter-rug'), 7)).toBe(false)
    expect(inSeason(find('hoof-pick'), 7)).toBe(true)
  })
  it('makes an Amazon search link without the notes in brackets', () => {
    expect(amazonSearch('Dewormer (ask Dr. Novick which)')).toBe('https://www.amazon.com/s?k=Dewormer')
  })
  it('matches whole words only', () => {
    expect(suggestionState(find('bridle'), [{ url: 'https://a.co/x', note: 'habit tracker' }], [])).toBe('open')
    expect(suggestionState(find('bridle'), [{ url: 'https://a.co/x', note: 'new bit' }], [])).toBe('listed')
    expect(suggestionState(find('riding-boots'), [{ url: 'https://a.co/x', note: 'brushing boots' }], [])).toBe('open')
  })
  it('has unique keys', () => {
    expect(new Set(SUGGESTIONS.map((s) => s.key)).size).toBe(SUGGESTIONS.length)
  })
})
