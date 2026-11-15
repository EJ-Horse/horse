import { describe, expect, it } from 'vitest'
import { amazonSearch, availableSuggestions, inSeason, SUGGESTIONS, suggestionState, suggestionsByCategory } from './suggestions'
import { SHOP_CATEGORIES } from './types'

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
  it('unlocks follow-ups once the first item is covered', () => {
    const keys = (items: { url: string; note?: string }[], have: string[] = []) => availableSuggestions(items, have, 11).map((s) => s.key)
    expect(keys([])).not.toContain('breakaway-halter')
    expect(keys([{ url: 'https://a.co/x', note: 'halter' }])).toContain('breakaway-halter')
    expect(keys([], ['helmet'])).toContain('helmet-bag')
  })
  it('shows at most 3 per category and backfills', () => {
    const before = suggestionsByCategory(SHOP_CATEGORIES, [], [], 11).find((g) => g.category === 'Grooming')!
    expect(before.shown).toHaveLength(3)
    const first = before.shown[0].key
    const after = suggestionsByCategory(SHOP_CATEGORIES, [], [first], 11).find((g) => g.category === 'Grooming')!
    expect(after.shown).toHaveLength(3)
    expect(after.shown.map((s) => s.key)).not.toContain(first)
  })
  it('lists every category, even with nothing to suggest', () => {
    const groups = suggestionsByCategory(SHOP_CATEGORIES, [], SUGGESTIONS.map((s) => s.key), 11)
    expect(groups.map((g) => g.category)).toEqual([...SHOP_CATEGORIES])
    expect(groups.every((g) => g.shown.length === 0)).toBe(true)
  })
  it('every follow-up points to a real suggestion', () => {
    const keys = new Set(SUGGESTIONS.map((s) => s.key))
    for (const s of SUGGESTIONS) for (const a of s.after ?? []) expect(keys.has(a), `${s.key} -> ${a}`).toBe(true)
  })
  it('has unique keys', () => {
    expect(new Set(SUGGESTIONS.map((s) => s.key)).size).toBe(SUGGESTIONS.length)
  })
})
