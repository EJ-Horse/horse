import { describe, expect, it } from 'vitest'
import { CAKES } from './cakes'
import { FOOD_GUIDE } from './foodGuide'

describe('horse-safe cakes', () => {
  it('only uses foods the guide allows', () => {
    for (const cake of CAKES)
      for (const ing of cake.ingredients) {
        if (!ing.food) continue
        const g = FOOD_GUIDE.find((f) => f.name === ing.food)
        expect(g, `${cake.name}: ${ing.food} is in the food guide`).toBeDefined()
        expect(g!.status, `${cake.name}: ${ing.food}`).not.toBe('forbidden')
      }
  })
  it('never uses flour, bread, chocolate or frosting', () => {
    // ignore warnings like "(no honey or chocolate kinds)" or "with NO chocolate"
    const text = CAKES.flatMap((c) => c.ingredients.map((i) => i.text.toLowerCase().replace(/\bno\b[^,;)]*/g, '')))
      .join(' ')
    for (const bad of ['flour', 'bread', 'chocolate', 'frosting', 'icing', 'sugar cube', 'honey', 'sprinkles']) expect(text).not.toMatch(new RegExp(`\\b${bad}\\b`))
  })
  it('tags every cake and keeps plenty of choice', () => {
    expect(CAKES.length).toBeGreaterThanOrEqual(40)
    for (const kind of ['no-bake', 'baked', 'frozen', 'mini']) expect(CAKES.some((c) => c.kind === kind)).toBe(true)
    expect(CAKES.filter((c) => c.sugar === 'low').length).toBeGreaterThanOrEqual(10)
    for (const c of CAKES) expect(c.oven, c.name).toBe(c.kind === 'baked' || (c.kind === 'mini' && c.oven))
  })
  it('has unique keys', () => {
    expect(new Set(CAKES.map((c) => c.key)).size).toBe(CAKES.length)
  })
})
