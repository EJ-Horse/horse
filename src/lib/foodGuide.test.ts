import { describe, expect, it } from 'vitest'
import { FOOD_GUIDE, sameFood, searchFoods } from './foodGuide'

const top = (q: string) => searchFoods(q, FOOD_GUIDE)[0]

describe('food guide search', () => {
  it('answers common questions', () => {
    expect(top('apple')?.name).toBe('Apples')
    expect(top('Apples')?.status).toBe('limit')
    expect(top('grapes')?.name).toBe('Grapes (seedless)')
    expect(top('chocolate')?.status).toBe('forbidden')
    expect(top('avocado')?.status).toBe('forbidden')
    expect(top('cucumber')?.status).toBe('allowed')
  })
  it('understands plurals and other names', () => {
    expect(top('strawberry')?.name).toBe('Strawberries')
    expect(top('spuds')?.name).toBe('Potatoes')
    expect(top('ice cream')?.status).toBe('forbidden')
    expect(top('chicken feed')?.name).toBe('Cattle or poultry feed')
    expect(top('courgette')?.name).toBe('Zucchini')
  })
  it('returns nothing for unknown foods', () => {
    expect(searchFoods('xylophone', FOOD_GUIDE)).toHaveLength(0)
  })
  it('matches names regardless of case and plurals', () => {
    expect(sameFood('Carrots', 'carrot')).toBe(true)
    expect(sameFood('Pears', 'Peaches & plums')).toBe(false)
  })
  it('has no duplicate names', () => {
    const names = FOOD_GUIDE.map((f) => f.name.toLowerCase())
    expect(new Set(names).size).toBe(names.length)
  })
  it('gives a reason for every food you should not feed', () => {
    expect(FOOD_GUIDE.filter((f) => f.status === 'forbidden' && !f.notes)).toHaveLength(0)
  })
})
