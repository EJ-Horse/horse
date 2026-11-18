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
    const text = CAKES.flatMap((c) => c.ingredients.map((i) => i.text)).join(' ').toLowerCase()
    for (const bad of ['flour', 'bread', 'chocolate', 'frosting', 'icing', 'sugar cube', 'honey', 'sprinkles']) expect(text).not.toContain(bad)
  })
  it('has unique keys', () => {
    expect(new Set(CAKES.map((c) => c.key)).size).toBe(CAKES.length)
  })
})
